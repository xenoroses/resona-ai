import React, { useState, useEffect } from 'react';
import { Edit3, Plus, Trash2, Play, Sparkles, RefreshCw, Volume2 } from 'lucide-react';

export default function ScriptEditor({ currentPodcast, onRenderCustomAudio, isRendering }) {
  const [dialogueTurns, setDialogueTurns] = useState([]);
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [researchSummary, setResearchSummary] = useState('');

  useEffect(() => {
    if (currentPodcast) {
      setDialogueTurns(currentPodcast.dialogue || []);
      setEpisodeTitle(currentPodcast.title || '');
      setResearchSummary(currentPodcast.researchSummary || '');
    }
  }, [currentPodcast]);

  if (!currentPodcast && dialogueTurns.length === 0) {
    return (
      <div className="text-center py-16 text-xs text-[#A1A1AA] italic">
        No active podcast script to edit. Generate an episode in Studio Hub first!
      </div>
    );
  }

  const handleTurnTextChange = (index, newText) => {
    const updated = [...dialogueTurns];
    updated[index].text = newText;
    setDialogueTurns(updated);
  };

  const handleSpeakerChange = (index, newSpeaker) => {
    const updated = [...dialogueTurns];
    updated[index].speaker = newSpeaker;
    setDialogueTurns(updated);
  };

  const handleAddTurn = () => {
    const lastSpeaker = dialogueTurns.length > 0 ? dialogueTurns[dialogueTurns.length - 1].speaker : 'Alex';
    const nextSpeaker = lastSpeaker === 'Alex' ? 'Sam' : 'Alex';
    setDialogueTurns([...dialogueTurns, { speaker: nextSpeaker, text: '' }]);
  };

  const handleDeleteTurn = (index) => {
    setDialogueTurns(dialogueTurns.filter((_, idx) => idx !== index));
  };

  const handleRenderAudio = () => {
    if (dialogueTurns.length === 0 || isRendering) return;
    onRenderCustomAudio({
      title: episodeTitle,
      topic: currentPodcast?.topic || 'Custom Script',
      dialogue: dialogueTurns
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Controls Bar */}
      <div className="resona-card rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#D97757] uppercase font-bold mb-1">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Human-in-the-Loop Script Editor</span>
          </div>
          <input
            type="text"
            value={episodeTitle}
            onChange={(e) => setEpisodeTitle(e.target.value)}
            className="text-base font-bold text-[#F4F4F5] bg-transparent border-b border-transparent hover:border-[#3F3F46] focus:border-[#D97757] focus:outline-none w-full"
          />
        </div>

        <button
          onClick={handleRenderAudio}
          disabled={isRendering || dialogueTurns.length === 0}
          className="px-5 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#C8654B] text-white font-bold text-xs flex items-center space-x-2 disabled:opacity-40 transition-all shadow-md shrink-0"
        >
          {isRendering ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Rendering Audio...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Render Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Dialogue Turns List */}
      <div className="space-y-4">
        {dialogueTurns.map((turn, index) => {
          const isAlex = turn.speaker === 'Alex';

          return (
            <div key={index} className="resona-card rounded-2xl p-4 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Speaker Selector Pill */}
                  <select
                    value={turn.speaker}
                    onChange={(e) => handleSpeakerChange(index, e.target.value)}
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                      isAlex
                        ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800'
                        : 'bg-amber-950/80 text-amber-400 border-amber-800'
                    }`}
                  >
                    <option value="Alex">Alex (Inquisitive Host)</option>
                    <option value="Sam">Sam (Domain Expert)</option>
                  </select>
                  <span className="text-[11px] text-[#A1A1AA] font-mono">Turn #{index + 1}</span>
                </div>

                <button
                  onClick={() => handleDeleteTurn(index)}
                  className="p-1 rounded hover:bg-rose-950/50 text-[#71717A] hover:text-rose-400 transition-colors"
                  title="Delete Line"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Editable Text Area */}
              <textarea
                value={turn.text}
                onChange={(e) => handleTurnTextChange(index, e.target.value)}
                rows={2}
                placeholder="Type host dialogue..."
                className="w-full bg-[#18181B] border border-[#3F3F46] rounded-xl p-3 text-xs text-[#F4F4F5] placeholder-[#71717A] focus:outline-none focus:border-[#D97757] font-sans leading-relaxed"
              />
            </div>
          );
        })}
      </div>

      {/* Add Line Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleAddTurn}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-xs font-semibold text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors"
        >
          <Plus className="w-4 h-4 text-[#D97757]" />
          <span>Add Dialogue Line</span>
        </button>
      </div>

    </div>
  );
}
