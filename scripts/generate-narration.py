import asyncio
import os
import json
import subprocess
import edge_tts

VOICE = "en-US-ChristopherNeural"
RATE = "+12%"
PITCH = "+0Hz"

BEATS = [
    {
        "id": "beat_1",
        "text": "Hi, I'm Jeel Nada, a systems and AI engineer. This is my portfolio.",
        "label": "Hook & Identity",
        "subtitles": [
            {"time_offset": 0.0, "text": "Hi, I'm Jeel Nada,"},
            {"time_offset": 1.5, "text": "Systems & AI Engineer."},
            {"time_offset": 3.0, "text": "This is my portfolio."}
        ]
    },
    {
        "id": "beat_2",
        "text": "My featured project helps Karnataka coffee farmers.",
        "label": "Featured Mission",
        "subtitles": [
            {"time_offset": 0.0, "text": "My featured project"},
            {"time_offset": 1.2, "text": "helps Karnataka coffee farmers."}
        ]
    },
    {
        "id": "beat_3",
        "text": "It scans a leaf, detects disease with a CNN, and explains treatment using hybrid RAG and an LLM, in Kannada or English.",
        "label": "PlantIQ Core",
        "subtitles": [
            {"time_offset": 0.0, "text": "It scans a leaf, detects disease with a CNN,"},
            {"time_offset": 3.0, "text": "and explains treatment using hybrid RAG & LLMs,"},
            {"time_offset": 5.8, "text": "in Kannada or English."}
        ]
    },
    {
        "id": "beat_4",
        "text": "Dive into the architecture, models, and code. Every project explains how it works.",
        "label": "Technical Depth",
        "subtitles": [
            {"time_offset": 0.0, "text": "Dive into the architecture, models, and code."},
            {"time_offset": 2.5, "text": "Every project explains how it works."}
        ]
    },
    {
        "id": "beat_5",
        "text": "And it works just as well on your phone.",
        "label": "Responsive Mobile",
        "subtitles": [
            {"time_offset": 0.0, "text": "And it works just as well"},
            {"time_offset": 1.1, "text": "on your phone."}
        ]
    },
    {
        "id": "beat_6",
        "text": "See what I build at solarquack.in.",
        "label": "Call to Action",
        "subtitles": [
            {"time_offset": 0.0, "text": "See what I build"},
            {"time_offset": 1.1, "text": "at solarquack.in."}
        ]
    }
]

AUDIO_DIR = os.path.abspath("brag-output/audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

async def generate_beat(beat):
    audio_path = os.path.join(AUDIO_DIR, f"{beat['id']}.mp3")
    vtt_path = os.path.join(AUDIO_DIR, f"{beat['id']}.vtt")
    
    communicate = edge_tts.Communicate(beat["text"], VOICE, rate=RATE, pitch=PITCH)
    submaker = edge_tts.SubMaker()
    
    with open(audio_path, "wb") as file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                submaker.feed(chunk)
                
    with open(vtt_path, "w", encoding="utf-8") as file:
        file.write(submaker.get_srt())
        
    cmd = [
        "C:\\ffmpeg\\bin\\ffprobe.exe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        audio_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    duration = float(res.stdout.strip())
    
    return {
        "id": beat["id"],
        "label": beat["label"],
        "text": beat["text"],
        "subtitles": beat["subtitles"],
        "audio_path": audio_path,
        "vtt_path": vtt_path,
        "duration": duration
    }

async def main():
    results = []
    total_speech_time = 0.0
    for beat in BEATS:
        res = await generate_beat(beat)
        results.append(res)
        total_speech_time += res["duration"]
        print(f"[{res['id']}] ({res['duration']:.2f}s) \"{res['text']}\"")
        
    print(f"\n---> Total speech duration: {total_speech_time:.2f} seconds <---")
    with open(os.path.join(AUDIO_DIR, "beats_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    asyncio.run(main())
