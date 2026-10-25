import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CAPTURES_DIR = os.path.abspath("brag-output/captures")
OUT_DIR = os.path.abspath("brag-output/scratch_frames")
os.makedirs(OUT_DIR, exist_ok=True)

# Fonts
FONT_BOLD = "C:\\Windows\\Fonts\\segoeuib.ttf"
FONT_REG = "C:\\Windows\\Fonts\\segoeui.ttf"
FONT_MONO = "C:\\Windows\\Fonts\\consolab.ttf"

def get_fonts():
    return {
        "title": ImageFont.truetype(FONT_BOLD, 68),
        "title_large": ImageFont.truetype(FONT_BOLD, 76),
        "subtitle": ImageFont.truetype(FONT_REG, 44),
        "tag": ImageFont.truetype(FONT_MONO, 26),
        "chip": ImageFont.truetype(FONT_BOLD, 36),
        "chip_sm": ImageFont.truetype(FONT_BOLD, 32),
        "url": ImageFont.truetype(FONT_BOLD, 54),
        "browser_url": ImageFont.truetype(FONT_MONO, 20),
    }

# Colors
BG_TOP = (248, 246, 240)
BG_BOTTOM = (235, 230, 220)
TEXT_DARK = (15, 15, 13)
TEXT_MUTED = (115, 110, 100)
ACCENT = (229, 56, 27) # #E5381B (Sun / Solar)
BROWSER_BAR = (22, 22, 20)
BROWSER_BORDER = (45, 45, 40)
URL_BAR = (35, 35, 32)
CHIP_BG = (20, 20, 18)
CHIP_TEXT = (233, 227, 210) # Bone

def create_background(w=1920, h=1080):
    img = Image.new("RGB", (w, h), BG_TOP)
    draw = ImageDraw.Draw(img)
    # Subtle gradient
    for y in range(h):
        factor = y / h
        r = int(BG_TOP[0] * (1 - factor) + BG_BOTTOM[0] * factor)
        g = int(BG_TOP[1] * (1 - factor) + BG_BOTTOM[1] * factor)
        b = int(BG_TOP[2] * (1 - factor) + BG_BOTTOM[2] * factor)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return img

def create_shadow(w, h, radius=18, blur=35, opacity=0.28):
    pad = blur * 3
    sw = w + pad * 2
    sh = h + pad * 2
    simg = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(simg)
    alpha = int(255 * opacity)
    sdraw.rounded_rectangle([pad, pad + 15, pad + w, pad + h + 15], radius=radius, fill=(0, 0, 0, alpha))
    simg = simg.filter(ImageFilter.GaussianBlur(blur))
    return simg, pad

def make_browser_mockup(content_img, w=1040, h=660):
    bar_h = 44
    vp_w = w
    vp_h = h - bar_h
    
    # Resize content
    cw, ch = content_img.size
    scale = max(vp_w / cw, vp_h / ch)
    nw, nh = int(cw * scale), int(ch * scale)
    scaled_content = content_img.resize((nw, nh), Image.Resampling.LANCZOS)
    cropped_content = scaled_content.crop((0, 0, vp_w, vp_h))
    
    # Assembly
    mock = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mdraw = ImageDraw.Draw(mock)
    
    # Outer rounded shell mask
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w, h], radius=16, fill=255)
    
    # Shell background
    shell = Image.new("RGBA", (w, h), (*BROWSER_BAR, 255))
    sdraw = ImageDraw.Draw(shell)
    
    # Window buttons
    sdraw.ellipse([18, 16, 28, 26], fill=(255, 95, 86))
    sdraw.ellipse([36, 16, 46, 26], fill=(255, 189, 46))
    sdraw.ellipse([54, 16, 64, 26], fill=(39, 201, 63))
    
    # URL bar pill
    url_pill_w = 420
    url_pill_x = (w - url_pill_w) // 2
    sdraw.rounded_rectangle([url_pill_x, 10, url_pill_x + url_pill_w, 34], radius=6, fill=URL_BAR)
    
    fonts = get_fonts()
    sdraw.text((url_pill_x + 30, 14), "https://solarquack.in", fill=(180, 175, 165), font=fonts["browser_url"])
    # Padlock dot
    sdraw.ellipse([url_pill_x + 14, 20, url_pill_x + 20, 26], fill=(130, 125, 115))
    
    # Paste viewport
    shell.paste(cropped_content, (0, bar_h))
    
    # Border
    sdraw.rounded_rectangle([0, 0, w - 1, h - 1], radius=16, outline=BROWSER_BORDER, width=2)
    
    mock.paste(shell, (0, 0), mask)
    return mock

def make_android_mockup(content_img, w=390, h=820):
    mock = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w, h], radius=44, fill=255)
    
    shell = Image.new("RGBA", (w, h), (18, 18, 16, 255))
    
    # Viewport
    bezel = 12
    vw = w - bezel * 2
    vh = h - bezel * 2
    
    cw, ch = content_img.size
    scale = max(vw / cw, vh / ch)
    nw, nh = int(cw * scale), int(ch * scale)
    scaled = content_img.resize((nw, nh), Image.Resampling.LANCZOS)
    cropped = scaled.crop((0, 0, vw, vh))
    
    vmask = Image.new("L", (vw, vh), 0)
    ImageDraw.Draw(vmask).rounded_rectangle([0, 0, vw, vh], radius=34, fill=255)
    
    shell.paste(cropped, (bezel, bezel), vmask)
    
    # Punch hole camera
    sdraw = ImageDraw.Draw(shell)
    cx, cy = w // 2, bezel + 16
    sdraw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=(5, 5, 5))
    sdraw.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=(20, 25, 35))
    
    # Metallic border
    sdraw.rounded_rectangle([0, 0, w - 1, h - 1], radius=44, outline=(60, 60, 55), width=3)
    
    mock.paste(shell, (0, 0), mask)
    return mock

def test():
    fonts = get_fonts()
    bg = create_background()
    
    # 1. Test Hero Frame
    hero_img = Image.open(os.path.join(CAPTURES_DIR, "desktop-hero.png"))
    browser = make_browser_mockup(hero_img, 1040, 660)
    shadow, pad = create_shadow(1040, 660)
    
    f1 = bg.copy()
    bx, by = 800, 210
    f1.paste(shadow, (bx - pad, by - pad), shadow)
    f1.paste(browser, (bx, by), browser)
    
    draw = ImageDraw.Draw(f1)
    # Tag
    draw.text((120, 360), "[ 01 // OVERVIEW ]", fill=TEXT_MUTED, font=fonts["tag"])
    # Subtitle
    draw.text((120, 420), "Hi, I'm Jeel Nada,", fill=ACCENT, font=fonts["title"])
    draw.text((120, 500), "Systems & AI Engineer.", fill=TEXT_DARK, font=fonts["title"])
    draw.text((120, 580), "This is my portfolio.", fill=TEXT_MUTED, font=fonts["title"])
    
    f1.save(os.path.join(OUT_DIR, "frame_hero.jpg"), quality=95)
    print("Saved frame_hero.jpg")
    
    # 2. Test Architecture Frame
    arch_img = Image.open(os.path.join(CAPTURES_DIR, "desktop-plantiq-architecture.png"))
    browser_arch = make_browser_mockup(arch_img, 1040, 660)
    f2 = bg.copy()
    f2.paste(shadow, (bx - pad, by - pad), shadow)
    f2.paste(browser_arch, (bx, by), browser_arch)
    draw2 = ImageDraw.Draw(f2)
    draw2.text((120, 280), "[ 03 // ARCHITECTURE & RAG ]", fill=TEXT_MUTED, font=fonts["tag"])
    draw2.text((120, 340), "Scans leaf, detects disease", fill=TEXT_DARK, font=fonts["title"])
    draw2.text((120, 420), "with a CNN,", fill=ACCENT, font=fonts["title"])
    draw2.text((120, 500), "explains treatment with", fill=TEXT_DARK, font=fonts["title"])
    draw2.text((120, 580), "Hybrid RAG & LLMs.", fill=ACCENT, font=fonts["title"])
    
    # Tech chips
    chips = ["PyTorch ResNet-50", "Hybrid RAG CCRI", "Gemini 2.5 Flash", "Kannada Voice"]
    cy = 680
    cx = 120
    for chip in chips:
        bbox = fonts["chip_sm"].getbbox(chip)
        cw = bbox[2] - bbox[0] + 32
        ch = 50
        draw2.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=8, fill=CHIP_BG)
        draw2.text((cx + 16, cy + 9), chip, fill=CHIP_TEXT, font=fonts["chip_sm"])
        cx += cw + 14
        if cx > 700:
            cx = 120
            cy += 60
            
    f2.save(os.path.join(OUT_DIR, "frame_arch.jpg"), quality=95)
    print("Saved frame_arch.jpg")

    # 3. Test Android Mobile Frame
    mob_img = Image.open(os.path.join(CAPTURES_DIR, "mobile-hero.png"))
    phone = make_android_mockup(mob_img, 390, 820)
    pshadow, ppad = create_shadow(390, 820, radius=44, blur=40)
    
    f3 = bg.copy()
    px, py = 1140, 130
    f3.paste(pshadow, (px - ppad, py - ppad), pshadow)
    f3.paste(phone, (px, py), phone)
    
    draw3 = ImageDraw.Draw(f3)
    draw3.text((120, 420), "[ 05 // MOBILE RESPONSIVE ]", fill=TEXT_MUTED, font=fonts["tag"])
    draw3.text((120, 480), "And it works", fill=TEXT_DARK, font=fonts["title"])
    draw3.text((120, 560), "just as well on your phone.", fill=ACCENT, font=fonts["title"])
    f3.save(os.path.join(OUT_DIR, "frame_mobile.jpg"), quality=95)
    print("Saved frame_mobile.jpg")

test()
