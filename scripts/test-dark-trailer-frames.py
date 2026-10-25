import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CAPTURES_DIR = os.path.abspath("brag-output/captures_trailer")
OUT_DIR = os.path.abspath("brag-output/scratch_frames_dark")
os.makedirs(OUT_DIR, exist_ok=True)

# Fonts
FONT_SERIF_BOLD = "C:\\Windows\\Fonts\\georgiab.ttf"
FONT_SERIF_REG = "C:\\Windows\\Fonts\\georgia.ttf"
FONT_MONO = "C:\\Windows\\Fonts\\consolab.ttf"

def get_fonts():
    return {
        "title_xl": ImageFont.truetype(FONT_SERIF_BOLD, 76),
        "title": ImageFont.truetype(FONT_SERIF_BOLD, 64),
        "title_sm": ImageFont.truetype(FONT_SERIF_BOLD, 52),
        "subtitle": ImageFont.truetype(FONT_SERIF_REG, 42),
        "section_tag": ImageFont.truetype(FONT_MONO, 32),
        "hud": ImageFont.truetype(FONT_MONO, 22),
        "chip": ImageFont.truetype(FONT_MONO, 28),
        "browser_url": ImageFont.truetype(FONT_MONO, 20),
        "close_url": ImageFont.truetype(FONT_SERIF_BOLD, 72),
        "close_name": ImageFont.truetype(FONT_MONO, 36),
    }

# Dark Chiaroscuro Palette
BG_DARK = (7, 7, 6)
SURFACE_DARK = (15, 15, 13)
BONE = (233, 227, 210)
MUTED = (115, 110, 100)
ACCENT = (229, 56, 27) # Solar Red #E5381B
RULE = (38, 36, 32)
BROWSER_BAR = (20, 20, 18)
BROWSER_BORDER = (45, 43, 38)
URL_BAR = (30, 30, 26)

def create_dark_background(w=1920, h=1080):
    img = Image.new("RGB", (w, h), BG_DARK)
    draw = ImageDraw.Draw(img)
    # Subtle radial vignette
    cx, cy = w // 2, h // 2
    max_dist = math.sqrt(cx**2 + cy**2)
    # We can create a subtle vignette overlay
    vignette = Image.new("L", (w, h), 0)
    vdraw = ImageDraw.Draw(vignette)
    for r in range(120, int(max_dist), 40):
        alpha = int(40 * (r / max_dist))
        vdraw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=alpha, width=40)
    vignette = vignette.filter(ImageFilter.GaussianBlur(50))
    # Combine
    return img

def create_shadow(w, h, radius=16, blur=40, opacity=0.45):
    pad = blur * 3
    sw = w + pad * 2
    sh = h + pad * 2
    simg = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(simg)
    alpha = int(255 * opacity)
    sdraw.rounded_rectangle([pad, pad + 18, pad + w, pad + h + 18], radius=radius, fill=(0, 0, 0, alpha))
    simg = simg.filter(ImageFilter.GaussianBlur(blur))
    return simg, pad

def make_browser_frame(content_img, w=1520, h=880, zoom=1.0, pan_x=0, pan_y=0):
    bar_h = 42
    vp_w = w
    vp_h = h - bar_h
    
    # Scale content
    cw, ch = content_img.size
    base_scale = max(vp_w / cw, vp_h / ch) * zoom
    nw, nh = int(cw * base_scale), int(ch * base_scale)
    scaled = content_img.resize((nw, nh), Image.Resampling.LANCZOS)
    
    # Crop with pan
    cx = max(0, min(nw - vp_w, int(pan_x * base_scale)))
    cy = max(0, min(nh - vp_h, int(pan_y * base_scale)))
    cropped = scaled.crop((cx, cy, cx + vp_w, cy + vp_h))
    
    mock = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w, h], radius=14, fill=255)
    
    shell = Image.new("RGBA", (w, h), (*BROWSER_BAR, 255))
    sdraw = ImageDraw.Draw(shell)
    
    # Traffic lights
    sdraw.ellipse([18, 15, 28, 25], fill=(255, 95, 86))
    sdraw.ellipse([36, 15, 46, 25], fill=(255, 189, 46))
    sdraw.ellipse([54, 15, 64, 25], fill=(39, 201, 63))
    
    # URL pill
    url_pill_w = 460
    url_pill_x = (w - url_pill_w) // 2
    sdraw.rounded_rectangle([url_pill_x, 9, url_pill_x + url_pill_w, 33], radius=6, fill=URL_BAR)
    
    fonts = get_fonts()
    sdraw.text((url_pill_x + 36, 13), "https://solarquack.in", fill=(190, 185, 175), font=fonts["browser_url"])
    # Padlock
    sdraw.ellipse([url_pill_x + 18, 18, url_pill_x + 24, 24], fill=(130, 125, 115))
    
    shell.paste(cropped, (0, bar_h))
    sdraw.rounded_rectangle([0, 0, w - 1, h - 1], radius=14, outline=BROWSER_BORDER, width=2)
    mock.paste(shell, (0, 0), mask)
    return mock

def draw_hud(draw, fonts, section_code, section_name, timecode="00:00:00"):
    # Top HUD
    draw.text((90, 36), f"SYS // 30 FPS  TC: {timecode}", fill=MUTED, font=fonts["hud"])
    draw.ellipse([80, 46, 86, 52], fill=ACCENT)
    
    right_text = "BLR TELEMETRY // [ VERIFIED SOURCE ]"
    rb = fonts["hud"].getbbox(right_text)
    rw = rb[2] - rb[0]
    draw.text((1920 - 90 - rw, 36), right_text, fill=MUTED, font=fonts["hud"])
    
    # Section Tag (at least 32px mono with Greek letter)
    draw.text((90, 72), f"[ {section_code} // {section_name} ]", fill=BONE, font=fonts["section_tag"])

def draw_subtitle_bar(draw, fonts, line1, line2=None, em_words=None):
    # Dedicated bottom-left subtitle bar (64px minimum font, bone-white, subtle dark backing)
    sx, sy = 90, 890
    bar_w, bar_h = 1740, 140
    
    # Subtle dark backing box
    draw.rounded_rectangle([sx, sy, sx + bar_w, sy + bar_h], radius=10, fill=(12, 12, 10))
    draw.rounded_rectangle([sx, sy, sx + bar_w, sy + bar_h], radius=10, outline=RULE, width=1)
    
    # Red accent pill indicator
    draw.rounded_rectangle([sx + 24, sy + 32, sx + 28, sy + 108], radius=2, fill=ACCENT)
    
    tx = sx + 50
    ty1 = sy + 24
    draw.text((tx, ty1), line1, fill=BONE, font=fonts["title"])
    
    if line2:
        ty2 = sy + 80
        draw.text((tx, ty2), line2, fill=ACCENT if em_words else BONE, font=fonts["title"])

def test_render():
    fonts = get_fonts()
    bg = create_dark_background()
    
    # 1. Hero Dossier (Beat 2)
    hero_raw = Image.open(os.path.join(CAPTURES_DIR, "02_hero_full.png"))
    browser = make_browser_frame(hero_raw, 1540, 750, zoom=1.0)
    shadow, pad = create_shadow(1540, 750)
    
    f1 = bg.copy()
    bx, by = 190, 120
    f1.paste(shadow, (bx - pad, by - pad), shadow)
    f1.paste(browser, (bx, by), browser)
    
    d1 = ImageDraw.Draw(f1)
    draw_hud(d1, fonts, "02", "HERO DOSSIER // MARBLE HERCULES", "00:00:04")
    draw_subtitle_bar(d1, fonts, "Marble, code,", "and a little obsession.", em_words=True)
    f1.save(os.path.join(OUT_DIR, "test_02_hero.jpg"), quality=95)
    print("Saved test_02_hero.jpg")
    
    # 2. Foundations (Beat 3) - Bone to Color Reveal
    found_raw = Image.open(os.path.join(CAPTURES_DIR, "03_foundations_strength_hover.png"))
    browser_found = make_browser_frame(found_raw, 1540, 750, zoom=1.08, pan_y=40)
    f2 = bg.copy()
    f2.paste(shadow, (bx - pad, by - pad), shadow)
    f2.paste(browser_found, (bx, by), browser_found)
    d2 = ImageDraw.Draw(f2)
    draw_hud(d2, fonts, "03", "FOUNDATIONS // ΙΣΧΥΣ • ΤΕΧΝΗ", "00:00:09")
    draw_subtitle_bar(d2, fonts, "Strength: pure Java systems.", "Craft: ResNet-50 at 96% with hybrid RAG.", em_words=True)
    f2.save(os.path.join(OUT_DIR, "test_03_foundations.jpg"), quality=95)
    print("Saved test_03_foundations.jpg")

    # 3. Armory Filtered (Beat 5)
    armory_raw = Image.open(os.path.join(CAPTURES_DIR, "05_armory_filtered.png"))
    browser_armory = make_browser_frame(armory_raw, 1540, 750, zoom=1.12, pan_y=20)
    f3 = bg.copy()
    f3.paste(shadow, (bx - pad, by - pad), shadow)
    f3.paste(browser_armory, (bx, by), browser_armory)
    d3 = ImageDraw.Draw(f3)
    draw_hud(d3, fonts, "05", "ARMORY // ΟΠΛΟΘΗΚΗ", "00:00:17")
    draw_subtitle_bar(d3, fonts, "6 languages, 16 tools,", "filterable in one keystroke.", em_words=True)
    f3.save(os.path.join(OUT_DIR, "test_05_armory.jpg"), quality=95)
    print("Saved test_05_armory.jpg")

    # 4. Close (Beat 10)
    f4 = bg.copy()
    d4 = ImageDraw.Draw(f4)
    draw_hud(d4, fonts, "10", "SYSTEM ARCHIVE // CLOSE", "00:00:34")
    
    cx, cy = 960, 520
    d4.text((cx - 240, cy - 140), "solarquack.in", fill=BONE, font=fonts["close_url"])
    d4.text((cx - 100, cy - 40), "JEEL NADA", fill=MUTED, font=fonts["close_name"])
    
    # Red accent pill
    badge_text = "OPEN TO SUMMER 2027 INTERNSHIPS"
    bb = fonts["chip"].getbbox(badge_text)
    bw = bb[2] - bb[0] + 56
    d4.rounded_rectangle([cx - bw // 2, cy + 30, cx + bw // 2, cy + 86], radius=28, fill=ACCENT)
    d4.text((cx - bw // 2 + 28, cy + 44), badge_text, fill=(255, 255, 255), font=fonts["chip"])
    
    draw_subtitle_bar(d4, fonts, "Open to Summer 2027 internships.", "solarquack.in", em_words=True)
    f4.save(os.path.join(OUT_DIR, "test_10_close.jpg"), quality=95)
    print("Saved test_10_close.jpg")

if __name__ == "__main__":
    test_render()
