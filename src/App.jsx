import React, { useState, useEffect } from 'react';
import {
  Radio,
  Edit3,
  Volume2,
  Cpu,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  Folder,
  Play,
  Pause,
  Download,
  Activity,
  Layers
} from 'lucide-react';
import StudioHub from './components/StudioHub.jsx';
import ScriptEditor from './components/ScriptEditor.jsx';
import AudioPlayerView from './components/AudioPlayerView.jsx';
import AgentTelemetry from './components/AgentTelemetry.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('hub');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [podcasts, setPodcasts] = useState([]);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(true);

  // Audio Dock State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = React.useRef(null);

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

  const handleGeneratePodcast = async (topic, durationVal) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, duration: durationVal })
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

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (timeSec) => {
    const min = Math.floor(timeSec / 60);
    const sec = Math.floor(timeSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0B0D17] via-[#101426] to-[#0A0D18] text-[#F8FAFC] font-sans flex flex-col overflow-hidden relative">
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* HTML5 Audio Player */}
      {currentPodcast && (
        <audio
          ref={audioRef}
          src={currentPodcast.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* 1. FROSTED GLASS TOP HEADER */}
      <header className="h-14 border-b border-white/[0.08] bg-[#0B0D17]/70 backdrop-blur-xl px-5 flex items-center justify-between shrink-0 select-none z-20">
        
        {/* Brand Logo & Gradient Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-[#D97757] p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0B0D17] rounded-[10px] flex items-center justify-center">
              <Radio className="w-4 h-4 text-purple-400" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <h1 className="text-base font-extrabold tracking-tight text-gradient">Resona AI</h1>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              Glass Studio
            </span>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="hidden md:flex items-center bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-slate-400 space-x-2 w-96 backdrop-blur-md">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="flex-1 truncate">Search transcripts, documents, or AWS papers...</span>
          <kbd className="bg-white/5 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10 text-slate-400">⌘K</kbd>
        </div>

        {/* Engine Status */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-purple-300 bg-white/[0.04] px-3 py-1 rounded-xl border border-white/10 flex items-center gap-2 backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${isServerConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'}`} />
            <span>{isServerConnected ? 'Python Core Online' : 'Offline'}</span>
          </span>
        </div>
      </header>

      {/* 2. MAIN GLASS WORKSPACE CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* FROSTED GLASS LEFT SIDEBAR */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} border-r border-white/[0.08] bg-[#0F1221]/50 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 shrink-0 select-none`}>
          
          <div className="p-3 space-y-1.5">
            <button
              onClick={() => setActiveTab('hub')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'hub'
                  ? 'btn-gradient-primary'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Studio Hub</span>}
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'btn-gradient-primary'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Scriptboard (HITL)</span>}
            </button>

            <button
              onClick={() => setActiveTab('player')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'player'
                  ? 'btn-gradient-primary'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Audio Timeline</span>}
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'telemetry'
                  ? 'btn-gradient-primary'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Agent Telemetry</span>}
            </button>
          </div>

          {/* Episodes Explorer Drawer */}
          {isSidebarOpen && (
            <div className="flex-1 p-3 overflow-y-auto border-t border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-indigo-400" /> Episodes ({podcasts.length})
                </span>
              </div>

              <div className="space-y-1.5">
                {podcasts.map((pod) => (
                  <button
                    key={pod.id}
                    onClick={() => {
                      setCurrentPodcast(pod);
                      setActiveTab('player');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      currentPodcast?.id === pod.id
                        ? 'bg-purple-500/10 border-purple-500/40 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <div className="font-bold truncate">{pod.title}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {pod.durationSec}s • {pod.dialogue?.length || 0} turns
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sidebar Toggle Footer */}
          <div className="p-3 border-t border-white/[0.08] flex justify-end">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/10 backdrop-blur-md"
            >
              {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* CENTER WORKSPACE WORKSTATION */}
        <main className="flex-1 overflow-y-auto p-6 relative">
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
      </div>

      {/* 3. FLOATING GLASS AUDIO PLAYER DOCK */}
      {currentPodcast && (
        <div className="h-16 border-t border-white/[0.1] bg-[#0F1221]/80 backdrop-blur-2xl px-6 flex items-center justify-between shrink-0 select-none shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-30">
          
          <div className="flex items-center space-x-3 w-1/4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl btn-gradient-primary flex items-center justify-center shadow-lg active:scale-95 shrink-0"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{currentPodcast.title}</div>
              <div className="text-[10px] font-mono text-purple-300 truncate">{currentPodcast.topic}</div>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8 space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = val;
                setCurrentTime(val);
              }}
              className="w-full accent-purple-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-indigo-300 bg-white/[0.05] px-3 py-1 rounded-xl border border-white/10 backdrop-blur-md">
              Edge-TTS Neural
            </span>
            <a
              href={currentPodcast.audioUrl}
              download={`${currentPodcast.title}.mp3`}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-purple-300 border border-white/10 transition-colors"
              title="Download MP3"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
