import React, { useState, useEffect } from 'react';
import { Edit3, Plus, Trash2, RefreshCw, Volume2, UserCheck } from 'lucide-react';

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
      <div className="text-center py-16 text-xs text-slate-400 italic">
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
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-300 uppercase font-bold mb-1">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span>LangGraph HITL Checkpoint</span>
          </div>
          <input
            type="text"
            value={episodeTitle}
            onChange={(e) => setEpisodeTitle(e.target.value)}
            className="text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-purple-400 focus:outline-none w-full"
          />
        </div>

        <button
          onClick={handleRenderAudio}
          disabled={isRendering || dialogueTurns.length === 0}
          className="px-5 py-3 rounded-xl btn-gradient-primary text-xs font-bold flex items-center space-x-2 disabled:opacity-40 shrink-0"
        >
          {isRendering ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Rendering Audio...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Render Custom Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Turns List */}
      <div className="space-y-4">
        {dialogueTurns.map((turn, index) => {
          const isAlex = turn.speaker === 'Alex';

          return (
            <div key={index} className="glass-panel rounded-2xl p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <select
                    value={turn.speaker}
                    onChange={(e) => handleSpeakerChange(index, e.target.value)}
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                      isAlex
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    <option value="Alex">Alex (Inquisitive Host)</option>
                    <option value="Sam">Sam (Domain Expert)</option>
                  </select>
                  <span className="text-[11px] text-slate-400 font-mono">Turn #{index + 1}</span>
                </div>

                <button
                  onClick={() => handleDeleteTurn(index)}
                  className="p-1.5 rounded-lg hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete Line"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                value={turn.text}
                onChange={(e) => handleTurnTextChange(index, e.target.value)}
                rows={2}
                placeholder="Type host dialogue..."
                className="w-full glass-input rounded-xl p-3.5 text-xs text-white placeholder-slate-500 font-sans leading-relaxed"
              />
            </div>
          );
        })}
      </div>

      {/* Add Line Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleAddTurn}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white backdrop-blur-md transition-all"
        >
          <Plus className="w-4 h-4 text-purple-400" />
          <span>Add Dialogue Line</span>
        </button>
      </div>

    </div>
  );
}
