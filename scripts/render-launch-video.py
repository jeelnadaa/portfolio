import os
import sys
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CAPTURES_DIR = os.path.abspath("brag-output/captures")
AUDIO_PATH = os.path.abspath("brag-output/audio/master_audio.m4a")
OUT_VIDEO = os.path.abspath("brag-output/brag.mp4")
POSTER_PATH = os.path.abspath("brag-output/brag.jpg")

FFMPEG = "C:\\ffmpeg\\bin\\ffmpeg.exe"

# Font paths
FONT_BOLD = "C:\\Windows\\Fonts\\segoeuib.ttf"
FONT_REG = "C:\\Windows\\Fonts\\segoeui.ttf"
FONT_MONO = "C:\\Windows\\Fonts\\consolab.ttf"

def get_fonts():
    return {
        "title_xl": ImageFont.truetype(FONT_BOLD, 72),
        "title": ImageFont.truetype(FONT_BOLD, 62),
        "title_sm": ImageFont.truetype(FONT_BOLD, 52),
        "subtitle": ImageFont.truetype(FONT_REG, 40),
        "tag": ImageFont.truetype(FONT_MONO, 24),
        "chip": ImageFont.truetype(FONT_BOLD, 36),
        "chip_sm": ImageFont.truetype(FONT_BOLD, 28),
        "badge_mono": ImageFont.truetype(FONT_MONO, 22),
        "url_large": ImageFont.truetype(FONT_BOLD, 58),
        "cta": ImageFont.truetype(FONT_BOLD, 36),
        "browser_url": ImageFont.truetype(FONT_MONO, 20),
    }

# Colors
BG_TOP = (248, 246, 240)
BG_BOTTOM = (235, 230, 220)
TEXT_DARK = (15, 15, 13)
TEXT_MUTED = (115, 110, 100)
ACCENT = (229, 56, 27) # #E5381B (Solar Red)
ACCENT_BG = (255, 235, 230)
BORDER_LIGHT = (215, 208, 195)
BROWSER_BAR = (22, 22, 20)
BROWSER_BORDER = (45, 45, 40)
URL_BAR = (35, 35, 32)
CHIP_BG = (20, 20, 18)
CHIP_TEXT = (233, 227, 210)

def create_background(w=1920, h=1080):
    img = Image.new("RGB", (w, h), BG_TOP)
    draw = ImageDraw.Draw(img)
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

def make_browser_mockup(content_img, w=1040, h=660, crop_y=0):
    bar_h = 44
    vp_w = w
    vp_h = h - bar_h
    
    cw, ch = content_img.size
    scale = max(vp_w / cw, vp_h / ch)
    nw, nh = int(cw * scale), int(ch * scale)
    scaled = content_img.resize((nw, nh), Image.Resampling.LANCZOS)
    
    max_crop_y = max(0, nh - vp_h)
    safe_crop_y = min(max(0, int(crop_y * scale)), max_crop_y)
    cropped = scaled.crop((0, safe_crop_y, vp_w, safe_crop_y + vp_h))
    
    mock = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w, h], radius=16, fill=255)
    
    shell = Image.new("RGBA", (w, h), (*BROWSER_BAR, 255))
    sdraw = ImageDraw.Draw(shell)
    
    # Traffic light window buttons
    sdraw.ellipse([18, 16, 28, 26], fill=(255, 95, 86))
    sdraw.ellipse([36, 16, 46, 26], fill=(255, 189, 46))
    sdraw.ellipse([54, 16, 64, 26], fill=(39, 201, 63))
    
    # URL pill
    url_pill_w = 420
    url_pill_x = (w - url_pill_w) // 2
    sdraw.rounded_rectangle([url_pill_x, 10, url_pill_x + url_pill_w, 34], radius=6, fill=URL_BAR)
    
    fonts = get_fonts()
    sdraw.text((url_pill_x + 30, 14), "https://solarquack.in", fill=(180, 175, 165), font=fonts["browser_url"])
    sdraw.ellipse([url_pill_x + 14, 20, url_pill_x + 20, 26], fill=(130, 125, 115))
    
    shell.paste(cropped, (0, bar_h))
    sdraw.rounded_rectangle([0, 0, w - 1, h - 1], radius=16, outline=BROWSER_BORDER, width=2)
    mock.paste(shell, (0, 0), mask)
    return mock

def make_android_mockup(content_img, w=390, h=820, crop_y=0):
    mock = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w, h], radius=44, fill=255)
    
    shell = Image.new("RGBA", (w, h), (18, 18, 16, 255))
    bezel = 12
    vw = w - bezel * 2
    vh = h - bezel * 2
    
    cw, ch = content_img.size
    scale = max(vw / cw, vh / ch)
    nw, nh = int(cw * scale), int(ch * scale)
    scaled = content_img.resize((nw, nh), Image.Resampling.LANCZOS)
    
    max_crop_y = max(0, nh - vh)
    safe_crop_y = min(max(0, int(crop_y * scale)), max_crop_y)
    cropped = scaled.crop((0, safe_crop_y, vw, safe_crop_y + vh))
    
    vmask = Image.new("L", (vw, vh), 0)
    ImageDraw.Draw(vmask).rounded_rectangle([0, 0, vw, vh], radius=34, fill=255)
    shell.paste(cropped, (bezel, bezel), vmask)
    
    sdraw = ImageDraw.Draw(shell)
    cx, cy = w // 2, bezel + 16
    sdraw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], fill=(5, 5, 5))
    sdraw.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=(20, 25, 35))
    sdraw.rounded_rectangle([0, 0, w - 1, h - 1], radius=44, outline=(60, 60, 55), width=3)
    
    mock.paste(shell, (0, 0), mask)
    return mock

def spring(t, omega=7.5, zeta=0.82):
    if t <= 0: return 0.0
    if t >= 1.5: return 1.0
    val = 1.0 - math.exp(-zeta * omega * t) * (math.cos(omega * t) + (zeta / math.sqrt(max(0.001, 1 - zeta**2))) * math.sin(omega * t))
    return min(1.08, max(0.0, val))

def ease_in_out(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)

def render_all_frames():
    fonts = get_fonts()
    bg_template = create_background(1920, 1080)
    
    # Load captures
    hero_raw = Image.open(os.path.join(CAPTURES_DIR, "desktop-hero.png"))
    showroom_raw = Image.open(os.path.join(CAPTURES_DIR, "desktop-showroom.png"))
    modal_raw = Image.open(os.path.join(CAPTURES_DIR, "desktop-modal-plantiq.png"))
    arch_raw = Image.open(os.path.join(CAPTURES_DIR, "desktop-plantiq-architecture.png"))
    armory_raw = Image.open(os.path.join(CAPTURES_DIR, "desktop-armory.png"))
    mobile_hero_raw = Image.open(os.path.join(CAPTURES_DIR, "mobile-hero.png"))

    browser_shadow, bpad = create_shadow(1040, 660, radius=18, blur=35)
    phone_shadow, ppad = create_shadow(390, 820, radius=44, blur=40)

    TOTAL_SECONDS = 27.5
    FPS = 30
    TOTAL_FRAMES = int(TOTAL_SECONDS * FPS) # 825 frames

    print(f"Preparing to render {TOTAL_FRAMES} frames ({TOTAL_SECONDS}s @ {FPS}fps)...")

    cmd = [
        FFMPEG, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", "1920x1080",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO_PATH,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        "-c:a", "copy",
        "-shortest",
        OUT_VIDEO
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    def build_frame(frame_idx, is_poster=False):
        t = frame_idx / FPS
        frame = bg_template.copy()
        draw = ImageDraw.Draw(frame)

        if is_poster or (t >= 0.8 and t < 6.8):
            # BEAT 2: HERO & IDENTITY (Poster Frame 0)
            browser_mock = make_browser_mockup(hero_raw, 1040, 660)
            bx, by = 800, 210
            frame.paste(browser_shadow, (bx - bpad, by - bpad), browser_shadow)
            frame.paste(browser_mock, (bx, by), browser_mock)

            draw.text((120, 320), "[ 01 // OVERVIEW ]", fill=TEXT_MUTED, font=fonts["tag"])
            
            if is_poster or t >= 0.8:
                draw.text((120, 380), "Hi, I'm Jeel Nada,", fill=ACCENT, font=fonts["title_xl"])
            if is_poster or t >= 2.2:
                draw.text((120, 470), "Systems & AI Engineer.", fill=TEXT_DARK, font=fonts["title"])
            if is_poster or t >= 4.2:
                draw.text((120, 560), "This is my portfolio.", fill=TEXT_MUTED, font=fonts["title"])

            tag_text = "PES UNIVERSITY '27 // BENGALURU"
            tb = fonts["chip_sm"].getbbox(tag_text)
            tw = tb[2] - tb[0] + 48
            draw.rounded_rectangle([120, 680, 120 + tw, 736], radius=28, fill=(235, 230, 220))
            draw.text((144, 694), tag_text, fill=TEXT_DARK, font=fonts["chip_sm"])

        elif t < 0.8:
            # BEAT 1: HOOK (0.0 to 0.8s)
            spring_val = spring(t / 0.8)
            bx = int(1200 - 400 * spring_val)
            by = 210

            browser_mock = make_browser_mockup(hero_raw, 1040, 660)
            frame.paste(browser_shadow, (bx - bpad, by - bpad), browser_shadow)
            frame.paste(browser_mock, (bx, by), browser_mock)

            draw.text((120, 360), "[ 00 // INITIATE ]", fill=TEXT_MUTED, font=fonts["tag"])
            draw.text((120, 430), "A portfolio should", fill=TEXT_DARK, font=fonts["title"])
            draw.text((120, 510), "show your work,", fill=ACCENT, font=fonts["title"])
            draw.text((120, 590), "not just list it.", fill=TEXT_DARK, font=fonts["title"])

        elif t >= 6.8 and t < 10.4:
            # BEAT 3a: FEATURED MISSION / SHOWROOM
            scroll_p = ease_in_out((t - 6.8) / (10.4 - 6.8))
            scroll_px = int(scroll_p * 350)
            
            browser_mock = make_browser_mockup(showroom_raw, 1040, 660, crop_y=scroll_px)
            bx, by = 800, 210
            frame.paste(browser_shadow, (bx - bpad, by - bpad), browser_shadow)
            frame.paste(browser_mock, (bx, by), browser_mock)

            draw.text((120, 340), "[ 02 // FEATURED MISSION ]", fill=TEXT_MUTED, font=fonts["tag"])
            draw.text((120, 410), "My featured project", fill=TEXT_DARK, font=fonts["title"])
            
            if t >= 8.1:
                draw.text((120, 490), "helps Karnataka", fill=ACCENT, font=fonts["title"])
                draw.text((120, 570), "coffee farmers.", fill=ACCENT, font=fonts["title"])

            tag_text = "PLANTIQ // AI CROP DOCTOR"
            tb = fonts["chip_sm"].getbbox(tag_text)
            tw = tb[2] - tb[0] + 48
            draw.rounded_rectangle([120, 680, 120 + tw, 736], radius=28, fill=CHIP_BG)
            draw.text((144, 694), tag_text, fill=CHIP_TEXT, font=fonts["chip_sm"])

        elif t >= 10.4 and t < 18.0:
            # BEAT 3b: ARCHITECTURE TOPOLOGY & RAG
            browser_mock = make_browser_mockup(arch_raw, 1040, 660)
            bx, by = 800, 210
            frame.paste(browser_shadow, (bx - bpad, by - bpad), browser_shadow)
            frame.paste(browser_mock, (bx, by), browser_mock)

            draw.text((120, 230), "[ 03 // ARCHITECTURE & RAG ]", fill=TEXT_MUTED, font=fonts["tag"])
            
            if t < 13.0:
                draw.text((120, 290), "Scans leaf, detects", fill=TEXT_DARK, font=fonts["title_sm"])
                draw.text((120, 360), "disease with CNN,", fill=ACCENT, font=fonts["title_sm"])
            elif t < 15.6:
                draw.text((120, 290), "Explains treatment with", fill=TEXT_DARK, font=fonts["title_sm"])
                draw.text((120, 360), "Hybrid RAG & LLMs,", fill=ACCENT, font=fonts["title_sm"])
            else:
                draw.text((120, 290), "Multilingual advisory in", fill=TEXT_DARK, font=fonts["title_sm"])
                draw.text((120, 360), "Kannada or English.", fill=ACCENT, font=fonts["title_sm"])

            # Clean Apple/Stripe-style Tech Chips with right-aligned badges
            chips = [
                ("PyTorch ResNet-50", 11.0, "96.4% TOP-1"),
                ("3-Stage Hybrid RAG", 12.8, "BM25 + BGE RRF"),
                ("Gemini 2.5 Flash", 14.2, "CCRI GROUNDED"),
                ("Vernacular NLP", 15.6, "KANNADA PRE-ROUTER")
            ]
            cy = 450
            for name, trigger_t, badge in chips:
                if t >= trigger_t:
                    cw = 620
                    ch = 64
                    draw.rounded_rectangle([120, cy, 120 + cw, cy + ch], radius=10, fill=CHIP_BG)
                    # Accent indicator dot
                    draw.ellipse([136, cy + 24, 150, cy + 38], fill=ACCENT)
                    draw.text((164, cy + 14), name, fill=CHIP_TEXT, font=fonts["chip"])
                    
                    # Right-aligned badge inside pill
                    bb = fonts["badge_mono"].getbbox(badge)
                    bw = bb[2] - bb[0] + 20
                    bx_badge = 120 + cw - bw - 14
                    by_badge = cy + 14
                    draw.rounded_rectangle([bx_badge, by_badge, bx_badge + bw, by_badge + 36], radius=6, fill=(35, 35, 32))
                    draw.text((bx_badge + 10, by_badge + 6), badge, fill=(215, 208, 195), font=fonts["badge_mono"])
                    cy += 74

        elif t >= 18.0 and t < 21.6:
            # BEAT 4: TECHNICAL DEPTH & ARMORY
            scroll_p = ease_in_out((t - 18.0) / (21.6 - 18.0))
            scroll_px = int(scroll_p * 200)
            
            browser_mock = make_browser_mockup(armory_raw, 1040, 660, crop_y=scroll_px)
            bx, by = 800, 210
            frame.paste(browser_shadow, (bx - bpad, by - bpad), browser_shadow)
            frame.paste(browser_mock, (bx, by), browser_mock)

            draw.text((120, 320), "[ 04 // TECHNICAL DEPTH ]", fill=TEXT_MUTED, font=fonts["tag"])
            draw.text((120, 390), "Dive into the", fill=TEXT_DARK, font=fonts["title"])
            draw.text((120, 470), "architecture,", fill=ACCENT, font=fonts["title"])
            draw.text((120, 550), "models, and code.", fill=TEXT_DARK, font=fonts["title"])

            tag_text = "DISTRIBUTED SYSTEMS // PURE JAVA"
            tb = fonts["chip_sm"].getbbox(tag_text)
            tw = tb[2] - tb[0] + 48
            draw.rounded_rectangle([120, 670, 120 + tw, 730], radius=28, fill=CHIP_BG)
            draw.text((144, 686), tag_text, fill=CHIP_TEXT, font=fonts["chip_sm"])

        elif t >= 21.6 and t < 24.3:
            # BEAT 5: RESPONSIVE ANDROID PHONE
            sp = spring((t - 21.6) / 0.8)
            px = int(1400 - 260 * sp)
            py = 130
            
            phone_mock = make_android_mockup(mobile_hero_raw, 390, 820)
            frame.paste(phone_shadow, (px - ppad, py - ppad), phone_shadow)
            frame.paste(phone_mock, (px, py), phone_mock)

            draw.text((120, 380), "[ 05 // MOBILE RESPONSIVE ]", fill=TEXT_MUTED, font=fonts["tag"])
            draw.text((120, 450), "And it works", fill=TEXT_DARK, font=fonts["title_xl"])
            draw.text((120, 540), "just as well", fill=TEXT_DARK, font=fonts["title_xl"])
            draw.text((120, 630), "on your phone.", fill=ACCENT, font=fonts["title_xl"])

        else:
            # BEAT 6: CLOSE & CALL TO ACTION (24.3 to 27.5s, held > 2 seconds)
            cx = 960
            emblem_y = 260
            draw.ellipse([cx - 48, emblem_y - 48, cx + 48, emblem_y + 48], fill=CHIP_BG)
            draw.text((cx - 20, emblem_y - 28), "sq", fill=ACCENT, font=fonts["title"])
            
            draw.text((cx - 180, 350), "[ SYSTEM READY // LIVE ]", fill=TEXT_MUTED, font=fonts["tag"])
            draw.text((cx - 280, 410), "See what I build at", fill=TEXT_DARK, font=fonts["title"])
            draw.text((cx - 290, 490), "solarquack.in", fill=ACCENT, font=fonts["title_xl"])

            cta_y = 610
            draw.rounded_rectangle([cx - 220, cta_y, cx + 220, cta_y + 70], radius=35, fill=CHIP_BG)
            draw.text((cx - 150, cta_y + 16), "See The Full Story  →", fill=CHIP_TEXT, font=fonts["cta"])

            badges_y = 740
            badge_text = "SYSTEMS & AI  •  DISTRIBUTED LOGS  •  MULTIMODAL AI  •  BENGALURU"
            bbox = fonts["tag"].getbbox(badge_text)
            bw = bbox[2] - bbox[0]
            draw.text((cx - bw // 2, badges_y), badge_text, fill=TEXT_MUTED, font=fonts["tag"])

        return frame

    poster_frame = build_frame(0, is_poster=True)
    poster_frame.save(POSTER_PATH, quality=95)
    print(f"Saved poster frame to {POSTER_PATH}")

    for f in range(TOTAL_FRAMES):
        if f == 0:
            frame_img = poster_frame
        else:
            frame_img = build_frame(f)

        proc.stdin.write(frame_img.tobytes())

        if f % 90 == 0 or f == TOTAL_FRAMES - 1:
            print(f"Rendered frame {f}/{TOTAL_FRAMES} ({(f/TOTAL_FRAMES)*100:.1f}%)")

    proc.stdin.close()
    proc.wait()
    print("Master video re-encoded successfully!")

if __name__ == "__main__":
    render_all_frames()
