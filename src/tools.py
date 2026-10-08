import datetime
import json
import logging
import os
import subprocess
import urllib.parse
import urllib.request
import webbrowser

from langchain_community.tools import DuckDuckGoSearchRun
from livekit.agents import RunContext, function_tool

logger = logging.getLogger("tools")

REMINDERS_FILE = os.path.join(os.path.dirname(__file__), "reminders.json")


def _load_reminders() -> list:
    if os.path.exists(REMINDERS_FILE):
        try:
            with open(REMINDERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []


def _open_in_browser(target: str) -> None:
    """Open URL or file in Google Chrome and bring to foreground."""
    url_target = f"file:///{os.path.abspath(target).replace(os.sep, '/')}" if os.path.exists(target) else target
    try:
        subprocess.Popen(f'start chrome "{url_target}"', shell=True)
        return
    except Exception as e:
        logger.warning(f"Failed start chrome command: {e}")

    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    ]
    for path in chrome_paths:
        if os.path.exists(path):
            try:
                subprocess.Popen([path, url_target])
                return
            except Exception:
                pass
    webbrowser.open(url_target)


def _save_reminders(reminders: list):
    try:
        with open(REMINDERS_FILE, "w", encoding="utf-8") as f:
            json.dump(reminders, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to save reminders: {e}")


@function_tool
async def search_web(context: RunContext, query: str) -> str:
    """Search the web for up-to-date real-world information, facts, answers, or general questions."""
    try:
        result = DuckDuckGoSearchRun().run(tool_input=query)
        logger.info(f"Web search result for '{query}': {result[:200]}...")
        return result
    except Exception as e:
        logger.error(f"Error searching the web for {query}: {e}")
        return "Sorry Sir, I encountered an error while searching the web."


@function_tool
async def get_weather(context: RunContext, location: str) -> str:
    """Get the current live weather, temperature, humidity, and forecast for any city or location."""
    try:
        loc_encoded = urllib.parse.quote(location)
        url = f"https://wttr.in/{loc_encoded}?format=%C+%t+(feels+like+%f),+Humidity:+%h,+Wind:+%w&m"
        req = urllib.request.Request(url, headers={"User-Agent": "curl/7.68.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            weather_data = response.read().decode("utf-8").strip()
            return f"Current weather in {location}: {weather_data}"
    except Exception as e:
        logger.error(f"Error fetching weather for {location}: {e}")
        return f"Unable to fetch weather for {location} right now, Sir."


@function_tool
async def get_current_time_and_date(context: RunContext, city_or_timezone: str = "") -> str:
    """Get the current date, time, and day of the week."""
    now = datetime.datetime.now()
    formatted = now.strftime("%A, %B %d, %Y at %I:%M %p")
    return f"The current time is {formatted}."


@function_tool
async def set_reminder_or_note(context: RunContext, text: str) -> str:
    """Save a reminder, note, or to-do item for the user."""
    reminders = _load_reminders()
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    entry = {"id": len(reminders) + 1, "created_at": now_str, "text": text}
    reminders.append(entry)
    _save_reminders(reminders)
    return f"Reminder saved, Sir: '{text}'"


@function_tool
async def get_reminders_and_notes(context: RunContext) -> str:
    """Retrieve all saved notes, reminders, and to-do items."""
    reminders = _load_reminders()
    if not reminders:
        return "You have no active reminders or notes, Sir."
    summary = "\n".join([f"- {r['text']} (added {r['created_at']})" for r in reminders])
    return f"Here are your active reminders, Sir:\n{summary}"


@function_tool
async def play_music_or_video(context: RunContext, query: str, content_type: str = "auto") -> str:
    """Search and play any music, song, artist, YouTube video, or YouTube Short in the browser."""
    try:
        encoded_query = urllib.parse.quote(query)
        if "short" in query.lower() or content_type == "short":
            url = f"https://www.youtube.com/results?search_query={encoded_query}+shorts"
        else:
            url = f"https://www.youtube.com/results?search_query={encoded_query}"
        _open_in_browser(url)
        return f"Playing {query} for you now."
    except Exception as e:
        logger.error(f"Error opening media: {e}")
        return f"Could not play {query}: {e}"


def _get_user_desktop() -> str:
    user_home = os.path.expanduser("~")
    onedrive_desktop = os.path.join(user_home, "OneDrive", "Desktop")
    if os.path.exists(onedrive_desktop):
        return onedrive_desktop
    std_desktop = os.path.join(user_home, "Desktop")
    if os.path.exists(std_desktop):
        return std_desktop
    return user_home


async def _generate_pdf_from_html(html_path: str, pdf_path: str) -> bool:
    """Render HTML file into a real PDF file using Playwright."""
    try:
        from playwright.async_api import async_playwright
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            url = f"file:///{os.path.abspath(html_path).replace(os.sep, '/')}"
            await page.goto(url, wait_until="load")
            await page.pdf(path=pdf_path, format="A4", print_background=True)
            await browser.close()
        return os.path.exists(pdf_path)
    except Exception as e:
        logger.warning(f"Could not generate PDF via Playwright: {e}")
        return False


@function_tool
async def create_and_open_document(context: RunContext, title: str, content: str, file_type: str = "pdf") -> str:
    """Create, write, and immediately open an interactive styled document/PDF on the user's screen with full editing, download, and print capabilities.

    Args:
        title: The title or heading of the document.
        content: The complete body, essay, report, notes, summary, or structured markdown text.
        file_type: 'pdf', 'html', 'doc', or 'txt'.
    """
    try:
        desktop_dir = _get_user_desktop()
        clean_title = "".join(c for c in title if c.isalnum() or c in (" ", "_", "-")).strip() or "Generated_Document"
        safe_filename = clean_title.replace(" ", "_")
        
        filename_html = f"{safe_filename}.html"
        file_path_html = os.path.join(desktop_dir, filename_html)
        file_path_pdf = os.path.join(desktop_dir, f"{safe_filename}.pdf")

        # Convert simple line breaks/markdown to styled HTML paragraphs
        formatted_content = "<br><br>".join([
            f"<p>{p.strip()}</p>" for p in content.split("\n\n") if p.strip()
        ]) if "\n\n" in content else f"<p>{content.replace(chr(10), '<br>')}</p>"

        created_time = datetime.datetime.now().strftime("%B %d, %Y at %I:%M %p")

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - JARVIS Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg-page: #080c14;
            --card-bg: rgba(15, 23, 42, 0.95);
            --card-border: rgba(255, 255, 255, 0.12);
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --accent: #00e5ff;
            --accent-grad: linear-gradient(135deg, #00e5ff 0%, #3b82f6 100%);
            --btn-bg: #1e293b;
            --btn-hover: #334155;
        }}
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}
        body {{
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background: var(--bg-page);
            color: var(--text-primary);
            line-height: 1.8;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }}
        /* Toolbar */
        .toolbar {{
            width: 100%;
            max-width: 900px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding: 14px 24px;
            background: rgba(30, 41, 59, 0.85);
            backdrop-filter: blur(16px);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.5);
            flex-wrap: wrap;
            gap: 12px;
        }}
        .brand-badge {{
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-weight: 800;
            font-size: 0.95rem;
            color: var(--accent);
            letter-spacing: 0.5px;
        }}
        .brand-dot {{
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--accent);
            box-shadow: 0 0 12px var(--accent);
        }}
        .btn-group {{
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }}
        .btn {{
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 9px 16px;
            border-radius: 9px;
            font-family: inherit;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border: 1px solid var(--card-border);
            background: var(--btn-bg);
            color: var(--text-primary);
            text-decoration: none;
            transition: all 0.2s ease;
        }}
        .btn:hover {{
            background: var(--btn-hover);
            border-color: var(--accent);
            transform: translateY(-1px);
        }}
        .btn-primary {{
            background: var(--accent-grad);
            color: #050811;
            border: none;
            font-weight: 700;
        }}
        .btn-primary:hover {{
            box-shadow: 0 0 18px rgba(0, 229, 255, 0.45);
        }}

        /* Document Container */
        .doc-container {{
            width: 100%;
            max-width: 900px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 60px 70px;
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(20px);
        }}
        .doc-header {{
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 30px;
            margin-bottom: 40px;
        }}
        .doc-meta {{
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 14px;
        }}
        .tag {{
            background: rgba(0, 229, 255, 0.18);
            color: var(--accent);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
        }}
        h1.doc-title {{
            font-size: 2.4rem;
            font-weight: 800;
            line-height: 1.25;
            background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 12px;
        }}
        .doc-body {{
            font-size: 1.1rem;
            color: #e2e8f0;
            outline: none;
        }}
        .doc-body p {{
            margin-bottom: 1.5em;
        }}
        .doc-body strong {{
            color: #ffffff;
        }}
        .doc-body.editable {{
            border: 2px dashed var(--accent);
            padding: 20px;
            border-radius: 12px;
            background: rgba(0, 0, 0, 0.3);
        }}
        .doc-footer {{
            margin-top: 60px;
            padding-top: 25px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: space-between;
            color: var(--text-secondary);
            font-size: 0.9rem;
            flex-wrap: wrap;
            gap: 10px;
        }}
        
        /* Print Styles for PDF Export */
        @media print {{
            body {{
                background: #ffffff !important;
                color: #000000 !important;
                padding: 0 !important;
            }}
            .toolbar {{
                display: none !important;
            }}
            .doc-container {{
                background: #ffffff !important;
                border: none !important;
                box-shadow: none !important;
                padding: 25px !important;
                max-width: 100% !important;
            }}
            h1.doc-title {{
                color: #111827 !important;
                -webkit-text-fill-color: #111827 !important;
            }}
            .doc-body {{
                color: #1f2937 !important;
            }}
            .doc-footer {{
                color: #6b7280 !important;
            }}
        }}
    </style>
</head>
<body>
    <div class="toolbar">
        <div class="brand-badge">
            <span class="brand-dot"></span>
            JARVIS AI Co-Pilot
        </div>
        <div class="btn-group">
            <button class="btn" onclick="toggleEdit()" id="editBtn">✏️ Edit Notes</button>
            <button class="btn" onclick="downloadText()">💾 Download .TXT</button>
            <button class="btn" onclick="copyContent()">📋 Copy All</button>
            <button class="btn btn-primary" onclick="window.print()">🖨️ Save as PDF / Print</button>
        </div>
    </div>

    <div class="doc-container">
        <div class="doc-header">
            <div class="doc-meta">
                <span class="tag">AI Generated Document</span>
                <span>•</span>
                <span>{created_time}</span>
            </div>
            <h1 class="doc-title">{title}</h1>
        </div>

        <div class="doc-body" id="docBody">
            {formatted_content}
        </div>

        <div class="doc-footer">
            <span>Saved to Desktop: <code>{safe_filename}.html</code></span>
            <span>Generated by JARVIS Voice AI</span>
        </div>
    </div>

    <script>
        let isEditing = false;
        function toggleEdit() {{
            isEditing = !isEditing;
            const body = document.getElementById('docBody');
            const btn = document.getElementById('editBtn');
            body.contentEditable = isEditing;
            if (isEditing) {{
                body.classList.add('editable');
                btn.textContent = '💾 Done Editing';
                body.focus();
            }} else {{
                body.classList.remove('editable');
                btn.textContent = '✏️ Edit Notes';
            }}
        }}

        function copyContent() {{
            const text = document.getElementById('docBody').innerText;
            navigator.clipboard.writeText(text).then(() => {{
                alert('Document copied to clipboard!');
            }}).catch(() => {{
                alert('Copied text!');
            }});
        }}

        function downloadText() {{
            const text = document.getElementById('docBody').innerText;
            const blob = new Blob([text], {{ type: 'text/plain;charset=utf-8' }});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = '{safe_filename}.txt';
            a.click();
        }}
    </script>
</body>
</html>"""
        with open(file_path_html, "w", encoding="utf-8") as f:
            f.write(html_content)

        # Generate real PDF alongside the HTML
        await _generate_pdf_from_html(file_path_html, file_path_pdf)

        # Launch immediately in Google Chrome foreground window
        _open_in_browser(file_path_html)

        return f"I have prepared '{title}' as a PDF and interactive document, saved it to your Desktop, and opened it in Google Chrome with full editing, copying, and download options."
    except Exception as e:
        logger.error(f"Error creating document: {e}")
        return f"Could not create document: {e}"


@function_tool
async def create_and_open_spreadsheet(context: RunContext, title: str, headers: list[str], rows: list[list[str]]) -> str:
    """Create, write, and immediately open an interactive data spreadsheet/table with CSV export, editing, and sorting on the user's screen.

    Args:
        title: Title/name of the spreadsheet or dataset.
        headers: List of column header names.
        rows: List of data rows, where each row is a list of cell values.
    """
    try:
        desktop_dir = _get_user_desktop()
        clean_title = "".join(c for c in title if c.isalnum() or c in (" ", "_", "-")).strip() or "Generated_Sheet"
        safe_filename = clean_title.replace(" ", "_")

        file_path_html = os.path.join(desktop_dir, f"{safe_filename}.html")
        file_path_csv = os.path.join(desktop_dir, f"{safe_filename}.csv")

        # Write CSV
        import csv
        with open(file_path_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(rows)

        # Build HTML table
        header_html = "".join([f"<th>{h}</th>" for h in headers])
        rows_html = "".join([
            "<tr>" + "".join([f"<td contenteditable='true'>{cell}</td>" for cell in r]) + "</tr>"
            for r in rows
        ])

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title} - JARVIS Spreadsheet</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {{
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            background: #0b0f19;
            color: #f8fafc;
            padding: 40px 20px;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }}
        .container {{
            width: 100%;
            max-width: 1000px;
            background: rgba(17, 24, 39, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            flex-wrap: wrap;
            gap: 12px;
        }}
        h1 {{
            font-size: 1.8rem;
            color: #00e5ff;
        }}
        .btn {{
            padding: 10px 18px;
            border-radius: 8px;
            background: #1e293b;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.15);
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
        }}
        .btn-primary {{
            background: linear-gradient(135deg, #00e5ff 0%, #3b82f6 100%);
            color: #0b0f19;
            border: none;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }}
        th, td {{
            padding: 14px 16px;
            text-align: left;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }}
        th {{
            background: rgba(30, 41, 59, 0.9);
            color: #00e5ff;
            font-weight: 700;
        }}
        tr:nth-child(even) {{
            background: rgba(255, 255, 255, 0.02);
        }}
        td[contenteditable="true"]:focus {{
            outline: 2px solid #00e5ff;
            background: rgba(0, 229, 255, 0.1);
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>📊 {title}</h1>
                <p style="color: #94a3b8; font-size: 0.9rem;">Editable Spreadsheet • Click cells to edit</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn" onclick="exportCSV()">📥 Download CSV</button>
                <button class="btn btn-primary" onclick="window.print()">🖨️ Print / PDF</button>
            </div>
        </div>
        <table id="dataTable">
            <thead><tr>{header_html}</tr></thead>
            <tbody>{rows_html}</tbody>
        </table>
    </div>
    <script>
        function exportCSV() {{
            const rows = Array.from(document.querySelectorAll('table tr'));
            const csv = rows.map(r => Array.from(r.querySelectorAll('th, td')).map(c => '"' + c.innerText.replace(/"/g, '""') + '"').join(',')).join('\\n');
            const blob = new Blob([csv], {{ type: 'text/csv' }});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = '{safe_filename}.csv';
            a.click();
        }}
    </script>
</body>
</html>"""
        with open(file_path_html, "w", encoding="utf-8") as f:
            f.write(html_content)

        _open_in_browser(file_path_html)
        return f"I have created the spreadsheet '{title}', saved it to your Desktop, and opened it in Google Chrome."
    except Exception as e:
        logger.error(f"Error creating spreadsheet: {e}")
        return f"Could not create spreadsheet: {e}"


@function_tool
async def open_document_or_file(context: RunContext, path_or_filename: str) -> str:
    """Open any PDF, document, spreadsheet, presentation, image, video file, or folder on the computer."""
    target = path_or_filename.strip().strip('"')
    try:
        if os.path.exists(target):
            os.startfile(target)
            return f"Opened {os.path.basename(target)} on your computer."
        else:
            user_home = os.path.expanduser("~")
            candidates = [
                os.path.join(user_home, "Desktop", target),
                os.path.join(user_home, "Downloads", target),
                os.path.join(user_home, "Documents", target),
            ]
            for c in candidates:
                if os.path.exists(c):
                    os.startfile(c)
                    return f"Opened {os.path.basename(c)} from your files."

            subprocess.Popen(f'start "" "{target}"', shell=True)
            return f"Attempted to open {target}."
    except Exception as e:
        return f"Could not open {target}: {e}"



@function_tool
async def open_any_website(context: RunContext, url_or_name: str) -> str:
    """Open ANY website, domain, or online service (e.g. google.com, youtube.com, spotify, maps, github, etc.)."""
    target = url_or_name.strip()
    if not target.startswith("http://") and not target.startswith("https://"):
        if "." in target and not " " in target:
            target = f"https://{target}"
        else:
            service_map = {
                "whatsapp": "https://web.whatsapp.com",
                "whatsapp web": "https://web.whatsapp.com",
                "web whatsapp": "https://web.whatsapp.com",
                "google sheets": "https://sheets.google.com",
                "sheets": "https://sheets.google.com",
                "spreadsheet": "https://sheets.google.com",
                "google spreadsheet": "https://sheets.google.com",
                "google docs": "https://docs.google.com",
                "docs": "https://docs.google.com",
                "google drive": "https://drive.google.com",
                "drive": "https://drive.google.com",
                "maps": "https://maps.google.com",
                "google maps": "https://maps.google.com",
                "spotify": "https://open.spotify.com",
                "gmail": "https://mail.google.com",
                "email": "https://mail.google.com",
                "github": "https://github.com",
                "youtube": "https://youtube.com",
                "wikipedia": "https://wikipedia.org",
                "netflix": "https://netflix.com",
                "amazon": "https://amazon.com",
                "instagram": "https://instagram.com",
                "twitter": "https://x.com",
                "x": "https://x.com",
                "reddit": "https://reddit.com",
                "chatgpt": "https://chatgpt.com",
            }
            target = service_map.get(target.lower(), f"https://www.google.com/search?q={urllib.parse.quote(target)}")

    try:
        _open_in_browser(target)
        return f"Opened {url_or_name} in your browser."
    except Exception as e:
        return f"Unable to open {url_or_name}: {e}"


@function_tool
async def launch_desktop_app(context: RunContext, app_name: str) -> str:
    """Launch any desktop application on Windows (e.g. calculator, notepad, chrome, edge, cmd, explorer, spotify, vscode, etc.)."""
    name_clean = app_name.lower().strip()
    app_commands = {
        "calculator": "calc",
        "calc": "calc",
        "notepad": "notepad",
        "chrome": "start chrome",
        "google chrome": "start chrome",
        "edge": "start msedge",
        "file explorer": "explorer",
        "explorer": "explorer",
        "terminal": "start wt",
        "command prompt": "start cmd",
        "cmd": "start cmd",
        "vscode": "code",
        "vs code": "code",
        "spotify": "start spotify:",
        "whatsapp": "start whatsapp:",
    }

    cmd = app_commands.get(name_clean, f"start {name_clean}")
    try:
        subprocess.Popen(cmd, shell=True)
        return f"Launched {app_name}."
    except Exception as e:
        return f"Could not launch {app_name}: {e}"

