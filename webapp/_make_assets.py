# -*- coding: utf-8 -*-
"""生成站点图标与 OG 分享图（zh / en）"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(ROOT, 'public')
os.makedirs(PUB, exist_ok=True)

CN_BOLD = 'C:/Windows/Fonts/msyhbd.ttc'
CN_REG = 'C:/Windows/Fonts/msyh.ttc'
EN_BOLD = 'C:/Windows/Fonts/arialbd.ttf'
EN_REG = 'C:/Windows/Fonts/arial.ttf'

W, H = 1200, 630


def font(path, size):
    return ImageFont.truetype(path, size)


def text_w(draw, txt, f):
    b = draw.textbbox((0, 0), txt, font=f)
    return b[2] - b[0]


def make_og(locale: str):
    bg = Image.new('RGBA', (W, H), (5, 6, 10, 255))
    d = ImageDraw.Draw(bg)

    # 网格
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 8), width=1)

    # 光晕
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-260, -420, 520, 220], fill=(99, 102, 241, 110))
    gd.ellipse([700, -300, 1400, 300], fill=(34, 211, 238, 80))
    gd.ellipse([380, 420, 1080, 900], fill=(168, 85, 247, 80))
    glow = glow.filter(ImageFilter.GaussianBlur(110))
    bg = Image.alpha_composite(bg, glow)

    d = ImageDraw.Draw(bg)

    if locale == 'zh':
        f_brand = font(CN_REG, 26)
        f_title = font(CN_BOLD, 78)
        f_sub = font(CN_REG, 30)
        f_chip = font(CN_REG, 22)
        title = 'AE 工程降级工具'
        sub = '浏览器本地转换 · 文件不上传 · 支持 AE 2018 – 2026'
        brand = 'Qi AEP 降级器'
        chip = 'RIFX 结构化重建 · WebAssembly 内核'
    else:
        f_brand = font(EN_BOLD, 24)
        f_title = font(EN_BOLD, 74)
        f_sub = font(EN_REG, 29)
        f_chip = font(EN_REG, 21)
        title = 'Downgrade AE Projects'
        sub = '100% local in your browser · no upload · AE 2018 – 2026'
        brand = 'Qi AEP Downgrader'
        chip = 'RIFX structured rebuild · WebAssembly core'

    # 徽章胶囊
    chip_txt = chip
    cw = text_w(d, chip_txt, f_chip)
    pad_x, pad_y = 26, 12
    bx0, by0 = 90, 96
    d.rounded_rectangle(
        [bx0, by0, bx0 + cw + pad_x * 2, by0 + 48],
        radius=24,
        fill=(99, 102, 241, 46),
        outline=(129, 140, 248, 150),
        width=2,
    )
    d.ellipse([bx0 + 20, by0 + 20, bx0 + 28, by0 + 28], fill=(165, 180, 252, 255))
    d.text((bx0 + 38, by0 + 12), chip_txt, font=f_chip, fill=(199, 210, 254, 255))

    # 标题
    d.text((88, 200), title, font=f_title, fill=(241, 243, 249, 255))
    # 标题下渐变条
    tw = text_w(d, title, f_title)
    bar = Image.new('RGBA', (tw, 6), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bar)
    for i in range(tw):
        r = int(110 + 60 * i / max(tw, 1))
        g = int(231 - 80 * i / max(tw, 1))
        b = int(183 + 40 * i / max(tw, 1))
        bd.line([(i, 0), (i, 6)], fill=(r, g, b, 230))
    bg.paste(bar, (88, 306), bar)
    d = ImageDraw.Draw(bg)

    # 副标题
    d.text((90, 336), sub, font=f_sub, fill=(167, 173, 192, 255))

    # 品牌
    d.text((90, 500), brand, font=f_brand, fill=(159, 176, 255, 255))

    # 右侧装饰：向下箭头
    cx, cy = 930, 300
    col = (129, 140, 248, 255)
    d.rounded_rectangle([cx - 150, cy - 210, cx + 150, cy + 210], radius=48,
                        fill=(255, 255, 255, 12), outline=(255, 255, 255, 34), width=2)
    d.line([(cx, cy - 120), (cx, cy + 70)], fill=col, width=26)
    d.line([(cx - 82, cy - 10), (cx, cy + 74), (cx + 82, cy - 10)], fill=col,
           width=26, joint='curve')
    for i, off in enumerate((-80, 0, 80)):
        d.line([(cx + off, cy + 130), (cx + off, cy + 168)], fill=col, width=18)

    out = bg.convert('RGB')
    path = os.path.join(PUB, f'og-{locale}.png')
    out.save(path, 'PNG', optimize=True)
    print('saved', path, out.size)


def make_app_icon(size: int):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = int(size * 0.22)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=(12, 15, 30, 255))
    glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-size * 0.2, -size * 0.5, size * 1.2, size * 0.35], fill=(99, 102, 241, 120))
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.12))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, outline=(255, 255, 255, 30),
                        width=max(1, size // 64))
    cx = size / 2
    lw = max(2, int(size * 0.085))
    col = (147, 160, 255, 255)
    d.line([(cx, size * 0.22), (cx, size * 0.62)], fill=col, width=lw)
    d.line([(cx - size * 0.17, size * 0.42), (cx, size * 0.62), (cx + size * 0.17, size * 0.42)],
           fill=col, width=lw, joint='curve')
    d.line([(cx - size * 0.27, size * 0.74), (cx - size * 0.27, size * 0.82)], fill=col, width=int(lw * 0.8))
    d.line([(cx, size * 0.74), (cx, size * 0.82)], fill=col, width=int(lw * 0.8))
    d.line([(cx + size * 0.27, size * 0.74), (cx + size * 0.27, size * 0.82)], fill=col, width=int(lw * 0.8))
    return img


make_og('zh')
make_og('en')

ic = make_app_icon(180)
ic.save(os.path.join(PUB, 'apple-icon.png'), 'PNG', optimize=True)
print('saved apple-icon.png')

ico = make_app_icon(256)
ico.save(os.path.join(PUB, 'favicon.ico'), 'ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print('saved favicon.ico')
