import React, { useState, useRef } from 'react';
import { Play, Pause, Download, Radio, Clock, Sparkles } from 'lucide-react';

export default function AudioPlayerView({ currentPodcast }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef(null);

  if (!currentPodcast) {
    return (
      <div className="text-center py-16 text-xs text-slate-400 italic">
        No generated audio podcast selected. Generate an episode in Studio Hub first!
      </div>
    );
  }

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

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const jumpToSpeakerTime = (timeSec) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeSec;
      setCurrentTime(timeSec);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (timeSec) => {
    const min = Math.floor(timeSec / 60);
    const sec = Math.floor(timeSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <audio
        ref={audioRef}
        src={currentPodcast.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Glass Audio Card */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-[#0B0D17] rounded-[14px] flex items-center justify-center text-purple-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono text-purple-300 uppercase font-bold">Resona Episode Console</span>
              <h3 className="text-lg font-bold text-white">{currentPodcast.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-1">{currentPodcast.researchSummary}</p>
            </div>
          </div>

          <a
            href={currentPodcast.audioUrl}
            download={`${currentPodcast.title}.mp3`}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-purple-300 flex items-center space-x-2 backdrop-blur-md transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download MP3</span>
          </a>
        </div>

        {/* Custom Progress Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-purple-400 h-2 bg-white/10 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-2xl btn-gradient-primary flex items-center justify-center shadow-lg active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" /> {currentPodcast.engine || 'Edge-TTS Neural Engine'}
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-white/[0.03] p-1 rounded-xl border border-white/10 backdrop-blur-md">
            {[1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`text-xs font-mono px-3 py-1 rounded-lg transition-colors ${
                  playbackRate === rate ? 'btn-gradient-primary font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript Timeline */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Interactive Synced Transcript
        </h4>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {currentPodcast.dialogue.map((turn, idx) => {
            const timecode = currentPodcast.timecodes?.[idx];
            const startTime = timecode?.startTimeSec || (idx * 6.0);
            const isAlex = turn.speaker === 'Alex';

            return (
              <div
                key={idx}
                onClick={() => jumpToSpeakerTime(startTime)}
                className="p-4 rounded-xl glass-panel-interactive cursor-pointer flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                      isAlex ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {turn.speaker}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      [{formatTime(startTime)}]
                    </span>
                  </div>
                  <p className="text-xs text-white leading-relaxed">
                    {turn.text}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-xl bg-white/[0.04] group-hover:bg-purple-500 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
