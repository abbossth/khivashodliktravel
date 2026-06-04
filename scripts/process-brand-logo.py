#!/usr/bin/env python3
"""Make outer white background transparent and export brand PNGs + favicons."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "brand"
SOURCE = ROOT / "assets" / "shodlik-travel-logo-source.jpg"


def flood_transparent(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    visited: set[tuple[int, int]] = set()
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if (x, y) in visited or x < 0 or x >= w or y < 0 or y >= h:
            continue
        r, g, b, _a = px[x, y]
        if r < 248 or g < 248 or b < 248:
            continue
        visited.add((x, y))
        px[x, y] = (r, g, b, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    return img


def main() -> None:
    src = SOURCE if SOURCE.exists() else next(
        (p for p in (ROOT / "assets").glob("shodlik-travel-logo*") if p.is_file()),
        None,
    )
    if not src:
        raise SystemExit("Place source logo at assets/shodlik-travel-logo-source.jpg")

    BRAND.mkdir(parents=True, exist_ok=True)
    img = flood_transparent(Image.open(src))
    img.thumbnail((512, 512), Image.Resampling.LANCZOS)

    for name in ("logo-mark.png", "khiva-shodlik-travel-logo.png", "logo.png"):
        img.save(BRAND / name, optimize=True)

    for size, name in [
        (32, "favicon-32.png"),
        (16, "favicon-16.png"),
        (180, "apple-touch-icon.png"),
        (512, "icon-512.png"),
    ]:
        thumb = img.copy()
        thumb.thumbnail((size, size), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        ox = (size - thumb.width) // 2
        oy = (size - thumb.height) // 2
        canvas.paste(thumb, (ox, oy), thumb)
        canvas.save(BRAND / name, optimize=True)

    print(f"Wrote brand assets from {src} -> {BRAND}")


if __name__ == "__main__":
    main()
