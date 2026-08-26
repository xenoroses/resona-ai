import React, { useState, useEffect } from 'react';
import {
  Radio,
  Edit3,
  Volume2,
  Cpu,
  Sparkles,
  Search,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Folder,
  Play,
  Pause,
  Download,
  Clock,
  Terminal,
  Activity,
  Plus
} from 'lucide-react';
import StudioHub from './components/StudioHub.jsx';
import ScriptEditor from './components/ScriptEditor.jsx';
import AudioPlayerView from './components/AudioPlayerView.jsx';
import AgentTelemetry from './components/AgentTelemetry.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'editor' | 'player' | 'telemetry'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [podcasts, setPodcasts] = useState([]);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(true);
  
  // Audio Player Dock State
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

  // Audio Dock Handlers
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
    <div className="h-screen w-screen bg-[#0F1117] text-[#F8FAFC] font-sans flex flex-col overflow-hidden">
      
      {/* HTML5 Audio Element for Bottom Dock */}
      {currentPodcast && (
        <audio
          ref={audioRef}
          src={currentPodcast.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* 1. ANTIGRAVITY TOP HEADER NAVBAR */}
      <header className="h-12 border-b border-[#2B3042] bg-[#0F1117] px-4 flex items-center justify-between shrink-0 select-none">
        
        {/* Left: Brand + Workspace Pill */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#6366F1] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              R
            </div>
            <span className="text-sm font-bold tracking-tight text-[#F8FAFC]">Resona AI</span>
          </div>

          <span className="text-[11px] font-mono text-[#94A3B8] bg-[#1A1D27] px-2.5 py-0.5 rounded-md border border-[#2B3042]">
            workspace / audio-studio
          </span>

          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#94A3B8] pl-2 border-l border-[#2B3042]">
            <span className={`w-2 h-2 rounded-full ${isServerConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span>{isServerConnected ? 'Engine 3.13 Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {/* Center: Command Bar */}
        <div className="hidden md:flex items-center bg-[#1A1D27] border border-[#2B3042] rounded-lg px-3 py-1 text-xs text-[#94A3B8] space-x-2 w-96">
          <Search className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="flex-1 truncate">Search podcasts, whitepapers, or prompt scripts...</span>
          <kbd className="bg-[#0F1117] text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#2B3042] text-[#64748B]">Ctrl K</kbd>
        </div>

        {/* Right: Model & Engine Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-[#818CF8] bg-[#6366F1]/10 px-2.5 py-1 rounded-md border border-[#6366F1]/30 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#6366F1]" />
            <span>llama-3.3-70b</span>
          </span>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER (Sidebar + Editor Console) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLLAPSIBLE SIDEBAR */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-14'} border-r border-[#2B3042] bg-[#0F1117] flex flex-col justify-between transition-all duration-200 shrink-0 select-none`}>
          
          {/* Navigation Links */}
          <div className="p-2 space-y-1">
            <button
              onClick={() => setActiveTab('hub')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'hub'
                  ? 'bg-[#6366F1] text-white font-semibold'
                  : 'text-[#94A3B8] hover:bg-[#1A1D27] hover:text-[#F8FAFC]'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Studio Hub</span>}
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'editor'
                  ? 'bg-[#6366F1] text-white font-semibold'
                  : 'text-[#94A3B8] hover:bg-[#1A1D27] hover:text-[#F8FAFC]'
              }`}
            >
              <Edit3 className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Scriptboard (HITL)</span>}
            </button>

            <button
              onClick={() => setActiveTab('player')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'player'
                  ? 'bg-[#6366F1] text-white font-semibold'
                  : 'text-[#94A3B8] hover:bg-[#1A1D27] hover:text-[#F8FAFC]'
              }`}
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Audio Timeline</span>}
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-[#6366F1] text-white font-semibold'
                  : 'text-[#94A3B8] hover:bg-[#1A1D27] hover:text-[#F8FAFC]'
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Agent Telemetry</span>}
            </button>
          </div>

          {/* Recent Episodes Explorer List */}
          {isSidebarOpen && (
            <div className="flex-1 p-3 overflow-y-auto border-t border-[#2B3042]/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-bold">
                <span className="flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-[#6366F1]" /> Episodes ({podcasts.length})
                </span>
              </div>

              <div className="space-y-1">
                {podcasts.map((pod) => (
                  <button
                    key={pod.id}
                    onClick={() => {
                      setCurrentPodcast(pod);
                      setActiveTab('player');
                    }}
                    className={`w-full text-left p-2 rounded-md border text-xs transition-all ${
                      currentPodcast?.id === pod.id
                        ? 'bg-[#1A1D27] border-[#6366F1] text-[#F8FAFC]'
                        : 'bg-[#0F1117] border-[#2B3042] text-[#94A3B8] hover:bg-[#1A1D27]'
                    }`}
                  >
                    <div className="font-semibold truncate">{pod.title}</div>
                    <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                      {pod.durationSec}s • {pod.dialogue?.length || 0} turns
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sidebar Toggle Footer */}
          <div className="p-2 border-t border-[#2B3042] flex justify-end">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-[#1A1D27] hover:bg-[#222634] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2B3042]"
            >
              {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* CENTER MAIN WORKSPACE */}
        <main className="flex-1 bg-[#0F1117] overflow-y-auto p-6">
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

      {/* 3. PERSISTENT BOTTOM AUDIO DOCK */}
      {currentPodcast && (
        <div className="h-16 border-t border-[#2B3042] bg-[#1A1D27] px-6 flex items-center justify-between shrink-0 select-none shadow-2xl">
          
          {/* Track Info */}
          <div className="flex items-center space-x-3 w-1/4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 shrink-0"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div className="truncate">
              <div className="text-xs font-bold text-[#F8FAFC] truncate">{currentPodcast.title}</div>
              <div className="text-[10px] font-mono text-[#94A3B8] truncate">{currentPodcast.topic}</div>
            </div>
          </div>

          {/* Center Audio Progress */}
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
              className="w-full accent-[#6366F1] h-1.5 bg-[#0F1117] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#64748B]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Download & Specs */}
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-[#818CF8] bg-[#0F1117] px-2.5 py-1 rounded border border-[#2B3042]">
              Edge-TTS Neural
            </span>
            <a
              href={currentPodcast.audioUrl}
              download={`${currentPodcast.title}.mp3`}
              className="p-2 rounded-lg bg-[#0F1117] hover:bg-[#222634] text-[#6366F1] border border-[#2B3042] transition-colors"
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
