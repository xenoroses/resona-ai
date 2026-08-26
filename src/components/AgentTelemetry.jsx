import React from 'react';
import { Cpu, CheckCircle2, Terminal as TerminalIcon } from 'lucide-react';

export default function AgentTelemetry({ currentPodcast }) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0B0D17] rounded-[14px] flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">CrewAI & LangGraph Agent Telemetry</h3>
            <p className="text-xs text-slate-400">System execution logs and agent thought breakdowns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl glass-panel-interactive space-y-2">
            <div className="flex items-center space-x-2 text-purple-300 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>1. Tech Researcher</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Parsed topic / whitepaper URL, extracted architecture insights, and structured research takeaways.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel-interactive space-y-2">
            <div className="flex items-center space-x-2 text-purple-300 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>2. Podcast Scriptwriter</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Structured 2-host podcast dialogue between Alex (Host A) and Sam (Host B) with natural conversational flow.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel-interactive space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Audio Synthesizer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Rendered dual-voice neural audio (`en-US-GuyNeural` & `en-US-JennyNeural`) and calculated timecodes.
            </p>
          </div>
        </div>
      </div>

      {currentPodcast && (
        <div className="glass-panel rounded-2xl p-5 space-y-3 font-mono text-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-indigo-400" /> Active Session Specs
          </h4>
          <div className="grid grid-cols-2 gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/10 text-[11px]">
            <div><span className="text-slate-500">Episode ID:</span> <span className="text-slate-300">{currentPodcast.id}</span></div>
            <div><span className="text-slate-500">Audio Length:</span> <span className="text-slate-300">{currentPodcast.durationSec}s</span></div>
            <div><span className="text-slate-500">Dialogue Turns:</span> <span className="text-slate-300">{currentPodcast.dialogue.length}</span></div>
            <div><span className="text-slate-500">TTS Engine:</span> <span className="text-slate-300">{currentPodcast.engine}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
