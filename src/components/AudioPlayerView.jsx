import React, { useState, useRef } from 'react';
import { Play, Pause, Download, Volume2, Radio, Clock, Sparkles } from 'lucide-react';

export default function AudioPlayerView({ currentPodcast }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef(null);

  if (!currentPodcast) {
    return (
      <div className="text-center py-16 text-xs text-[#A1A1AA] italic">
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
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentPodcast.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Episode Banner & Player Controls */}
      <div className="resona-card rounded-2xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#3F3F46]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#D97757]/15 border border-[#D97757]/40 flex items-center justify-center text-[#D97757] shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#D97757] uppercase font-bold">Resona Audio Episode</span>
              <h3 className="text-lg font-bold text-[#F4F4F5]">{currentPodcast.title}</h3>
              <p className="text-xs text-[#A1A1AA] line-clamp-1">{currentPodcast.researchSummary}</p>
            </div>
          </div>

          {/* Download Audio Button */}
          <a
            href={currentPodcast.audioUrl}
            download={`${currentPodcast.title}.mp3`}
            className="px-4 py-2 rounded-xl bg-[#18181B] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-mono text-[#D97757] flex items-center space-x-2 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download MP3</span>
          </a>
        </div>

        {/* Custom Audio Progress Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-[#D97757] h-2 bg-[#18181B] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-[#A1A1AA]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls & Speed Options */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[#D97757] hover:bg-[#C8654B] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <span className="text-xs font-mono text-[#A1A1AA] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D97757]" /> {currentPodcast.engine || 'Edge-TTS Neural Engine'}
            </span>
          </div>

          {/* Speed selector */}
          <div className="flex items-center space-x-1 bg-[#18181B] p-1 rounded-xl border border-[#3F3F46]">
            {[1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-colors ${
                  playbackRate === rate ? 'bg-[#D97757] text-white font-bold' : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Synched Dialogue Transcript Feed */}
      <div className="resona-card rounded-2xl p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] font-mono flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D97757]" /> Synched Dialogue Transcript
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
                className="p-3.5 rounded-xl bg-[#18181B] hover:bg-[#3F3F46]/50 border border-[#3F3F46]/60 cursor-pointer transition-all flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      isAlex ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {turn.speaker}
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">
                      [{formatTime(startTime)}]
                    </span>
                  </div>
                  <p className="text-xs text-[#F4F4F5] leading-relaxed group-hover:text-white">
                    {turn.text}
                  </p>
                </div>

                <div className="w-7 h-7 rounded-full bg-[#27272A] group-hover:bg-[#D97757] text-[#A1A1AA] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
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
