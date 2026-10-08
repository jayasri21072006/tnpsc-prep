"""Tests for the Playwright BrowserController used by JARVIS.

These exercise a real headless Chromium against a local HTTP fixture server
served from ``tests/fixtures``, so no external network is required.
"""

from __future__ import annotations

import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest

from browser import BrowserController, BrowserError

FIXTURES_DIR = Path(__file__).parent / "fixtures"
SLOW_WAIT_SECONDS = 30


class FixtureHandler(SimpleHTTPRequestHandler):
    """Serves the fixture pages, plus a deliberately slow route for timeouts."""

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, directory=str(FIXTURES_DIR), **kwargs)

    def do_GET(self) -> None:
        if self.path.startswith("/slow"):
            time.sleep(SLOW_WAIT_SECONDS)
        return super().do_GET()

    def log_message(self, *args) -> None:  # silence request logging
        pass


@pytest.fixture(scope="module")
def server_url() -> str:
    server = ThreadingHTTPServer(("127.0.0.1", 0), FixtureHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}"
    finally:
        server.shutdown()
        server.server_close()


@pytest.fixture
async def browser() -> BrowserController:
    controller = BrowserController(headless=True, action_timeout=5.0)
    yield controller
    await controller.close()


async def test_open_loads_fixture_and_describes_page(
    browser: BrowserController, server_url: str
) -> None:
    summary = await browser.open_url(f"{server_url}/index.html")
    assert "Welcome to the Test Page" in summary
    assert "/index.html" in summary


async def test_read_page_summary_includes_text(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    text = await browser.read_page()
    assert (
        "used to test JARVIS browser automation" in text
        or "used to test Jarvis browser automation" in text
    )


async def test_read_page_links_lists_links(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    links = await browser.read_page("links")
    assert "Go to page two" in links
    assert "page2" in links


async def test_read_page_forms_lists_fields(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    forms = await browser.read_page("forms")
    assert "sample-input" in forms
    assert "magic-button" in forms


async def test_click_by_css_selector_updates_page(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    await browser.click("#magic-button")
    assert "Button was clicked!" in await browser.read_page()


async def test_click_by_visible_text_updates_page(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    await browser.click("Click me")
    assert "Button was clicked!" in await browser.read_page()


async def test_type_fills_field_and_submits(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    await browser.type_text("#sample-input", "Ada", submit=True)
    assert "Form submitted with name: Ada" in await browser.read_page()


async def test_act_select_options(browser: BrowserController, server_url: str) -> None:
    await browser.open_url(f"{server_url}/index.html")
    await browser.act("select", selector="#sample-select", value="Green")
    assert "Selected: green" in await browser.read_page()


async def test_act_back_and_forward(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    await browser.click("#next-link")
    assert "Second Page" in await browser.describe_page()

    await browser.act("back")
    assert "Welcome to the Test Page" in await browser.describe_page()

    await browser.act("forward")
    assert "Second Page" in await browser.describe_page()


async def test_screenshot_returns_jpeg_bytes(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    image = await browser.screenshot()
    assert isinstance(image, bytes)
    assert image.startswith(b"\xff\xd8")  # JPEG magic bytes
    assert len(image) > 1000


async def test_timeout_raises_browser_error(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    with pytest.raises(BrowserError, match="timed out"):
        await browser.open_url(f"{server_url}/slow")


async def test_unknown_action_raises_browser_error(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    with pytest.raises(BrowserError, match="Unknown browser action"):
        await browser.act("teleport")


async def test_close_releases_and_restarts(
    browser: BrowserController, server_url: str
) -> None:
    await browser.open_url(f"{server_url}/index.html")
    await browser.close()
    # Starting again after close should work with a fresh browser instance.
    summary = await browser.open_url(f"{server_url}/page2.html")
    assert "Second Page" in summary
