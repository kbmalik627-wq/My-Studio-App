import React, { useState, useEffect, useMemo } from 'react';
import {
  Volume2,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  HelpCircle,
  Copy,
  Check,
  Trash2,
  RotateCcw,
  Wand2,
  BookOpen,
  ArrowRight,
  Zap,
  Lock,
  MessageCircle,
} from 'lucide-react';
import { Voice, GeneratedAudio, PlanStatus } from './types';
import { AudioPlayer } from './components/AudioPlayer';
import { VoiceSelector } from './components/VoiceSelector';
import { PaymentModal } from './components/PaymentModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PRESET_SCRIPTS } from './data/presets';

const DEFAULT_VOICES: Voice[] = [
  {
    id: 'ur-PK-AsadNeural',
    label: '🇵🇰 Urdu Male - Asad [FREE]',
    name: 'Asad',
    language: 'Urdu (Pakistan)',
    langCode: 'ur-PK',
    gender: 'Male',
    flag: '🇵🇰',
    isFree: true,
    engine: 'edge',
    previewText: 'السلام علیکم! ورلڈ اے آئی وائس اسٹوڈیو میں خوش آمدید۔',
  },
  {
    id: 'ur-PK-UzmaNeural',
    label: '🇵🇰 Urdu Female - Uzma [FREE]',
    name: 'Uzma',
    language: 'Urdu (Pakistan)',
    langCode: 'ur-PK',
    gender: 'Female',
    flag: '🇵🇰',
    isFree: true,
    engine: 'edge',
    previewText: 'السلام علیکم! میں عظمیٰ ہوں، آپ کی ڈیجیٹل آواز۔',
  },
  {
    id: 'en-US-JennyNeural',
    label: '🇺🇸 English Female - Jenny',
    name: 'Jenny',
    language: 'English (US)',
    langCode: 'en-US',
    gender: 'Female',
    flag: '🇺🇸',
    isFree: false,
    engine: 'edge',
    previewText: 'Hello! Welcome to World AI Voice Studio, your premier audio creator.',
  },
  {
    id: 'en-US-GuyNeural',
    label: '🇺🇸 English Male - Guy',
    name: 'Guy',
    language: 'English (US)',
    langCode: 'en-US',
    gender: 'Male',
    flag: '🇺🇸',
    isFree: false,
    engine: 'edge',
    previewText: 'Hey there! Experience crystal clear AI narrations for your videos.',
  },
  {
    id: 'es-ES-ElviraNeural',
    label: '🇪🇸 Spanish - Elvira',
    name: 'Elvira',
    language: 'Spanish (Spain)',
    langCode: 'es-ES',
    gender: 'Female',
    flag: '🇪🇸',
    isFree: false,
    engine: 'edge',
    previewText: '¡Hola! Bienvenido al estudio de voz con inteligencia artificial.',
  },
  {
    id: 'zh-CN-XiaoxiaoNeural',
    label: '🇨🇳 Chinese - Xiaoxiao',
    name: 'Xiaoxiao',
    language: 'Chinese (Mandarin)',
    langCode: 'zh-CN',
    gender: 'Female',
    flag: '🇨🇳',
    isFree: false,
    engine: 'edge',
    previewText: '你好！欢迎使用全球人工智能语音工作室。',
  },
  {
    id: 'hi-IN-SwaraNeural',
    label: '🇮🇳 Hindi - Swara',
    name: 'Swara',
    language: 'Hindi (India)',
    langCode: 'hi-IN',
    gender: 'Female',
    flag: '🇮🇳',
    isFree: false,
    engine: 'edge',
    previewText: 'नमस्ते! वर्ल्ड एआई वॉयस स्टूडियो में आपका हार्दिक स्वागत है।',
  },
  {
    id: 'ar-SA-ZariyahNeural',
    label: '🇸🇦 Arabic - Zariyah',
    name: 'Zariyah',
    language: 'Arabic (Saudi Arabia)',
    langCode: 'ar-SA',
    gender: 'Female',
    flag: '🇸🇦',
    isFree: false,
    engine: 'edge',
    previewText: 'أهلاً وسهلاً بكم في استوديو الأصوات الذكي بتقنية الذكاء الاصطناعي.',
  },
  {
    id: 'fr-FR-DeniseNeural',
    label: '🇫🇷 French - Denise',
    name: 'Denise',
    language: 'French (France)',
    langCode: 'fr-FR',
    gender: 'Female',
    flag: '🇫🇷',
    isFree: false,
    engine: 'edge',
    previewText: 'Bonjour! Bienvenue dans le studio vocal doté de l\'intelligence artificielle.',
  },
  {
    id: 'pt-BR-FranciscaNeural',
    label: '🇧🇷 Portuguese - Francisca',
    name: 'Francisca',
    language: 'Portuguese (Brazil)',
    langCode: 'pt-BR',
    gender: 'Female',
    flag: '🇧🇷',
    isFree: false,
    engine: 'edge',
    previewText: 'Olá! Bem-vindo ao estúdio de voz com inteligência artificial.',
  },
  {
    id: 'bn-BD-NabanitaNeural',
    label: '🇧🇩 Bengali - Nabanita',
    name: 'Nabanita',
    language: 'Bengali (Bangladesh)',
    langCode: 'bn-BD',
    gender: 'Female',
    flag: '🇧🇩',
    isFree: false,
    engine: 'edge',
    previewText: 'হ্যালো! ওয়ার্ল্ড এআই ভয়েس স্টুডিওতে আপনাকে স্বাগতম।',
  },
  {
    id: 'ru-RU-SvetlanaNeural',
    label: '🇷🇺 Russian - Svetlana',
    name: 'Svetlana',
    language: 'Russian',
    langCode: 'ru-RU',
    gender: 'Female',
    flag: '🇷🇺',
    isFree: false,
    engine: 'edge',
    previewText: 'Здравствуйте! Добро пожаловать в студию искусственного интеллекта.',
  },
];

export default function App() {
  const [voices, setVoices] = useState<Voice[]>(DEFAULT_VOICES);
  const [text, setText] = useState<string>('السلام علیکم! ورلڈ اے آئی وائس اسٹوڈیو میں خوش آمدید۔ یہاں آپ اردو اور دیگر زبانوں میں کاپی رائٹ فری وائس اوور آسانی سے تیار کر سکتے ہیں۔');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('ur-PK-AsadNeural');
  const [speed, setSpeed] = useState<string>('+0%');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null);
  const [history, setHistory] = useState<GeneratedAudio[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [initialPackageType, setInitialPackageType] = useState<'voices' | 'words' | 'combo'>('combo');

  // Inline payment box state matching user snippet
  const [showInlinePayOpt, setShowInlinePayOpt] = useState<boolean>(false);
  const [inlineTrxId, setInlineTrxId] = useState<string>('');
  const [inlinePkg, setInlinePkg] = useState<'voices' | 'words' | 'combo'>('combo');
  const [isInlineVerifying, setIsInlineVerifying] = useState<boolean>(false);
  const [inlineVerifyMsg, setInlineVerifyMsg] = useState<string | null>(null);

  // Script enhancer modal
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

  // Plan Status from localStorage
  const [planStatus, setPlanStatus] = useState<PlanStatus>(() => {
    const pv = localStorage.getItem('premiumVoice') === 'true';
    const pw = localStorage.getItem('premiumWords') === 'true';
    const stored = localStorage.getItem('planStatus');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return {
      isPremiumVoice: pv,
      isPremiumWords: pw,
    };
  });

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('audio_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('History parse error:', e);
      }
    }
  }, []);

  // Fetch dynamic voices from backend
  useEffect(() => {
    fetch('/api/voices')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.voices?.length) {
          setVoices(data.voices);
        }
      })
      .catch((err) => {
        console.warn('Using default fallback voices:', err);
      });
  }, []);

  // Save history updates
  const saveToHistory = (item: GeneratedAudio) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, 30);
      localStorage.setItem('audio_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('audio_history');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem('audio_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Word counter logic matching original snippet
  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, [text]);

  const isWordLimitExceeded = wordCount > 500 && !planStatus.isPremiumWords;

  // Selected Voice object
  const currentVoiceObj = useMemo(() => {
    return voices.find((v) => v.id === selectedVoiceId) || voices[0];
  }, [voices, selectedVoiceId]);

  // Main Generate Action
  const handleGenerate = async () => {
    setErrorMsg(null);
    setSuccessToast(null);

    const cleanText = text.trim();
    if (!cleanText) {
      setErrorMsg('Text likho Jano! (Please enter text to generate speech)');
      return;
    }

    // Voice restriction check
    const isFreeVoice = ['ur-PK-AsadNeural', 'ur-PK-UzmaNeural'].includes(selectedVoiceId);
    if (!isFreeVoice && !planStatus.isPremiumVoice) {
      setErrorMsg('Ye Premium Voice hai! Rs.250 wala package lo 🔒');
      setInitialPackageType('voices');
      setIsPaymentModalOpen(true);
      return;
    }

    // Word count limit check
    if (wordCount > 500 && !planStatus.isPremiumWords) {
      setErrorMsg(`500 words se zyada (${wordCount} words) ke liye Unlimited Words package (Rs. 250) zaroori hai! 🔒`);
      setInitialPackageType('words');
      setIsPaymentModalOpen(true);
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voice: selectedVoiceId,
          speed,
          isPremiumVoice: planStatus.isPremiumVoice,
          isPremiumWords: planStatus.isPremiumWords,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Audio generate karne me masla hua.');
      }

      const newAudioItem: GeneratedAudio = {
        id: 'audio-' + Date.now(),
        title: `${currentVoiceObj.name} - ${cleanText.slice(0, 30)}...`,
        text: cleanText,
        audioDataUri: data.dataUri,
        mimeType: data.mimeType || 'audio/mpeg',
        voice: currentVoiceObj,
        speed,
        wordCount,
        characterCount: cleanText.length,
        createdAt: new Date().toISOString(),
      };

      setCurrentAudio(newAudioItem);
      saveToHistory(newAudioItem);
      setSuccessToast('🎉 Voice kamyabi se generate ho gayi! Neeche play ya download karein.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Inline verify function matching original snippet `verify()`
  const handleInlineVerify = async () => {
    if (!inlineTrxId.trim()) {
      setInlineVerifyMsg('Transaction ID likho pehle!');
      return;
    }

    setIsInlineVerifying(true);
    setInlineVerifyMsg(null);

    try {
      const res = await fetch('/api/verify-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trxid: inlineTrxId.trim(),
          pkg: inlinePkg,
          paymentMethod: 'jazzcash',
        }),
      });

      const data = await res.json();

      if (data.success && data.verified) {
        const updated: PlanStatus = {
          isPremiumVoice: planStatus.isPremiumVoice || data.unlockVoices,
          isPremiumWords: planStatus.isPremiumWords || data.unlockWords,
          activatedPackage: inlinePkg,
          trxId: data.trxId,
          activatedAt: new Date().toISOString(),
          expiresAt: data.expiresAt,
        };

        localStorage.setItem('premiumVoice', updated.isPremiumVoice ? 'true' : 'false');
        localStorage.setItem('premiumWords', updated.isPremiumWords ? 'true' : 'false');
        localStorage.setItem('planStatus', JSON.stringify(updated));

        setPlanStatus(updated);
        setInlineVerifyMsg('✅ Mubarak ho! Package verify aur activate ho gaya hai.');
        setShowInlinePayOpt(false);
      } else {
        setInlineVerifyMsg(data.error || 'Verification fail ho gayi. WhatsApp par screenshot bhejein.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setInlineVerifyMsg(`Error: ${msg}`);
    } finally {
      setIsInlineVerifying(false);
    }
  };

  // AI Script Polish
  const handleEnhanceScript = async () => {
    if (!text.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetTone: 'engaging viral narration with natural pauses',
          language: currentVoiceObj.language,
        }),
      });
      const data = await res.json();
      if (data.success && data.enhancedText) {
        setText(data.enhancedText);
        setSuccessToast('✨ Script ko natural pauses aur flow ke sath polish kar diya gaya hai!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Reset plan for testing
  const handleResetPlan = () => {
    localStorage.removeItem('premiumVoice');
    localStorage.removeItem('premiumWords');
    localStorage.removeItem('planStatus');
    setPlanStatus({ isPremiumVoice: false, isPremiumWords: false });
    setSuccessToast('Plan Free Tier par reset ho gaya.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#130d24] to-[#1f113a] text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-purple-900/30 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌍</span>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                World AI Voice Studio
                <span className="hidden sm:inline-block rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Neural v2.5
                </span>
              </h1>
              <p className="text-[11px] text-purple-300/80 hidden sm:block">
                10+ Languages &bull; Male & Female &bull; Copyright Free
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Plan Badge */}
            {planStatus.isPremiumVoice && planStatus.isPremiumWords ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                🔥 VIP Combo Active
              </span>
            ) : planStatus.isPremiumVoice ? (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-500/30">
                ✨ Voices Unlocked
              </span>
            ) : (
              <button
                onClick={() => {
                  setInitialPackageType('combo');
                  setIsPaymentModalOpen(true);
                }}
                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 px-3 py-1 text-xs font-bold text-white shadow-sm shadow-pink-600/30 hover:opacity-95"
              >
                <Zap className="h-3.5 w-3.5 fill-current" /> Upgrade PRO
              </button>
            )}

            {/* History Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <History className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden xs:inline">History</span>
              {history.length > 0 && (
                <span className="rounded-full bg-purple-500/30 px-1.5 py-0.2 text-[10px] text-purple-300 font-mono">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Card (matching the style and layout from user brief, upgraded with Tailwind) */}
      <main className="flex-1 max-w-xl w-full mx-auto p-3 sm:p-4 my-auto">
        <div className="rounded-3xl border border-purple-500/30 bg-slate-900/90 p-5 sm:p-7 shadow-2xl shadow-purple-950/40 backdrop-blur-xl ring-1 ring-white/10">
          {/* Header Title & Subtitle */}
          <div className="text-center mb-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">
              🌍 World AI Voice Studio
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
              10 Languages | Male & Female | Copyright Free
            </p>
          </div>

          {/* Quick Preset Scripts Row */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <BookOpen className="h-3.5 w-3.5 text-purple-400" /> Sample Scripts:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEnhanceScript}
                  disabled={isEnhancing || !text.trim()}
                  className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 disabled:opacity-40"
                  title="AI Polish with Natural Speech Pauses"
                >
                  <Wand2 className="h-3 w-3" />
                  <span>{isEnhancing ? 'Polishing...' : 'AI Enhance Script'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="text-[11px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_SCRIPTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setText(preset.text);
                    setSelectedVoiceId(preset.voiceId);
                  }}
                  className="whitespace-nowrap rounded-lg bg-slate-950/80 border border-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-purple-500/50 hover:text-white transition-colors"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Yahan text likho... (500 words tak FREE)"
              dir="auto"
              className={`w-full h-32 rounded-2xl border-2 p-3.5 text-sm sm:text-base text-white placeholder-slate-500 bg-slate-950/70 focus:outline-none focus:ring-2 transition-all font-urdu leading-relaxed resize-y ${
                isWordLimitExceeded
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20'
                  : 'border-purple-500/40 focus:border-purple-400 focus:ring-purple-500/30'
              }`}
            />
          </div>

          {/* Word Counter matching user brief */}
          <div className="flex items-center justify-between mt-1.5 mb-3 text-xs">
            <span className="text-[11px] text-slate-500">
              {text.length} characters
            </span>
            <div
              id="counter"
              className={`font-semibold ${
                isWordLimitExceeded
                  ? 'text-red-400 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {wordCount} / 500 words {planStatus.isPremiumWords ? '(UNLIMITED ACTIVE)' : isWordLimitExceeded ? '(Limit Cross - Premium Needed)' : 'FREE'}
            </div>
          </div>

          {/* Voice and Speed Selectors */}
          <VoiceSelector
            voices={voices}
            selectedVoiceId={selectedVoiceId}
            onSelectVoice={setSelectedVoiceId}
            isPremiumVoice={planStatus.isPremiumVoice}
            onOpenUpgrade={() => {
              setInitialPackageType('voices');
              setIsPaymentModalOpen(true);
            }}
            speed={speed}
            onSpeedChange={setSpeed}
          />

          {/* Main Generate Button matching user brief */}
          <button
            id="generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-4 py-3.5 px-4 rounded-2xl font-bold text-white text-base shadow-lg shadow-purple-600/30 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Voice Generate Ho Rahi Hai...</span>
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5" />
                <span>🔊 Voice Generate Karo</span>
              </>
            )}
          </button>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-950/80 p-3 text-xs text-red-200">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMsg}</p>
                {errorMsg.includes('Premium') && (
                  <button
                    onClick={() => {
                      setInitialPackageType('combo');
                      setIsPaymentModalOpen(true);
                    }}
                    className="mt-1.5 font-bold underline text-white hover:text-pink-300"
                  >
                    Click here to open payment options &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successToast && (
            <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/80 p-3 text-xs text-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <p className="font-semibold">{successToast}</p>
            </div>
          )}

          {/* Audio Player Card */}
          <div className="mt-5">
            <AudioPlayer audio={currentAudio} />
          </div>

          {/* FREE Plan Box (exact requirement from user code) */}
          <div
            id="freeBox"
            className="mt-5 rounded-2xl border-2 border-dashed border-purple-500/40 bg-purple-950/20 p-4 text-xs sm:text-sm text-slate-300"
          >
            <b className="text-purple-300 text-sm">🎁 FREE Plan:</b>
            <div className="mt-2 space-y-1">
              <div>✅ 2 Voices FREE (Asad & Uzma)</div>
              <div>✅ 500 Words / Day FREE</div>
              <div>✅ Urdu + English Neural Quality</div>
            </div>
          </div>

          {/* Premium Box (matching user snippet with dynamic upgrade status) */}
          {!(planStatus.isPremiumVoice && planStatus.isPremiumWords) ? (
            <div
              id="premiumBox"
              className="mt-4 rounded-2xl border-2 border-pink-500/50 bg-pink-950/30 p-4 sm:p-5 text-slate-200"
            >
              {planStatus.isPremiumVoice ? (
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    ✅ Voices Unlocked! Words ke liye upgrade karo
                  </h3>
                </div>
              ) : null}

              <h3 className="text-base sm:text-lg font-bold text-pink-400 flex items-center gap-1.5">
                <Lock className="h-4 w-4" /> 🔒 Premium Unlock - Full World Access
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Agar aap ko zyada voices chahiye ya 500 words se zyada banana hai to:
              </p>

              <div className="mt-2.5 space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-pink-500/20">
                <p>
                  <b>Package 1:</b> All 12+ Voices Unlock = <b className="text-pink-400">Rs. 250 / Month</b>
                </p>
                <p>
                  <b>Package 2:</b> Unlimited Words (500+ words) = <b className="text-pink-400">Rs. 250 / Month Extra</b>
                </p>
                <p>
                  <b>Combo:</b> Dono = <b className="text-emerald-400 font-bold">Rs. 400 / Month</b> (Save Rs. 100)
                </p>
              </div>

              {/* Toggle Inline Payment Options button */}
              <button
                type="button"
                onClick={() => setShowInlinePayOpt(!showInlinePayOpt)}
                className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-md shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                💳 Payment Options Dekho
              </button>

              {/* Inline Payment Options Drawer matching user snippet `<div id="payOpt">` */}
              {showInlinePayOpt && (
                <div
                  id="payOpt"
                  className="mt-3.5 rounded-2xl bg-slate-950 p-4 border border-pink-500/30 text-left text-xs space-y-3"
                >
                  <div>
                    <p className="text-xs text-emerald-400 font-bold">🇵🇰 Pakistan ke liye:</p>
                    <p className="text-slate-300">
                      JazzCash / Easypaisa:{' '}
                      <b className="text-emerald-400 text-base font-mono">03267976823</b>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Account Title: <b className="text-white">AI Voice Studio</b>
                    </p>
                  </div>

                  <hr className="border-slate-800" />

                  <div>
                    <p className="text-xs text-amber-400 font-bold">🌍 Other Countries ke liye:</p>
                    <p className="text-slate-300">
                      Binance Pay ID: <b className="font-mono text-white">3267976823</b>
                    </p>
                    <p className="text-slate-300">
                      PayPal: contact on WhatsApp (
                      <a
                        href="https://wa.me/923267976823"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 underline font-bold"
                      >
                        03267976823
                      </a>
                      )
                    </p>
                  </div>

                  <hr className="border-slate-800" />

                  <p className="text-[11px] text-slate-400">
                    1. Upar diye gaye number par paise bhejo<br />
                    2. Neeche Trx ID likho
                  </p>

                  <input
                    id="trxid"
                    value={inlineTrxId}
                    onChange={(e) => setInlineTrxId(e.target.value)}
                    placeholder="Transaction ID / Hash (e.g. 03291847192)"
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono text-xs focus:outline-none focus:border-pink-500"
                  />

                  <select
                    id="pkg"
                    value={inlinePkg}
                    onChange={(e) => setInlinePkg(e.target.value as 'voices' | 'words' | 'combo')}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="voices">Sirf Voices - Rs.250</option>
                    <option value="words">Sirf Unlimited Words - Rs.250</option>
                    <option value="combo">Combo (Dono) - Rs.400</option>
                  </select>

                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                    <span>Instant demo:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInlineTrxId('DEMO400');
                        setInlinePkg('combo');
                      }}
                      className="rounded bg-purple-950 px-2 py-0.5 text-purple-300 ring-1 ring-purple-500/30"
                    >
                      DEMO400
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInlineTrxId('VIPFREE');
                        setInlinePkg('combo');
                      }}
                      className="rounded bg-pink-950 px-2 py-0.5 text-pink-300 ring-1 ring-pink-500/30"
                    >
                      VIPFREE
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleInlineVerify}
                    disabled={isInlineVerifying}
                    className="w-full p-3 rounded-xl font-bold text-white text-xs bg-pink-600 hover:bg-pink-500 shadow-md shadow-pink-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isInlineVerifying ? 'Verifying...' : '✅ Verify & Unlock'}
                  </button>

                  {inlineVerifyMsg && (
                    <p
                      className={`text-xs font-semibold p-2 rounded-lg ${
                        inlineVerifyMsg.includes('✅') || inlineVerifyMsg.includes('Mubarak')
                          ? 'bg-emerald-950/80 text-emerald-300'
                          : 'bg-red-950/80 text-red-300'
                      }`}
                    >
                      {inlineVerifyMsg}
                    </p>
                  )}

                  <p className="text-[11px] text-center text-slate-400">
                    WhatsApp par screenshot bhejo for fast unlock:<br />
                    <a
                      href="https://wa.me/923267976823?text=Assalam-o-Alaikum!%20Maine%20AI%20Voice%20Studio%20ke%20liye%20payment%20ki%20hai."
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-emerald-400 underline"
                    >
                      03267976823
                    </a>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-center">
              <span className="text-emerald-400 text-sm font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> VIP Full Access Active!
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Aapke paas All Voices aur Unlimited Words ka mukammal access mojood hai.
              </p>
              <button
                onClick={handleResetPlan}
                className="mt-2 text-[11px] text-slate-500 underline hover:text-slate-300"
              >
                Reset to Free Plan (Testing)
              </button>
            </div>
          )}

          {/* Support and Copyright note matching user code */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              &copy; World AI Voice Studio | 100% Copyright Free for TikTok, YouTube, Instagram, Facebook | Support:{' '}
              <a
                href="https://wa.me/923267976823"
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 font-bold hover:underline"
              >
                03267976823
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planStatus={planStatus}
        initialPackage={initialPackageType}
        onPlanUpdated={(newPlan) => {
          setPlanStatus(newPlan);
          setSuccessToast('🎉 Package activate ho gaya hai!');
        }}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectAudio={(item) => setCurrentAudio(item)}
        onClearHistory={clearHistory}
        onDeleteAudio={deleteHistoryItem}
      />
    </div>
  );
}
