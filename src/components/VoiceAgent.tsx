"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { agentReply, initialAgentState } from "@/lib/agent";

type Speaker = "agent" | "customer" | "system";

interface Transcript {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: number;
}

const SPEECH_LANG = "hi-IN";

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG;
  utterance.rate = 0.95;
  utterance.pitch = 1;

  const matchingVoice = window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().includes("hi"));

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function createRecognition() {
  if (typeof window === "undefined") return null;
  const SpeechRecognitionCtor =
    window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!SpeechRecognitionCtor) return null;
  const recognition = new SpeechRecognitionCtor();
  recognition.lang = SPEECH_LANG;
  recognition.continuous = false;
  recognition.interimResults = false;
  return recognition;
}

export function VoiceAgent() {
  const [transcripts, setTranscripts] = useState<Transcript[]>(() => {
    const greeting = initialAgentState();
    return [
      {
        id: "agent-initial",
        speaker: "agent",
        text: greeting.reply,
        timestamp: Date.now(),
      },
    ];
  });
  const [context, setContext] = useState(initialAgentState().context);
  const [recognitionAvailable, setRecognitionAvailable] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const customerInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const conversationStarted = useMemo(
    () => transcripts.length > 1,
    [transcripts.length],
  );

  useEffect(() => {
    recognitionRef.current = createRecognition();
    setRecognitionAvailable(!!recognitionRef.current);
  }, []);

  useEffect(() => {
    speak(transcripts[transcripts.length - 1]?.text ?? "");
  }, [transcripts]);

  const pushTranscript = useCallback((speaker: Speaker, text: string) => {
    setTranscripts((prev) => [
      ...prev,
      {
        id: `${speaker}-${prev.length + 1}`,
        speaker,
        text,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const handleAgentResponse = useCallback(
    (customerUtterance: string) => {
      pushTranscript("customer", customerUtterance);
      const response = agentReply(customerUtterance, context);
      setContext(response.context);
      pushTranscript("agent", response.reply);
    },
    [context, pushTranscript],
  );

  const handleCustomerUtterance = useCallback(
    (utterance: string) => {
      if (!utterance) return;
      setError(null);
      handleAgentResponse(utterance);
    },
    [handleAgentResponse],
  );

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript)
        .filter(Boolean)
        .join(" ")
        .trim();

      if (!transcript) return;
      handleCustomerUtterance(transcript);
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      if (listening) {
        recognition.start();
      }
    };
  }, [handleCustomerUtterance, listening]);

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setListening(true);
    setError(null);
    recognition.start();
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setListening(false);
    recognition.stop();
  };

  const handleManualSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = customerInputRef.current;
    if (!input) return;
    const value = input.value.trim();
    if (!value) return;
    handleCustomerUtterance(value);
    input.value = "";
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg shadow-emerald-500/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-4">
          <header className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Wishfin Voice Agent
              </p>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                हिंदी में संवाद और लोन मार्गदर्शन
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                रीयल-टाइम ऑफ़र मैचिंग, दस्तावेज़ सहायता और कॉल के बाद फॉलो-अप
                संदेश।
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
              लाइव
            </span>
          </header>

          <div className="space-y-3 rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-emerald-50 to-white p-4 dark:border-zinc-800/80 dark:from-zinc-900 dark:to-zinc-950">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors ${
                  listening ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                } ${!recognitionAvailable ? "opacity-50" : ""}`}
                disabled={!recognitionAvailable}
              >
                <span className="text-lg">{listening ? "■" : "🎙️"}</span>
              </button>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {listening ? "सुन रही हूँ..." : "माइक चालू करने के लिए टैप करें"}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {recognitionAvailable
                    ? "क्रोम या एज ब्राउज़र में सबसे बेहतर अनुभव मिलेगा।"
                    : "आपका ब्राउज़र अभी वॉयस इनपुट सपोर्ट नहीं करता, कृपया नीचे टेक्स्ट से प्रतिक्रिया दें।"}
                </p>
              </div>
            </div>
            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                माइक में कोई दिक्कत आ गई: {error}
              </div>
            )}
          </div>

          <div className="grid gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <div className="rounded-xl bg-white/70 p-3 text-xs text-zinc-500 shadow-sm dark:bg-zinc-900/70">
              हम आपकी आवाज़ का उपयोग केवल इस ब्राउज़र सेशन में करते हैं। कोई कॉल
              रिकॉर्डिंग सर्वर पर सेव नहीं होती।
            </div>
            {!conversationStarted && (
              <div className="rounded-xl border border-dashed border-emerald-400/60 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300">
                ग्राहक की प्रतिक्रिया रिकॉर्ड होने पर बातचीत अपने आप आगे बढ़ती
                जाएगी। जल्दी से माइक चालू करें और बातचीत शुरू करें।
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-zinc-200/60 bg-white/60 p-4 shadow-inner dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            कॉल ट्रांसक्रिप्ट
          </h3>
          <ol className="flex h-72 flex-col gap-3 overflow-y-auto rounded-xl border border-zinc-100/80 bg-white/80 p-4 text-sm leading-relaxed dark:border-zinc-800 dark:bg-zinc-950/80">
            {transcripts.map((message) => (
              <li
                key={message.id}
                className={`rounded-2xl px-4 py-3 ${
                  message.speaker === "agent"
                    ? "self-start bg-emerald-500/10 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100"
                    : message.speaker === "customer"
                      ? "self-end bg-zinc-200/60 text-zinc-900 dark:bg-zinc-700/40 dark:text-zinc-50"
                      : "bg-zinc-100/60 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200"
                }`}
              >
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {message.speaker === "agent"
                    ? "एजेंट"
                    : message.speaker === "customer"
                      ? "ग्राहक"
                      : "सिस्टम"}
                </span>
                {message.text}
              </li>
            ))}
          </ol>

          <form
            onSubmit={handleManualSubmit}
            className="mt-4 flex gap-2 rounded-2xl border border-zinc-200/80 bg-white/80 p-2 dark:border-zinc-800 dark:bg-zinc-950/80"
          >
            <input
              ref={customerInputRef}
              type="text"
              placeholder="अगर आवाज़ काम नहीं करे, तो ग्राहक की बात हिंदी में यहाँ लिखें…"
              className="flex-1 rounded-xl bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:text-zinc-50"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              जोड़ें
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
