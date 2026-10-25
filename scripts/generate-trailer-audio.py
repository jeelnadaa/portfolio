import os
import json
import subprocess
import edge_tts

AUDIO_DIR = os.path.abspath("brag-output/audio_trailer")
os.makedirs(AUDIO_DIR, exist_ok=True)

FFMPEG = "C:\\ffmpeg\\bin\\ffmpeg.exe"
FFPROBE = "C:\\ffmpeg\\bin\\ffprobe.exe"
VOICE = "en-US-AndrewNeural"
RATE = "+0%" # natural, confident, authoritative pacing

# 10 Storyboard Beats matching the 10 sections
PHRASES = [
    {
        "id": "p01_gate",
        "beat": 1,
        "text": "Hi, I'm Jeel. Welcome to solarquack.",
        "subs": ["Hi, I'm Jeel.", "Welcome to solarquack."]
    },
    {
        "id": "p02_hero",
        "beat": 2,
        "text": "Marble, code, and a little obsession.",
        "subs": ["Marble, code,", "and a little obsession."]
    },
    {
        "id": "p03_foundations",
        "beat": 3,
        "text": "Strength: pure Java systems. Craft: ResNet-50 at ninety-six percent, with hybrid RAG.",
        "subs": ["Strength: pure Java systems.", "Craft: ResNet-50 at 96%,", "with hybrid RAG."]
    },
    {
        "id": "p04_work",
        "beat": 4,
        "text": "Five systems, shipped and running.",
        "subs": ["Five systems,", "shipped and running."]
    },
    {
        "id": "p05_armory",
        "beat": 5,
        "text": "Explore the whole armory: six languages, sixteen tools, filterable in one keystroke.",
        "subs": ["Explore the whole armory:", "6 languages, 16 tools,", "filterable in one keystroke."]
    },
    {
        "id": "p06_github",
        "beat": 6,
        "text": "Every commit, live.",
        "subs": ["Every commit, live."]
    },
    {
        "id": "p07_path",
        "beat": 7,
        "text": "Every step, charted.",
        "subs": ["Every step, charted."]
    },
    {
        "id": "p08_status",
        "beat": 8,
        "text": "And an honest look at what's still broken.",
        "subs": ["And an honest look", "at what's still broken."]
    },
    {
        "id": "p09_pages",
        "beat": 9,
        "text": "The repo is the portfolio.",
        "subs": ["The repo is the portfolio."]
    },
    {
        "id": "p10_close",
        "beat": 10,
        "text": "I'm open to Summer twenty twenty-seven internships. Solarquack dot in.",
        "subs": ["Open to Summer 2027 internships.", "solarquack.in"]
    }
]

async def synthesize_all():
    print("Synthesizing clips at RATE=+0%...")
    clips = []
    for item in PHRASES:
        raw_path = os.path.join(AUDIO_DIR, f"{item['id']}_raw.mp3")
        trimmed_path = os.path.join(AUDIO_DIR, f"{item['id']}.wav")
        
        c = edge_tts.Communicate(item["text"], VOICE, rate=RATE)
        await c.save(raw_path)
        
        trim_cmd = [
            FFMPEG, "-y",
            "-i", raw_path,
            "-af", "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_duration=0.01:start_threshold=-50dB,areverse",
            trimmed_path
        ]
        subprocess.run(trim_cmd, check=True, capture_output=True)
        
        dur_cmd = [
            FFPROBE, "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            trimmed_path
        ]
        res = subprocess.run(dur_cmd, capture_output=True, text=True, check=True)
        dur = float(res.stdout.strip())
        
        item["path"] = trimmed_path
        item["duration"] = dur
        clips.append(item)
        print(f"[{item['id']}] dur={dur:.3f}s: \"{item['text']}\"")
        
    return clips

def calculate_tight_pacing(clips):
    # Total video length: 35.0 seconds
    # Intro silence: 0.8s (gate reveals and clicks)
    current_time = 0.8
    gaps = []
    
    for i, clip in enumerate(clips):
        clip["start_time"] = round(current_time, 3)
        clip["end_time"] = round(current_time + clip["duration"], 3)
        
        if i < len(clips) - 1:
            if i == 8: # Beat 9 to Beat 10: deliberate 450ms dramatic pause before close
                gap = 0.48
            else: # Standard tight phrase gap: 160-220ms
                gap = 0.18
            gaps.append(gap)
            current_time = clip["end_time"] + gap
        else:
            current_time = clip["end_time"]

    TOTAL_DURATION = 35.0
    hold_duration = round(TOTAL_DURATION - clips[-1]["end_time"], 2)
    max_gap = max(gaps)
    
    print("\n--- MEASURED TIMELINE PACING ---")
    for c in clips:
        print(f"Beat {c['beat']} [{c['id']}]: {c['start_time']:.2f}s -> {c['end_time']:.2f}s (dur={c['duration']:.2f}s)")
    print(f"\nTotal speech finishes at: {clips[-1]['end_time']:.2f}s")
    print(f"Final signoff hold duration: {hold_duration}s (target: >= 2.0s)")
    print(f"Longest silence gap between phrases: {max_gap*1000:.0f} ms (target: 400-600 ms before final line)")
    
    with open(os.path.join(AUDIO_DIR, "synced_trailer_timeline.json"), "w", encoding="utf-8") as f:
        json.dump(clips, f, indent=2)
        
    return clips, TOTAL_DURATION

def mix_audio(clips, total_duration=35.0):
    music_src = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\music\\happy-beats-business-moves-vol-12-by-ende-dot-app.mp3"
    sfx_click = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\sfx\\ui\\click1.ogg"
    sfx_switch = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\sfx\\ui\\switch1.ogg"
    sfx_whoosh = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\sfx\\interface\\drop_001.ogg"
    sfx_impact = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\sfx\\interface\\drop_002.ogg"
    sfx_chime = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\sfx\\ui\\switch2.ogg"

    filter_complex = [
        f"[0:a]atrim=0:{total_duration},afade=t=in:st=0:d=0.3,afade=t=out:st={total_duration-1.0}:d=1.0,volume=0.08[bgm];"
    ]
    mix_inputs = ["[bgm]"]
    
    for i, c in enumerate(clips):
        delay_ms = int(c["start_time"] * 1000)
        filter_complex.append(f"[{i+1}:a]adelay={delay_ms}|{delay_ms},volume=1.10[v{i}];")
        mix_inputs.append(f"[v{i}]")
        
    # SFX at visual cuts
    sfx_cues = [
        (11, 200, 0.40, "sfx0"),   # 0.2s gate whoosh
        (12, 1000, 0.45, "sfx1"),  # 1.0s click enter
        (13, 3100, 0.45, "sfx2"),  # 3.1s hero reveal
        (14, 6000, 0.35, "sfx3"),  # foundations
        (15, 13000, 0.35, "sfx4"), # work
        (16, 15000, 0.35, "sfx5"), # armory
        (17, 30500, 0.45, "sfx6"), # close chime
    ]
    for input_idx, delay_ms, vol, label in sfx_cues:
        filter_complex.append(f"[{input_idx}:a]adelay={delay_ms}|{delay_ms},volume={vol}[{label}];")
        mix_inputs.append(f"[{label}]")
        
    total_inputs = len(mix_inputs)
    filter_complex.append(f"{''.join(mix_inputs)}amix=inputs={total_inputs}:duration=longest:dropout_transition=2,loudnorm=I=-16:TP=-1.0:LRA=11[master]")
    
    cmd = [
        FFMPEG, "-y",
        "-i", music_src,
    ]
    for c in clips:
        cmd.extend(["-i", c["path"]])
    cmd.extend([
        "-i", sfx_whoosh,
        "-i", sfx_click,
        "-i", sfx_impact,
        "-i", sfx_switch,
        "-i", sfx_switch,
        "-i", sfx_click,
        "-i", sfx_chime,
        "-filter_complex", "".join(filter_complex),
        "-map", "[master]",
        "-c:a", "aac",
        "-b:a", "192k",
        "-ar", "48000",
        "-t", str(total_duration),
        os.path.join(AUDIO_DIR, "master_trailer_audio.m4a")
    ])
    subprocess.run(cmd, check=True)
    print("Master trailer audio mixed and normalized to -16 LUFS, -1 dBTP!")

if __name__ == "__main__":
    import asyncio
    clips = asyncio.run(synthesize_all())
    scheduled, total_dur = calculate_tight_pacing(clips)
    mix_audio(scheduled, total_dur)
