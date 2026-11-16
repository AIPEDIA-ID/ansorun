#!/usr/bin/env python3
"""
Ekspor aset web dari asset bank (.docs/assets_bank) ke public/.
Jalankan dari root project:   python3 scripts/export-assets.py
Butuh Pillow (pip install pillow). Idempotent: menimpa file hasil ekspor.

Hasil:
  public/brand/logo-on-dark.webp   logo (gradient lime-putih) untuk latar gelap
  public/brand/logo-on-light.webp  logo hitam untuk latar terang (header putih)
  public/brand/kv.webp, kv-og.jpg  key visual (hero) dan versi og:image
  public/favicon.png, favicon.ico  huruf "A" dari logo
  public/sample/race/jersey.webp, tas-serut.webp   mockup tanpa latar putih
"""
from collections import deque
from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
BANK = Path(".docs/assets_bank")
BRAND = Path("public/brand")
RACE = Path("public/sample/race")
for d in (BRAND, RACE):
    d.mkdir(parents=True, exist_ok=True)

TITLING = BANK / "KV DSGN/TITLING DSGN - ANSORUN 2026.-APPROVED.png"       # gradient, untuk latar gelap
TITLING_BLACK = BANK / "KV DSGN/TITLING- BLCK DSGN - ANSORUN 2026.-APPROVED.png"  # hitam, untuk latar terang
KV = BANK / "KV DSGN/KV DSGN - ANSORUN 2026.-APPROVED.png"


def alpha_bbox(im, thr=8):
    return im.split()[-1].point(lambda v: 255 if v > thr else 0).getbbox()


def export_logo(src, dst, width=1000):
    im = Image.open(src).convert("RGBA")
    im = im.crop(alpha_bbox(im))
    im.resize((width, round(im.height * width / im.width)), Image.LANCZOS).save(dst, quality=92, method=6)


def export_kv():
    kv = Image.open(KV).convert("RGB")
    kv.resize((2400, round(kv.height * 2400 / kv.width)), Image.LANCZOS).save(BRAND / "kv.webp", quality=82, method=6)
    kv.resize((1200, round(kv.height * 1200 / kv.width)), Image.LANCZOS).save(BRAND / "kv-og.jpg", quality=84, optimize=True)


def export_favicon():
    """Huruf A saja: dipotong di celah kolom antara A dan N, tanpa tagline/baris bawah."""
    lg = Image.open(BRAND / "logo-on-dark.webp").convert("RGBA")
    w, h = lg.size
    al = lg.split()[-1].point(lambda v: 255 if v > 40 else 0)
    px = al.load()
    rows = [sum(1 for x in range(w) if px[x, y]) for y in range(h)]
    big = [y for y in range(h) if rows[y] > w * 0.25]          # baris huruf besar
    y0, y1 = big[0], big[-1]
    cols = [sum(1 for y in range(y0, y1 + 1) if px[x, y]) for x in range(w)]
    cut = min(range(int(w * 0.12), int(w * 0.32)), key=lambda x: cols[x])   # celah A|N
    a = lg.crop((0, y0 + 39, cut, y1 - 32))
    a = a.crop(alpha_bbox(a, 40))
    size, pad = 256, int(256 * 0.14)
    tile = Image.new("RGBA", (size, size), (11, 42, 53, 255))
    a.thumbnail((size - 2 * pad, size - 2 * pad), Image.LANCZOS)
    tile.paste(a, ((size - a.width) // 2, (size - a.height) // 2), a)
    tile.save("public/favicon.png")
    tile.convert("RGB").save("public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


def cutout(src, dst, width, min_bg=1500):
    """Hapus latar putih mockup. Hanya area putih/abu netral yang terhubung ke tepi (atau luas, mis. lubang
    tali) yang dihapus; huruf putih kecil di dalam desain tetap utuh. Bayangan jadi hitam semi-transparan."""
    im = Image.open(src).convert("RGB")
    im = im.crop(im.point(lambda v: 255 if v < 235 else 0).convert("L").getbbox())
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    w, h = im.size
    px = im.load()
    near = [[min(px[x, y]) > 170 and max(px[x, y]) - min(px[x, y]) < 20 for x in range(w)] for y in range(h)]
    seen = [[False] * w for _ in range(h)]
    bg = [[False] * w for _ in range(h)]
    for y0 in range(h):
        for x0 in range(w):
            if near[y0][x0] and not seen[y0][x0]:
                comp, touch, dq = [], False, deque([(x0, y0)])
                seen[y0][x0] = True
                while dq:
                    x, y = dq.popleft()
                    comp.append((x, y))
                    touch = touch or x in (0, w - 1) or y in (0, h - 1)
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and near[ny][nx] and not seen[ny][nx]:
                            seen[ny][nx] = True
                            dq.append((nx, ny))
                if touch or len(comp) > min_bg:
                    for x, y in comp:
                        bg[y][x] = True
    out = Image.new("RGBA", (w, h))
    o = out.load()
    for y in range(h):
        for x in range(w):
            o[x, y] = (0, 0, 0, int((255 - min(px[x, y])) * 0.85)) if bg[y][x] else (*px[x, y], 255)
    edge = out.copy()
    e = edge.load()
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            if not bg[y][x] and any(bg[y + dy][x + dx] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                mn = min(px[x, y])
                if mn > 120:
                    r, g, b = px[x, y]
                    e[x, y] = (int(r * .6), int(g * .6), int(b * .6), max(0, min(255, int((255 - mn) * 255 / 135))))
    edge.crop(alpha_bbox(edge, 20)).save(dst, quality=88, method=6)


if __name__ == "__main__":
    export_logo(TITLING, BRAND / "logo-on-dark.webp")
    export_logo(TITLING_BLACK, BRAND / "logo-on-light.webp")
    export_kv()
    export_favicon()
    cutout(BANK / "JERSEY/Teal and Lime Running Jersey Mockups.png", RACE / "jersey.webp", 900)
    cutout(BANK / "TAS SERUT/ANSORUN Ramadan 2027 Drawstring Bag alt 1.png", RACE / "tas-serut.webp", 700)
    print("selesai")
