import asyncio
import os
import json
import subprocess
import edge_tts

VOICE = "en-US-ChristopherNeural"
RATE = "+20%"

BEATS = [
    {
        "id": "beat_intro",
        "text": "Hi, I'm Jeel Nada, a systems and AI engineer. This is my portfolio.",
        "start_target": 0.6
    },
    {
        "id": "beat_mission",
        "text": "My featured project helps Karnataka coffee farmers.",
        "start_target": 6.0
    },
    {
        "id": "beat_plantiq",
        "text": "It scans a leaf, detects disease with a CNN, and explains treatment with RAG and an LLM, in Kannada or English.",
        "start_target": 9.2
    },
    {
        "id": "beat_architecture",
        "text": "Dive into the architecture, models, and code. Every project explains how it works.",
        "start_target": 16.5
    },
    {
        "id": "beat_mobile",
        "text": "And it works just as well on your phone.",
        "start_target": 21.6
    },
    {
        "id": "beat_cta",
        "text": "See what I build at solarquack.in.",
        "start_target": 24.2
    }
]

AUDIO_DIR = os.path.abspath("brag-output/audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

async def main():
    manifest = []
    print("Synthesizing narration beats at +20% rate...")
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
        manifest.append(b)
        
    curr_time = 0.6
    for b in manifest:
        if curr_time < b["start_target"]:
            curr_time = b["start_target"]
        b["final_start"] = round(curr_time, 2)
        b["final_end"] = round(curr_time + b["measured_duration"], 2)
        print(f"[{b['id']}] {b['final_start']}s -> {b['final_end']}s (dur={b['measured_duration']:.2f}s): \"{b['text']}\"")
        curr_time = b["final_end"] + 0.2

    print(f"\nFinal audio completes at: {manifest[-1]['final_end']}s")
    total_video_duration = 27.0
    print(f"Holding outro until: {total_video_duration}s (outro hold = {total_video_duration - manifest[-1]['final_end']:.2f}s)")

    with open(os.path.join(AUDIO_DIR, "measured_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

if __name__ == "__main__":
    asyncio.run(main())
