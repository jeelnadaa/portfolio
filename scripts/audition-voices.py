import os
import asyncio
import subprocess
import edge_tts

AUDITION_DIR = os.path.abspath("brag-output/audio/auditions")
os.makedirs(AUDITION_DIR, exist_ok=True)

FFPROBE = "C:\\ffmpeg\\bin\\ffprobe.exe"

SCRIPT = (
    "Hi, I'm Jeel. Welcome to solarquack. Marble, code, and a little obsession. "
    "Strength: pure Java systems. Craft: ResNet-50 at ninety-six percent, with hybrid RAG. "
    "Five systems, shipped and running. "
    "Explore the whole armory, six languages, sixteen tools, filterable in one keystroke. "
    "Every commit, live. Every step, charted. And an honest look at what's still broken. "
    "The repo is the portfolio. "
    "I'm open to Summer twenty twenty-seven internships. Solarquack dot in."
)

VOICES = [
    {"name": "Christopher", "id": "en-US-ChristopherNeural", "rate": "+4%"},
    {"name": "Andrew", "id": "en-US-AndrewNeural", "rate": "+4%"},
    {"name": "Guy", "id": "en-US-GuyNeural", "rate": "+4%"}
]

async def audition():
    print("Auditioning voices on the full narration script...")
    results = []
    for v in VOICES:
        out_path = os.path.join(AUDITION_DIR, f"{v['name'].lower()}_full.mp3")
        comm = edge_tts.Communicate(SCRIPT, v["id"], rate=v["rate"])
        await comm.save(out_path)
        
        cmd = [FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", out_path]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        dur = float(res.stdout.strip())
        print(f"Voice [{v['name']}] ({v['id']}) - Total duration: {dur:.2f}s")
        results.append({"voice": v["name"], "id": v["id"], "duration": dur, "path": out_path})
        
    return results

if __name__ == "__main__":
    asyncio.run(audition())
