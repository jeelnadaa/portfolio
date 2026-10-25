import os
import json
import subprocess
import edge_tts

AUDIO_DIR = os.path.abspath("brag-output/audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

FFMPEG = "C:\\ffmpeg\\bin\\ffmpeg.exe"
FFPROBE = "C:\\ffmpeg\\bin\\ffprobe.exe"
VOICE = "en-US-ChristopherNeural"
RATE = "+18%"

# 6 Storyboard Beats with exact timings
BEATS = [
    {
        "id": "beat_1",
        "start": 0.6,
        "text": "Hi, I'm Jeel Nada, a systems and AI engineer. This is my portfolio.",
        "subs": [
            {"t": 0.6, "words": ["Hi,", "I'm", "Jeel", "Nada,"], "em": [2, 3]},
            {"t": 2.2, "words": ["Systems", "&", "AI", "Engineer."], "em": [0, 2, 3]},
            {"t": 4.2, "words": ["This", "is", "my", "portfolio."], "em": [3]}
        ]
    },
    {
        "id": "beat_2",
        "start": 6.8,
        "text": "My featured project helps Karnataka coffee farmers.",
        "subs": [
            {"t": 6.8, "words": ["My", "featured", "project"], "em": [1]},
            {"t": 8.1, "words": ["helps", "Karnataka", "coffee", "farmers."], "em": [1, 2]}
        ]
    },
    {
        "id": "beat_3",
        "start": 10.4,
        "text": "It scans a leaf, detects disease with a CNN, and explains treatment with RAG and an LLM, in Kannada or English.",
        "subs": [
            {"t": 10.4, "words": ["Scans", "leaf,", "detects", "disease", "with", "a", "CNN,"], "em": [0, 3, 6]},
            {"t": 13.0, "words": ["explains", "treatment", "with", "hybrid", "RAG", "&", "LLM,"], "em": [1, 4, 6]},
            {"t": 15.6, "words": ["in", "Kannada", "or", "English."], "em": [1, 3]}
        ]
    },
    {
        "id": "beat_4",
        "start": 18.0,
        "text": "Dive into the architecture, models, and code.",
        "subs": [
            {"t": 18.0, "words": ["Dive", "into", "the", "architecture,"], "em": [0, 3]},
            {"t": 19.5, "words": ["the", "models,", "and", "the", "code."], "em": [1, 4]}
        ]
    },
    {
        "id": "beat_5",
        "start": 21.6,
        "text": "And it works just as well on your phone.",
        "subs": [
            {"t": 21.6, "words": ["And", "it", "works", "just", "as", "well"], "em": [2]},
            {"t": 22.8, "words": ["on", "your", "phone."], "em": [2]}
        ]
    },
    {
        "id": "beat_6",
        "start": 24.3,
        "text": "See what I build at solarquack.in.",
        "subs": [
            {"t": 24.3, "words": ["See", "what", "I", "build"], "em": [0, 3]},
            {"t": 25.4, "words": ["at", "solarquack.in"], "em": [1]}
        ]
    }
]

async def synthesize_all():
    print("Generating speech clips...")
    for b in BEATS:
        path = os.path.join(AUDIO_DIR, f"{b['id']}.mp3")
        c = edge_tts.Communicate(b["text"], VOICE, rate=RATE)
        await c.save(path)
        cmd = [FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        dur = float(res.stdout.strip())
        b["dur"] = dur
        b["end"] = b["start"] + dur
        print(f"[{b['id']}] {b['start']}s -> {b['end']:.2f}s (dur={dur:.2f}s): {b['text']}")

    with open(os.path.join(AUDIO_DIR, "synced_beats.json"), "w", encoding="utf-8") as f:
        json.dump(BEATS, f, indent=2)

def build_audio_mix(total_duration=27.5):
    print("Building composite audio mix with ducked music & SFX...")
    music_src = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\music\\happy-beats-business-moves-vol-1-by-ende-dot-app.mp3"
    sfx_click = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\sfx\\ui\\click1.ogg"
    sfx_switch = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\sfx\\ui\\switch1.ogg"
    sfx_switch2 = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\sfx\\ui\\switch2.ogg"
    sfx_drop = "C:\\Users\\solarquack\\.gemini\\config\\skills\\brag\\assets\\sfx\\interface\\drop_001.ogg"

    cmd = [
        FFMPEG, "-y",
        "-i", music_src,
        "-i", os.path.join(AUDIO_DIR, "beat_1.mp3"),
        "-i", os.path.join(AUDIO_DIR, "beat_2.mp3"),
        "-i", os.path.join(AUDIO_DIR, "beat_3.mp3"),
        "-i", os.path.join(AUDIO_DIR, "beat_4.mp3"),
        "-i", os.path.join(AUDIO_DIR, "beat_5.mp3"),
        "-i", os.path.join(AUDIO_DIR, "beat_6.mp3"),
        "-i", sfx_drop,
        "-i", sfx_click,
        "-i", sfx_switch,
        "-i", sfx_switch2,
        "-filter_complex",
        f"""
        [0:a]atrim=0:{total_duration},afade=t=in:st=0:d=0.5,afade=t=out:st={total_duration-1.5}:d=1.5,volume=0.09[bgm];
        [1:a]adelay=600|600,volume=1.05[a1];
        [2:a]adelay=6800|6800,volume=1.05[a2];
        [3:a]adelay=10400|10400,volume=1.05[a3];
        [4:a]adelay=18000|18000,volume=1.05[a4];
        [5:a]adelay=21600|21600,volume=1.05[a5];
        [6:a]adelay=24300|24300,volume=1.05[a6];
        [7:a]adelay=100|100,volume=0.45[sfx0];
        [8:a]adelay=6800|6800,volume=0.35[sfx1];
        [9:a]adelay=21400|21400,volume=0.40[sfx2];
        [10:a]adelay=24200|24200,volume=0.40[sfx3];
        [bgm][a1][a2][a3][a4][a5][a6][sfx0][sfx1][sfx2][sfx3]amix=inputs=11:duration=longest:dropout_transition=2[out]
        """,
        "-map", "[out]",
        "-c:a", "aac",
        "-b:a", "192k",
        "-ar", "48000",
        "-t", str(total_duration),
        os.path.join(AUDIO_DIR, "master_audio.m4a")
    ]

    subprocess.run(cmd, check=True)
    print("Master audio mix built successfully!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(synthesize_all())
    build_audio_mix(27.5)
