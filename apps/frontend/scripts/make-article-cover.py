"""Branded 1200×630 article cover in the style of src/assets/articles/*.webp.

    python3 apps/frontend/scripts/make-article-cover.py --title "Симптоми РДУГ у дорослих" --kicker "РДУГ" --out apps/frontend/src/assets/articles/<slug>.webp

The cover is served from https://doctor-skripnik.com.ua/assets/articles/<slug>.webp once the
frontend is deployed; set that URL as the article's coverImage. Needs Pillow and macOS's Arial.
"""
import argparse
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG, ACCENT, PEACH, TITLE, MUTED = '#fdf5ef', '#8d6a56', '#e8bfa4', '#2b2b2b', '#8d6a56'
FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'
TEXT_X, TITLE_MAX_W = 80, 660
FOOTER = 'Центр ментального здоров’я'
SITE = 'doctor-skripnik.com.ua'


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
    p = argparse.ArgumentParser()
    p.add_argument('--title', required=True, help='short banner title, ~2–6 words')
    p.add_argument('--kicker', required=True, help='topic chip, e.g. "РДУГ", "Депресія"')
    p.add_argument('--out', required=True)
    args = p.parse_args()

    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)

    # Decorative circle and ring on the right, as on the existing covers
    d.ellipse((820, -180, 1420, 420), fill=PEACH)
    d.ellipse((980, 380, 1300, 700), outline=ACCENT, width=4)

    chip_font = ImageFont.truetype(FONT_BOLD, 22)
    chip_w = d.textlength(args.kicker, font=chip_font) + 48
    d.rounded_rectangle((TEXT_X, 80, TEXT_X + chip_w, 136), radius=28, fill=ACCENT)
    d.text((TEXT_X + 24, 108), args.kicker, font=chip_font, fill='white', anchor='lm')

    font, lines = title_layout(d, args.title)
    line_h = int(font.size * 1.22)
    for i, line in enumerate(lines):
        d.text((TEXT_X, 196 + i * line_h), line, font=font, fill=TITLE)

    d.rectangle((TEXT_X, 518, TEXT_X + 120, 522), fill=PEACH)
    d.text((TEXT_X, 562), FOOTER, font=ImageFont.truetype(FONT_BOLD, 24), fill=TITLE, anchor='lm')
    d.text((TEXT_X, 597), SITE, font=ImageFont.truetype(FONT, 22), fill=MUTED, anchor='lm')

    im.save(args.out, 'WEBP', quality=88, method=6)
    print(f'Cover saved: {args.out}')


if __name__ == '__main__':
    main()
