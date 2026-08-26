import React, { useState } from 'react';
import { Radio, Sparkles, Globe, Upload, CheckCircle2, ArrowRight, Zap, Link } from 'lucide-react';

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
      <div className="nordic-card rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Radio className="w-8 h-8 text-[#2DD4BF]" />
        </div>
        <h2 className="text-2xl font-bold text-[#F0F9FF] mb-2 tracking-tight">
          Resona Audio Workstation
        </h2>
        <p className="text-sm text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
          Transform topics, AWS whitepapers, or uploaded documents (.txt / .md / .pdf) into a dual-host podcast episode.
        </p>
      </div>

      {/* Main Source Ingestion Box */}
      <div className="nordic-card rounded-2xl p-6 space-y-5">
        
        {/* Source Type Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#222F43] pb-3">
          <button
            onClick={() => setActiveSourceType('topic')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSourceType === 'topic'
                ? 'bg-[#0C131D] text-[#2DD4BF] border border-[#222F43]'
                : 'text-[#94A3B8] hover:text-[#F0F9FF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topic / Prompt</span>
          </button>

          <button
            onClick={() => setActiveSourceType('url')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSourceType === 'url'
                ? 'bg-[#0C131D] text-[#2DD4BF] border border-[#222F43]'
                : 'text-[#94A3B8] hover:text-[#F0F9FF]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>AWS Whitepaper / URL</span>
          </button>

          <button
            onClick={() => setActiveSourceType('file')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSourceType === 'file'
                ? 'bg-[#0C131D] text-[#2DD4BF] border border-[#222F43]'
                : 'text-[#94A3B8] hover:text-[#F0F9FF]'
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
              <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider">
                Upload File or Document Text
              </label>
              
              <div className="border-2 border-dashed border-[#222F43] hover:border-[#2DD4BF] rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-[#0C131D]">
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.doc,.docx,.json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-[#2DD4BF] mx-auto mb-2" />
                <span className="block text-xs font-bold text-[#F0F9FF]">
                  Click to Browse or Drag & Drop Document
                </span>
                <span className="block text-[11px] text-[#94A3B8] mt-1 font-mono">
                  Supports .txt, .md, .pdf, .doc, .docx, .json files
                </span>
              </div>

              {uploadedFileName && (
                <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>File Loaded: <strong>{uploadedFileName}</strong> ({uploadedCharCount.toLocaleString()} characters)</span>
                </div>
              )}

              {topicInput && (
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">
                    Extracted Text Preview:
                  </label>
                  <textarea
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    rows={4}
                    className="w-full bg-[#0C131D] border border-[#222F43] rounded-xl p-3 text-xs text-[#F0F9FF] font-mono focus:outline-none focus:border-[#2DD4BF]"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase tracking-wider">
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
                className="w-full bg-[#0C131D] border border-[#222F43] rounded-xl p-3.5 text-sm text-[#F0F9FF] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>
          )}

          {activeSourceType === 'url' && (
            <div className="pt-1 space-y-2">
              <span className="text-[11px] font-mono text-[#94A3B8] flex items-center gap-1">
                <Link className="w-3 h-3 text-[#2DD4BF]" /> Official AWS Whitepaper Test Links:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AWS_WHITEPAPER_PRESETS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopicInput(item.url)}
                    className="text-left p-2.5 rounded-lg bg-[#0C131D] hover:bg-[#1E2C3F] border border-[#222F43] text-xs transition-all flex items-center justify-between"
                  >
                    <span className="font-semibold text-[#F0F9FF] truncate mr-2">{item.title}</span>
                    <span className="text-[10px] font-mono text-[#2DD4BF] shrink-0 font-bold px-1.5 py-0.5 rounded bg-[#151F2C]">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[#222F43]">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#94A3B8] font-mono">Target Duration:</span>
              <div className="flex items-center space-x-1 bg-[#0C131D] p-1 rounded-xl border border-[#222F43]">
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
                        ? 'bg-[#2DD4BF] text-[#0C131D] font-bold shadow-md'
                        : 'text-[#94A3B8] hover:text-[#F0F9FF]'
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
              className="px-6 py-3 rounded-xl bg-[#2DD4BF] hover:bg-[#38BDF8] text-[#0C131D] font-bold text-xs flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#2DD4BF]/20 shrink-0"
            >
              <span>{isGenerating ? 'Agents At Work...' : 'Generate Episode'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Preset Sample Topic Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#2DD4BF]" /> Explore Sample Topics
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAMPLE_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSourceType('topic');
                setTopicInput(topic.title);
              }}
              className="text-left p-4 rounded-xl bg-[#151F2C] hover:bg-[#1E2C3F] border border-[#222F43] transition-all group"
            >
              <h5 className="text-xs font-bold text-[#F0F9FF] group-hover:text-[#2DD4BF] transition-colors mb-1">
                {topic.title}
              </h5>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {topic.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
