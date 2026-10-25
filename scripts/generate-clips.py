import asyncio
import os
import json
import subprocess
import edge_tts

VOICE = "en-US-ChristopherNeural"
RATE = "+18%"

CLIPS = [
    {
        "id": "clip_1",
        "text": "Hi, I'm Jeel Nada, a systems and AI engineer. This is my portfolio.",
        "target_start": 0.8
    },
    {
        "id": "clip_2",
        "text": "My featured project helps Karnataka coffee farmers.",
        "target_start": 5.4
    },
    {
        "id": "clip_3",
        "text": "It scans a leaf, detects disease with a CNN, and explains treatment using RAG and an LLM, in Kannada or English.",
        "target_start": 8.8
    },
    {
        "id": "clip_4",
        "text": "Dive into the architecture, models, and code. Every project explains how it works.",
        "target_start": 16.0
    },
    {
        "id": "clip_5",
        "text": "And it works just as well on your phone.",
        "target_start": 20.2
    },
    {
        "id": "clip_6",
        "text": "See what I build at solarquack.in.",
        "target_start": 23.0
    }
]

AUDIO_DIR = os.path.abspath("brag-output/audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

async def generate_clip(item):
    audio_path = os.path.join(AUDIO_DIR, f"{item['id']}.mp3")
    comm = edge_tts.Communicate(item["text"], VOICE, rate=RATE)
    submaker = edge_tts.SubMaker()
    
    with open(audio_path, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                submaker.feed(chunk)
                
    # ffprobe duration
    cmd = [
        "C:\\ffmpeg\\bin\\ffprobe.exe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        audio_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    duration = float(res.stdout.strip())
    
    words_data = []
    for cue in submaker.cues:
        # submaker.cues has start, end, text
        words_data.append({
            "start": cue.start.total_seconds(),
            "end": cue.end.total_seconds(),
            "text": cue.content
        })
        
    return {
        "id": item["id"],
        "text": item["text"],
        "audio_path": audio_path,
        "duration": duration,
        "words": words_data
    }

async def main():
    results = []
    for c in CLIPS:
        res = await generate_clip(c)
        results.append(res)
        print(f"[{res['id']}] dur={res['duration']:.3f}s: \"{res['text']}\"")
        
    with open(os.path.join(AUDIO_DIR, "clips_cues.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    asyncio.run(main())
