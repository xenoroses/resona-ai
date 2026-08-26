import React, { useState, useEffect } from 'react';
import { Edit3, Plus, Trash2, RefreshCw, Volume2, Code, UserCheck } from 'lucide-react';

export default function ScriptEditor({ currentPodcast, onRenderCustomAudio, isRendering }) {
  const [dialogueTurns, setDialogueTurns] = useState([]);
  const [episodeTitle, setEpisodeTitle] = useState('');

  useEffect(() => {
    if (currentPodcast) {
      setDialogueTurns(currentPodcast.dialogue || []);
      setEpisodeTitle(currentPodcast.title || '');
    }
  }, [currentPodcast]);

  if (!currentPodcast && dialogueTurns.length === 0) {
    return (
      <div className="text-center py-16 text-xs text-[#94A3B8] italic">
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
    <div className="max-w-5xl mx-auto space-y-5">
      
      {/* Scriptboard Header */}
      <div className="bg-[#1A1D27] border border-[#2B3042] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#6366F1] font-bold uppercase mb-1">
            <UserCheck className="w-4 h-4" />
            <span>LangGraph HITL Checkpoint</span>
          </div>
          <input
            type="text"
            value={episodeTitle}
            onChange={(e) => setEpisodeTitle(e.target.value)}
            className="text-base font-bold text-[#F8FAFC] bg-transparent border-b border-transparent hover:border-[#2B3042] focus:border-[#6366F1] focus:outline-none w-full"
          />
        </div>

        <button
          onClick={handleRenderAudio}
          disabled={isRendering || dialogueTurns.length === 0}
          className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs flex items-center space-x-2 disabled:opacity-40 transition-all shadow-md shrink-0"
        >
          {isRendering ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synthesizing Dual Voices...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Render Dual-Voice Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Turns List */}
      <div className="space-y-3">
        {dialogueTurns.map((turn, index) => {
          const isAlex = turn.speaker === 'Alex';

          return (
            <div key={index} className="bg-[#1A1D27] border border-[#2B3042] rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <select
                    value={turn.speaker}
                    onChange={(e) => handleSpeakerChange(index, e.target.value)}
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border focus:outline-none cursor-pointer ${
                      isAlex
                        ? 'bg-[#0F1117] text-[#818CF8] border-[#2B3042]'
                        : 'bg-[#0F1117] text-[#10B981] border-[#2B3042]'
                    }`}
                  >
                    <option value="Alex">Alex (Inquisitive Host)</option>
                    <option value="Sam">Sam (Domain Expert)</option>
                  </select>
                  <span className="text-[10px] text-[#64748B] font-mono">Turn #{index + 1}</span>
                </div>

                <button
                  onClick={() => handleDeleteTurn(index)}
                  className="p-1 rounded hover:bg-rose-950/50 text-[#64748B] hover:text-rose-400 transition-colors"
                  title="Delete Turn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                value={turn.text}
                onChange={(e) => handleTurnTextChange(index, e.target.value)}
                rows={2}
                placeholder="Type dialogue line..."
                className="w-full bg-[#0F1117] border border-[#2B3042] rounded-lg p-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] font-sans leading-relaxed"
              />
            </div>
          );
        })}
      </div>

      {/* Add Line */}
      <div className="flex justify-center pt-1">
        <button
          onClick={handleAddTurn}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-[#1A1D27] hover:bg-[#222634] border border-[#2B3042] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#6366F1]" />
          <span>Add Dialogue Line</span>
        </button>
      </div>

    </div>
  );
}
