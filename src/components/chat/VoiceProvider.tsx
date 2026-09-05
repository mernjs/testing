"use client";

import * as React from "react";
import { useChat, type AssistantDoneInfo } from "@/components/chat/ChatProvider";

export type VoiceStatus = "idle" | "listening" | "transcribing" | "thinking" | "speaking";

interface VoiceContextValue {
  supported: boolean;
  available: boolean;
  voiceMode: boolean;
  status: VoiceStatus;
  level: number;
  recordingMs: number;
  muted: boolean;
  hint: string | null;
  error: string | null;
  canReplay: boolean;
  setVoiceMode: (on: boolean) => void;
  toggleListening: () => void;
  stopListening: () => void;
  interrupt: () => void;
  replayLast: () => void;
  toggleMute: () => void;
  dismissHint: () => void;
}

const VoiceContext = React.createContext<VoiceContextValue | null>(null);

export function useVoice(): VoiceContextValue {
  const ctx = React.useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used within <VoiceProvider>");
  return ctx;
}

const MAX_RECORDING_MS = 60_000;
const SILENCE_MS = 1600; // auto-stop after this much quiet (once speech was detected)

function lsGet(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "1";
  } catch {
    return fallback;
  }
}
function lsSet(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) return c;
  }
  return "";
}

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const { send, config } = useChat();

  const [voiceMode, setVoiceModeState] = React.useState(false);
  const [status, setStatus] = React.useState<VoiceStatus>("idle");
  const [level, setLevel] = React.useState(0);
  const [recordingMs, setRecordingMs] = React.useState(0);
  const [muted, setMuted] = React.useState(false);
  const [hint, setHint] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [canReplay, setCanReplay] = React.useState(false);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = React.useRef(0);
  const audioElRef = React.useRef<HTMLAudioElement | null>(null);
  const elSourceRef = React.useRef<MediaElementAudioSourceNode | null>(null);
  const speakAbortRef = React.useRef<AbortController | null>(null);
  const lastBlobUrlRef = React.useRef<string | null>(null);
  const spokeAtRef = React.useRef(0);
  const silenceStartRef = React.useRef(0);
  const pendingTurnRef = React.useRef<{
    transcriptId: string;
    userText: string;
    userAudioDurationMs: number;
    sttMs: number;
  } | null>(null);
  const statusRef = React.useRef<VoiceStatus>("idle");
  const mutedRef = React.useRef(false);
  const stopListeningRef = React.useRef<() => void>(() => {});

  // Mirror render state into refs for use inside RAF loops / recorder callbacks.
  React.useEffect(() => {
    statusRef.current = status;
  }, [status]);
  React.useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const supported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined";
  const available = supported && Boolean(config?.voice?.available);

  // Restore persisted prefs after mount (kept out of the server render).
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
    setVoiceModeState(lsGet("yo_voice_mode", false));
    setMuted(lsGet("yo_voice_muted", false));
  }, []);

  // One shared <audio> element + analyser graph for playback metering.
  React.useEffect(() => {
    const el = new Audio();
    el.preload = "auto";
    audioElRef.current = el;
    const onEnded = () => {
      if (statusRef.current === "speaking") setStatus("idle");
    };
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("ended", onEnded);
      el.pause();
      audioElRef.current = null;
    };
  }, []);

  const stopMeter = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setLevel(0);
  }, []);

  const runMeter = React.useCallback(
    (analyser: AnalyserNode, mode: "listen" | "speak") => {
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const scaled = Math.min(1, rms * (mode === "listen" ? 3.2 : 2.4));
        setLevel(scaled);

        if (mode === "listen") {
          const now = performance.now();
          if (scaled > 0.06) {
            spokeAtRef.current = now;
            silenceStartRef.current = 0;
          } else if (spokeAtRef.current > 0) {
            if (silenceStartRef.current === 0) silenceStartRef.current = now;
            else if (now - silenceStartRef.current > SILENCE_MS) {
              stopListeningRef.current();
              return;
            }
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    []
  );

  const teardownRecording = React.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    stopMeter();
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, [stopMeter]);

  // --- Playback -----------------------------------------------------------

  const cleanupLastBlob = React.useCallback(() => {
    if (lastBlobUrlRef.current) {
      URL.revokeObjectURL(lastBlobUrlRef.current);
      lastBlobUrlRef.current = null;
    }
  }, []);

  const attachSpeakMeter = React.useCallback(() => {
    const el = audioElRef.current;
    if (!el) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      if (!elSourceRef.current) {
        elSourceRef.current = ctx.createMediaElementSource(el);
      }
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      elSourceRef.current.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      runMeter(analyser, "speak");
    } catch {
      /* metering is optional */
    }
  }, [runMeter]);

  const playBlob = React.useCallback(
    (blob: Blob) => {
      const el = audioElRef.current;
      if (!el) return;
      cleanupLastBlob();
      const url = URL.createObjectURL(blob);
      lastBlobUrlRef.current = url;
      setCanReplay(true);
      el.src = url;
      el.muted = mutedRef.current;
      attachSpeakMeter();
      void el.play().catch(() => {});
    },
    [attachSpeakMeter, cleanupLastBlob]
  );

  const speak = React.useCallback(
    async (info: AssistantDoneInfo) => {
      if (!available) {
        setStatus("idle");
        return;
      }
      setStatus("speaking");
      spokeAtRef.current = 0;
      const controller = new AbortController();
      speakAbortRef.current = controller;
      const pending = pendingTurnRef.current;
      pendingTurnRef.current = null;
      try {
        const res = await fetch("/api/voice/speak", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            text: info.text,
            chatMessageId: info.messageId,
            userChatMessageId: info.userMessageId,
            transcriptId: pending?.transcriptId,
            userText: pending?.userText,
            userAudioDurationMs: pending?.userAudioDurationMs,
            sttMs: pending?.sttMs,
          }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          setStatus("idle");
          setError("Couldn't play the voice reply.");
          return;
        }
        // Read the whole stream (also lets the server persist the audio via its tee),
        // then play. Short flash answers keep this well under ~2s.
        const buf = await res.arrayBuffer();
        if (controller.signal.aborted) return;
        playBlob(new Blob([buf], { type: "audio/mpeg" }));
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setStatus("idle");
        setError("Voice playback failed.");
      } finally {
        speakAbortRef.current = null;
      }
    },
    [available, playBlob]
  );

  // --- Recording --------------------------------------------------------

  const transcribeAndSend = React.useCallback(
    async (blob: Blob) => {
      setStatus("transcribing");
      const form = new FormData();
      form.append("audio", blob, "speech.webm");
      try {
        const res = await fetch("/api/voice/transcribe", { method: "POST", body: form });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setStatus("idle");
          setError(json.error ?? "Voice mode is unavailable right now.");
          return;
        }
        if (json.empty || !json.text) {
          setStatus("idle");
          setHint("Didn't catch that — try again.");
          return;
        }
        pendingTurnRef.current = {
          transcriptId: typeof json.transcriptId === "string" ? json.transcriptId : "",
          userText: json.text,
          userAudioDurationMs: typeof json.audioDurationMs === "number" ? json.audioDurationMs : 0,
          sttMs: typeof json.sttMs === "number" ? json.sttMs : 0,
        };
        setStatus("thinking");
        send(json.text, { voice: true, onAssistantDone: speak });
      } catch {
        setStatus("idle");
        setError("Network error — please try again.");
      }
    },
    [send, speak]
  );

  const stopListening = React.useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop();
    }
  }, []);
  React.useEffect(() => {
    stopListeningRef.current = stopListening;
  }, [stopListening]);

  const startListening = React.useCallback(async () => {
    if (!available || statusRef.current === "listening") return;
    setError(null);
    setHint(null);
    // stop any current playback first
    audioElRef.current?.pause();
    speakAbortRef.current?.abort();

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch {
      setError("Microphone access was denied.");
      return;
    }
    streamRef.current = stream;

    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current ??= new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") await ctx.resume();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      analyserRef.current = analyser;
      spokeAtRef.current = 0;
      silenceStartRef.current = 0;
      runMeter(analyser, "listen");
    } catch {
      /* metering optional */
    }

    const mimeType = pickMimeType();
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    chunksRef.current = [];
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      teardownRecording();
      setRecordingMs(0);
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      chunksRef.current = [];
      if (blob.size < 1200) {
        setStatus("idle");
        setHint("That was too short — hold the mic a little longer.");
        return;
      }
      void transcribeAndSend(blob);
    };
    mediaRecorderRef.current = rec;
    rec.start();

    startedAtRef.current = performance.now();
    setRecordingMs(0);
    timerRef.current = setInterval(() => {
      const ms = performance.now() - startedAtRef.current;
      setRecordingMs(ms);
      if (ms >= MAX_RECORDING_MS) stopListeningRef.current();
    }, 100);

    setStatus("listening");
  }, [available, runMeter, teardownRecording, transcribeAndSend]);

  const toggleListening = React.useCallback(() => {
    if (statusRef.current === "listening") stopListening();
    else if (statusRef.current === "idle") void startListening();
  }, [startListening, stopListening]);

  const interrupt = React.useCallback(() => {
    speakAbortRef.current?.abort();
    const el = audioElRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    teardownRecording();
    stopMeter();
    setRecordingMs(0);
    setStatus("idle");
  }, [stopMeter, teardownRecording]);

  const replayLast = React.useCallback(() => {
    const el = audioElRef.current;
    if (!el || !lastBlobUrlRef.current) return;
    el.src = lastBlobUrlRef.current;
    el.muted = mutedRef.current;
    setStatus("speaking");
    attachSpeakMeter();
    void el.play().catch(() => {});
  }, [attachSpeakMeter]);

  const toggleMute = React.useCallback(() => {
    setMuted((m) => {
      const next = !m;
      lsSet("yo_voice_muted", next);
      if (audioElRef.current) audioElRef.current.muted = next;
      return next;
    });
  }, []);

  const setVoiceMode = React.useCallback(
    (on: boolean) => {
      setVoiceModeState(on);
      lsSet("yo_voice_mode", on);
      if (!on) interrupt();
    },
    [interrupt]
  );

  const dismissHint = React.useCallback(() => setHint(null), []);

  // Auto-clear transient messages
  React.useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 4000);
    return () => clearTimeout(t);
  }, [hint]);
  React.useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(t);
  }, [error]);

  React.useEffect(() => {
    return () => {
      teardownRecording();
      stopMeter();
      speakAbortRef.current?.abort();
      cleanupLastBlob();
    };
  }, [teardownRecording, stopMeter, cleanupLastBlob]);

  const value = React.useMemo<VoiceContextValue>(
    () => ({
      supported,
      available,
      voiceMode,
      status,
      level,
      recordingMs,
      muted,
      hint,
      error,
      canReplay,
      setVoiceMode,
      toggleListening,
      stopListening,
      interrupt,
      replayLast,
      toggleMute,
      dismissHint,
    }),
    [
      supported,
      available,
      voiceMode,
      status,
      level,
      recordingMs,
      muted,
      hint,
      error,
      canReplay,
      setVoiceMode,
      toggleListening,
      stopListening,
      interrupt,
      replayLast,
      toggleMute,
      dismissHint,
    ]
  );

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}
