# -*- coding: utf-8 -*-
"""
生成站点的位图资源：
  - public/og/{zh,en}.png          社交分享卡片（1200x630）
  - public/brand/icon-{192,512}.png        应用图标（透明底）
  - public/brand/icon-maskable-512.png     安卓主屏用（满底，图形缩到 60%）

为什么要脚本而不是手放几张图：
  - 分享卡片上的版本区间与 lib/site.js 的版本表绑定，版本表一变卡片就该跟着变；
  - 卡片品牌色直接从 public/brand/aeback-lockup.png 采样，
    不在这儿二次硬编码一套色值（避免"两处颜色慢慢漂移"这种慢性病）。

用法：python test/assets.py
"""

import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'public', 'og')
BRAND_DIR = os.path.join(ROOT, 'public', 'brand')
LOGO = os.path.join(BRAND_DIR, 'aeback-lockup.png')
# 用户提供的应用图标原件。丢了也没关系 —— 缺失时脚本会跳过图标那一步，
# 不会把已经生成好的文件删掉。
ICON_SRC = 'C:/Users/User/Downloads/浏览器icon.png'

W, H = 1200, 630
PAD = 92

BG = (10, 10, 15)          # #0a0a0f，与 app/globals.css 的 --bg 一致
GRID = (255, 255, 255, 7)  # 极淡网格
TXT = (244, 245, 248)
MUTED = (138, 143, 160)
FAINT = (86, 90, 104)

FONT_DIR = 'C:/Windows/Fonts'
BOLD = os.path.join(FONT_DIR, 'msyhbd.ttc')
REG = os.path.join(FONT_DIR, 'msyh.ttc')


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.truetype(os.path.join(FONT_DIR, 'arial.ttf'), size)


# ── 从品牌图采样颜色：左半是字标的橙色段，右半是紫色段 ──
def brand_colors():
    im = Image.open(LOGO).convert('RGBA')
    w, h = im.size
    px = im.load()
    best = {}  # 色相桶 -> (计数, 颜色)
    for x in range(0, w, 2):
        for y in range(0, h, 2):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            # 只要饱和的彩色像素，跳过白/灰
            mx, mn = max(r, g, b), min(r, g, b)
            if mx - mn < 60 or mx < 90:
                continue
            key = 'warm' if r >= b else 'cool'
            best[key] = best.get(key, (0, (0, 0, 0)))
            best[key] = (best[key][0] + 1, (r, g, b))
    warm = best.get('warm', (0, (255, 77, 0)))[1]
    cool = best.get('cool', (0, (120, 110, 220)))[1]
    return warm, cool


ACCENT, ACCENT_2 = brand_colors()


def card(lang):
    img = Image.new('RGB', (W, H), BG)

    # ── 背景网格（和站点 body 的底纹同一套参数：44px、1px 线） ──
    grid = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    for x in range(0, W, 44):
        gd.line([(x, 0), (x, H)], fill=GRID, width=1)
    for y in range(0, H, 44):
        gd.line([(0, y), (W, y)], fill=GRID, width=1)
    img = Image.alpha_composite(img.convert('RGBA'), grid).convert('RGB')

    d = ImageDraw.Draw(img)

    f_mark = font(BOLD, 66)
    f_h = font(BOLD, 62)
    f_mono = font(REG, 29)
    f_mono_b = font(BOLD, 29)
    f_url = font(REG, 25)

    # ── 品牌字标：AE 用暖色、Back 用冷色，与 logo 里的两段配色对应 ──
    y = 74
    d.text((PAD, y), 'AE', font=f_mark, fill=ACCENT)
    w_ae = d.textlength('AE', font=f_mark)
    d.text((PAD + w_ae, y), 'Back', font=f_mark, fill=ACCENT_2)

    # 右上角一个小标签，交代这站是干什么的
    tag = 'ONLINE DOWNGRADER' if lang == 'en' else '在线工程降级'
    f_tag = font(REG, 24)
    tw = d.textlength(tag, font=f_tag)
    d.text((W - PAD - tw, y + 26), tag, font=f_tag, fill=FAINT)

    # ── 主标题 ──
    if lang == 'zh':
        lines = [
            ('把工程文件降级到', TXT),
            ('旧版本能打开的状态', ACCENT),
        ]
        mono = [
            ('.prproj', 'CS6 · CC 2013–2018 · 2019–2026'),
            ('.aep', 'AE 2018 · 2021 · 2023 · 2026'),
        ]
    else:
        lines = [
            ('Downgrade your project', TXT),
            ('to an older Adobe version', ACCENT),
        ]
        mono = [
            ('.prproj', 'CS6 · CC 2013–2018 · 2019–2026'),
            ('.aep', 'AE 2018 · 2021 · 2023 · 2026'),
        ]

    y = 216
    for text, color in lines:
        d.text((PAD, y), text, font=f_h, fill=color)
        y += 84

    # ── 版本区间 ──
    y = 432
    for ext, versions in mono:
        d.text((PAD, y), ext, font=f_mono_b, fill=TXT)
        d.text((PAD + 132, y), versions, font=f_mono, fill=MUTED)
        y += 48

    # ── 底边：域名 + 分隔线 ──
    d.line([(PAD, H - 88), (W - PAD, H - 88)], fill=(30, 30, 46), width=1)
    d.text((PAD, H - 68), 'aeback.com', font=f_url, fill=FAINT)
    note = '免费 · 不上传文件' if lang == 'zh' else 'Free · nothing uploaded'
    nw = d.textlength(note, font=f_url)
    d.text((W - PAD - nw, H - 68), note, font=f_url, fill=FAINT)

    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f'{lang}.png')
    img.save(path, optimize=True)
    print(f'  {path}  {img.size[0]}x{img.size[1]}  {os.path.getsize(path) // 1024} KB')


print('品牌采样色：暖', ACCENT, '冷', ACCENT_2)
for lg in ('zh', 'en'):
    card(lg)


# ═══════════════════════════ 应用图标 ═══════════════════════════

def app_icons():
    if not os.path.exists(ICON_SRC):
        print('  ! 找不到图标原件，跳过应用图标生成（已存在的文件不动）')
        return

    src = Image.open(ICON_SRC).convert('RGBA')
    bbox = src.getbbox()
    if bbox:
        src = src.crop(bbox)  # 裁掉四周空白，让图形撑满画布

    os.makedirs(BRAND_DIR, exist_ok=True)

    # 透明底版本：给 manifest 的 "any" purpose 用
    for size in (192, 512):
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        inner = src.copy()
        inner.thumbnail((int(size * 0.9), int(size * 0.9)), Image.Resampling.LANCZOS)
        canvas.paste(inner, ((size - inner.width) // 2, (size - inner.height) // 2), inner)
        path = os.path.join(BRAND_DIR, f'icon-{size}.png')
        canvas.save(path, optimize=True)
        print(f'  {path}  {size}x{size}  {os.path.getsize(path) // 1024} KB')

    # 满底版本：安卓会把图标裁成圆形/圆角，图形必须缩进安全区（约 60%），
    # 否则边缘会被切掉。底色用站点背景色，比采样图标自身颜色更稳。
    size = 512
    canvas = Image.new('RGBA', (size, size), BG + (255,))
    inner = src.copy()
    inner.thumbnail((int(size * 0.6), int(size * 0.6)), Image.Resampling.LANCZOS)
    canvas.paste(inner, ((size - inner.width) // 2, (size - inner.height) // 2), inner)
    path = os.path.join(BRAND_DIR, 'icon-maskable-512.png')
    canvas.save(path, optimize=True)
    print(f'  {path}  {size}x{size}  {os.path.getsize(path) // 1024} KB')


app_icons()
