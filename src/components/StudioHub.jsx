import React, { useState } from 'react';
import { Radio, Sparkles, FileText, Globe, Upload, CheckCircle2, ArrowRight, Zap, Link } from 'lucide-react';

const AWS_WHITEPAPER_PRESETS = [
  {
    title: "AWS Well-Architected Framework",
    url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
    category: "Architecture"
  },
  {
    title: "Multi-Agent Systems on AWS Bedrock",
    url: "https://aws.amazon.com/blogs/machine-learning/build-a-multi-agent-system-with-amazon-bedrock/",
    category: "AI & ML"
  },
  {
    title: "Serverless Multi-Region App Architecture",
    url: "https://aws.amazon.com/blogs/architecture/serverless-multi-region-application-architecture/",
    category: "Serverless"
  },
  {
    title: "AWS Cloud Best Practices Whitepaper",
    url: "https://d1.awsstatic.com/whitepapers/AWS_Cloud_Best_Practices.pdf",
    category: "Whitepaper"
  }
];

const SAMPLE_TOPICS = [
  { title: "Agentic AI Engineering 2026", desc: "Multi-agent systems using CrewAI, LangGraph, and Model Context Protocol (MCP)." },
  { title: "AWS Bedrock LLM Orchestration", desc: "Serverless event-driven microservices, Bedrock agents, and DynamoDB." },
  { title: "Quantum Machine Learning", desc: "Hybrid variational quantum-classical algorithms for cryptography and optimization." },
  { title: "Sub-100ms Low Latency Systems", desc: "Rust, WebRTC, and ONNX Runtime for real-time edge AI inference." }
];

export default function StudioHub({ onGeneratePodcast, isGenerating }) {
  const [topicInput, setTopicInput] = useState('');
  const [targetDuration, setTargetDuration] = useState('medium');
  const [activeSourceType, setActiveSourceType] = useState('topic'); // 'topic' | 'url' | 'file'
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadedCharCount, setUploadedCharCount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topicInput.trim() || isGenerating) return;
    onGeneratePodcast(topicInput.trim(), targetDuration);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      setTopicInput(content);
      setUploadedCharCount(content.length);
    };

    reader.readAsText(file);
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
          Transform any topic, AWS whitepaper URL, or uploaded document (.txt / .md / .pdf) into a studio-quality dual-host podcast episode.
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
            <span>AWS Whitepaper / Article URL</span>
          </button>

          <button
            onClick={() => setActiveSourceType('file')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSourceType === 'file'
                ? 'bg-[#18181B] text-[#D97757] border border-[#3F3F46]'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document (.txt / .md / .pdf)</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {activeSourceType === 'file' ? (
            <div className="space-y-3">
              <label className="block text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
                Upload File or Document Text
              </label>
              
              {/* File Browser Box */}
              <div className="border-2 border-dashed border-[#3F3F46] hover:border-[#D97757] rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-[#18181B]">
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.doc,.docx,.json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-[#D97757] mx-auto mb-2" />
                <span className="block text-xs font-bold text-[#F4F4F5]">
                  Click to Browse or Drag & Drop Document
                </span>
                <span className="block text-[11px] text-[#A1A1AA] mt-1 font-mono">
                  Supports .txt, .md, .pdf, .doc, .docx, .json files
                </span>
              </div>

              {uploadedFileName && (
                <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>File Loaded: <strong>{uploadedFileName}</strong> ({uploadedCharCount.toLocaleString()} characters)</span>
                </div>
              )}

              {/* Text Preview Area */}
              {topicInput && (
                <div>
                  <label className="block text-[11px] font-mono text-[#71717A] mb-1">
                    Extracted Text Preview:
                  </label>
                  <textarea
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    rows={4}
                    className="w-full bg-[#18181B] border border-[#3F3F46] rounded-xl p-3 text-xs text-[#F4F4F5] font-mono focus:outline-none focus:border-[#D97757]"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono text-[#A1A1AA] mb-2 uppercase tracking-wider">
                {activeSourceType === 'topic' ? 'Enter Topic or Title' : 'Enter Article / AWS Whitepaper URL'}
              </label>
              
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={
                  activeSourceType === 'url'
                    ? 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html'
                    : 'e.g. Multi-Agent AI Systems with CrewAI and LangGraph'
                }
                disabled={isGenerating}
                className="w-full bg-[#18181B] border border-[#3F3F46] rounded-xl p-3.5 text-sm text-[#F4F4F5] placeholder-[#71717A] focus:outline-none focus:border-[#D97757]"
              />
            </div>
          )}

          {/* Quick AWS Whitepaper Presets Bar (Shown when URL tab is active) */}
          {activeSourceType === 'url' && (
            <div className="pt-1 space-y-2">
              <span className="text-[11px] font-mono text-[#A1A1AA] flex items-center gap-1">
                <Link className="w-3 h-3 text-[#D97757]" /> Official AWS Whitepaper Test Links:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AWS_WHITEPAPER_PRESETS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopicInput(item.url)}
                    className="text-left p-2.5 rounded-lg bg-[#18181B] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs transition-all flex items-center justify-between"
                  >
                    <span className="font-semibold text-[#F4F4F5] truncate mr-2">{item.title}</span>
                    <span className="text-[10px] font-mono text-[#D97757] shrink-0 font-bold px-1.5 py-0.5 rounded bg-[#27272A]">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Length & Generate Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[#3F3F46]/60">
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
          <Zap className="w-3.5 h-3.5 text-[#D97757]" /> Explore Sample Topics
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAMPLE_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSourceType('topic');
                setTopicInput(topic.title);
              }}
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
