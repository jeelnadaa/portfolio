import os
import sys
import math
import subprocess
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CAPTURES_DIR = os.path.abspath("brag-output/captures_trailer")
AUDIO_PATH = os.path.abspath("brag-output/audio_trailer/master_trailer_audio.m4a")
TIMELINE_JSON = os.path.abspath("brag-output/audio_trailer/synced_trailer_timeline.json")
OUT_VIDEO = os.path.abspath("brag-output/brag.mp4")
POSTER_PATH = os.path.abspath("brag-output/brag.jpg")

FFMPEG = "C:\\ffmpeg\\bin\\ffmpeg.exe"
FFPROBE = "C:\\ffmpeg\\bin\\ffprobe.exe"

# Font paths
FONT_SERIF_BOLD = "C:\\Windows\\Fonts\\georgiab.ttf"
FONT_SERIF_REG = "C:\\Windows\\Fonts\\georgia.ttf"
FONT_MONO_BOLD = "C:\\Windows\\Fonts\\consolab.ttf"
FONT_MONO_REG = "C:\\Windows\\Fonts\\consola.ttf"

# Dimensions
WIDTH = 1920
HEIGHT = 1080
FPS = 30
TOTAL_FRAMES = 1050 # 35.0 seconds exactly

# Palette
BG_DARK = (7, 7, 6)
SURFACE_DARK = (15, 15, 13)
BONE = (233, 227, 210)
MUTED = (115, 110, 100)
ACCENT = (229, 56, 27) # Solar Red #E5381B
RULE = (38, 36, 32)
BROWSER_BAR = (20, 20, 18)
BROWSER_BORDER = (45, 43, 38)
URL_BAR = (30, 30, 26)

def get_fonts():
    return {
        "title_hero": ImageFont.truetype(FONT_SERIF_BOLD, 74),
        "title": ImageFont.truetype(FONT_SERIF_BOLD, 64),
        "title_sm": ImageFont.truetype(FONT_SERIF_BOLD, 52),
        "subtitle": ImageFont.truetype(FONT_SERIF_REG, 42),
        "section_tag": ImageFont.truetype(FONT_MONO_BOLD, 32),
        "hud": ImageFont.truetype(FONT_MONO_REG, 22),
        "chip": ImageFont.truetype(FONT_MONO_BOLD, 28),
        "callout": ImageFont.truetype(FONT_MONO_BOLD, 24),
        "browser_url": ImageFont.truetype(FONT_MONO_REG, 20),
        "close_url": ImageFont.truetype(FONT_SERIF_BOLD, 76),
        "close_name": ImageFont.truetype(FONT_MONO_BOLD, 34),
        "greek_bg": ImageFont.truetype(FONT_SERIF_BOLD, 84),
    }

def create_shadow_texture(w, h, radius=16, blur=40, opacity=0.45):
    pad = blur * 3
    sw = w + pad * 2
    sh = h + pad * 2
    simg = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(simg)
    alpha = int(255 * opacity)
    sdraw.rounded_rectangle([pad, pad + 18, pad + w, pad + h + 18], radius=radius, fill=(0, 0, 0, alpha))
    simg = simg.filter(ImageFilter.GaussianBlur(blur))
    return simg, pad

class TrailerRenderer:
    def __init__(self):
        self.fonts = get_fonts()
        self.load_assets()
        self.setup_templates()

    def load_assets(self):
        print("Loading high-res captures...")
        self.captures = {}
        names = [
            "01_gate_prompt", "01_gate_sliced",
            "02_hero_full", "02_hero_specs",
            "03_foundations_bone", "03_foundations_strength_hover", "03_foundations_craft_hover",
            "04_work_grid", "04_work_list", "04_project_kafka",
            "05_armory_overview", "05_armory_filtered",
            "06_github_telemetry",
            "07_path_timeline",
            "08_honest_status",
            "09_page_about", "09_page_log", "09_page_resume", "09_page_contact"
        ]
        for name in names:
            p = os.path.join(CAPTURES_DIR, f"{name}.png")
            if os.path.exists(p):
                # Pre-downscale slightly for lightning-fast rendering without quality loss
                raw = Image.open(p).convert("RGB")
                # Downsample 3840x2160 to 1920x1080 as base cache
                self.captures[name] = raw.resize((1920, 1080), Image.Resampling.LANCZOS)
            else:
                print(f"Warning: Missing capture {name}")

    def setup_templates(self):
        # Base browser dimensions: 1540 x 750 (80.2% width)
        self.bw = 1540
        self.bh = 750
        self.bx = 190
        self.by = 120
        self.bar_h = 42

        # Precompute drop shadow
        self.shadow, self.shadow_pad = create_shadow_texture(self.bw, self.bh)

        # Precompute browser chrome header shell
        self.chrome_header = Image.new("RGBA", (self.bw, self.bar_h), (*BROWSER_BAR, 255))
        cdraw = ImageDraw.Draw(self.chrome_header)
        # Traffic lights
        cdraw.ellipse([18, 15, 28, 25], fill=(255, 95, 86))
        cdraw.ellipse([36, 15, 46, 25], fill=(255, 189, 46))
        cdraw.ellipse([54, 15, 64, 25], fill=(39, 201, 63))
        # URL pill
        url_pill_w = 460
        url_pill_x = (self.bw - url_pill_w) // 2
        cdraw.rounded_rectangle([url_pill_x, 9, url_pill_x + url_pill_w, 33], radius=6, fill=URL_BAR)
        cdraw.text((url_pill_x + 36, 12), "https://solarquack.in", fill=(190, 185, 175), font=self.fonts["browser_url"])
        cdraw.ellipse([url_pill_x + 18, 17, url_pill_x + 24, 23], fill=(130, 125, 115))

        # Base dark background
        self.bg_base = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
        # Subtle horizontal scanlines
        scan_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(scan_overlay)
        for y in range(0, HEIGHT, 4):
            sdraw.line([(0, y), (WIDTH, y)], fill=(0, 0, 0, 18), width=1)
        self.bg_base.paste(scan_overlay, (0, 0), scan_overlay)

    def assemble_browser_frame(self, content_img, zoom=1.0, pan_x=0, pan_y=0):
        vp_w = self.bw
        vp_h = self.bh - self.bar_h

        cw, ch = content_img.size
        scale = max(vp_w / cw, vp_h / ch) * zoom
        nw, nh = int(cw * scale), int(ch * scale)
        scaled = content_img.resize((nw, nh), Image.Resampling.BILINEAR)

        # Pan offsets
        cx = max(0, min(nw - vp_w, int((nw - vp_w) / 2 + pan_x)))
        cy = max(0, min(nh - vp_h, int((nh - vp_h) / 2 + pan_y)))
        cropped = scaled.crop((cx, cy, cx + vp_w, cy + vp_h))

        frame = Image.new("RGBA", (self.bw, self.bh), (*SURFACE_DARK, 255))
        frame.paste(cropped, (0, self.bar_h))
        frame.paste(self.chrome_header, (0, 0))
        
        # Border
        fdraw = ImageDraw.Draw(frame)
        fdraw.rounded_rectangle([0, 0, self.bw - 1, self.bh - 1], radius=14, outline=BROWSER_BORDER, width=2)
        
        mask = Image.new("L", (self.bw, self.bh), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, self.bw, self.bh], radius=14, fill=255)
        
        out = Image.new("RGBA", (self.bw, self.bh), (0, 0, 0, 0))
        out.paste(frame, (0, 0), mask)
        return out

    def draw_hud(self, draw, section_code, section_name, frame_idx):
        # Timecode
        secs = frame_idx / FPS
        mm = int(secs // 60)
        ss = int(secs % 60)
        ff = int(frame_idx % FPS)
        timecode = f"{mm:02d}:{ss:02d}:{ff:02d}"

        # Top HUD row
        draw.text((90, 36), f"SYS // 30 FPS  TC: {timecode}", fill=MUTED, font=self.fonts["hud"])
        draw.ellipse([80, 46, 86, 52], fill=ACCENT)

        right_text = "BLR TELEMETRY // [ VERIFIED SOURCE ]"
        rb = self.fonts["hud"].getbbox(right_text)
        rw = rb[2] - rb[0]
        draw.text((WIDTH - 90 - rw, 36), right_text, fill=MUTED, font=self.fonts["hud"])

        # Section Tag (at least 32px mono with Greek letter)
        draw.text((90, 72), f"[ {section_code} // {section_name} ]", fill=BONE, font=self.fonts["section_tag"])

    def draw_subtitle_bar(self, draw, line1, line2=None, em_words=None):
        sx, sy = 90, 890
        bar_w, bar_h = 1740, 140

        # Subtle dark backing box
        draw.rounded_rectangle([sx, sy, sx + bar_w, sy + bar_h], radius=10, fill=(12, 12, 10))
        draw.rounded_rectangle([sx, sy, sx + bar_w, sy + bar_h], radius=10, outline=RULE, width=1)

        # Red accent pill indicator
        draw.rounded_rectangle([sx + 24, sy + 32, sx + 28, sy + 108], radius=2, fill=ACCENT)

        tx = sx + 50
        ty1 = sy + 24
        draw.text((tx, ty1), line1, fill=BONE, font=self.fonts["title"])

        if line2:
            ty2 = sy + 80
            draw.text((tx, ty2), line2, fill=ACCENT if em_words else BONE, font=self.fonts["title"])

    def draw_callout_badge(self, draw, x, y, text, accent_edge=True):
        bb = self.fonts["callout"].getbbox(text)
        bw = bb[2] - bb[0] + 32
        bh = bb[3] - bb[1] + 20
        draw.rounded_rectangle([x, y, x + bw, y + bh], radius=6, fill=(14, 14, 12))
        draw.rounded_rectangle([x, y, x + bw, y + bh], radius=6, outline=ACCENT if accent_edge else RULE, width=2)
        draw.text((x + 16, y + 10), text, fill=BONE, font=self.fonts["callout"])

    def render_frame(self, frame_idx):
        img = self.bg_base.copy()
        draw = ImageDraw.Draw(img)

        # -------------------------------------------------------------
        # BEAT 1: GATE (Frames 0 - 95; 0.00s - 3.19s)
        # -------------------------------------------------------------
        if frame_idx < 96:
            progress = frame_idx / 95.0
            content = self.captures["01_gate_prompt"]
            zoom = 1.0 + 0.05 * progress
            browser = self.assemble_browser_frame(content, zoom=zoom)
            
            img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
            img.paste(browser, (self.bx, self.by), browser)

            # Virtual cursor & simulated click at frame 65
            if frame_idx > 20:
                c_prog = min(1.0, (frame_idx - 20) / 45.0)
                # Cursor glides from bottom-right to enter button center (around 960, 560 in screen coords)
                cur_x = int(1200 - 240 * c_prog)
                cur_y = int(700 - 140 * c_prog)
                
                # Draw cursor
                draw.polygon([(cur_x, cur_y), (cur_x + 18, cur_y + 18), (cur_x + 6, cur_y + 18), (cur_x, cur_y + 26)], fill=BONE)
                
                # Click shock ripple at frame 65-75
                if frame_idx >= 65:
                    r = int((frame_idx - 65) * 18)
                    draw.ellipse([960 - r, 560 - r, 960 + r, 560 + r], outline=ACCENT, width=3)

            # Slice wipe reveal during frames 80-95
            if frame_idx >= 80:
                wipe_p = (frame_idx - 80) / 15.0
                slice_x = int(WIDTH * wipe_p)
                draw.line([(slice_x, 0), (slice_x + 60, HEIGHT)], fill=ACCENT, width=6)

            self.draw_hud(draw, "Α // 01", "ENTER GATE // SYSTEM DOSSIER", frame_idx)
            if frame_idx < 54:
                self.draw_subtitle_bar(draw, "Hi, I'm Jeel.", None)
            else:
                self.draw_subtitle_bar(draw, "Welcome to solarquack.", None, em_words=True)

        # -------------------------------------------------------------
        # BEAT 2: HERO DOSSIER (Frames 96 - 170; 3.19s - 5.68s)
        # -------------------------------------------------------------
        elif frame_idx < 171:
            p = (frame_idx - 96) / 74.0
            # Continuous 3D push-in: 1.0 -> 1.15
            zoom = 1.0 + 0.15 * p
            pan_y = -30 * p
            content = self.captures["02_hero_full"] if frame_idx < 135 else self.captures["02_hero_specs"]
            browser = self.assemble_browser_frame(content, zoom=zoom, pan_y=pan_y)

            img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
            img.paste(browser, (self.bx, self.by), browser)

            # Kinetic Callout Badge
            if frame_idx >= 120:
                self.draw_callout_badge(draw, 1080, 240, "[ SYSTEMS ENGINEER // PES UNIVERSITY '27 ]", accent_edge=True)

            self.draw_hud(draw, "Β // 02", "HERO DOSSIER // MARBLE HERCULES", frame_idx)
            if frame_idx < 130:
                self.draw_subtitle_bar(draw, "Marble, code,", None)
            else:
                self.draw_subtitle_bar(draw, "Marble, code,", "and a little obsession.", em_words=True)

        # -------------------------------------------------------------
        # BEAT 3: FOUNDATIONS (Frames 171 - 385; 5.68s - 12.86s)
        # -------------------------------------------------------------
        elif frame_idx < 386:
            p = (frame_idx - 171) / (385.0 - 171.0)
            self.draw_hud(draw, "Γ // 03", "FOUNDATIONS // ΙΣΧΥΣ • ΤΕΧΝΗ", frame_idx)

            # 3A: Strength (Frames 171 to 264)
            if frame_idx < 265:
                sub_p = (frame_idx - 171) / 93.0
                zoom = 1.12 + 0.08 * sub_p
                pan_x = -180 + 30 * sub_p
                
                # Bone to color reveal blend
                bone_img = self.captures["03_foundations_bone"]
                color_img = self.captures["03_foundations_strength_hover"]
                if frame_idx < 205:
                    blend_factor = 0.0
                elif frame_idx < 240:
                    blend_factor = (frame_idx - 205) / 35.0
                else:
                    blend_factor = 1.0
                content = Image.blend(bone_img, color_img, blend_factor)

                browser = self.assemble_browser_frame(content, zoom=zoom, pan_x=pan_x, pan_y=30)
                img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
                img.paste(browser, (self.bx, self.by), browser)

                if frame_idx >= 210:
                    self.draw_callout_badge(draw, 240, 220, "[ 01 STRENGTH // PURE JAVA SOCKET BROKER ]", accent_edge=True)

                self.draw_subtitle_bar(draw, "Strength: pure Java systems.", None)

            # 3B: Craft (Frames 265 to 385)
            else:
                sub_p = (frame_idx - 265) / 120.0
                zoom = 1.14 + 0.08 * sub_p
                pan_x = 180 - 30 * sub_p
                
                bone_img = self.captures["03_foundations_bone"]
                color_img = self.captures["03_foundations_craft_hover"]
                if frame_idx < 295:
                    blend_factor = 0.0
                elif frame_idx < 335:
                    blend_factor = (frame_idx - 295) / 40.0
                else:
                    blend_factor = 1.0
                content = Image.blend(bone_img, color_img, blend_factor)

                browser = self.assemble_browser_frame(content, zoom=zoom, pan_x=pan_x, pan_y=30)
                img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
                img.paste(browser, (self.bx, self.by), browser)

                if frame_idx >= 300:
                    self.draw_callout_badge(draw, 1040, 220, "[ 02 CRAFT // RESNET-50 96.4% TOP-1 ]", accent_edge=True)

                if frame_idx < 326:
                    self.draw_subtitle_bar(draw, "Craft: ResNet-50 at 96%,", None)
                else:
                    self.draw_subtitle_bar(draw, "Craft: ResNet-50 at 96%,", "with hybrid RAG.", em_words=True)

        # -------------------------------------------------------------
        # BEAT 4: WORK SHOWROOM (Frames 386 - 441; 12.86s - 14.73s)
        # -------------------------------------------------------------
        elif frame_idx < 442:
            self.draw_hud(draw, "Δ // 04", "WORK SHOWROOM // ΕΡΓΑ", frame_idx)
            p = (frame_idx - 386) / (441.0 - 386.0)

            # 386 - 408: Grid view
            if frame_idx < 409:
                content = self.captures["04_work_grid"]
                zoom = 1.0 + 0.06 * (frame_idx - 386) / 23.0
                browser = self.assemble_browser_frame(content, zoom=zoom, pan_y=-20)
                self.draw_subtitle_bar(draw, "Five systems,", None)
            # 409 - 425: List view toggle
            elif frame_idx < 426:
                content = self.captures["04_work_list"]
                zoom = 1.08 + 0.04 * (frame_idx - 409) / 16.0
                browser = self.assemble_browser_frame(content, zoom=zoom, pan_y=10)
                self.draw_subtitle_bar(draw, "Five systems,", "shipped and running.", em_words=True)
            # 426 - 441: Zoom-through to Project Kafka Detail
            else:
                content = self.captures["04_project_kafka"]
                zoom = 1.15 + 0.10 * (frame_idx - 426) / 15.0
                browser = self.assemble_browser_frame(content, zoom=zoom, pan_y=30)
                self.draw_subtitle_bar(draw, "Five systems,", "shipped and running.", em_words=True)

            img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
            img.paste(browser, (self.bx, self.by), browser)

            if frame_idx >= 400:
                self.draw_callout_badge(draw, 1140, 200, "[ 5 SYSTEMS SHIPPED // ZERO PLACEHOLDERS ]", accent_edge=True)

        # -------------------------------------------------------------
        # BEAT 5: ARMORY (Frames 442 - 631; 14.73s - 21.05s)
        # -------------------------------------------------------------
        elif frame_idx < 632:
            self.draw_hud(draw, "Ε // 05", "THE ARMORY // ΟΠΛΟΘΗΚΗ", frame_idx)

            # 442 - 530: Armory Overview with ticking counters
            if frame_idx < 530:
                sub_p = (frame_idx - 442) / 88.0
                content = self.captures["05_armory_overview"]
                zoom = 1.02 + 0.06 * sub_p
                browser = self.assemble_browser_frame(content, zoom=zoom, pan_y=-30 * sub_p)
                img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
                img.paste(browser, (self.bx, self.by), browser)

                # Simulated Counter HUD
                c_lang = min(6, int(sub_p * 8))
                c_tools = min(16, int(sub_p * 20))
                c_sys = min(5, int(sub_p * 6))
                self.draw_callout_badge(draw, 240, 200, f"[ STACK COUNTERS: {c_lang} LANGUAGES • {c_tools} TOOLS • {c_sys} SYSTEMS ]", accent_edge=True)

                if frame_idx < 505:
                    self.draw_subtitle_bar(draw, "Explore the whole armory:", None)
                else:
                    self.draw_subtitle_bar(draw, "Explore the whole armory:", "6 languages, 16 tools,", em_words=False)

            # 530 - 631: Live Filter Typing + Filtered View
            else:
                sub_p = (frame_idx - 530) / 101.0
                content = self.captures["05_armory_filtered"]
                zoom = 1.10 + 0.08 * sub_p
                pan_y = int(30 * math.sin(sub_p * math.pi))
                browser = self.assemble_browser_frame(content, zoom=zoom, pan_y=pan_y)
                img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
                img.paste(browser, (self.bx, self.by), browser)

                self.draw_callout_badge(draw, 1080, 200, "[ KEYSTROKE FILTER: \"/\" -> FASTAPI • KAFKA ]", accent_edge=True)

                if frame_idx < 565:
                    self.draw_subtitle_bar(draw, "Explore the whole armory:", "6 languages, 16 tools,", em_words=False)
                else:
                    self.draw_subtitle_bar(draw, "6 languages, 16 tools,", "filterable in one keystroke.", em_words=True)

        # -------------------------------------------------------------
        # BEAT 6: GITHUB TELEMETRY (Frames 632 - 668; 21.05s - 22.28s)
        # -------------------------------------------------------------
        elif frame_idx < 669:
            self.draw_hud(draw, "Ϛ // 06", "GITHUB TELEMETRY // COMMITS", frame_idx)
            p = (frame_idx - 632) / 36.0
            content = self.captures["06_github_telemetry"]
            zoom = 1.08 + 0.10 * p
            pan_y = 20 * p
            browser = self.assemble_browser_frame(content, zoom=zoom, pan_y=pan_y)
            img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
            img.paste(browser, (self.bx, self.by), browser)

            self.draw_callout_badge(draw, 240, 200, "[ 52-WEEK ACTIVITY MATRIX // SOURCE-DRIVEN ]", accent_edge=True)
            self.draw_subtitle_bar(draw, "Every commit, live.", None, em_words=True)

        # -------------------------------------------------------------
        # BEAT 7: PATH TRAJECTORY (Frames 669 - 709; 22.28s - 23.65s)
        # -------------------------------------------------------------
        elif frame_idx < 710:
            self.draw_hud(draw, "Ζ // 07", "THE PATH // TRAJECTORY TIMELINE", frame_idx)
            p = (frame_idx - 669) / 40.0
            content = self.captures["07_path_timeline"]
            zoom = 1.06 + 0.08 * p
            pan_y = -40 + 70 * p # Vertical scroll down the timeline
            browser = self.assemble_browser_frame(content, zoom=zoom, pan_y=pan_y)
            img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
            img.paste(browser, (self.bx, self.by), browser)

            self.draw_callout_badge(draw, 1120, 200, "[ 2023 — 2026 // ENGINEERING TRAJECTORY ]", accent_edge=True)
            self.draw_subtitle_bar(draw, "Every step, charted.", None, em_words=True)

        # -------------------------------------------------------------
        # BEAT 8: HONEST STATUS (Frames 710 - 769; 23.65s - 25.64s)
        # -------------------------------------------------------------
        elif frame_idx < 770:
            self.draw_hud(draw, "Η // 08", "HONEST STATUS // KINTSUGI BUST", frame_idx)
            p = (frame_idx - 710) / 59.0
            content = self.captures["08_honest_status"]
            zoom = 1.05 + 0.12 * p
            browser = self.assemble_browser_frame(content, zoom=zoom, pan_y=10 * p)
            img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
            img.paste(browser, (self.bx, self.by), browser)

            self.draw_callout_badge(draw, 240, 200, "[ KINTSUGI: BUILDING • LEARNING • INVESTIGATING • OPEN ]", accent_edge=True)
            if frame_idx < 736:
                self.draw_subtitle_bar(draw, "And an honest look", None)
            else:
                self.draw_subtitle_bar(draw, "And an honest look", "at what's still broken.", em_words=True)

        # -------------------------------------------------------------
        # BEAT 9: PAGE MONTAGE (Frames 770 - 829; 25.64s - 27.66s)
        # Rapid cuts (15 frames = 0.5s each)
        # -------------------------------------------------------------
        elif frame_idx < 830:
            self.draw_hud(draw, "Θ // 09", "SITE ATLAS // CORE ARCHIVES", frame_idx)
            
            if frame_idx < 785:
                content = self.captures["09_page_about"]
                page_label = "[ /ABOUT // FIRST PRINCIPLE: REPO IS PORTFOLIO ]"
            elif frame_idx < 800:
                content = self.captures["09_page_log"]
                page_label = "[ /LOG // SYSTEMS DEV JOURNAL ]"
            elif frame_idx < 815:
                content = self.captures["09_page_resume"]
                page_label = "[ /RESUME // CURRICULUM & HONORS ]"
            else:
                content = self.captures["09_page_contact"]
                page_label = "[ /CONTACT // DIRECT TERMINAL REACH ]"

            sub_f = (frame_idx - 770) % 15
            zoom = 1.05 + 0.06 * (sub_f / 15.0)
            browser = self.assemble_browser_frame(content, zoom=zoom)
            img.paste(self.shadow, (self.bx - self.shadow_pad, self.by - self.shadow_pad), self.shadow)
            img.paste(browser, (self.bx, self.by), browser)

            self.draw_callout_badge(draw, 240, 200, page_label, accent_edge=True)
            self.draw_subtitle_bar(draw, "The repo is the portfolio.", None, em_words=True)

        # -------------------------------------------------------------
        # BEAT 10: CLOSE / SIGNOFF (Frames 830 - 1049; 27.66s - 35.00s)
        # -------------------------------------------------------------
        else:
            self.draw_hud(draw, "Ω // 10", "SYSTEM ARCHIVE // CLOSE", frame_idx)
            p = (frame_idx - 830) / (1049.0 - 830.0)

            # Ambient drifting Greek words in background
            greek_words = "ΙΣΧΥΣ • ΤΕΧΝΗ • ΕΡΓΑ • ΟΠΛΟΘΗΚΗ"
            gw_box = self.fonts["greek_bg"].getbbox(greek_words)
            gw_w = gw_box[2] - gw_box[0]
            gw_x = int(WIDTH // 2 - gw_w // 2 + 30 * math.sin(p * math.pi))
            draw.text((gw_x, 180), greek_words, fill=(16, 16, 14), font=self.fonts["greek_bg"])

            # Central Endcard Box
            card_w, card_h = 1380, 560
            card_x = (WIDTH - card_w) // 2
            card_y = 280
            draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=16, fill=(13, 13, 11))
            draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=16, outline=RULE, width=2)

            # Corner accents
            ac_len = 24
            for cx, cy in [(card_x, card_y), (card_x + card_w, card_y), (card_x, card_y + card_h), (card_x + card_w, card_y + card_h)]:
                draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=ACCENT)

            # Title
            t_url = "solarquack.in"
            tb = self.fonts["close_url"].getbbox(t_url)
            tw = tb[2] - tb[0]
            draw.text(((WIDTH - tw) // 2, card_y + 80), t_url, fill=BONE, font=self.fonts["close_url"])

            # Monospace sub-headline
            t_name = "JEEL NADA  //  SYSTEMS & ML ENGINEER"
            nb = self.fonts["close_name"].getbbox(t_name)
            nw = nb[2] - nb[0]
            draw.text(((WIDTH - nw) // 2, card_y + 190), t_name, fill=MUTED, font=self.fonts["close_name"])

            # Callout specs
            t_sub = "PES UNIVERSITY '27  •  BENGALURU, INDIA  •  SOURCE-VERIFIED"
            sb = self.fonts["callout"].getbbox(t_sub)
            sw = sb[2] - sb[0]
            draw.text(((WIDTH - sw) // 2, card_y + 250), t_sub, fill=(160, 155, 145), font=self.fonts["callout"])

            # Red Pill Button
            badge_text = "OPEN TO SUMMER 2027 INTERNSHIPS"
            bb = self.fonts["chip"].getbbox(badge_text)
            bw = bb[2] - bb[0] + 64
            bh = 64
            bx = (WIDTH - bw) // 2
            by = card_y + 350
            draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=32, fill=ACCENT)
            draw.text((bx + 32, by + 18), badge_text, fill=(255, 255, 255), font=self.fonts["chip"])

            # Subtitle
            if frame_idx < 895:
                self.draw_subtitle_bar(draw, "Open to Summer 2027 internships.", None)
            else:
                self.draw_subtitle_bar(draw, "Open to Summer 2027 internships.", "solarquack.in", em_words=True)

        return img

def render_trailer_video():
    print(f"Initializing Trailer Renderer (1920x1080 @ {FPS} fps, {TOTAL_FRAMES} frames)...")
    renderer = TrailerRenderer()

    # Save representative hero frame 140 as poster image
    print("Generating poster image brag.jpg from Hero frame...")
    poster_frame = renderer.render_frame(140)
    poster_frame.save(POSTER_PATH, quality=95)
    print(f"Saved poster: {POSTER_PATH}")

    # Launch FFmpeg pipe
    ffmpeg_cmd = [
        FFMPEG, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO_PATH,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "copy",
        "-shortest",
        OUT_VIDEO
    ]
    print("Launching FFmpeg encoding pipe...")
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)

    try:
        for f in range(TOTAL_FRAMES):
            frame_img = renderer.render_frame(f)
            # Send raw bytes to pipe
            proc.stdin.write(frame_img.tobytes())
            
            if f % 75 == 0 or f == TOTAL_FRAMES - 1:
                pct = (f + 1) / TOTAL_FRAMES * 100
                print(f"Rendered frame {f+1}/{TOTAL_FRAMES} ({pct:.1f}%)")
                
        proc.stdin.close()
        proc.wait()
        print(f"\nSuccessfully finished rendering trailer: {OUT_VIDEO}")
    except Exception as e:
        print(f"Error during video render: {e}")
        if proc.stdin:
            proc.stdin.close()
        proc.kill()
        raise e

if __name__ == "__main__":
    render_trailer_video()
