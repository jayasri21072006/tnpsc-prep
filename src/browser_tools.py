"""LiveKit function tools that give JARVIS full control over a browser.

Each tool maps to a ``BrowserController`` operation and returns plain,
speech-ready text for the LLM. Failures are raised as ``ToolError`` so the
agent can explain them to the user instead of crashing.
"""

from __future__ import annotations

import base64
import logging

from livekit.agents import RunContext, function_tool
from livekit.agents.llm import ImageContent, ToolError

from browser import BrowserController, BrowserError

logger = logging.getLogger(__name__)

browser_controller = BrowserController()


def _raise_tool_error(exc: BrowserError) -> ToolError:
    raise ToolError(str(exc)) from exc


@function_tool
async def browser_open(context: RunContext, url: str) -> str:
    """Open a website in the browser and report what is on the page.

    Use this whenever the user wants to visit a website, load a page, or do
    anything on a specific site. Provide the full address such as
    https://example.com; a bare domain like example.com also works.

    Args:
        url: The web address to open, with or without the https:// prefix.

    Returns:
        A speech-ready description of the opened page.
    """
    try:
        summary = await browser_controller.open_url(url)
    except BrowserError as exc:
        _raise_tool_error(exc)
    return f"Sir, the page is now open. {summary}"


@function_tool
async def browser_read_page(context: RunContext, mode: str = "summary") -> str:
    """Read text content from the current browser page.

    Use this to find out what is on the page after opening it or after an
    action. Does not require the page to be re-opened.

    Args:
        mode: What to extract. "summary" returns a short overview of the page
            text, "full" returns most of the visible text, "links" lists the
            page's links with their addresses, and "forms" lists the page's
            input fields, buttons and dropdowns.

    Returns:
        Plain text extracted from the page.
    """
    try:
        return await browser_controller.read_page(mode)
    except BrowserError as exc:
        _raise_tool_error(exc)


@function_tool
async def browser_click(context: RunContext, target: str) -> str:
    """Click an element on the current browser page.

    Use this to press a button, follow a link, or activate any clickable
    element. Provide a CSS selector (like #submit-button) when you know one,
    or the exact visible text of the element (like "Log in").

    Args:
        target: A CSS selector or the visible text of the element to click.

    Returns:
        A description of the page after the click.
    """
    try:
        return await browser_controller.click(target)
    except BrowserError as exc:
        _raise_tool_error(exc)


@function_tool
async def browser_type(
    context: RunContext, selector: str, text: str, submit: bool = False
) -> str:
    """Type text into a field on the current browser page.

    Use this to fill in a search box, a form field, or any text input.
    Set submit to True only when the user has asked you to complete and submit
    the form; pressing Enter may trigger payments or other irreversible
    actions, so always confirm with the user first.

    Args:
        selector: The CSS selector of the input field to type into.
        text: The text to type.
        submit: Whether to press Enter afterwards (default False).

    Returns:
        A description of the page after typing.
    """
    try:
        return await browser_controller.type_text(selector, text, submit=submit)
    except BrowserError as exc:
        _raise_tool_error(exc)


@function_tool
async def browser_act(
    context: RunContext,
    action: str,
    selector: str = "",
    value: str = "",
) -> str:
    """Perform a navigation or interaction helper action in the browser.

    Use this for actions that do not fit open, click or type. Supported
    actions: "back" to go to the previous page, "forward" to go to the next
    page, "reload" to refresh the page, "scroll_up" and "scroll_down" to move
    through the page, and "select" to choose an option from a dropdown (which
    needs the dropdown's selector and the option's visible text or value).

    Args:
        action: One of back, forward, reload, scroll_up, scroll_down, select.
        selector: CSS selector of the element to act on (only for "select").
        value: The option text to choose (only for "select").

    Returns:
        A description of the page after the action.
    """
    try:
        return await browser_controller.act(action, selector=selector, value=value)
    except BrowserError as exc:
        _raise_tool_error(exc)


@function_tool
async def browser_screenshot(context: RunContext) -> str:
    """Take a screenshot of the current browser page so you can see it.

    Use this when you need to see how a page actually looks: its layout,
    images, charts, or whether it rendered correctly. The screenshot is added
    to your context as a vision image alongside a text description.

    Returns:
        A text description of the page, with the screenshot made visible to you.
    """
    try:
        image_bytes = await browser_controller.screenshot()
    except BrowserError as exc:
        _raise_tool_error(exc)

    data_url = f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode('ascii')}"

    agent = context.session.current_agent
    if agent is not None:
        chat_ctx = agent.chat_ctx.copy()
        chat_ctx.add_message(
            role="user",
            content=[
                "Here is a screenshot of the current browser page.",
                ImageContent(image=data_url, inference_detail="low"),
            ],
        )
        await agent.update_chat_ctx(chat_ctx)

    try:
        summary = await browser_controller.describe_page()
    except BrowserError as exc:
        _raise_tool_error(exc)
    return f"A screenshot was captured so you can see the page. {summary}"


@function_tool
async def browser_close(context: RunContext) -> str:
    """Close the browser and end the browsing session.

    Use this when the user is finished with the browser or asks you to close
    it. This frees up memory. The browser can be reopened later with
    browser_open.

    Returns:
        A short confirmation that the browser was closed.
    """
    await browser_controller.close()
    return "The browser has been closed, Sir."
