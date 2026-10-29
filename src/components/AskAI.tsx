import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PROJECT_ID } from "../data/company";
import { streamKphReply, type AptCard } from "../lib/kphEngine";
import KhalijiGuide from "./KhalijiGuide";

const ASK_API = (import.meta.env.VITE_ASK_API || import.meta.env.VITE_CASCO_API || "https://api.casco.studio").replace(
  /\/$/,
  "",
);

type ChatItem = {
  role: "user" | "assistant";
  text: string;
  thinking?: string;
  showThinking?: boolean;
  apartments?: AptCard[];
  phase?: "thinking" | "answer" | "done";
};

function formatMoney(n: number, ar: boolean) {
  return new Intl.NumberFormat(ar ? "ar-AE" : "en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AskAI() {
  const { t, i18n } = useTranslation();
  const ar = i18n.language.startsWith("ar");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ChatItem[]>([
    { role: "assistant", text: t("ask.welcome"), phase: "done" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items, open]);

  useEffect(() => {
    setItems((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant" && !prev[0].thinking) {
        return [{ role: "assistant", text: t("ask.welcome"), phase: "done" }];
      }
      return prev;
    });
  }, [t, i18n.language]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function patchAssistant(patch: Partial<ChatItem>) {
    setItems((current) => {
      const next = [...current];
      for (let i = next.length - 1; i >= 0; i -= 1) {
        if (next[i].role === "assistant") {
          next[i] = { ...next[i], ...patch };
          break;
        }
      }
      return next;
    });
  }

  async function streamRemote(message: string, signal: AbortSignal) {
    const response = await fetch(`${ASK_API}/api/rasikhoon/ask/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify({ message, projectId: PROJECT_ID, lang: ar ? "ar" : "en" }),
      signal,
    });
    if (!response.ok || !response.body) throw new Error("stream unavailable");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let thinking = "";
    let answer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() || "";

      for (const chunk of chunks) {
        const line = chunk
          .split("\n")
          .map((part) => part.trim())
          .find((part) => part.startsWith("data:"));
        if (!line) continue;
        const payload = line.slice(5).trim();
        if (!payload) continue;

        let data: {
          thinkingToken?: string;
          thinkingDone?: boolean;
          token?: string;
          apartments?: AptCard[];
          done?: boolean;
          error?: string;
        };
        try {
          data = JSON.parse(payload);
        } catch {
          continue;
        }

        if (data.error) throw new Error(data.error);
        if (typeof data.thinkingToken === "string") {
          thinking += data.thinkingToken;
          patchAssistant({ thinking, showThinking: true, phase: "thinking" });
        }
        if (data.thinkingDone) patchAssistant({ thinking, showThinking: false, phase: "answer" });
        if (typeof data.token === "string") {
          answer += data.token;
          patchAssistant({ text: answer, phase: "answer", showThinking: false });
        }
        if (data.apartments?.length) patchAssistant({ apartments: data.apartments });
        if (data.done) patchAssistant({ phase: "done", showThinking: false });
      }
    }

    if (!answer && !thinking) throw new Error("empty");
  }

  async function streamLocal(message: string, signal: AbortSignal) {
    let thinking = "";
    let answer = "";
    await streamKphReply(message, ar ? "ar" : "en", (ev) => {
      if ("thinkingToken" in ev) {
        thinking += ev.thinkingToken;
        patchAssistant({ thinking, showThinking: true, phase: "thinking" });
      } else if ("thinkingDone" in ev) {
        patchAssistant({ thinking, showThinking: false, phase: "answer" });
      } else if ("token" in ev) {
        answer += ev.token;
        patchAssistant({ text: answer, phase: "answer", showThinking: false });
      } else if ("apartments" in ev) {
        patchAssistant({ apartments: ev.apartments });
      } else if ("done" in ev) {
        patchAssistant({ phase: "done", showThinking: false });
      }
    }, signal);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setInput("");
    setLoading(true);
    setItems((current) => [
      ...current,
      { role: "user", text: message },
      { role: "assistant", text: "", thinking: "", showThinking: true, phase: "thinking", apartments: [] },
    ]);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamRemote(message, controller.signal);
    } catch {
      if (controller.signal.aborted) return;
      try {
        await streamLocal(message, controller.signal);
      } catch {
        if (!controller.signal.aborted) {
          patchAssistant({
            text: ar ? "تعذّر الرد. جرّب مرة أخرى أو واتساب 8005454." : "Reply failed. Try again or WhatsApp 8005454.",
            phase: "done",
            showThinking: false,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        id="ask-ai"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-3 start-2 z-[70] flex flex-col items-center gap-0 border-0 bg-transparent p-0"
        aria-label="KPH"
      >
        <KhalijiGuide size={128} />
        <span className="relative -mt-1 rounded-full bg-ink px-3 py-1 text-xs font-bold text-gold shadow-gold">
          KPH
        </span>
      </button>

      {open ? (
        <div className="fixed bottom-40 start-3 z-[70] flex h-[min(78vh,640px)] w-[min(96vw,420px)] flex-col overflow-hidden border border-gold/30 bg-cream shadow-soft">
          <div className="flex items-center justify-between gap-3 bg-ink-wash px-4 py-3 text-cream">
            <div className="flex items-center gap-3">
              <div className="overflow-hidden rounded-full bg-cream/10 ring-1 ring-gold/30">
                <KhalijiGuide size={52} />
              </div>
              <div>
                <p className="font-display text-lg text-gold">{t("ask.title")}</p>
                <p className="text-xs text-cream/65">{t("ask.assistant")}</p>
              </div>
            </div>
            <button type="button" className="text-2xl leading-none" onClick={() => setOpen(false)} aria-label="close">
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-auto p-4">
            {items.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`max-w-[94%] rounded-2xl px-3 py-2 text-sm leading-7 ${
                  item.role === "user" ? "ms-auto bg-sea text-cream" : "bg-white text-ink ring-1 ring-ink/10"
                }`}
              >
                {item.role === "assistant" && item.thinking ? (
                  <div className="mb-2">
                    {(item.showThinking || item.phase === "thinking") && (
                      <div className="rounded-xl bg-ink/[0.03] px-3 py-2 text-xs text-ink-muted">
                        <p className="mb-1 font-semibold text-gold">{t("ask.thinking")}</p>
                        <p className="thinking-stream">{item.thinking}</p>
                      </div>
                    )}
                    {item.phase !== "thinking" && item.thinking ? (
                      <button
                        type="button"
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-sea"
                        onClick={() =>
                          setItems((curr) =>
                            curr.map((row, i) =>
                              i === index ? { ...row, showThinking: !row.showThinking } : row,
                            ),
                          )
                        }
                      >
                        <span aria-hidden>{item.showThinking ? "▾" : "▸"}</span>
                        {item.showThinking ? t("ask.hideThinking") : t("ask.showThinking")}
                      </button>
                    ) : null}
                  </div>
                ) : null}

                <div className="chat-md whitespace-pre-wrap">{item.text}</div>

                {item.apartments && item.apartments.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {item.apartments.map((apt) => (
                      <div key={apt.id} className="overflow-hidden rounded-xl ring-1 ring-ink/10">
                        {apt.images?.[0] ? (
                          <img src={apt.images[0]} alt="" className="aspect-[16/9] w-full object-cover" />
                        ) : null}
                        <div className="p-2.5 text-xs">
                          <p className="font-bold">
                            {ar ? `شقة ${apt.unit}` : `Apt ${apt.unit}`} · {ar ? `طابق ${apt.floor}` : `Floor ${apt.floor}`}
                          </p>
                          <p className="text-ink-muted">
                            {apt.type} · {formatMoney(apt.priceAed, ar)} · {apt.sizeSqft} {ar ? "قدم²" : "sqft"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {loading && index === items.length - 1 && item.role === "assistant" && item.phase !== "done" ? (
                  <span className="ms-0.5 inline-block h-4 w-0.5 animate-pulse bg-gold align-middle" />
                ) : null}
              </div>
            ))}
            <p className="text-[11px] text-ink-muted">{t("ask.hint")}</p>
            <div ref={endRef} />
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-ink/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("ask.placeholder")}
              className="flex-1 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm outline-none ring-gold focus:ring"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink disabled:opacity-60"
            >
              {t("ask.send")}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
