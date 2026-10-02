export interface Voice {
  id: string;
  label: string;
  name: string;
  language: string;
  langCode: string;
  gender: 'Male' | 'Female';
  flag: string;
  isFree: boolean;
  engine: 'edge' | 'gemini';
  previewText: string;
}

export interface GeneratedAudio {
  id: string;
  title: string;
  text: string;
  audioDataUri: string;
  mimeType: string;
  voice: Voice;
  speed: string;
  pitch?: string;
  wordCount: number;
  characterCount: number;
  createdAt: string;
  duration?: number;
}

export interface PlanStatus {
  isPremiumVoice: boolean;
  isPremiumWords: boolean;
  activatedPackage?: 'voices' | 'words' | 'combo';
  trxId?: string;
  activatedAt?: string;
  expiresAt?: string;
}

export interface PresetScript {
  id: string;
  title: string;
  category: 'Urdu Poetry' | 'TikTok Facts' | 'Motivation' | 'News / Bulletin' | 'Islamic Quotes' | 'Storytelling';
  language: string;
  voiceId: string;
  text: string;
}
