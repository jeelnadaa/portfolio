import asyncio
import os
import json
import subprocess
import edge_tts

VOICE = "en-US-ChristopherNeural"
RATE = "+16%"

# Storyboard narration beats
BEATS = [
    {
        "id": "beat_hero",
        "start_time": 3.8,
        "text": "Hi, I'm Jeel Nada, a systems and AI engineer. This is my portfolio.",
        "subs": [
            {"start": 3.8, "end": 5.4, "text": "Hi, I'm Jeel Nada,"},
            {"start": 5.4, "end": 6.8, "text": "Systems & AI Engineer."},
            {"start": 6.8, "end": 8.0, "text": "This is my portfolio."}
        ]
    },
    {
        "id": "beat_mission",
        "start_time": 8.2,
        "text": "My featured project helps Karnataka coffee farmers.",
        "subs": [
            {"start": 8.2, "end": 9.6, "text": "My featured project"},
            {"start": 9.6, "end": 11.2, "text": "helps Karnataka coffee farmers."}
        ]
    },
    {
        "id": "beat_plantiq",
        "start_time": 11.4,
        "text": "It scans a leaf, detects disease with a CNN, and explains treatment with RAG and an LLM, in Kannada or English.",
        "subs": [
            {"start": 11.4, "end": 13.0, "text": "It scans a leaf, detects disease with a CNN,"},
            {"start": 13.0, "end": 14.5, "text": "and explains treatment with RAG and an LLM,"},
            {"start": 14.5, "end": 15.5, "text": "in Kannada or English."}
        ]
    },
    {
        "id": "beat_depth",
        "start_time": 15.6,
        "text": "Dive into the architecture, models, and code. Every project explains how it works.",
        "subs": [
            {"start": 15.6, "end": 17.5, "text": "Dive into the architecture, models, and code."},
            {"start": 17.5, "end": 19.5, "text": "Every project explains how it works."}
        ]
    },
    {
        "id": "beat_mobile",
        "start_time": 19.6,
        "text": "And it works just as well on your phone.",
        "subs": [
            {"start": 19.6, "end": 21.0, "text": "And it works just as well"},
            {"start": 21.0, "end": 22.4, "text": "on your phone."}
        ]
    },
    {
        "id": "beat_cta",
        "start_time": 22.6,
        "text": "See what I build at solarquack.in.",
        "subs": [
            {"start": 22.6, "end": 24.2, "text": "See what I build"},
            {"start": 24.2, "end": 25.8, "text": "at solarquack.in."}
        ]
    }
]

AUDIO_DIR = os.path.abspath("brag-output/audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

async def main():
    manifest = []
    print("Synthesizing narration beats...")
    for b in BEATS:
        path = os.path.join(AUDIO_DIR, f"{b['id']}.mp3")
        c = edge_tts.Communicate(b["text"], VOICE, rate=RATE)
        await c.save(path)
        
        cmd = [
            "C:\\ffmpeg\\bin\\ffprobe.exe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        dur = float(res.stdout.strip())
        b["measured_duration"] = dur
        b["measured_end_time"] = b["start_time"] + dur
        print(f"[{b['id']}] {b['start_time']:.1f}s -> {b['measured_end_time']:.2f}s (dur={dur:.2f}s): {b['text']}")
        manifest.append(b)
        
    with open(os.path.join(AUDIO_DIR, "narration_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

if __name__ == "__main__":
    asyncio.run(main())
