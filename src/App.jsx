import React, { useState, useEffect } from 'react';
import { Radio, Edit3, Volume2, Cpu, Plus, Sparkles, RefreshCw } from 'lucide-react';
import StudioHub from './components/StudioHub.jsx';
import ScriptEditor from './components/ScriptEditor.jsx';
import AudioPlayerView from './components/AudioPlayerView.jsx';
import AgentTelemetry from './components/AgentTelemetry.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'editor' | 'player' | 'telemetry'
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
    <div className="min-h-screen bg-[#18181B] text-[#F4F4F5] font-sans flex flex-col justify-between">
      
      {/* Top Claude Navbar */}
      <header className="h-14 border-b border-[#27272A] bg-[#18181B] px-4 md:px-6 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#D97757]/15 border border-[#D97757]/40 flex items-center justify-center shadow-sm">
            <Radio className="w-4 h-4 text-[#D97757]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h1 className="text-base font-bold tracking-tight text-[#F4F4F5]">Resona AI</h1>
            <span className="text-[10px] font-mono text-[#D97757] font-semibold">v2.4</span>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="flex items-center space-x-1 bg-[#27272A] p-1 rounded-xl border border-[#3F3F46]/50">
          <button
            onClick={() => setActiveTab('hub')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'hub'
                ? 'bg-[#18181B] text-[#D97757] font-semibold shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-[#18181B] text-[#D97757] font-semibold shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Script Editor (HITL)</span>
          </button>

          <button
            onClick={() => setActiveTab('player')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'player'
                ? 'bg-[#18181B] text-[#D97757] font-semibold shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio Player & Transcript</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'telemetry'
                ? 'bg-[#18181B] text-[#D97757] font-semibold shadow-sm'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Agent Telemetry</span>
          </button>
        </nav>

        {/* Server Status Indicator */}
        <div className="flex items-center space-x-1.5 text-xs font-mono text-[#A1A1AA]">
          <span className={`w-2 h-2 rounded-full ${isServerConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className="hidden md:inline">{isServerConnected ? 'Express + CrewAI Core Online' : 'Server Offline'}</span>
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
      <footer className="border-t border-[#27272A] py-2.5 px-6 text-center text-xs font-mono text-[#71717A]">
        Resona AI • Autonomous Multi-Agent Podcast & Audio Intelligence Studio
      </footer>
    </div>
  );
}
