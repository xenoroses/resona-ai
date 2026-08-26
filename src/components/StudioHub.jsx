import React, { useState } from 'react';
import { Sparkles, Globe, Upload, CheckCircle2, ArrowRight, Zap, Link, FileText, Code, Cpu } from 'lucide-react';

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
  const [activeSourceType, setActiveSourceType] = useState('topic');
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
      let content = event.target.result || '';
      // Truncate to 50,000 characters if file is extremely large
      if (content.length > 50000) {
        content = content.substring(0, 50000) + '\n\n[Text automatically trimmed to 50,000 characters for optimal LLM context efficiency.]';
      }
      setTopicInput(content);
      setUploadedCharCount(content.length);
    };

    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Frosted Glass Hero Banner */}
      <div className="glass-panel rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-300 font-bold uppercase">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Resona Audio Workstation v2.4</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gradient">
            Autonomous Multi-Agent Podcast Studio
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Synthesize technical papers, AWS architecture documents, or uploaded text files into studio-quality dual-host podcast episodes with neural voice synthesis.
          </p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center space-x-3 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          <span className="text-xs font-mono text-slate-200">CrewAI + LangGraph Active</span>
        </div>
      </div>

      {/* Main Frosted Glass Ingestion Card */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        
        {/* Source Type Tabs */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveSourceType('topic')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSourceType === 'topic'
                ? 'btn-gradient-primary'
                : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topic / Prompt</span>
          </button>

          <button
            onClick={() => setActiveSourceType('url')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSourceType === 'url'
                ? 'btn-gradient-primary'
                : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>AWS Whitepaper / URL</span>
          </button>

          <button
            onClick={() => setActiveSourceType('file')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSourceType === 'file'
                ? 'btn-gradient-primary'
                : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document (.txt / .pdf)</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {activeSourceType === 'file' ? (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-white/10 hover:border-purple-400 rounded-2xl p-6 text-center cursor-pointer transition-all bg-white/[0.02] backdrop-blur-xl relative">
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.doc,.docx,.json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <span className="block text-xs font-bold text-white">
                  Drop Document File (.txt, .md, .pdf)
                </span>
                <span className="block text-[11px] text-slate-400 font-mono mt-1">
                  Extracted text will be analyzed by the CrewAI Research Agent
                </span>
              </div>

              {uploadedFileName && (
                <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 p-3 rounded-xl backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>File Loaded: <strong>{uploadedFileName}</strong> ({uploadedCharCount.toLocaleString()} chars)</span>
                </div>
              )}

              {topicInput && (
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Extracted Document Text:</label>
                  <textarea
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    rows={4}
                    className="w-full glass-input rounded-xl p-3.5 text-xs text-white font-mono"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                {activeSourceType === 'topic' ? 'Target Topic Prompt' : 'AWS Whitepaper / Article URL'}
              </label>
              
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={
                  activeSourceType === 'url'
                    ? 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html'
                    : 'e.g. Multi-Agent AI Architecture with CrewAI & LangGraph'
                }
                disabled={isGenerating}
                className="w-full glass-input rounded-xl p-4 text-sm text-white placeholder-slate-500 font-mono"
              />
            </div>
          )}

          {activeSourceType === 'url' && (
            <div className="pt-1 space-y-2">
              <span className="text-[11px] font-mono text-purple-300 flex items-center gap-1.5 font-semibold">
                <Link className="w-3.5 h-3.5 text-indigo-400" /> Official AWS Whitepaper Presets:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AWS_WHITEPAPER_PRESETS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopicInput(item.url)}
                    className="text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-xs transition-all flex items-center justify-between backdrop-blur-md"
                  >
                    <span className="font-semibold text-slate-200 truncate mr-2">{item.title}</span>
                    <span className="text-[10px] font-mono text-purple-300 shrink-0 font-bold px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-mono">Podcast Length:</span>
              <div className="flex items-center space-x-1 bg-white/[0.03] p-1 rounded-xl border border-white/10 backdrop-blur-md">
                {[
                  { id: 'short', label: '⚡ 2-min' },
                  { id: 'medium', label: '🎙️ 5-min' },
                  { id: 'deep', label: '🧠 10-min' }
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setTargetDuration(dur.id)}
                    className={`text-xs font-mono px-3 py-1 rounded-lg transition-all ${
                      targetDuration === dur.id
                        ? 'btn-gradient-primary font-bold'
                        : 'text-slate-400 hover:text-white'
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
              className="px-6 py-3.5 rounded-xl btn-gradient-primary text-xs font-extrabold flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-xl"
            >
              <span>{isGenerating ? 'Agents Synthesizing...' : 'Run Agent Pipeline'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Preset Topics Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400" /> Architectural Benchmark Topics
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAMPLE_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSourceType('topic');
                setTopicInput(topic.title);
              }}
              className="text-left p-4 rounded-2xl glass-panel-interactive group"
            >
              <h5 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                {topic.title}
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {topic.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
