import os
import sys
import json
from typing import Dict, List, Any, TypedDict

# Add parent directory to sys.path for robust imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from crew_agents import ResonaCrewEngine
from audio_renderer import ResonaAudioRenderer

class ResonaState(TypedDict):
    topic: str
    target_duration: str
    status: str
    research_summary: str
    title: str
    dialogue: List[Dict[str, str]]
    audio_meta: Dict[str, Any]
    error: str


class ResonaGraphWorkflow:
    def __init__(self):
        self.crew = ResonaCrewEngine()
        self.renderer = ResonaAudioRenderer()

    def step_research_and_script(self, state: ResonaState) -> ResonaState:
        topic = state.get("topic", "Agentic AI")
        duration = state.get("target_duration", "medium")

        crew_res = self.crew.run_crew(topic, duration)

        state["title"] = crew_res.get("title", f"Resona AI: {topic}")
        state["research_summary"] = crew_res.get("research_summary", "Multi-agent analysis completed.")
        state["dialogue"] = crew_res.get("dialogue", [])
        state["status"] = "SCRIPT_DRAFTED"
        return state

    def step_update_script(self, state: ResonaState, updated_dialogue: List[Dict[str, str]]) -> ResonaState:
        state["dialogue"] = updated_dialogue
        state["status"] = "SCRIPT_APPROVED"
        return state

    def step_render_audio(self, state: ResonaState, filename: str = "podcast.mp3") -> ResonaState:
        dialogue = state.get("dialogue", [])
        if not dialogue:
            state["error"] = "No dialogue available to render audio."
            return state

        audio_res = self.renderer.render(dialogue, filename)
        state["audio_meta"] = audio_res
        state["status"] = "COMPLETED"
        return state

    def execute_pipeline(self, topic: str, duration: str = "medium", filename: str = "podcast.mp3") -> ResonaState:
        state: ResonaState = {
            "topic": topic,
            "target_duration": duration,
            "status": "INITIALIZED",
            "research_summary": "",
            "title": "",
            "dialogue": [],
            "audio_meta": {},
            "error": ""
        }

        state = self.step_research_and_script(state)
        state = self.step_render_audio(state, filename)
        return state


if __name__ == "__main__":
    workflow = ResonaGraphWorkflow()
    res = workflow.execute_pipeline("The Future of Agentic Workflows in 2026")
    print(json.dumps(res, indent=2))
