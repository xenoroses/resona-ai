import React from 'react';
import { Cpu, CheckCircle2, ShieldCheck, Terminal as TerminalIcon, Sparkles } from 'lucide-react';

export default function AgentTelemetry({ currentPodcast }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Agent Status Card */}
      <div className="resona-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#3F3F46]">
          <div className="w-10 h-10 rounded-xl bg-[#D97757]/15 border border-[#D97757]/40 flex items-center justify-center text-[#D97757]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F4F4F5]">CrewAI & LangGraph Multi-Agent Telemetry</h3>
            <p className="text-xs text-[#A1A1AA]">Execution logs and agent thought breakdowns</p>
          </div>
        </div>

        {/* 3-Agent Workflow Execution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#18181B] border border-[#3F3F46] space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Tech Researcher</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Parsed input topic/URL, extracted core architecture points, pros & cons, and structured research takeaways.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#18181B] border border-[#3F3F46] space-y-2">
            <div className="flex items-center space-x-2 text-[#D97757] font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Podcast Scriptwriter</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Structured natural 2-host podcast script between Alex (Inquisitive Host) and Sam (Domain Expert).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#18181B] border border-[#3F3F46] space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Audio Synthesizer</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Rendered dual-voice neural audio (`en-US-GuyNeural` & `en-US-JennyNeural`) and exported timecode indexes.
            </p>
          </div>
        </div>
      </div>

      {/* Current Podcast Telemetry Data */}
      {currentPodcast && (
        <div className="resona-card rounded-2xl p-5 space-y-3 font-mono text-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-[#D97757]" /> Current Episode Metadata
          </h4>
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#18181B] rounded-xl border border-[#3F3F46] text-[11px]">
            <div><span className="text-[#71717A]">Episode ID:</span> {currentPodcast.id}</div>
            <div><span className="text-[#71717A]">Duration:</span> {currentPodcast.durationSec}s</div>
            <div><span className="text-[#71717A]">Dialogue Turns:</span> {currentPodcast.dialogue.length}</div>
            <div><span className="text-[#71717A]">TTS Engine:</span> {currentPodcast.engine}</div>
          </div>
        </div>
      )}
    </div>
  );
}
