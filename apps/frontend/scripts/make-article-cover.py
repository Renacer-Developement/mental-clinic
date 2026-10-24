"""Branded 1200×630 article cover, each one different from the last.

    python3 apps/frontend/scripts/make-article-cover.py --title "Симптоми РДУГ у дорослих" --kicker "РДУГ" --out apps/frontend/src/assets/articles/<slug>.webp

The palette rotates with the number of covers already in the output folder, so two
consecutive articles never share colours; the composition and the shapes' size and
position come from the file name, so each article keeps its own look when regenerated.
The cover is served from https://doctor-skripnik.com.ua/assets/articles/<slug>.webp once
the frontend is deployed; set that URL as the article's coverImage. Needs Pillow and macOS's Arial.
"""
import argparse
import hashlib
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
# Cards crop the cover to 16:10 and 4:3 (up to 180px off each side), so text starts at 200
TEXT_X, TITLE_MAX_W = 200, 600
FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'
FOOTER = 'Центр ментального здоров’я'
SITE = 'doctor-skripnik.com.ua'
TEXT = '#fbf7f2'

# Deep backgrounds so the cover stands out from the site's cream pages; light text on top.
# shape: the large decorative form, accent: chip, lines and small details
PALETTES = [
    {'bg': '#6b4a3a', 'shape': '#a5775f', 'accent': '#ecc7ae'},  # cocoa / peach
    {'bg': '#2f4a3d', 'shape': '#557563', 'accent': '#c3d9c9'},  # forest / sage
    {'bg': '#2c3e57', 'shape': '#4f6687', 'accent': '#c3d1e4'},  # navy / dusty blue
    {'bg': '#43334d', 'shape': '#6c5578', 'accent': '#dccbe2'},  # plum / lavender
    {'bg': '#5e4820', 'shape': '#8f7238', 'accent': '#eed9a8'},  # ochre / sand
    {'bg': '#5f3431', 'shape': '#8c5550', 'accent': '#ebc1bc'},  # oxblood / rose clay
    {'bg': '#1f4645', 'shape': '#3f6e6c', 'accent': '#bcdcda'},  # deep teal / mist
]


def rnd(seed, i, lo, hi):
    """Deterministic number in [lo, hi] from byte i of the seed."""
    return lo + seed[i % len(seed)] * (hi - lo) // 255


def layout_circle_ring(d, p, s):
    r = rnd(s, 1, 240, 290)
    cx, cy = rnd(s, 2, 1100, 1160), rnd(s, 3, 60, 160)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=p['shape'])
    r2 = rnd(s, 4, 130, 180)
    cx2, cy2 = rnd(s, 5, 1080, 1180), rnd(s, 6, 500, 580)
    d.ellipse((cx2 - r2, cy2 - r2, cx2 + r2, cy2 + r2), outline=p['accent'], width=4)


def layout_arc(d, p, s):
    r = rnd(s, 1, 360, 420)
    cx, cy = rnd(s, 2, 1200, 1260), rnd(s, 3, 560, 660)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=p['shape'])
    r2 = r - rnd(s, 4, 60, 100)
    d.ellipse((cx - r2, cy - r2, cx + r2, cy + r2), outline=p['bg'], width=6)
    d.ellipse((1000, 70, 1040, 110), fill=p['accent'])


def layout_dots(d, p, s):
    for i, (bx, by, br) in enumerate([(1010, 170, 150), (1130, 360, 110), (950, 470, 80)]):
        r = br + rnd(s, i + 1, -20, 30)
        x, y = bx + rnd(s, i + 4, -30, 30), by + rnd(s, i + 7, -30, 30)
        d.ellipse((x - r, y - r, x + r, y + r), fill=p['shape'] if i != 2 else p['accent'])


def layout_pill(d, p, s):
    top = rnd(s, 1, -120, -40)
    x = rnd(s, 2, 860, 920)
    d.rounded_rectangle((x, top, x + 260, top + 560), radius=130, fill=p['shape'])
    d.rounded_rectangle((x + 170, top + 300, x + 430, top + 860), radius=130, outline=p['accent'], width=4)


def layout_rings(d, p, s):
    cx, cy = rnd(s, 1, 1110, 1160), rnd(s, 2, 250, 360)
    d.ellipse((cx - 190, cy - 190, cx + 190, cy + 190), fill=p['shape'])
    for k, r in enumerate((240, 290)):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=p['accent'] if k == 0 else p['shape'], width=3)


LAYOUTS = [layout_circle_ring, layout_arc, layout_dots, layout_pill, layout_rings]


def wrap(draw, text, font, max_w):
    lines, line = [], ''
    for word in text.split():
        candidate = f'{line} {word}'.strip()
        if draw.textlength(candidate, font=font) <= max_w or not line:
            line = candidate
        else:
            lines.append(line)
            line = word
    return lines + [line] if line else lines


def title_layout(draw, text):
    """Largest size (60 → 40px) at which the title fits in three lines."""
    for size in range(60, 38, -2):
        font = ImageFont.truetype(FONT_BOLD, size)
        lines = wrap(draw, text, font, TITLE_MAX_W)
        if len(lines) <= 3:
            return font, lines
    return font, lines[:3]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--title', required=True, help='short banner title, ~2–6 words')
    ap.add_argument('--kicker', required=True, help='topic chip, e.g. "РДУГ", "Депресія"')
    ap.add_argument('--out', required=True)
    ap.add_argument('--palette', type=int, help='palette index 0–6, to override the rotation when redrawing several covers at once')
    args = ap.parse_args()

    name = os.path.basename(args.out)
    folder = os.path.dirname(args.out) or '.'
    existing = sorted(f for f in os.listdir(folder) if f.endswith('.webp') and f != name) if os.path.isdir(folder) else []
    seed = hashlib.md5(name.encode()).digest()
    palette = PALETTES[(args.palette if args.palette is not None else len(existing)) % len(PALETTES)]
    layout = LAYOUTS[seed[0] % len(LAYOUTS)]

    im = Image.new('RGB', (W, H), palette['bg'])
    d = ImageDraw.Draw(im)
    layout(d, palette, seed)

    chip_font = ImageFont.truetype(FONT_BOLD, 22)
    chip_w = d.textlength(args.kicker, font=chip_font) + 48
    d.rounded_rectangle((TEXT_X, 80, TEXT_X + chip_w, 136), radius=28, fill=palette['accent'])
    d.text((TEXT_X + 24, 108), args.kicker, font=chip_font, fill=palette['bg'], anchor='lm')

    font, lines = title_layout(d, args.title)
    line_h = int(font.size * 1.22)
    for i, line in enumerate(lines):
        d.text((TEXT_X, 196 + i * line_h), line, font=font, fill=TEXT)

    d.rectangle((TEXT_X, 518, TEXT_X + 120, 522), fill=palette['accent'])
    d.text((TEXT_X, 562), FOOTER, font=ImageFont.truetype(FONT_BOLD, 24), fill=TEXT, anchor='lm')
    d.text((TEXT_X, 597), SITE, font=ImageFont.truetype(FONT, 22), fill=palette['accent'], anchor='lm')

    im.save(args.out, 'WEBP', quality=88, method=6)
    print(f'Cover saved: {args.out} (palette {PALETTES.index(palette)}, {layout.__name__})')


if __name__ == '__main__':
    main()
