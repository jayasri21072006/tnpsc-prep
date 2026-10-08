"""End-to-end check: load the JARVIS frontend in a real browser, connect,
and verify the agent joins the room."""

import asyncio
import json
import sys

from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"


async def body_text(page, timeout=5000):
    try:
        return (await page.locator("body").inner_text(timeout=timeout)) or ""
    except Exception:  # noqa: BLE001
        return ""


async def main() -> int:
    console_msgs = []
    page_errors = []
    failures = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--use-fake-ui-for-media-stream",
                "--use-fake-device-for-media-stream",
            ],
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            permissions=["microphone", "camera"],
        )
        page = await context.new_page()
        page.on(
            "console",
            lambda m: console_msgs.append(f"[{m.type}] {m.text}")
            if m.type in ("error", "warning")
            else None,
        )
        page.on("pageerror", lambda e: page_errors.append(str(e)))

        print(f"Navigating to {BASE_URL} ...")
        try:
            await page.goto(BASE_URL, wait_until="load", timeout=180_000)
            print(f"Navigated. url={page.url}")
        except Exception as e:  # noqa: BLE001
            failures.append(f"page.goto failed: {e}")
            print(f"goto error: {e}")

        # Wait for React to render the session UI.
        seen = ""
        for _ in range(90):
            seen = await body_text(page)
            if "Waiting for agent" in seen or "Agent is listening" in seen:
                break
            await asyncio.sleep(2)
        else:
            # Dump what we actually got so we can diagnose.
            html = ""
            try:
                html = await page.content()
            except Exception:  # noqa: BLE001
                pass
            print("--- page HTML head (first 1200 chars) ---")
            print(html[:1200])

        print("--- initial UI text ---")
        print(seen[:1500])

        # Click the Start Audio button if present (enables audio playback).
        start_btn = page.get_by_role("button", name="Start Audio")
        if await start_btn.count():
            await start_btn.first.click(timeout=15_000)
            print("Clicked Start Audio")
        else:
            print("No Start Audio button (audio may already be allowed)")

        # Wait for the session to connect and the agent to join.
        final_text = seen
        agent_ready = False
        for i in range(90):
            final_text = await body_text(page)
            if "Agent is listening" in final_text:
                agent_ready = True
                print(f"REACHED: Agent is listening after ~{i * 2}s")
                break
            await asyncio.sleep(2)
        else:
            print(f"TIMEOUT waiting for agent. Final UI text:\n{final_text[:1500]}")

        if not agent_ready:
            failures.append("agent never joined the room")

        await page.screenshot(path="e2e-final.png", full_page=True)

        print("--- console messages (error/warning) ---")
        for m in console_msgs:
            print(m)
        print("--- page errors ---")
        for e in page_errors:
            print(e)

        await browser.close()

    report = {
        "ui_final_state": final_text[:1500],
        "agent_ready": agent_ready,
        "console_errors": console_msgs,
        "page_errors": page_errors,
        "failures": failures,
    }
    with open("e2e-report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print("REPORT saved to e2e-report.json")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))