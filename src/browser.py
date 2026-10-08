"""Playwright-powered browser control for JARVIS.

This module owns a single persistent Playwright browser page per agent session
so the voice agent can navigate, read, and interact with websites step by step,
like a human assistant.

It is intentionally independent of the LiveKit SDK so it can be tested in
isolation. The neighbouring ``browser_tools`` module wraps these operations as
LiveKit function tools and maps :class:`BrowserError` to the framework's
``ToolError``.
"""

from __future__ import annotations

import asyncio
import logging
import os

from playwright.async_api import (
    Browser,
    BrowserContext,
    Page,
    Playwright,
    async_playwright,
)
from playwright.async_api import (
    TimeoutError as PlaywrightTimeoutError,
)

logger = logging.getLogger(__name__)

DEFAULT_VIEWPORT = {"width": 1280, "height": 800}
SUMMARY_TEXT_LIMIT = 800
FULL_TEXT_LIMIT = 5000
MAX_LINKS = 20

_scroll_deltas = {
    "scroll_up": -900,
    "scroll_down": 900,
}


class BrowserError(RuntimeError):
    """A browser operation failed in a way the agent should report to the user."""


class BrowserController:
    """Stateful Playwright controller : one browser, one page, many steps.

    The browser starts lazily on the first action and is reused across tool
    calls so common web flows (navigate -> read -> click -> type -> screenshot)
    stay fast and feel like a single browsing session.
    """

    def __init__(
        self,
        *,
        headless: bool | None = None,
        action_timeout: float = 15.0,
    ) -> None:
        self._action_timeout = action_timeout
        self._headless = (
            headless
            if headless is not None
            else os.getenv("JARVIS_BROWSER_HEADLESS", "false").lower() == "true"
        )
        self._lock = asyncio.Lock()
        self._playwright: Playwright | None = None
        self._browser: Browser | None = None
        self._context: BrowserContext | None = None
        self._page: Page | None = None

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    async def ensure_started(self) -> Page:
        """Return the persistent page, launching the browser on first use."""
        if self._page is not None and not self._page.is_closed():
            return self._page

        async with self._lock:
            if self._page is not None and not self._page.is_closed():
                return self._page
            try:
                self._playwright = await async_playwright().start()
                try:
                    self._browser = await self._playwright.chromium.launch(
                        channel="chrome",
                        headless=self._headless,
                    )
                except Exception as chrome_err:
                    logger.info(f"Google Chrome channel not available ({chrome_err}), falling back to Chromium.")
                    self._browser = await self._playwright.chromium.launch(
                        headless=self._headless,
                    )
                self._context = await self._browser.new_context(
                    viewport=DEFAULT_VIEWPORT,
                    locale="en-US",
                )
                page = await self._context.new_page()
                page.set_default_timeout(self._action_timeout * 1000)
            except Exception as e:
                await self._close_unlocked()
                raise BrowserError(
                    f"Could not start the browser: {e}. "
                    "Make sure Playwright and Chromium are installed "
                    "(run: uv run playwright install chromium)."
                ) from e
            self._page = page
            return page

    async def close(self) -> None:
        """Stop the browser and free all resources."""
        async with self._lock:
            await self._close_unlocked()

    async def _close_unlocked(self) -> None:
        if self._playwright is not None:
            try:
                await self._playwright.stop()
            except Exception:
                logger.exception("Error while stopping Playwright")
        self._page = None
        self._context = None
        self._browser = None
        self._playwright = None

    # ------------------------------------------------------------------
    # Actions
    # ------------------------------------------------------------------

    async def open_url(self, url: str) -> str:
        """Navigate the page to ``url`` and return a speech-ready summary.

        A bare hostname (no scheme) is treated as ``https://`` to tolerate
        how the LLM may phrase a requested address.
        """
        page = await self.ensure_started()
        normalized = url.strip()
        if not normalized:
            raise BrowserError("No URL was provided to open.")
        if not normalized.startswith(("http://", "https://", "file://", "about:")):
            normalized = f"https://{normalized}"

        try:
            await self._guard(
                page.goto(normalized, wait_until="domcontentloaded"),
                what=f"Opening {normalized}",
            )
        except BrowserError:
            raise
        return await self.describe_page()

    async def describe_page(self) -> str:
        """A short, speech-ready overview of the current page."""
        page = await self.ensure_started()
        url = page.url or "no page open"
        title = (await page.title() or "").strip() or "untitled page"
        links = await self._link_count()
        text = await self._visible_text(SUMMARY_TEXT_LIMIT)
        return (
            f"Current page: {title}. Address: {url}. "
            f"{links} links on the page. Page text: {text}"
        )

    async def read_page(self, mode: str = "summary") -> str:
        """Extract content from the current page.

        ``mode`` is one of ``summary`` (default), ``full``, ``links`` or
        ``forms`` and always returns plain, speech-friendly text.
        """
        mode = (mode or "summary").strip().lower()
        if mode == "links":
            return await self._extract_links()
        if mode == "forms":
            return await self._extract_forms()
        if mode == "full":
            return await self._visible_text(FULL_TEXT_LIMIT)
        # default: summary
        text = await self._visible_text(SUMMARY_TEXT_LIMIT)
        return f"Page text: {text}" if text else "The page appears to be empty."

    async def click(self, target: str) -> str:
        """Click an element by CSS selector or by its visible text."""
        page = await self.ensure_started()
        target = target.strip()
        if not target:
            raise BrowserError("No click target was provided.")

        locator = page.locator(target)
        try:
            if await locator.count() == 0:
                locator = page.get_by_text(target, exact=False).first
            await self._guard(locator.click(), what=f"Clicking {target!r}")
        except BrowserError:
            raise
        return await self.describe_page()

    async def type_text(
        self,
        selector: str,
        text: str,
        submit: bool = False,
    ) -> str:
        """Fill a text field identified by ``selector`` (optionally hit Enter)."""
        page = await self.ensure_started()
        selector = selector.strip()
        if not selector:
            raise BrowserError("No field selector was provided to type into.")
        if not text:
            raise BrowserError("No text was provided to type.")

        locator = page.locator(selector).first
        try:
            await self._guard(locator.fill(text), what=f"Typing into {selector!r}")
            if submit:
                await self._guard(
                    locator.press("Enter"), what=f"Submitting {selector!r}"
                )
        except BrowserError:
            raise
        filler = " and submitted" if submit else ""
        return f"Typed into {selector!r}{filler}. {await self.describe_page()}"

    async def act(self, action: str, selector: str = "", value: str = "") -> str:
        """Perform a navigation or interaction helper action.

        Supported actions: ``back``, ``forward``, ``reload``, ``scroll_up``,
        ``scroll_down`` and ``select`` (select requires ``selector`` and
        ``value``, the option's visible text or value).
        """
        page = await self.ensure_started()
        action = (action or "").strip().lower()
        try:
            if action == "back":
                await self._guard(page.go_back(), what="Going back")
            elif action == "forward":
                await self._guard(page.go_forward(), what="Going forward")
            elif action == "reload":
                await self._guard(page.reload(), what="Reloading the page")
            elif action in _scroll_deltas:
                await self._guard(
                    page.mouse.wheel(0, _scroll_deltas[action]), what=f"{action}"
                )
            elif action == "select":
                if not selector:
                    raise BrowserError(
                        "Selecting an option needs both a field selector and a value."
                    )
                locator = page.locator(selector).first
                await self._guard(
                    locator.select_option(label=value),
                    what=f"Selecting in {selector!r}",
                )
            else:
                raise BrowserError(
                    f"Unknown browser action {action!r}. Supported actions are: "
                    "back, forward, reload, scroll_up, scroll_down, select."
                )
        except BrowserError:
            raise
        return await self.describe_page()

    async def screenshot(self) -> bytes:
        """Capture the visible viewport as JPEG bytes (small for vision tokens)."""
        page = await self.ensure_started()
        try:
            return await self._guard(
                page.screenshot(type="jpeg", quality=60),
                what="Taking a screenshot",
            )
        except BrowserError:
            raise

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    async def _visible_text(self, limit: int) -> str:
        page = await self.ensure_started()
        try:
            text = await self._guard(
                page.locator("body").inner_text(), what="Reading the page"
            )
        except BrowserError:
            return ""
        text = " ".join(text.split())
        if len(text) > limit:
            return f"{text[:limit].rstrip()}..."
        return text

    async def _link_count(self) -> int:
        page = await self.ensure_started()
        try:
            return await self._guard(page.locator("a").count(), what="Counting links")
        except BrowserError:
            return 0

    async def _extract_links(self) -> str:
        page = await self.ensure_started()
        try:
            entries = await self._guard(
                page.locator("a").evaluate_all(
                    "els => els.map(e => ({ text: e.innerText.trim(), href: e.href }))"
                ),
                what="Reading links",
            )
        except BrowserError:
            raise
        entries = [e for e in entries if e["text"] or e["href"]][:MAX_LINKS]
        if not entries:
            return "The page has no links."
        lines = [f"{e['text'] or '(untitled link)'} at {e['href']}" for e in entries]
        return "Links on the page: " + "; ".join(lines)

    async def _extract_forms(self) -> str:
        page = await self.ensure_started()
        try:
            controls = await self._guard(
                page.locator("input, select, textarea, button").evaluate_all(
                    "els => els.map(e => ({"
                    "  tag: e.tagName.toLowerCase(),"
                    "  id: e.id || '',"
                    "  name: e.name || '',"
                    "  type: e.type || '',"
                    "  text: (e.innerText || e.value || '').trim().slice(0, 40)"
                    "}))"
                ),
                what="Reading form fields",
            )
        except BrowserError:
            raise
        if not controls:
            return "The page has no form fields."
        lines = []
        for c in controls:
            label = c["id"] or c["name"] or c["text"] or "(unnamed)"
            kind = f" of type {c['type']}" if c["type"] else ""
            lines.append(f"{c['tag']} {label}{kind}")
        return "Form fields on the page: " + "; ".join(lines)

    async def _guard(self, awaitable: object, *, what: str) -> object:
        """Run a Playwright call, converting timeouts into BrowserError."""
        try:
            return await awaitable  # type: ignore[misc]
        except (asyncio.TimeoutError, PlaywrightTimeoutError):
            raise BrowserError(
                f"{what} timed out after {self._action_timeout:g} seconds. "
                "The site may be slow or blocked; tell the user and suggest "
                "retrying or using a different page."
            ) from None
