"""Tests for the LiveKit function tools that expose the browser to JARVIS.

The BrowserController is stubbed so these focus on tool contract behavior:
argument passing, speech-ready returns, and ToolError mapping.
"""

from __future__ import annotations

from typing import Any

import pytest
from livekit.agents.llm import ImageContent, ToolError

import browser_tools
from browser import BrowserError


class FakeSession:
    def __init__(self) -> None:
        self.current_agent = None


class FakeContext:
    def __init__(self) -> None:
        self.session = FakeSession()


class FakeChatCtx:
    def __init__(self) -> None:
        self.messages: list[tuple[str, list[Any]]] = []

    def copy(self) -> FakeChatCtx:
        return self

    def add_message(self, *, role: str, content: list[Any]) -> None:
        self.messages.append((role, content))


class FakeAgent:
    def __init__(self) -> None:
        self.chat_ctx = FakeChatCtx()
        self.updated: FakeChatCtx | None = None

    async def update_chat_ctx(self, chat_ctx: FakeChatCtx) -> None:
        self.updated = chat_ctx


class FakeController:
    """Records calls and returns canned results; can be told to raise."""

    def __init__(self) -> None:
        self.calls: list[tuple[str, dict[str, Any]]] = []
        self.error: BrowserError | None = None
        self.screenshot_bytes = b"\xff\xd8screenshot-jpeg-data"
        self.summary = (
            "Current page: Test Page. Address: http://x.test. 2 links on the page."
        )

    def _record(self, name: str, **kwargs: Any) -> None:
        self.calls.append((name, kwargs))
        if self.error is not None:
            raise self.error

    async def open_url(self, url: str) -> str:
        self._record("open_url", url=url)
        return self.summary

    async def read_page(self, mode: str) -> str:
        self._record("read_page", mode=mode)
        return "Page text: some visible content."

    async def click(self, target: str) -> str:
        self._record("click", target=target)
        return self.summary

    async def type_text(self, selector: str, text: str, submit: bool) -> str:
        self._record("type_text", selector=selector, text=text, submit=submit)
        return self.summary

    async def act(self, action: str, selector: str, value: str) -> str:
        self._record("act", action=action, selector=selector, value=value)
        return self.summary

    async def screenshot(self) -> bytes:
        self._record("screenshot")
        return self.screenshot_bytes

    async def describe_page(self) -> str:
        return self.summary

    async def close(self) -> None:
        self._record("close")


@pytest.fixture
def fake_controller(monkeypatch: pytest.MonkeyPatch) -> FakeController:
    controller = FakeController()
    monkeypatch.setattr(browser_tools, "browser_controller", controller)
    return controller


async def test_browser_open_returns_speech_ready_summary(
    fake_controller: FakeController,
) -> None:
    result = await browser_tools.browser_open(FakeContext(), url="example.com")
    assert result.startswith("Sir, the page is now open.")
    assert "Test Page" in result
    assert fake_controller.calls == [("open_url", {"url": "example.com"})]


async def test_browser_open_maps_browser_error_to_tool_error(
    fake_controller: FakeController,
) -> None:
    fake_controller.error = BrowserError("no network connection")
    with pytest.raises(ToolError, match="no network connection"):
        await browser_tools.browser_open(FakeContext(), url="example.com")


async def test_browser_read_page_forwards_mode(
    fake_controller: FakeController,
) -> None:
    result = await browser_tools.browser_read_page(FakeContext(), mode="links")
    assert "some visible content" in result
    assert fake_controller.calls == [("read_page", {"mode": "links"})]


async def test_browser_click_forwards_target(
    fake_controller: FakeController,
) -> None:
    await browser_tools.browser_click(FakeContext(), target="#magic-button")
    assert fake_controller.calls == [("click", {"target": "#magic-button"})]


async def test_browser_type_forwards_submit_flag(
    fake_controller: FakeController,
) -> None:
    await browser_tools.browser_type(
        FakeContext(), selector="#sample-input", text="Ada", submit=True
    )
    assert fake_controller.calls == [
        ("type_text", {"selector": "#sample-input", "text": "Ada", "submit": True})
    ]


async def test_browser_act_forwards_arguments(
    fake_controller: FakeController,
) -> None:
    await browser_tools.browser_act(
        FakeContext(), action="select", selector="#sample-select", value="Green"
    )
    assert fake_controller.calls == [
        ("act", {"action": "select", "selector": "#sample-select", "value": "Green"})
    ]


async def test_browser_screenshot_returns_summary(
    fake_controller: FakeController,
) -> None:
    result = await browser_tools.browser_screenshot(FakeContext())
    assert "A screenshot was captured" in result
    assert "Test Page" in result


async def test_browser_screenshot_injects_vision_image(
    fake_controller: FakeController, monkeypatch: pytest.MonkeyPatch
) -> None:
    agent = FakeAgent()
    context = FakeContext()
    context.session.current_agent = agent

    monkeypatch.setattr(
        browser_tools,
        "browser_controller",
        fake_controller,  # already set by fixture
    )

    await browser_tools.browser_screenshot(context)

    assert agent.updated is not None
    assert len(agent.updated.messages) == 1
    role, content = agent.updated.messages[0]
    assert role == "user"
    images = [c for c in content if isinstance(c, ImageContent)]
    assert len(images) == 1
    assert images[0].image.startswith("data:image/jpeg;base64,")


async def test_browser_screenshot_maps_browser_error(
    fake_controller: FakeController,
) -> None:
    fake_controller.error = BrowserError("the page crashed")
    with pytest.raises(ToolError, match="the page crashed"):
        await browser_tools.browser_screenshot(FakeContext())


async def test_browser_close_calls_controller(
    fake_controller: FakeController,
) -> None:
    result = await browser_tools.browser_close(FakeContext())
    assert "closed" in result.lower()
    assert fake_controller.calls == [("close", {})]
