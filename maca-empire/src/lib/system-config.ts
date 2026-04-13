/**
 * MaCA Empire: Integrated System Configuration
 * This file contains the master logic for the Global Compliance Index (GCI),
 * Mission Intelligence Ticker (MIT), and the Multilingual Orchestration Engine.
 */

export const SYSTEM_CONFIG = {
  multilingual_engine: {
    description: "Auto-detect user language, translate to English for LLM processing, respond in the user's original language. Applies to all A6 Voice CA interactions and optionally to all 15 agents.",
    pivot_language: "en-IN",
    translation_stack: {
      primary: "IndicTrans2 by AI4Bharat (self-hosted on FastAPI)",
      fallback: "Google Cloud Translation API v3",
      government_option: "Bhashini NMT (MeitY) — free tier for cost control"
    },
    stt_stack: {
      primary: "Sarvam AI sarvam-1 — best WER for Indian accents",
      fallback: "Google Cloud Speech-to-Text v2",
      government_option: "Bhashini ASR (MeitY)"
    },
    tts_stack: {
      primary: "Sarvam AI TTS — natural prosody for Hindi/Kannada/Marathi",
      secondary: "Google WaveNet / Neural2 Indian voices",
      premium: "ElevenLabs Multilingual v2 — for client-facing demos"
    },
    supported_languages: [
      { code: "en-IN", name: "English", script: "Latin", is_pivot: true },
      { code: "hi-IN", name: "Hindi", script: "Devanagari", is_pivot: false },
      { code: "kn-IN", name: "Kannada", script: "Kannada", is_pivot: false },
      { code: "ml-IN", name: "Malayalam", script: "Malayalam", is_pivot: false },
      { code: "gu-IN", name: "Gujarati", script: "Gujarati", is_pivot: false },
      { code: "mr-IN", name: "Marathi", script: "Devanagari", is_pivot: false }
    ],
    oracle_rule: "The Oracle and all 15 agents MUST respond in the language the user first spoke in. Legal citations remain in English within the regional response."
  },
  
  engines: {
    gci_engine: {
      name: "Global Compliance Index",
      thresholds: { critical: 30, warning: 60, stable: 85 }
    },
    mit_ticker: {
      name: "Mission Intelligence Ticker",
      refresh_rate: "Real-time / Streamed"
    },
    arq_engine: {
      name: "Autonomous Risk Queue",
      stages: [7, 30, 60, 90]
    }
  }
};

export const A6_CONFIG = {
  id: "A6",
  name: "Voice CA",
  domains: [
    "Multimodal Legal Advisory",
    "Multilingual Interface",
    "Notice Drafting",
    "Contract Review",
    "Estate Planning"
  ],
  capabilities: [
    "Conversational legal advisory in 6 languages",
    "Auto-detect user language on every turn",
    "Voice-to-notice drafting in regional scripts",
    "SPA/SHA review via voice",
    "Will drafting",
    "Accessibility-first legal interface"
  ],
  voice_intents: [
    "draft a notice",
    "review this contract",
    "draft a will",
    "legal advice",
    "review this SPA",
    "kya karna chahiye",
    "notice draft karo",
    "kelsa madabekaagide",
    "enthu cheyyanam",
    "shu karvu",
    "kay karaycha"
  ]
};
