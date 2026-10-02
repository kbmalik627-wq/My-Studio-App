import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import { GeneratedAudio } from '../types';

interface AudioPlayerProps {
  audio: GeneratedAudio | null;
  onDownload?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audio }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current && audio?.audioDataUri) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audio?.audioDataUri]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error('Audio play error:', e);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const handleDownload = () => {
    if (!audio?.audioDataUri) return;
    const a = document.createElement('a');
    a.href = audio.audioDataUri;
    const safeTitle = (audio.voice.name || 'Voice') + '-' + Date.now();
    a.download = `World-AI-Voice-${safeTitle}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!audio) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 p-8 text-center text-slate-400 backdrop-blur-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-950/60 text-purple-400 ring-1 ring-purple-500/20">
          <Play className="h-5 w-5 fill-current" />
        </div>
        <p className="text-sm font-medium text-slate-300">Generated Voice Yahan Play Hogi</p>
        <p className="mt-1 text-xs text-slate-500">Text likhein aur &ldquo;Voice Generate Karo&rdquo; dabayein</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-purple-950/40 p-5 shadow-xl shadow-purple-950/20 ring-1 ring-white/10">
      <audio
        ref={audioRef}
        src={audio.audioDataUri}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{audio.voice.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">{audio.voice.name}</h4>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[11px] font-medium text-purple-300">
                {audio.voice.language}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {audio.wordCount} words &bull; Speed: {audio.speed}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> No Copyright
          </span>
        </div>
      </div>

      {/* Visualizer animation bars */}
      <div className="my-4 flex h-14 items-center justify-center gap-1 rounded-xl bg-slate-950/60 px-4 py-2 ring-1 ring-white/5">
        {[40, 65, 25, 90, 45, 75, 30, 85, 60, 95, 35, 70, 50, 80, 45, 65, 30, 75, 40, 85].map((height, i) => (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              isPlaying
                ? 'bg-gradient-to-t from-purple-500 via-indigo-400 to-pink-400 animate-pulse'
                : 'bg-slate-700/60'
            }`}
            style={{
              height: isPlaying ? `${Math.max(15, (height * (1 + Math.sin(currentTime * 8 + i))) / 1.5)}%` : '20%',
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* Timeline Scrub Bar */}
      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-purple-500 transition-colors focus:outline-none"
        />
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Play / Restart Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
              }
            }}
            title="Restart"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlay}
            className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:from-purple-500 hover:to-indigo-500 active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-current" /> Play Audio
              </>
            )}
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-950/80 p-1 ring-1 ring-white/10 text-xs">
          {[0.75, 1, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              className={`rounded-lg px-2 py-1 font-medium transition-colors ${
                playbackRate === rate ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 text-slate-400">
          <button onClick={toggleMute} className="hover:text-white">
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="h-1 w-16 cursor-pointer appearance-none rounded bg-slate-700 accent-purple-500"
          />
        </div>
      </div>

      {/* Main Download Button matching user specification */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white ring-1 ring-purple-500/40 transition-all hover:bg-slate-900 hover:ring-purple-400 hover:shadow-lg hover:shadow-purple-900/20 active:scale-[0.99]"
        >
          <Download className="h-4 w-4 text-purple-400" />
          <span>⬇️ Download MP3 (100% Copyright Free)</span>
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          TikTok, YouTube, Facebook aur Instagram reels ke liye bilkul safe aur commercial use verified.
        </p>
      </div>
    </div>
  );
};
