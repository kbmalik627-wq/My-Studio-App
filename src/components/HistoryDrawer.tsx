import React from 'react';
import { GeneratedAudio } from '../types';
import { Play, Download, Trash2, Clock, Volume2, X } from 'lucide-react';

interface HistoryDrawerProps {
  history: GeneratedAudio[];
  onSelectAudio: (audio: GeneratedAudio) => void;
  onClearHistory: () => void;
  onDeleteAudio: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelectAudio,
  onClearHistory,
  onDeleteAudio,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">Generation History</h3>
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300 font-mono">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-950/30"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Volume2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Abhi tak koi voice generate nahi hui</p>
              <p className="text-xs text-slate-600 mt-1">Jab aap audio banayenge, yahan mehfooz hogi</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border border-slate-800 bg-slate-950/60 p-3 hover:border-purple-500/40 hover:bg-slate-950 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.voice.flag}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.voice.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {item.wordCount} words &bull; {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onSelectAudio(item);
                        onClose();
                      }}
                      className="rounded-lg bg-purple-600/20 p-1.5 text-purple-300 hover:bg-purple-600 hover:text-white"
                      title="Play in Player"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </button>
                    <a
                      href={item.audioDataUri}
                      download={`World-AI-Voice-${item.voice.name}-${item.id}.mp3`}
                      className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
                      title="Download MP3"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => onDeleteAudio(item.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-300 line-clamp-2 italic font-urdu leading-relaxed">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
