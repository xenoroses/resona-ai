import React from 'react';
import { Cpu, CheckCircle2, Terminal as TerminalIcon } from 'lucide-react';

export default function AgentTelemetry({ currentPodcast }) {
  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="bg-[#1A1D27] border border-[#2B3042] rounded-xl p-5 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#2B3042]">
          <div className="w-9 h-9 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/40 flex items-center justify-center text-[#6366F1]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">CrewAI & LangGraph Agent Telemetry</h3>
            <p className="text-xs text-[#94A3B8]">System execution logs and agent thought breakdowns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-[#0F1117] border border-[#2B3042] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#818CF8] font-mono text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1. Tech Researcher</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Parsed topic / whitepaper URL, extracted architecture insights, and structured research takeaways.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0F1117] border border-[#2B3042] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#6366F1] font-mono text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>2. Podcast Scriptwriter</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Structured 2-host podcast dialogue between Alex (Host A) and Sam (Host B) with natural conversational flow.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0F1117] border border-[#2B3042] space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3. Audio Synthesizer</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Rendered dual-voice neural audio (`en-US-GuyNeural` & `en-US-JennyNeural`) and calculated timecodes.
            </p>
          </div>
        </div>
      </div>

      {currentPodcast && (
        <div className="bg-[#1A1D27] border border-[#2B3042] rounded-xl p-4 space-y-3 font-mono text-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-[#6366F1]" /> Active Session Specs
          </h4>
          <div className="grid grid-cols-2 gap-2.5 p-3 bg-[#0F1117] rounded-lg border border-[#2B3042] text-[11px]">
            <div><span className="text-[#64748B]">Episode ID:</span> {currentPodcast.id}</div>
            <div><span className="text-[#64748B]">Audio Length:</span> {currentPodcast.durationSec}s</div>
            <div><span className="text-[#64748B]">Dialogue Turns:</span> {currentPodcast.dialogue.length}</div>
            <div><span className="text-[#64748B]">TTS Engine:</span> {currentPodcast.engine}</div>
          </div>
        </div>
      )}
    </div>
  );
}
