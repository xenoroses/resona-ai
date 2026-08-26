import React, { useState, useEffect } from 'react';
import { Radio, Edit3, Volume2, Cpu, Sparkles, Sliders } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0C131D] text-[#F0F9FF] font-sans flex flex-col justify-between">
      
      {/* Nordic Workstation Top Navbar */}
      <header className="h-14 border-b border-[#222F43] bg-[#0C131D]/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between">
        
        {/* Brand with Aquamarine Glow */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 flex items-center justify-center shadow-lg shadow-[#2DD4BF]/10">
            <Radio className="w-4 h-4 text-[#2DD4BF]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h1 className="text-base font-bold tracking-tight text-[#F0F9FF]">Resona AI</h1>
            <span className="text-[10px] font-mono text-[#2DD4BF] font-bold uppercase tracking-wider">
              Audio Workstation
            </span>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="flex items-center space-x-1 bg-[#151F2C] p-1 rounded-xl border border-[#222F43]">
          <button
            onClick={() => setActiveTab('hub')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'hub'
                ? 'bg-[#0C131D] text-[#2DD4BF] font-semibold border border-[#222F43] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F0F9FF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-[#0C131D] text-[#2DD4BF] font-semibold border border-[#222F43] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F0F9FF]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Script Editor (HITL)</span>
          </button>

          <button
            onClick={() => setActiveTab('player')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'player'
                ? 'bg-[#0C131D] text-[#2DD4BF] font-semibold border border-[#222F43] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F0F9FF]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio Player & Transcript</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'telemetry'
                ? 'bg-[#0C131D] text-[#2DD4BF] font-semibold border border-[#222F43] shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F0F9FF]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Agent Telemetry</span>
          </button>
        </nav>

        {/* Right Status */}
        <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8]">
          <span className={`w-2 h-2 rounded-full ${isServerConnected ? 'bg-[#2DD4BF] animate-pulse' : 'bg-rose-500'}`} />
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
      <footer className="border-t border-[#222F43] py-2.5 px-6 text-center text-xs font-mono text-[#94A3B8]">
        Resona AI • Nordic Audio Workstation • Dual-Voice Neural Engine
      </footer>
    </div>
  );
}
