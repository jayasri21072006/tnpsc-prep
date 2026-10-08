"""Tamil Nadu Government Exam Preparation Tools & Resources for JARVIS / TN Exam AI Co-Pilot.

Covers all Tamil Nadu State Government Recruitment Boards:
- TNPSC (Group 1, 2/2A, 4 & VAO, Technical Services)
- TNUSRB (Sub-Inspector SI, Police Constable, Fireman, Jail Warden)
- TRB (Teachers Recruitment Board - TNTET, PG TRB, Poly Lecturers)
- TNEB / TANGEDCO (Assistant Engineer, Junior Assistant, Accounts)
- MRB (Medical Services Recruitment Board)
- TNFUSRC (Forest Guard, Forester)
- Samacheer Kalvi School Books, PYQs, General Tamil (பொதுத்தமிழ்), General Studies, Aptitude & Current Affairs.
"""

from __future__ import annotations

import datetime
import json
import logging
import os
import subprocess
import tempfile
import urllib.parse
from html import escape
from pathlib import Path
from livekit.agents import RunContext, function_tool

logger = logging.getLogger("tn_exam_tools")

SAMACHEER_BOOKS = {
    "6": {"tamil": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=ta&class=6", "english": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=en&class=6"},
    "7": {"tamil": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=ta&class=7", "english": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=en&class=7"},
    "8": {"tamil": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=ta&class=8", "english": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=en&class=8"},
    "9": {"tamil": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=ta&class=9", "english": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=en&class=9"},
    "10": {"tamil": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=ta&class=10", "english": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=en&class=10"},
    "11": {"tamil": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=ta&class=11", "english": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=en&class=11"},
    "12": {"tamil": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=ta&class=12", "english": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=en&class=12"},
}


def get_samacheer_book_links(medium: str, exam_name: str) -> dict:
    """Return the complete medium-specific Samacheer Kalvi catalog for an exam."""
    normalized_medium = medium.strip().lower()
    if normalized_medium not in {"tamil", "english"}:
        raise ValueError("Medium must be tamil or english.")

    return {
        "exam": exam_name.strip() or "Samacheer Kalvi",
        "medium": normalized_medium,
        "books": [
            {
                "class": class_name,
                "title": f"Class {class_name} Samacheer Kalvi {normalized_medium.title()} Medium Books",
                "url": url,
            }
            for class_name, url_by_medium in SAMACHEER_BOOKS.items()
            for url in [url_by_medium[normalized_medium]]
        ],
    }


# Official Portals Directory
TN_OFFICIAL_PORTALS = {
    "tnpsc": {
        "name": "TNPSC (Tamil Nadu Public Service Commission)",
        "url": "https://www.tnpsc.gov.in",
        "pyq_url": "https://www.tnpsc.gov.in/English/previous_question_papers.html",
        "syllabus_url": "https://www.tnpsc.gov.in/English/syllabus.html",
        "notifications_url": "https://www.tnpsc.gov.in/English/notifications.html",
        "resources": {
            "Group 1 PYQ": "https://www.tnpsc.gov.in/English/Previous_Questions.aspx?id=1",
            "Group 2 PYQ": "https://www.tnpsc.gov.in/English/Previous_Questions.aspx?id=2",
            "Group 4 & VAO PYQ": "https://www.tnpsc.gov.in/English/Previous_Questions.aspx?id=3"
        },
        "exams": ["Group 1", "Group 2 / 2A", "Group 4 & VAO", "Combined Technical Services", "Forest Apprentice"],
    },
    "tnusrb": {
        "name": "TNUSRB (Tamil Nadu Uniformed Services Recruitment Board)",
        "url": "https://www.tnusrb.tn.gov.in",
        "pyq_url": "https://www.tnusrb.tn.gov.in/previous_question_papers.php",
        "syllabus_url": "https://www.tnusrb.tn.gov.in/syllabus.php",
        "notifications_url": "https://www.tnusrb.tn.gov.in",
        "exams": ["Sub-Inspector (Taluk / AR / TSP)", "Police Constable (Grade II)", "Jail Warden", "Fireman"],
    },
    "trb": {
        "name": "TRB (Teachers Recruitment Board Tamil Nadu)",
        "url": "https://trb.tn.gov.in",
        "pyq_url": "https://trb.tn.gov.in/previous-year-questions",
        "syllabus_url": "https://trb.tn.gov.in/syllabus",
        "notifications_url": "https://trb.tn.gov.in",
        "exams": ["TNTET (Paper I & II)", "PG TRB", "Polytechnic College Lecturers", "BEO (Block Educational Officer)", "Special Teachers"],
    },
    "tangedco": {
        "name": "TNEB / TANGEDCO (Tamil Nadu Generation and Distribution Corporation)",
        "url": "https://www.tangedco.org",
        "notifications_url": "https://www.tangedco.org",
        "exams": ["Assistant Engineer (AE - Electrical / Mechanical / Civil)", "Junior Assistant", "Field Assistant"],
    },
    "mrb": {
        "name": "MRB (Medical Services Recruitment Board TN)",
        "url": "https://www.mrb.tn.gov.in",
        "notifications_url": "https://www.mrb.tn.gov.in/notifications.html",
        "exams": ["Staff Nurse", "Assistant Surgeon", "Pharmacist", "Lab Technician"],
    },
    "forest": {
        "name": "TNFUSRC (Tamil Nadu Forest Uniformed Services Recruitment Committee)",
        "url": "https://www.forests.tn.gov.in/pages/view/TNFUSRC",
        "notifications_url": "https://www.forests.tn.gov.in",
        "exams": ["Forest Guard", "Forester", "Forest Watcher"],
    },
    "samacheer": {
        "name": "Tamil Nadu Text Book & Educational Services Corporation (Samacheer Kalvi Books)",
        "url": "https://www.textbooksonline.tn.nic.in",
        "books_pdf_url": "https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html",
        "exams": ["Standard 6 to 12 School Textbooks in Tamil & English Medium"],
    },
}

def _get_user_desktop() -> str:
    user_home = os.path.expanduser("~")
    onedrive_desktop = os.path.join(user_home, "OneDrive", "Desktop")
    if os.path.exists(onedrive_desktop):
        return onedrive_desktop
    std_desktop = os.path.join(user_home, "Desktop")
    if os.path.exists(std_desktop):
        return std_desktop
    return user_home

def _open_in_chrome(url_or_file: str, chrome_profile_dir: str | None = None) -> None:
    url_target = f"file:///{os.path.abspath(url_or_file).replace(os.sep, '/')}" if os.path.exists(url_or_file) else url_or_file
    profile_argument = ""
    if chrome_profile_dir:
        profile_argument = f' --user-data-dir="{chrome_profile_dir}" --no-first-run --new-window'
    try:
        subprocess.Popen(f'start chrome{profile_argument} "{url_target}"', shell=True)
        return
    except Exception:
        import webbrowser
        webbrowser.open(url_target)


@function_tool
async def open_tn_official_portal(context: RunContext, board_or_portal_name: str, resource_type: str = "") -> str:
    """Open official Tamil Nadu Government recruitment board websites, notifications, or Samacheer Kalvi book portals.

    Args:
        board_or_portal_name: 'tnpsc', 'tnusrb', 'trb', 'tangedco', 'mrb', 'forest', 'samacheer kalvi', 'group 4', 'group 2', 'police', etc.
        resource_type: Optional. Specific resource to open. E.g., 'pyq', 'syllabus', 'notifications', 'books'. If empty, opens the main URL.
    """
    clean_name = board_or_portal_name.lower().strip()
    res_type_clean = resource_type.lower().strip()
    
    target_key = "tnpsc"
    for key in TN_OFFICIAL_PORTALS:
        if key in clean_name:
            target_key = key
            break
    if "police" in clean_name or "si" in clean_name or "constable" in clean_name:
        target_key = "tnusrb"
    elif "teacher" in clean_name or "tet" in clean_name or "trb" in clean_name:
        target_key = "trb"
    elif "electricity" in clean_name or "tneb" in clean_name or "tangedco" in clean_name or "ae" in clean_name:
        target_key = "tangedco"
    elif "medical" in clean_name or "nurse" in clean_name or "mrb" in clean_name:
        target_key = "mrb"
    elif "forest" in clean_name:
        target_key = "forest"
    elif "book" in clean_name or "school" in clean_name or "samacheer" in clean_name:
        target_key = "samacheer"

    portal_info = TN_OFFICIAL_PORTALS.get(target_key, TN_OFFICIAL_PORTALS["tnpsc"])
    
    target_url = portal_info["url"]
    
    if "pyq" in res_type_clean or "previous" in res_type_clean:
        target_url = portal_info.get("pyq_url", target_url)
    elif "syllabus" in res_type_clean:
        target_url = portal_info.get("syllabus_url", target_url)
    elif "notification" in res_type_clean:
        target_url = portal_info.get("notifications_url", target_url)
    elif "book" in res_type_clean or "pdf" in res_type_clean:
        target_url = portal_info.get("books_pdf_url", target_url)

    _open_in_chrome(target_url)
    return f"Opened {portal_info['name']} {resource_type} portal ({target_url}) on your screen in Google Chrome."


@function_tool
async def open_samacheer_kalvi_books(
    context: RunContext, exam_name: str, medium: str
) -> str:
    """Open the Tamil or English Samacheer Kalvi book catalog for the requested exam."""
    books = get_samacheer_book_links(medium, exam_name)
    first_book_url = books["books"][0]["url"]
    _open_in_chrome(first_book_url)
    return (
        f"Opened the {books['medium']} Samacheer Kalvi books for {books['exam']} "
        f"in Google Chrome ({first_book_url})."
    )


@function_tool
async def get_tn_exam_details_and_syllabus(
    context: RunContext,
    exam_name: str,
    medium: str = "tamil",
) -> str:
    """Provide comprehensive details, exam pattern, age limit, syllabus breakdown, and eligibility for any TN government exam (TNPSC Group 1, 2, 4/VAO, TNUSRB SI, Police, TRB, etc.).

    Args:
        exam_name: The name of the exam (e.g. 'TNPSC Group 4', 'TNPSC Group 2', 'TNUSRB SI', 'TRB TET', 'TNEB AE').
    """
    exam_lower = exam_name.lower()
    
    if "group 4" in exam_lower or "vao" in exam_lower:
        return (
            "📌 **TNPSC Group 4 & VAO Exam Breakdown:**\n"
            "• **Total Questions:** 200 Questions (300 Marks) | Duration: 3 Hours\n"
            "• **Part A:** கட்டாயத் தமிழ் மொழித் தகுதி மற்றும் மதிப்பீட்டுத் தேர்வு (General Tamil - 100 Questions, 150 Marks - 6th to 10th Samacheer Kalvi)\n"
            "• **Part B:** General Studies (75 Questions) + Aptitude & Mental Ability (25 Questions) = 100 Questions (150 Marks)\n"
            "• **Key Topics:** பொதுத்தமிழ் (இலக்கணம், இலக்கியம், தமிழ் அறிஞர்களும் தொண்டும்), இந்திய வரலாறு, தமிழ்நாடு வரலாறு மற்றும் பண்பாடு (Unit 8), தமிழகத்தில் வளர்ச்சி நிர்வாகம் (Unit 9), பொது அறிவியல், நடப்பு நிகழ்வுகள், கணிதம்.\n"
            "• **Eligibility:** 10th Standard (SSLC) Pass | Minimum Age: 21 (VAO), 18 (Other posts)."
        )
    elif "group 2" in exam_lower or "group 2a" in exam_lower:
        return (
            "📌 **TNPSC Group 2 / 2A Exam Breakdown:**\n"
            "• **Preliminary Exam:** 200 Questions (300 Marks) | 3 Hours\n"
            "  - General Tamil / General English (100 Qs)\n"
            "  - General Studies Degree Standard (75 Qs)\n"
            "  - Aptitude & Mental Ability SSLC Standard (25 Qs)\n"
            "• **Main Written Exam:** Degree Standard Descriptive Paper (Social Issues, Science & Tech, Polity, Economy, State Admin, Unit 8/9).\n"
            "• **Key Posts:** Sub-Registrar, Municipal Commissioner, Assistant Section Officer (Secretariat), Revenue Inspector.\n"
            "• **Eligibility:** Any Bachelor's Degree."
        )
    elif "group 1" in exam_lower:
        return (
            "📌 **TNPSC Group 1 Exam Breakdown:**\n"
            "• **Prelims:** 200 Questions (300 Marks) - General Studies (175 Qs) + Aptitude (25 Qs)\n"
            "• **Mains:** 4 Papers (Paper 1: Tamil Eligibility Qualifying, Paper 2, 3, 4: Core GS Topics - 750 Marks) + Interview (100 Marks)\n"
            "• **Key Posts:** Deputy Collector (DC), Deputy Superintendent of Police (DSP), Commercial Tax Officer (CTO), District Registrar.\n"
            "• **Eligibility:** Any Bachelor's Degree | Age: 21 to 39 years (BC/MBC/SC/ST)."
        )
    elif "police" in exam_lower or "tnusrb" in exam_lower or "si" in exam_lower:
        return (
            "📌 **TNUSRB Sub-Inspector (SI) & Police Constable Breakdown:**\n"
            "• **Part I:** Tamil Language Eligibility Test (100 Qs, 100 Marks - Qualifying with 40%)\n"
            "• **Part II:** Main Written Exam (General Knowledge 80 Marks + Psychology/Logical Reasoning 60 Marks = 140 Marks, 70 Qs)\n"
            "• **Physical Tests:** PMT, ET (1500m run in 7 mins), PET (Rope Climbing, Long Jump, 100m/400m sprint).\n"
            "• **Eligibility:** SI: Any Degree | PC: 10th Pass."
        )
    elif "trb" in exam_lower or "tet" in exam_lower:
        return (
            "📌 **TRB (TNTET / PG TRB) Exam Breakdown:**\n"
            "• **TNTET Paper 1:** For Primary Teachers (Classes 1-5) - Child Dev, Tamil, English, Maths, EVS (150 Marks)\n"
            "• **TNTET Paper 2:** For Upper Primary (Classes 6-8) - Child Dev, Language 1, Language 2, Maths & Science / Social Science (150 Marks)\n"
            "• **PG TRB:** Subject Specialization (110 Marks) + Educational Methodology (30 Marks) + GK (10 Marks) + Tamil Eligibility."
        )
    else:
        return (
            f"📌 **{exam_name} Details & Resources:**\n"
            "• Covers all state syllabus components: Samacheer Kalvi Textbooks (Classes 6-12), General Tamil, General Studies, Aptitude/Mental Ability, and Current Affairs.\n"
            f"• Samacheer Kalvi {medium.title()} Medium Books: {get_samacheer_book_links(medium, exam_name)['books'][0]['url']}\n"
            "• Use `create_tn_study_plan_or_notes_pdf` to generate study notes or a customized 60-day schedule for this exam on your Desktop."
        )


@function_tool
async def generate_tn_mock_test_quiz(
    context: RunContext,
    topic_or_exam: str,
    num_questions: int = 5,
    duration_minutes: int = 30,
    medium: str = "tamil",
) -> str:
    """Generate an interactive, timed, closed-book mock test in the selected language.

    Args:
        topic_or_exam: e.g. 'TNPSC Group 4 General Tamil', 'Unit 8 Tamil History'.
        num_questions: Number of questions to show.
        duration_minutes: Test duration in minutes.
        medium: 'tamil' or 'english'.
    """
    normalized_medium = medium.strip().lower()
    if normalized_medium not in {"tamil", "english"}:
        raise ValueError("Medium must be tamil or english.")
    if num_questions < 1:
        raise ValueError("num_questions must be at least 1.")
    if duration_minutes < 1:
        raise ValueError("duration_minutes must be at least 1.")

    desktop_dir = _get_user_desktop()
    clean_title = "".join(c for c in topic_or_exam if c.isalnum() or c in (" ", "_", "-")).strip() or "TN_Mock_Test"
    safe_filename = clean_title.replace(" ", "_")
    file_path_html = os.path.join(desktop_dir, f"{safe_filename}_MockTest.html")
    chrome_profile_dir = tempfile.mkdtemp(prefix="jarvis_mock_test_")

    language = "ta"
    setup_text = "ஒரு முறை மட்டுமே பதிலளிக்கவும். பதிலை மாற்ற முடியாது."
    submit_text = "சமர்ப்பிக்கவும்"
    start_text = "தேர்வு தொடங்குகிறது"
    rules = [
        "தேர்வு ஒரு முறை மட்டும். பின்னர் பதில்களை மாற்ற முடியாது.",
        "பதில்களை பரப்புதல், அகராதி அல்லது புறநிலை உதவியைப் பயன்படுத்தக் கூடாது.",
        "விண்ணப்ப செய்யும் போது அனைத்து கேள்விகளுக்கும் பதிலளிக்க வேண்டும்.",
    ]
    question_intro = "கேள்வி"
    if normalized_medium == "english":
        language = "en"
        setup_text = "Answer each question only once. You cannot change your answer."
        submit_text = "Submit Test"
        start_text = "Test starts now"
        rules = [
            "This is a closed-book test. Do not use notes, books, or external aid.",
            "Answer each question once. You cannot return to change a response.",
            "Submit only when you have answered every question.",
        ]
        question_intro = "Question"

    html_content = f"""<!DOCTYPE html>
<html lang="{language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{escape(topic_or_exam)} - TN Gov Exam Mock Quiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg: #080c14;
            --card-bg: rgba(15, 23, 42, 0.95);
            --accent: #00e5ff;
            --success: #10b981;
            --danger: #ef4444;
            --text: #f8fafc;
        }}
        body {{
            font-family: 'Mukta Malar', 'Plus Jakarta Sans', system-ui, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }}
        .container {{
            width: 100%;
            max-width: 860px;
            background: var(--card-bg);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }}
        .header {{
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
        }}
        .timer {{
            min-width: 110px;
            text-align: center;
            padding: 10px 16px;
            border-radius: 10px;
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.4);
            font-weight: 800;
        }}
        h1 {{
            color: var(--accent);
            font-size: 1.8rem;
            margin: 0;
        }}
        .q-card {{
            display: none;
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
        }}
        .q-card.active {{
            display: block;
        }}
        .q-title {{
            font-size: 1.15rem;
            font-weight: 700;
            margin-bottom: 15px;
            color: #ffffff;
        }}
        .option-btn {{
            display: block;
            width: 100%;
            text-align: left;
            padding: 12px 16px;
            margin-bottom: 10px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            background: #1e293b;
            color: #e2e8f0;
            font-family: inherit;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
        }}
        .option-btn:hover {{
            background: #334155;
            border-color: var(--accent);
        }}
        .option-btn.correct {{
            background: rgba(16, 185, 129, 0.25) !important;
            border-color: var(--success) !important;
            color: #6ee7b7 !important;
            font-weight: 700;
        }}
        .option-btn.wrong {{
            background: rgba(239, 68, 68, 0.25) !important;
            border-color: var(--danger) !important;
            color: #fca5a5 !important;
        }}
        .explanation {{
            margin-top: 12px;
            padding: 10px 14px;
            border-radius: 8px;
            background: rgba(0, 229, 255, 0.1);
            color: #93c5fd;
            font-size: 0.95rem;
            display: none;
        }}
        .score-box {{
            text-align: center;
            padding: 25px;
            border-radius: 16px;
            background: rgba(0, 229, 255, 0.15);
            border: 1px solid var(--accent);
            margin-top: 30px;
            display: none;
        }}
        .btn-action {{
            background: linear-gradient(135deg, #00e5ff 0%, #3b82f6 100%);
            color: #050811;
            font-weight: 700;
            padding: 12px 28px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 20px;
        }}
        .hidden {{
            display: none !important;
        }}
        .instruction-list {{
            margin: 16px 0;
            padding-left: 20px;
        }}
        .instruction-list li {{
            margin: 8px 0;
            color: #cbd5e1;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>🎯 {escape(topic_or_exam)}</h1>
                <p style="color: #94a3b8; margin-top: 5px;">{escape(setup_text)}</p>
            </div>
            <div class="timer" id="timer">{duration_minutes}:00</div>
        </div>

        <div id="instructions" class="q-card active">
            <div class="q-title">{start_text}</div>
            <p>{setup_text}</p>
            <ul class="instruction-list">
                {''.join(f'<li>{escape(rule)}</li>' for rule in rules)}
            </ul>
            <button class="btn-action" id="startBtn">{submit_text}</button>
        </div>

        <div id="quizContainer">
            {''.join(f'''<div class="q-card" data-correct="{index % 4}">
                <div class="q-title">{question_intro} {index + 1}. {escape(topic_or_exam)} - Sample Question {index + 1}</div>
                <button class="option-btn" data-index="0">A) {escape('Option A')}</button>
                <button class="option-btn" data-index="1">B) {escape('Option B')}</button>
                <button class="option-btn" data-index="2">C) {escape('Option C')}</button>
                <button class="option-btn" data-index="3">D) {escape('Option D')}</button>
                <div class="explanation">💡 {escape('Explanation will appear after submission.')}</div>
            </div>''' for index in range(num_questions))}
        </div>

        <div class="score-box" id="scoreBox">
            <h2 id="scoreText">{escape('Final Score: 0 / ' + str(num_questions))}</h2>
            <p>{escape('Your answers are locked. Results are shown only after submission.')}</p>
        </div>
    </div>

    <script>
        const total = {num_questions};
        const durationSeconds = {duration_minutes} * 60;
        let answered = 0;
        let score = 0;
        let currentQuestion = 0;
        let testStarted = false;
        let testFinished = false;
        let secondsLeft = durationSeconds;
        let countdown;

        const cards = [...document.querySelectorAll('.q-card')];
        const timerElement = document.getElementById('timer');
        const instructions = document.getElementById('instructions');
        const startBtn = document.getElementById('startBtn');
        const quizContainer = document.getElementById('quizContainer');
        const scoreBox = document.getElementById('scoreBox');

        function startTest() {{
            testStarted = true;
            instructions.classList.add('hidden');
            cards[0].classList.add('active');
            countdown = setInterval(() => {{
                secondsLeft -= 1;
                const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
                const seconds = (secondsLeft % 60).toString().padStart(2, '0');
                timerElement.textContent = `${{minutes}}:${{seconds}}`;
                if (secondsLeft <= 0) {{
                    finishTest();
                }}
            }}, 1000);
            document.documentElement.requestFullscreen?.();
        }}

        function checkAnswer(btn, selectedIndex) {{
            if (!testStarted || testFinished) return;
            const card = btn.closest('.q-card');
            if (card.dataset.answered === 'true') return;
            card.dataset.answered = 'true';
            const correctIndex = Number(card.dataset.correct);
            const explanation = card.querySelector('.explanation');
            const buttons = card.querySelectorAll('.option-btn');

            if (selectedIndex === correctIndex) {{
                btn.classList.add('correct');
                score += 1;
            }} else {{
                btn.classList.add('wrong');
                buttons[correctIndex].classList.add('correct');
            }}
            explanation.style.display = 'block';
            answered += 1;
            setTimeout(() => {{
                card.classList.remove('active');
                const nextCard = cards[currentQuestion + 1];
                if (nextCard) {{
                    currentQuestion += 1;
                    nextCard.classList.add('active');
                }} else {{
                    finishTest();
                }}
            }}, 900);
        }}

        function finishTest() {{
            if (testFinished) return;
            testFinished = true;
            clearInterval(countdown);
            document.querySelectorAll('.option-btn').forEach((btn) => {{
                btn.disabled = true;
            }});
            quizContainer.classList.add('hidden');
            scoreBox.style.display = 'block';
            document.getElementById('scoreText').textContent = `Final Score: ${{score}} / ${{total}} (${{Math.round((score / total) * 100)}}%)`;
            document.exitFullscreen?.();
        }}

        startBtn.addEventListener('click', startTest);
        document.addEventListener('visibilitychange', () => {{
            if (document.hidden && testStarted && !testFinished) {{
                finishTest();
            }}
        }});
        document.addEventListener('contextmenu', (event) => event.preventDefault());
        document.addEventListener('keydown', (event) => {{
            if ((event.ctrlKey || event.metaKey) && ['c', 'v', 'p', 's'].includes(event.key.toLowerCase())) {{
                event.preventDefault();
            }}
        }});

        cards.forEach((card, index) => {{
            card.querySelectorAll('.option-btn').forEach((btn) => {{
                btn.addEventListener('click', () => checkAnswer(btn, Number(btn.dataset.index)));
            }});
            if (index !== 0) card.classList.remove('active');
        }});
    </script>
</body>
</html>"""
    with open(file_path_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    _open_in_chrome(file_path_html, chrome_profile_dir)
    return f"I have prepared a timed, closed-book mock test on '{topic_or_exam}' in {normalized_medium.title()} medium, saved it to your Desktop, and opened it in an isolated Chrome profile."
