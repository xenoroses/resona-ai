import sys
import os
import json
import argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from graph_workflow import ResonaGraphWorkflow


def run_cli_interactive(topic: str = None):
    """Interactive Command-Line Podcast Generator"""
    workflow = ResonaGraphWorkflow()

    print("=" * 70)
    print("   Resona AI - Autonomous Multi-Agent Podcast & Audio Engine v2.4")
    print("   CrewAI + LangGraph HITL + Edge-TTS Dual-Voice Synthesizer")
    print("=" * 70 + "\n")

    if not topic:
        topic = input("Enter a topic or paper title to produce podcast for > ").strip()

    if not topic:
        topic = "Multi-Agent AI Systems in Enterprise"

    print(f"\n[Resona Engine] Researching and drafting 2-host dialogue script for: '{topic}'...")
    res = workflow.execute_pipeline(topic, filename=f"resona_{int(os.path.getmtime(__file__))}.mp3")

    print("\n" + "=" * 70)
    print(f"  🎙️ EPISODE TITLE: {res['title']}")
    print("=" * 70)
    print(f"  📝 RESEARCH SUMMARY: {res['research_summary']}\n")

    print("  --- DIALOGUE TRANSCRIPT ---")
    for turn in res["dialogue"]:
        speaker = turn.get("speaker", "Host")
        text = turn.get("text", "")
        color = "\033[96m" if speaker == "Alex" else "\033[93m"
        print(f"  {color}{speaker}:\033[0m {text}")

    print("\n" + "=" * 70)
    meta = res.get("audio_meta", {})
    print(f"  🔊 AUDIO GENERATED: {meta.get('audio_file')}")
    print(f"  ⏱️ DURATION: {meta.get('total_duration_sec')} seconds")
    print(f"  ⚙️ ENGINE: {meta.get('engine')}")
    print("=" * 70 + "\n")


def run_unit_tests():
    """Automated NLP & Audio Engine Verification Suite"""
    workflow = ResonaGraphWorkflow()
    print("[TEST SUITE] Executing Resona AI Multi-Agent & Audio Tests...")

    res = workflow.execute_pipeline("Generative AI Systems Test", filename="test_podcast.mp3")
    assert res["status"] == "COMPLETED", "Pipeline execution failed!"
    assert len(res["dialogue"]) > 0, "No dialogue generated!"
    assert os.path.exists(res["audio_meta"]["audio_file"]), "Audio file missing!"

    print("  -> Topic:", res["topic"])
    print("  -> Episode Title:", res["title"])
    print("  -> Dialogue Turns:", len(res["dialogue"]))
    print("  -> Audio File Exists:", res["audio_meta"]["audio_file"])
    print("\033[92m[SUCCESS] All Resona Core tests passed cleanly.\033[0m")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Resona AI Core Engine Runner")
    parser.add_argument("--cli", type=str, nargs="?", const="default", help="Run interactive CLI podcast generator")
    parser.add_argument("--test", action="store_true", help="Run automated test suite")
    parser.add_argument("--json", type=str, help="Generate podcast for input topic string and return JSON")

    args = parser.parse_args()

    if args.test:
        run_unit_tests()
    elif args.json:
        workflow = ResonaGraphWorkflow()
        res = workflow.execute_pipeline(args.json)
        print(json.dumps(res, indent=2))
    elif args.cli:
        topic_arg = None if args.cli == "default" else args.cli
        run_cli_interactive(topic_arg)
    else:
        workflow = ResonaGraphWorkflow()
        res = workflow.execute_pipeline("Multi-Agent AI Engineering")
        print(json.dumps(res, indent=2))
