import React, { useState, useEffect } from 'react';
import { Radio, Edit3, Volume2, Cpu, Sparkles } from 'lucide-react';
import StudioHub from './components/StudioHub.jsx';
import ScriptEditor from './components/ScriptEditor.jsx';
import AudioPlayerView from './components/AudioPlayerView.jsx';
import AgentTelemetry from './components/AgentTelemetry.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('hub');
  const [podcasts, setPodcasts] = useState([]);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(true);

  const fetchPodcasts = async () => {
    try {
      const res = await fetch('/api/podcasts');
      if (res.ok) {
        const data = await res.json();
        setPodcasts(data.podcasts || []);
        if (data.podcasts && data.podcasts.length > 0 && !currentPodcast) {
          setCurrentPodcast(data.podcasts[0]);
        }
        setIsServerConnected(true);
      }
    } catch (err) {
      console.warn('Resona API Server offline:', err.message);
      setIsServerConnected(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleGeneratePodcast = async (topic, duration) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, duration })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentPodcast(data.podcast);
        setPodcasts((prev) => [data.podcast, ...prev]);
        setActiveTab('player');
        setIsServerConnected(true);
      }
    } catch (err) {
      console.error('Failed to generate podcast:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRenderCustomAudio = async (customScriptPayload) => {
    setIsRendering(true);
    try {
      const res = await fetch('/api/render-custom-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customScriptPayload)
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentPodcast(data.podcast);
        setPodcasts((prev) => [data.podcast, ...prev]);
        setActiveTab('player');
        setIsServerConnected(true);
      }
    } catch (err) {
      console.error('Failed to render custom audio:', err);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#F8FAFC] font-sans flex flex-col justify-between">
      
      {/* Antigravity Header Navbar */}
      <header className="h-14 border-b border-[#2B3042] bg-[#0F1117] px-4 md:px-6 flex items-center justify-between">
        
        {/* Antigravity Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/40 flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#6366F1]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h1 className="text-base font-bold tracking-tight text-[#F8FAFC]">Resona AI</h1>
            <span className="text-[10px] font-mono text-[#6366F1] font-semibold bg-[#6366F1]/10 px-2 py-0.5 rounded border border-[#6366F1]/30">
              v2.4
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-[#1A1D27] p-1 rounded-xl border border-[#2B3042]">
          <button
            onClick={() => setActiveTab('hub')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'hub'
                ? 'bg-[#6366F1] text-white font-semibold shadow-md shadow-[#6366F1]/20'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222634]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-[#6366F1] text-white font-semibold shadow-md shadow-[#6366F1]/20'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222634]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Script Editor (HITL)</span>
          </button>

          <button
            onClick={() => setActiveTab('player')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'player'
                ? 'bg-[#6366F1] text-white font-semibold shadow-md shadow-[#6366F1]/20'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222634]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio Player & Transcript</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'telemetry'
                ? 'bg-[#6366F1] text-white font-semibold shadow-md shadow-[#6366F1]/20'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222634]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Agent Telemetry</span>
          </button>
        </nav>

        {/* Server Status Pill */}
        <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8]">
          <span className={`w-2 h-2 rounded-full ${isServerConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="hidden md:inline">{isServerConnected ? 'Engine Online' : 'Engine Offline'}</span>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {activeTab === 'hub' && (
          <StudioHub
            onGeneratePodcast={handleGeneratePodcast}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'editor' && (
          <ScriptEditor
            currentPodcast={currentPodcast}
            onRenderCustomAudio={handleRenderCustomAudio}
            isRendering={isRendering}
          />
        )}

        {activeTab === 'player' && (
          <AudioPlayerView currentPodcast={currentPodcast} />
        )}

        {activeTab === 'telemetry' && (
          <AgentTelemetry currentPodcast={currentPodcast} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2B3042] py-2.5 px-6 text-center text-xs font-mono text-[#64748B]">
        Resona AI • Antigravity UI System • Python 3.13 + Node.js 24 + React 18
      </footer>
    </div>
  );
}
