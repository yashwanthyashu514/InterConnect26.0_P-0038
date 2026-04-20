import { NextResponse } from "next/server";

type VoiceAssistPayload = {
  text_response: string;
  transcript: string;
  detected_language: string;
  audio_base64: string;
  audio_mime_type: string;
};

const SUPPORTED_LANGUAGES = new Set(["en-IN", "hi-IN", "kn-IN", "ml-IN", "gu-IN", "mr-IN"]);

function normalizeLanguage(code: string | null | undefined): string {
  if (!code) return "en-IN";
  return SUPPORTED_LANGUAGES.has(code) ? code : "en-IN";
}

function detectLanguageFromText(text: string): string {
  if (/[\u0C80-\u0CFF]/u.test(text)) return "kn-IN"; // Kannada
  if (/[\u0D00-\u0D7F]/u.test(text)) return "ml-IN"; // Malayalam
  if (/[\u0A80-\u0AFF]/u.test(text)) return "gu-IN"; // Gujarati
  if (/[\u0900-\u097F]/u.test(text)) {
    // Hindi and Marathi both use Devanagari. Heuristic keeps Hindi as default.
    if (/\b(aahe|nahiye|karaycha|pahije)\b/iu.test(text)) return "mr-IN";
    return "hi-IN";
  }
  return "en-IN";
}

function ttsInstructionForLanguage(language: string): string {
  switch (language) {
    case "hi-IN":
      return "Speak in Hindi with clear Indian pronunciation.";
    case "kn-IN":
      return "Speak in Kannada with natural Indian pronunciation.";
    case "ml-IN":
      return "Speak in Malayalam with natural Indian pronunciation.";
    case "gu-IN":
      return "Speak in Gujarati with natural Indian pronunciation.";
    case "mr-IN":
      return "Speak in Marathi with natural Indian pronunciation.";
    default:
      return "Speak in clear Indian English.";
  }
}

async function transcribeAudioWithSarvam(file: File, apiKey: string, languageHint: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language_code", languageHint);
  formData.append("model", "saaras:v3");

  const response = await fetch("https://api.sarvam.ai/speech-to-text", {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`SARVAM_STT_FAILED_${response.status}_${errText}`);
  }

  const data = (await response.json()) as { transcript?: string };
  return (data.transcript ?? "").trim();
}

async function transcribeAudioWithOpenAI(file: File, apiKey: string): Promise<string> {
  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("file", file);

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`STT_FAILED_${response.status}_${errText}`);
  }

  const data = (await response.json()) as { text?: string };
  return (data.text ?? "").trim();
}

async function streamAskResponse(query: string, languageCode: string, backendUrl: string): Promise<string> {
  const response = await fetch(`${backendUrl}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      agent_id: "A6",
      language: languageCode,
      language_code: languageCode,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`ASK_FAILED_${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n");
    buffer = parts.pop() ?? "";

    for (const line of parts) {
      if (!line.startsWith("data: ")) continue;
      const dataStr = line.slice(6).trim();
      if (dataStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(dataStr) as { token?: string };
        if (parsed.token) fullText += parsed.token;
      } catch {
        // Ignore malformed SSE chunks.
      }
    }
  }

  return fullText.trim();
}

async function synthesizeAudioWithSarvam(text: string, languageCode: string, apiKey: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: languageCode,
      speaker: "anushka",
      model: "bulbul:v1",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`SARVAM_TTS_FAILED_${response.status}_${errText}`);
  }

  const data = (await response.json()) as { audios: string[] };
  return { base64: data.audios[0], mimeType: "audio/mpeg" };
}

async function synthesizeAudioWithOpenAI(text: string, languageCode: string, apiKey: string): Promise<{ base64: string; mimeType: string }> {
  const prompt = `${ttsInstructionForLanguage(languageCode)}\n\n${text}`;
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      format: "mp3",
      input: prompt,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`TTS_FAILED_${response.status}_${errText}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const audioBase64 = Buffer.from(audioBuffer).toString("base64");
  return { base64: audioBase64, mimeType: "audio/mpeg" };
}

export async function POST(req: Request) {
  try {
    const openAiApiKey = process.env.OPENAI_API_KEY;
    const sarvamApiKey = process.env.SARVAM_API_KEY;

    const isOpenAiValid = openAiApiKey && openAiApiKey !== "ROTATE_REQUIRED_SET_NEW_OPENAI_KEY";
    const isSarvamValid = sarvamApiKey && sarvamApiKey.startsWith("sk_");

    if (!isOpenAiValid && !isSarvamValid) {
      return NextResponse.json({ 
        error: "Voice feature configuration missing. Please set a valid OPENAI_API_KEY or SARVAM_API_KEY in your .env file." 
      }, { status: 503 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const formData = await req.formData();
    const audio = formData.get("audio");
    const languageHint = normalizeLanguage((formData.get("language_hint") as string | null) ?? "en-IN");

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "Audio file missing" }, { status: 400 });
    }

    // 1. Transcription (STT)
    let transcript = "";
    if (isSarvamValid) {
      transcript = await transcribeAudioWithSarvam(audio, sarvamApiKey!, languageHint);
    } else {
      transcript = await transcribeAudioWithOpenAI(audio, openAiApiKey!);
    }

    if (!transcript) {
      return NextResponse.json({ error: "No speech detected. Please try again." }, { status: 400 });
    }

    const detectedLanguage = detectLanguageFromText(transcript);
    const responseLanguage = detectedLanguage || languageHint;

    // 2. Intelligence Layer
    const textResponse = await streamAskResponse(transcript, responseLanguage, backendUrl);
    if (!textResponse) {
      return NextResponse.json({ error: "No response generated by Voice CA" }, { status: 502 });
    }

    // 3. Synthesis (TTS)
    let tts;
    if (isSarvamValid) {
      tts = await synthesizeAudioWithSarvam(textResponse, responseLanguage, sarvamApiKey!);
    } else {
      tts = await synthesizeAudioWithOpenAI(textResponse, responseLanguage, openAiApiKey!);
    }

    const payload: VoiceAssistPayload = {
      text_response: textResponse,
      transcript,
      detected_language: responseLanguage,
      audio_base64: tts.base64,
      audio_mime_type: tts.mimeType,
    };

    return NextResponse.json(payload);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown voice pipeline error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

