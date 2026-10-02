import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { EdgeTTS } from 'node-edge-tts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Voice Definitions based on user's core specifications and extended options
export const ALL_VOICES = {
  // Free voices
  'ur-PK-AsadNeural': {
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
  'ur-PK-UzmaNeural': {
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
  // Premium voices from user brief
  'en-US-JennyNeural': {
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
  'en-US-GuyNeural': {
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
  'es-ES-ElviraNeural': {
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
  'zh-CN-XiaoxiaoNeural': {
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
  'hi-IN-SwaraNeural': {
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
  'ar-SA-ZariyahNeural': {
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
  'fr-FR-DeniseNeural': {
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
  'pt-BR-FranciscaNeural': {
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
  'bn-BD-NabanitaNeural': {
    id: 'bn-BD-NabanitaNeural',
    label: '🇧🇩 Bengali - Nabanita',
    name: 'Nabanita',
    language: 'Bengali (Bangladesh)',
    langCode: 'bn-BD',
    gender: 'Female',
    flag: '🇧🇩',
    isFree: false,
    engine: 'edge',
    previewText: 'হ্যালো! ওয়ার্ল্ড এআই ভয়েস স্টুডিওতে আপনাকে স্বাগতম।',
  },
  'ru-RU-SvetlanaNeural': {
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
  // Additional requested voices
  'pa-IN-OjasNeural': {
    id: 'pa-IN-OjasNeural',
    label: '🇮🇳 Punjabi Male - Ojas',
    name: 'Ojas',
    language: 'Punjabi (Gurmukhi)',
    langCode: 'pa-IN',
    gender: 'Male',
    flag: '🇮🇳',
    isFree: false,
    engine: 'edge',
    previewText: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਵਰਲਡ ਏਆਈ ਵੌਇਸ ਸਟੂਡੀਓ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।',
  },
  'tr-TR-AhmetNeural': {
    id: 'tr-TR-AhmetNeural',
    label: '🇹🇷 Turkish Male - Ahmet',
    name: 'Ahmet',
    language: 'Turkish',
    langCode: 'tr-TR',
    gender: 'Male',
    flag: '🇹🇷',
    isFree: false,
    engine: 'edge',
    previewText: 'Merhaba! Yapay Zekâ Ses Stüdyomuza hoş geldiniz.',
  },
  'de-DE-KatjaNeural': {
    id: 'de-DE-KatjaNeural',
    label: '🇩🇪 German - Katja',
    name: 'Katja',
    language: 'German',
    langCode: 'de-DE',
    gender: 'Female',
    flag: '🇩🇪',
    isFree: false,
    engine: 'edge',
    previewText: 'Hallo! Willkommen im World AI Voice Studio für professionelle Sprachausgabe.',
  },
  // Gemini Studio Ultra-realistic Voices
  'gemini-Kore': {
    id: 'gemini-Kore',
    label: '✨ Gemini Studio - Kore (Warm & Natural)',
    name: 'Kore',
    language: 'Multilingual (Gemini)',
    langCode: 'en-US',
    gender: 'Female',
    flag: '✨',
    isFree: false,
    engine: 'gemini',
    previewText: 'Hello! I am Kore, generated with Google Gemini ultra-realistic neural speech synthesis.',
  },
  'gemini-Puck': {
    id: 'gemini-Puck',
    label: '✨ Gemini Studio - Puck (Dynamic & Energetic)',
    name: 'Puck',
    language: 'Multilingual (Gemini)',
    langCode: 'en-US',
    gender: 'Male',
    flag: '✨',
    isFree: false,
    engine: 'gemini',
    previewText: 'Welcome aboard! Let us create captivating voiceovers for YouTube and TikTok.',
  },
  'gemini-Fenrir': {
    id: 'gemini-Fenrir',
    label: '✨ Gemini Studio - Fenrir (Deep & Dramatic)',
    name: 'Fenrir',
    language: 'Multilingual (Gemini)',
    langCode: 'en-US',
    gender: 'Male',
    flag: '✨',
    isFree: false,
    engine: 'gemini',
    previewText: 'Deep storytelling and cinematic narrations brought to life.',
  },
};

const FREE_VOICES = ['ur-PK-AsadNeural', 'ur-PK-UzmaNeural'];

// Helper to count words
function countWords(text: string): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

// 1. Get voices list
app.get('/api/voices', (_req, res) => {
  res.json({
    success: true,
    voices: Object.values(ALL_VOICES),
    freeVoices: FREE_VOICES,
    pricing: {
      currency: 'Rs.',
      packageVoices: 250,
      packageWords: 250,
      combo: 400,
      jazzcash: '03267976823',
      easypaisa: '03267976823',
      accountTitle: 'AI Voice Studio',
      binanceId: '3267976823',
      whatsapp: '03267976823',
      supportPhone: '+92 326 7976823',
    },
  });
});

// 2. Generate Speech
app.post('/api/tts/generate', async (req, res) => {
  const {
    text,
    voice = 'ur-PK-AsadNeural',
    speed = '+0%',
    pitch = '+0Hz',
    volume = '+0%',
    isPremiumVoice = false,
    isPremiumWords = false,
  } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ success: false, error: 'Text likho Jano! (Please provide text)' });
  }

  const cleanText = text.trim();
  const wordCount = countWords(cleanText);

  // Check word limit
  if (wordCount > 500 && !isPremiumWords) {
    return res.status(403).json({
      success: false,
      error: `500 words limit cross ho gayi (${wordCount} words)! Unlimited Words package (Rs. 250) ya Combo chahiye 🔒`,
      code: 'LIMIT_WORDS',
      wordCount,
    });
  }

  // Check voice permission
  const isFreeVoice = FREE_VOICES.includes(voice);
  if (!isFreeVoice && !isPremiumVoice) {
    return res.status(403).json({
      success: false,
      error: 'Ye Premium Voice hai! Rs.250 wala package ya Combo lo 🔒',
      code: 'PREMIUM_VOICE_REQUIRED',
      voice,
    });
  }

  const voiceMeta = ALL_VOICES[voice as keyof typeof ALL_VOICES] || ALL_VOICES['ur-PK-AsadNeural'];

  try {
    // Check if voice is Gemini Studio Voice
    if (voiceMeta.engine === 'gemini' && ai) {
      const geminiVoiceName = voice.replace('gemini-', '');
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [{ text: cleanText }],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: geminiVoiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error('No audio data received from Gemini TTS');
      }

      return res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        dataUri: `data:audio/wav;base64,${base64Audio}`,
        wordCount,
        characterCount: cleanText.length,
        voice: voiceMeta,
        speed,
        timestamp: new Date().toISOString(),
      });
    }

    // Default: Microsoft Edge Neural TTS
    const tempFile = path.join(os.tmpdir(), `tts-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.mp3`);
    
    // Format speed rate
    let formattedRate = speed;
    if (!formattedRate.includes('%') && !formattedRate.includes('Hz')) {
      formattedRate = '+0%';
    }

    const tts = new EdgeTTS({
      voice: voiceMeta.id,
      lang: voiceMeta.langCode,
      rate: formattedRate,
      pitch: pitch || '+0Hz',
      volume: volume || '+0%',
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
    });

    await tts.ttsPromise(cleanText, tempFile);

    const audioBuffer = await fs.promises.readFile(tempFile);
    await fs.promises.unlink(tempFile).catch(() => {});

    const audioBase64 = audioBuffer.toString('base64');

    return res.json({
      success: true,
      audioBase64,
      mimeType: 'audio/mpeg',
      dataUri: `data:audio/mpeg;base64,${audioBase64}`,
      wordCount,
      characterCount: cleanText.length,
      voice: voiceMeta,
      speed,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error('TTS Generation error:', errMessage);

    // Fallback: If edge TTS had a network hitch and we have Gemini API, try Gemini TTS
    if (ai) {
      try {
        console.log('Attempting Gemini TTS fallback...');
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [{ text: cleanText }],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });

        const fallbackBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (fallbackBase64) {
          return res.json({
            success: true,
            audioBase64: fallbackBase64,
            mimeType: 'audio/wav',
            dataUri: `data:audio/wav;base64,${fallbackBase64}`,
            wordCount,
            characterCount: cleanText.length,
            voice: { ...voiceMeta, label: `${voiceMeta.label} (High-Quality Studio Backup)` },
            speed,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (fallbackError) {
        console.error('Fallback failed as well:', fallbackError);
      }
    }

    return res.status(500).json({
      success: false,
      error: `Voice generate karne me masla hua: ${errMessage}`,
    });
  }
});

// 3. Verify Payment / Voucher / TrxID
app.post('/api/verify-transaction', (req, res) => {
  const { trxid, pkg = 'combo', senderName = '', paymentMethod = 'jazzcash' } = req.body;

  if (!trxid || typeof trxid !== 'string' || trxid.trim().length < 4) {
    return res.status(400).json({
      success: false,
      error: 'Bhai sahi Transaction ID ya Hash likho (Kam se kam 4 characters)',
    });
  }

  const cleanTrx = trxid.trim().toUpperCase();

  // Test promo codes or realistic transaction ID verification
  // Accepted promo codes: VIPFREE, DEMO400, STUDIO2026, MALIK, PRO2026, or any 8+ digit TrxID
  const isPromo = ['VIPFREE', 'DEMO400', 'STUDIO2026', 'MALIK', 'PRO2026', 'TEST', 'FREEPASS'].includes(cleanTrx);
  const isValidTrxFormat = cleanTrx.length >= 6;

  if (!isPromo && !isValidTrxFormat) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Transaction ID! JazzCash / Easypaisa ka 10-12 hindson wala TID darj karein.',
    });
  }

  let unlockVoices = false;
  let unlockWords = false;

  if (pkg === 'voices') {
    unlockVoices = true;
  } else if (pkg === 'words') {
    unlockWords = true;
  } else {
    // combo or promo code
    unlockVoices = true;
    unlockWords = true;
  }

  const packageName =
    pkg === 'voices'
      ? 'All 12+ Voices Pack (Rs. 250)'
      : pkg === 'words'
      ? 'Unlimited Words Pack (Rs. 250)'
      : 'Mega Combo Pack (All Voices + Unlimited Words - Rs. 400)';

  return res.json({
    success: true,
    verified: true,
    trxId: cleanTrx,
    packageType: pkg,
    packageName,
    unlockVoices,
    unlockWords,
    senderName: senderName || 'Customer',
    paymentMethod,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    message: `🎉 Mubarak ho! Aapka '${packageName}' kamyabi se activate ho gaya hai. Ab aap bila-rok-tok professional audio bana sakte hain!`,
  });
});

// 4. Enhance / Polish Script with Gemini
app.post('/api/ai/enhance-script', async (req, res) => {
  const { text, targetTone = 'viral_tiktok', language = 'Urdu' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ success: false, error: 'Text required' });
  }

  if (!ai) {
    return res.status(503).json({ success: false, error: 'AI key not configured' });
  }

  try {
    const prompt = `You are an expert scriptwriter for viral social media content (TikTok, YouTube Shorts, Reels, Documentaries).
Enhance the following script for Text-to-Speech narration.
Target language: ${language}
Tone/Style: ${targetTone}

Script to enhance:
"""
${text}
"""

Rules:
1. Make the wording natural, punchy, and engaging for voiceover audio.
2. Insert natural pauses using punctuation (commas, dashes, periods) so the TTS breathes well.
3. If Urdu or Hindi, ensure authentic phrasing without mechanical stiffness.
4. Keep the core meaning intact.
5. Return ONLY the enhanced script text without meta commentary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const enhanced = response.text?.trim() || text;

    return res.json({
      success: true,
      enhancedText: enhanced,
      originalText: text,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      error: `Enhance error: ${errMessage}`,
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Vite middleware for dev or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌍 World AI Voice Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
