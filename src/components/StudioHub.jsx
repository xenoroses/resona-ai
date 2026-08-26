import React, { useState } from 'react';
import { Radio, Sparkles, FileText, Globe, Cpu, ArrowRight, Zap } from 'lucide-react';

const SAMPLE_TOPICS = [
  { title: "Agentic AI Engineering", desc: "Multi-agent systems using CrewAI, LangGraph, and Model Context Protocol (MCP)." },
  { title: "AWS Cloud Architecture 2026", desc: "Serverless event-driven microservices, Bedrock LLM orchestrations, and DynamoDB." },
  { title: "Quantum Machine Learning", desc: "Hybrid variational quantum-classical algorithms for cryptography and optimization." },
  { title: "Sub-100ms Low Latency Systems", desc: "Rust, WebRTC, and ONNX Runtime for real-time edge AI inference." }
];

export default function StudioHub({ onGeneratePodcast, isGenerating }) {
  const [topicInput, setTopicInput] = useState('');
  const [targetDuration, setTargetDuration] = useState('medium'); // 'short' | 'medium' | 'deep'
  const [activeSourceType, setActiveSourceType] = useState('topic'); // 'topic' | 'url' | 'pdf'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topicInput.trim() || isGenerating) return;
    onGeneratePodcast(topicInput.trim(), targetDuration);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="resona-card rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#D97757]/15 border border-[#D97757]/40 flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Radio className="w-8 h-8 text-[#D97757]" />
        </div>
        <h2 className="text-2xl font-bold text-[#F4F4F5] mb-2 tracking-tight">
          Resona AI Podcast Studio
        </h2>
        <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto leading-relaxed">
          Transform any topic, technical paper, or raw text into an engaging, multi-agent dual-host podcast episode with dual-voice neural synthesis.
        </p>
      </div>

      {/* Main Source Ingestion Box */}
      <div className="resona-card rounded-2xl p-6 space-y-5">
        
        {/* Source Type Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#3F3F46] pb-3">
          <button
            onClick={() => setActiveSourceType('topic')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSourceType === 'topic'
                ? 'bg-[#18181B] text-[#D97757] border border-[#3F3F46]'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topic / Prompt</span>
          </button>

          <button
            onClick={() => setActiveSourceType('url')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSourceType === 'url'
                ? 'bg-[#18181B] text-[#D97757] border border-[#3F3F46]'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web URL / Article</span>
          </button>

          <button
            onClick={() => setActiveSourceType('pdf')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSourceType === 'pdf'
                ? 'bg-[#18181B] text-[#D97757] border border-[#3F3F46]'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Raw Text / Paper</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#A1A1AA] mb-2 uppercase tracking-wider">
              {activeSourceType === 'topic' ? 'Enter Topic or Title' : activeSourceType === 'url' ? 'Enter Article / Repository URL' : 'Paste Document / Abstract Text'}
            </label>
            
            {activeSourceType === 'pdf' ? (
              <textarea
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Paste research paper abstract, document notes, or technical specifications here..."
                rows={4}
                disabled={isGenerating}
                className="w-full bg-[#18181B] border border-[#3F3F46] rounded-xl p-3.5 text-sm text-[#F4F4F5] placeholder-[#71717A] focus:outline-none focus:border-[#D97757]"
              />
            ) : (
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={activeSourceType === 'url' ? 'https://arxiv.org/abs/2401.12345 or https://github.com/...' : 'e.g. Multi-Agent Systems with CrewAI and LangGraph'}
                disabled={isGenerating}
                className="w-full bg-[#18181B] border border-[#3F3F46] rounded-xl p-3.5 text-sm text-[#F4F4F5] placeholder-[#71717A] focus:outline-none focus:border-[#D97757]"
              />
            )}
          </div>

          {/* Target Podcast Length Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#A1A1AA] font-mono">Target Duration:</span>
              <div className="flex items-center space-x-1 bg-[#18181B] p-1 rounded-xl border border-[#3F3F46]">
                {[
                  { id: 'short', label: '⚡ 2-min Digest' },
                  { id: 'medium', label: '🎙️ 5-min Standard' },
                  { id: 'deep', label: '🧠 10-min Deep Dive' }
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setTargetDuration(dur.id)}
                    className={`text-xs font-mono px-3 py-1 rounded-lg transition-colors ${
                      targetDuration === dur.id
                        ? 'bg-[#D97757] text-white font-bold'
                        : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !topicInput.trim()}
              className="px-6 py-3 rounded-xl bg-[#D97757] hover:bg-[#C8654B] text-white font-bold text-xs flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shrink-0"
            >
              <span>{isGenerating ? 'Agents At Work...' : 'Generate Episode'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Preset Sample Topic Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] font-mono flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#D97757]" /> Explore Sample Episodes
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAMPLE_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => setTopicInput(topic.title)}
              className="text-left p-4 rounded-xl bg-[#27272A] hover:bg-[#3F3F46]/80 border border-[#3F3F46]/60 transition-all group"
            >
              <h5 className="text-xs font-bold text-[#F4F4F5] group-hover:text-[#D97757] transition-colors mb-1">
                {topic.title}
              </h5>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                {topic.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
