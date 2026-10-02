import React, { useState } from 'react';
import { Voice } from '../types';
import { Lock, Sparkles, Check, Play, Volume2, Globe } from 'lucide-react';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  isPremiumVoice: boolean;
  onOpenUpgrade: () => void;
  speed: string;
  onSpeedChange: (speed: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoiceId,
  onSelectVoice,
  isPremiumVoice,
  onOpenUpgrade,
  speed,
  onSpeedChange,
}) => {
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<'all' | 'Male' | 'Female'>('all');
  const [showCardsModal, setShowCardsModal] = useState<boolean>(false);

  const selectedVoice = voices.find((v) => v.id === selectedVoiceId) || voices[0];

  const filteredVoices = voices.filter((v) => {
    if (filterGender !== 'all' && v.gender !== filterGender) return false;
    if (filterLang === 'urdu') return v.langCode.startsWith('ur');
    if (filterLang === 'english') return v.langCode.startsWith('en');
    if (filterLang === 'south_asian') return ['ur-PK', 'hi-IN', 'bn-BD', 'pa-IN'].includes(v.langCode);
    if (filterLang === 'international') return !['ur-PK', 'hi-IN', 'bn-BD', 'pa-IN', 'en-US'].includes(v.langCode);
    if (filterLang === 'gemini') return v.engine === 'gemini';
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Primary selectors row matching user snippet: voice select + speed select */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <select
            id="voice"
            value={selectedVoiceId}
            onChange={(e) => {
              const val = e.target.value;
              const v = voices.find((item) => item.id === val);
              if (v && !v.isFree && !isPremiumVoice) {
                onOpenUpgrade();
              }
              onSelectVoice(val);
            }}
            className="w-full appearance-none rounded-xl border-2 border-purple-500/40 bg-slate-900/90 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            {voices.map((v) => {
              const locked = !v.isFree && !isPremiumVoice;
              return (
                <option key={v.id} value={v.id} className="bg-slate-900 text-white py-1">
                  {v.label} {locked ? '🔒 [LOCKED]' : ''}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-400 font-bold">
            ▼
          </div>
        </div>

        {/* Speed Selector */}
        <div className="relative sm:w-44">
          <select
            id="speed"
            value={speed}
            onChange={(e) => onSpeedChange(e.target.value)}
            className="w-full appearance-none rounded-xl border-2 border-purple-500/40 bg-slate-900/90 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            <option value="+0%">Normal Speed</option>
            <option value="-20%">Slow (-20%)</option>
            <option value="+20%">Fast (+20%)</option>
            <option value="-35%">Very Slow (-35%)</option>
            <option value="+35%">Very Fast (+35%)</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-400 font-bold">
            ▼
          </div>
        </div>

        {/* Browse visually button */}
        <button
          type="button"
          onClick={() => setShowCardsModal(!showCardsModal)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3.5 py-3 text-xs font-semibold text-purple-200 transition-all hover:bg-purple-900/50 hover:text-white"
        >
          <Globe className="h-4 w-4 text-purple-400" />
          <span>{showCardsModal ? 'Hide Gallery' : 'Explore Voices'}</span>
        </button>
      </div>

      {/* Selected Voice Status Bar */}
      {selectedVoice && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900/60 px-3.5 py-2 ring-1 ring-white/5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">{selectedVoice.flag}</span>
            <span className="font-semibold text-white">{selectedVoice.name}</span>
            <span className="text-slate-400">({selectedVoice.language} &bull; {selectedVoice.gender})</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedVoice.isFree ? (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                🎁 FREE VOICE
              </span>
            ) : isPremiumVoice ? (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-500/30">
                ✨ UNLOCKED
              </span>
            ) : (
              <button
                onClick={onOpenUpgrade}
                className="flex items-center gap-1 rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-300 ring-1 ring-pink-500/40 hover:bg-pink-500/30"
              >
                <Lock className="h-3 w-3" /> Rs.250 Unlock Required
              </button>
            )}
          </div>
        </div>
      )}

      {/* Expandable Voice Gallery */}
      {showCardsModal && (
        <div className="rounded-2xl border border-purple-500/30 bg-slate-900/95 p-4 shadow-xl backdrop-blur-md">
          {/* Filters */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All (15+)' },
                { id: 'urdu', label: '🇵🇰 Urdu' },
                { id: 'english', label: '🇺🇸 English' },
                { id: 'south_asian', label: '🇮🇳 Regional' },
                { id: 'international', label: '🌍 World' },
                { id: 'gemini', label: '✨ Studio' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterLang(tab.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    filterLang === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1 text-xs">
              {(['all', 'Male', 'Female'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setFilterGender(gender)}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    filterGender === gender
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {gender === 'all' ? 'All Genders' : gender}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredVoices.map((v) => {
              const isSelected = v.id === selectedVoiceId;
              const isLocked = !v.isFree && !isPremiumVoice;

              return (
                <div
                  key={v.id}
                  onClick={() => {
                    if (isLocked) {
                      onOpenUpgrade();
                    }
                    onSelectVoice(v.id);
                  }}
                  className={`relative cursor-pointer rounded-xl p-3 transition-all ${
                    isSelected
                      ? 'border-2 border-purple-500 bg-purple-950/60 ring-2 ring-purple-500/20'
                      : 'border border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{v.flag}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{v.name}</h4>
                        <p className="text-[10px] text-slate-400">{v.language}</p>
                      </div>
                    </div>

                    <div>
                      {v.isFree ? (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                          FREE
                        </span>
                      ) : isLocked ? (
                        <span className="flex items-center gap-0.5 rounded bg-pink-500/20 px-1.5 py-0.5 text-[9px] font-bold text-pink-400">
                          <Lock className="h-2.5 w-2.5" /> PRO
                        </span>
                      ) : (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                          PRO
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-1 text-[10px] text-slate-400 italic font-urdu">
                    &ldquo;{v.previewText}&rdquo;
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <span>{v.gender}</span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-purple-400 font-bold">
                        <Check className="h-3 w-3" /> Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
