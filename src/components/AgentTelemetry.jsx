import React from 'react';
import { Cpu, CheckCircle2, Terminal as TerminalIcon } from 'lucide-react';

export default function AgentTelemetry({ currentPodcast }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="antigravity-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#2B3042]">
          <div className="w-10 h-10 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/40 flex items-center justify-center text-[#6366F1]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">CrewAI & LangGraph Multi-Agent Telemetry</h3>
            <p className="text-xs text-[#94A3B8]">Execution logs and agent thought breakdowns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0F1117] border border-[#2B3042] space-y-2">
            <div className="flex items-center space-x-2 text-[#818CF8] font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Tech Researcher</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Parsed input topic/URL, extracted core architecture points, pros & cons, and structured research takeaways.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0F1117] border border-[#2B3042] space-y-2">
            <div className="flex items-center space-x-2 text-[#6366F1] font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Podcast Scriptwriter</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Structured natural 2-host podcast script between Alex (Inquisitive Host) and Sam (Domain Expert).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0F1117] border border-[#2B3042] space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Audio Synthesizer</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Rendered dual-voice neural audio (`en-US-GuyNeural` & `en-US-JennyNeural`) and exported timecode indexes.
            </p>
          </div>
        </div>
      </div>

      {currentPodcast && (
        <div className="antigravity-card rounded-2xl p-5 space-y-3 font-mono text-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-[#6366F1]" /> Current Episode Metadata
          </h4>
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#0F1117] rounded-xl border border-[#2B3042] text-[11px]">
            <div><span className="text-[#94A3B8]">Episode ID:</span> {currentPodcast.id}</div>
            <div><span className="text-[#94A3B8]">Duration:</span> {currentPodcast.durationSec}s</div>
            <div><span className="text-[#94A3B8]">Dialogue Turns:</span> {currentPodcast.dialogue.length}</div>
            <div><span className="text-[#94A3B8]">TTS Engine:</span> {currentPodcast.engine}</div>
          </div>
        </div>
      )}
    </div>
  );
}
