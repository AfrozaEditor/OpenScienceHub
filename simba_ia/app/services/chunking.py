from typing import Any

from app.core.config import settings


def chunk_text(text: str, *, size: int | None = None, overlap: int | None = None) -> list[str]:
    size = size or settings.chunk_size
    overlap = overlap or settings.chunk_overlap
    text = text.strip()
    if not text:
        return []
    if len(text) <= size:
        return [text]
    step = max(1, size - overlap)
    return [text[start : start + size] for start in range(0, len(text), step)]


def _page_at(offsets: list[tuple[int, int]], pos: int) -> int | None:
    page: int | None = None
    for off, p in offsets:
        if off <= pos:
            page = p
        else:
            break
    return page


def chunk_pages(
    pages: list[tuple[int, str]], *, size: int | None = None, overlap: int | None = None
) -> list[dict[str, Any]]:
    """Découpe le texte en conservant page_start/page_end approximatifs."""
    size = size or settings.chunk_size
    overlap = overlap or settings.chunk_overlap

    fragments: list[str] = []
    offsets: list[tuple[int, int]] = []
    pos = 0
    for page_no, ptext in pages:
        ptext = (ptext or "").strip()
        if not ptext:
            continue
        offsets.append((pos, page_no))
        fragments.append(ptext)
        pos += len(ptext) + 1

    joined = "\n".join(fragments)
    raw_chunks = chunk_text(joined, size=size, overlap=overlap)

    result: list[dict[str, Any]] = []
    step = max(1, size - overlap)
    start = 0
    for idx, chunk in enumerate(raw_chunks):
        end = start + len(chunk)
        result.append(
            {
                "chunk_index": idx,
                "chunk_text": chunk,
                "page_start": _page_at(offsets, start),
                "page_end": _page_at(offsets, max(start, end - 1)),
            }
        )
        start += step
    return result
