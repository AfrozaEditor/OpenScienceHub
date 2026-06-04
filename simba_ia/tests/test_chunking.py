from app.services.chunking import chunk_pages, chunk_text


def test_chunk_text_overlap():
    text = "abcdefghij" * 30

    chunks = chunk_text(text, size=100, overlap=20)

    assert len(chunks) >= 3
    assert all(len(chunk) <= 100 for chunk in chunks)


def test_chunk_text_short_single():
    assert chunk_text("court", size=100, overlap=10) == ["court"]


def test_chunk_text_empty():
    assert chunk_text("   ", size=100, overlap=10) == []


def test_chunk_pages_tracks_pages():
    pages = [(1, "alpha " * 50), (2, "bravo " * 50)]

    chunks = chunk_pages(pages, size=120, overlap=20)

    assert chunks
    assert chunks[0]["page_start"] == 1
    assert all("chunk_text" in chunk and "page_start" in chunk for chunk in chunks)
    assert {chunk["page_end"] for chunk in chunks} <= {1, 2}
