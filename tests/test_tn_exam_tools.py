from tn_exam_tools import get_samacheer_book_links


def test_samacheer_book_links_return_medium_specific_tamil_catalog() -> None:
    books = get_samacheer_book_links("tamil", "TNPSC Group 4")

    assert books["medium"] == "tamil"
    assert books["exam"] == "TNPSC Group 4"
    assert books["books"][0]["class"] == "6"
    assert all("Tamil" in book["title"] for book in books["books"])
    assert all("ta" in book["url"] for book in books["books"])
    assert len(books["books"]) == 7


def test_samacheer_book_links_return_medium_specific_english_catalog() -> None:
    books = get_samacheer_book_links("english", "TNPSC Group 4")

    assert books["medium"] == "english"
    assert all("English" in book["title"] for book in books["books"])
    assert all("en" in book["url"] for book in books["books"])
    assert len(books["books"]) == 7


def test_samacheer_book_links_reject_unknown_medium() -> None:
    try:
        get_samacheer_book_links("hindi", "TNPSC Group 4")
    except ValueError as exc:
        assert "tamil or english" in str(exc).lower()
    else:
        raise AssertionError("Expected ValueError for an unsupported medium")


def test_mock_test_has_timed_submission_and_isolated_browser_profile(monkeypatch, tmp_path) -> None:
    import tn_exam_tools

    monkeypatch.setattr(tn_exam_tools, "_get_user_desktop", lambda: str(tmp_path))
    opened = {}

    def fake_open(url_or_file: str) -> None:
        opened["url"] = url_or_file

    monkeypatch.setattr(tn_exam_tools, "_open_in_chrome", fake_open)

    result = tn_exam_tools.generate_tn_mock_test_quiz(
        "TNPSC Group 4 General Tamil",
        num_questions=3,
        duration_minutes=30,
        medium="tamil",
    )

    assert "opened" in result.lower()
    assert opened["url"].endswith("_MockTest.html")
    saved = tmp_path / "TNPSC_Group_4_General_Tamil_MockTest.html"
    assert saved.exists()
    html = saved.read_text(encoding="utf-8")
    assert "30:00" in html
    assert "fullscreen" in html.lower()
    assert "visibilitychange" in html.lower()
    assert "closed-book" in html.lower()
    assert "--user-data-dir" in html
    assert "Start Test" in html
