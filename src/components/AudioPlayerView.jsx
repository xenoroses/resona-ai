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
      <div className="text-center py-16 text-xs text-[#94A3B8] italic">
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
    <div className="max-w-5xl mx-auto space-y-5">
      
      <audio
        ref={audioRef}
        src={currentPodcast.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Episode Banner & Audio Console */}
      <div className="bg-[#1A1D27] border border-[#2B3042] rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-[#2B3042]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/40 flex items-center justify-center text-[#6366F1] shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#6366F1] uppercase font-bold">Resona Episode Audio</span>
              <h3 className="text-base font-bold text-[#F8FAFC]">{currentPodcast.title}</h3>
              <p className="text-xs text-[#94A3B8] line-clamp-1">{currentPodcast.researchSummary}</p>
            </div>
          </div>

          <a
            href={currentPodcast.audioUrl}
            download={`${currentPodcast.title}.mp3`}
            className="px-3.5 py-1.5 rounded-lg bg-[#0F1117] hover:bg-[#222634] border border-[#2B3042] text-xs font-mono text-[#6366F1] flex items-center space-x-2 transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download MP3</span>
          </a>
        </div>

        {/* Audio Progress Bar */}
        <div className="space-y-1.5">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-[#6366F1] h-1.5 bg-[#0F1117] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#64748B]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <span className="text-xs font-mono text-[#94A3B8] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#6366F1]" /> {currentPodcast.engine || 'Edge-TTS Neural Engine'}
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-[#0F1117] p-1 rounded-lg border border-[#2B3042]">
            {[1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${
                  playbackRate === rate ? 'bg-[#6366F1] text-white font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript Timeline */}
      <div className="bg-[#1A1D27] border border-[#2B3042] rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] font-mono flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" /> Interactive Synced Transcript
        </h4>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {currentPodcast.dialogue.map((turn, idx) => {
            const timecode = currentPodcast.timecodes?.[idx];
            const startTime = timecode?.startTimeSec || (idx * 6.0);
            const isAlex = turn.speaker === 'Alex';

            return (
              <div
                key={idx}
                onClick={() => jumpToSpeakerTime(startTime)}
                className="p-3 rounded-lg bg-[#0F1117] hover:bg-[#222634] border border-[#2B3042] cursor-pointer transition-all flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isAlex ? 'bg-[#1A1D27] text-[#818CF8] border border-[#2B3042]' : 'bg-[#1A1D27] text-[#10B981] border border-[#2B3042]'
                    }`}>
                      {turn.speaker}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      [{formatTime(startTime)}]
                    </span>
                  </div>
                  <p className="text-xs text-[#F8FAFC] leading-relaxed group-hover:text-white">
                    {turn.text}
                  </p>
                </div>

                <div className="w-6 h-6 rounded bg-[#1A1D27] group-hover:bg-[#6366F1] text-[#94A3B8] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
