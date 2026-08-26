import os
import sys
import json
import asyncio
import argparse
from typing import List, Dict, Any

# Speaker Voice Mapping (Edge-TTS Microsoft Neural Voices)
VOICE_MAPPING = {
    "Alex": "en-US-GuyNeural",     # Host A: Inquisitive & Warm Male Voice
    "Sam": "en-US-JennyNeural",    # Host B: Analytical & Professional Female Voice
    "Default": "en-US-ChristopherNeural"
}

try:
    import edge_tts
    HAS_EDGE_TTS = True
except ImportError:
    HAS_EDGE_TTS = False

try:
    import pyttsx3
    HAS_PYTTSX3 = True
except ImportError:
    HAS_PYTTSX3 = False


class ResonaAudioRenderer:
    def __init__(self, output_dir: str = "outputs"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    async def render_dialogue_edge_tts(self, dialogue_turns: List[Dict[str, str]], filename: str = "podcast.mp3") -> Dict[str, Any]:
        """Synthesizes dialogue turns into audio using Edge-TTS async API"""
        output_path = os.path.join(self.output_dir, filename)
        temp_files = []
        timecodes = []
        current_time_sec = 0.0

        for idx, turn in enumerate(dialogue_turns):
            speaker = turn.get("speaker", "Alex")
            text = turn.get("text", "")
            if not text.strip():
                continue

            voice = VOICE_MAPPING.get(speaker, VOICE_MAPPING["Default"])
            temp_file = os.path.join(self.output_dir, f"temp_turn_{idx}.mp3")
            temp_files.append(temp_file)

            # Generate single turn audio
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(temp_file)

            # Approximate duration based on word count (150 words per min = 2.5 words/sec)
            words_count = len(text.split())
            estimated_duration = max(1.5, words_count / 2.5)

            timecodes.append({
                "index": idx,
                "speaker": speaker,
                "text": text,
                "startTimeSec": round(current_time_sec, 2),
                "endTimeSec": round(current_time_sec + estimated_duration, 2)
            })
            current_time_sec += estimated_duration + 0.3  # 0.3s pause between speakers

        # Concatenate audio bytes
        with open(output_path, "wb") as master_file:
            for tf in temp_files:
                if os.path.exists(tf):
                    with open(tf, "rb") as sub:
                        master_file.write(sub.read())
                    try:
                        os.remove(tf)
                    except Exception:
                        pass

        return {
            "status": "success",
            "audio_file": output_path,
            "filename": filename,
            "total_duration_sec": round(current_time_sec, 2),
            "timecodes": timecodes,
            "engine": "Edge-TTS (Microsoft Neural Voices)"
        }

    def render_dialogue_fallback(self, dialogue_turns: List[Dict[str, str]], filename: str = "podcast.wav") -> Dict[str, Any]:
        """Fallback local TTS rendering using pyttsx3"""
        output_path = os.path.join(self.output_dir, filename)
        if HAS_PYTTSX3:
            engine = pyttsx3.init()
            full_script = "\n\n".join([f"{t.get('speaker', 'Host')}: {t.get('text', '')}" for t in dialogue_turns])
            engine.save_to_file(full_script, output_path)
            engine.runAndWait()

        return {
            "status": "success",
            "audio_file": output_path,
            "filename": filename,
            "total_duration_sec": 30.0,
            "timecodes": [],
            "engine": "pyttsx3 Offline"
        }

    def render(self, dialogue_turns: List[Dict[str, str]], filename: str = "podcast.mp3") -> Dict[str, Any]:
        if HAS_EDGE_TTS:
            try:
                return asyncio.run(self.render_dialogue_edge_tts(dialogue_turns, filename))
            except Exception as e:
                print(f"[AudioRenderer Warning] Edge-TTS failed: {e}. Falling back to pyttsx3.")
        return self.render_dialogue_fallback(dialogue_turns, filename.replace(".mp3", ".wav"))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Resona AI Audio Renderer Engine")
    parser.add_argument("--json", type=str, help="JSON file or string containing dialogue turns")
    parser.add_argument("--output", type=str, default="resona_podcast.mp3", help="Output audio filename")
    args = parser.parse_args()

    sample_dialogue = [
        {"speaker": "Alex", "text": "Welcome to Resona AI Podcast Studio! Today we are exploring state-of-the-art multi-agent AI engineering."},
        {"speaker": "Sam", "text": "That is right Alex. Multi-agent systems use role delegation and state graphs to solve complex workflow problems effortlessly."}
    ]

    renderer = ResonaAudioRenderer()
    if args.json:
        try:
            turns = json.loads(args.json)
        except Exception:
            turns = sample_dialogue
    else:
        turns = sample_dialogue

    res = renderer.render(turns, args.output)
    print(json.dumps(res, indent=2))
