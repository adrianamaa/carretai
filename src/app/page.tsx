"use client";

import { useEffect, useRef, useState } from "react";
import { MicrophoneIcon, StopIcon } from "@phosphor-icons/react";

type Result = {
  names: { name: string; why: string }[];
  oneliner: string;
  hero: { headline: string; subhead: string };
  bullets: string[];
  pitch: { hook: string; what: string; demo: string; why: string; close: string };
  slop: { before: string; after: string }[];
};

const PITCH_STEPS: {
  key: keyof Result["pitch"];
  label: string;
  time: string;
  dur: string;
}[] = [
  { key: "hook", label: "hook", time: "0:00", dur: "0:20" },
  { key: "what", label: "qué construiste", time: "0:20", dur: "0:20" },
  { key: "demo", label: "demo en vivo", time: "0:40", dur: "0:50" },
  { key: "why", label: "tech + por qué", time: "1:30", dur: "0:10" },
  { key: "close", label: "cierre", time: "1:40", dur: "0:20" },
];

const DIAS = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const printerRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      printerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  async function downloadReceipt() {
    if (!receiptRef.current || !result) return;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(receiptRef.current, { pixelRatio: 2 });
    const a = document.createElement("a");
    a.download = `carretai-${result.names[0].name.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.href = dataUrl;
    a.click();
  }

  function newOrder() {
    setResult(null);
    setInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    type SRResult = { resultIndex: number; results: { [i: number]: { 0: { transcript: string } }; length: number } };
    type SRClass = new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: (e: SRResult) => void;
      onend: () => void;
      onerror: () => void;
      start: () => void;
      stop: () => void;
    };
    const w = window as unknown as { SpeechRecognition?: SRClass; webkitSpeechRecognition?: SRClass };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) {
      setError("tu navegador no soporta dictado, escribe el enredo");
      return;
    }
    const rec = new SR();
    rec.lang = "es-CO";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
      if (t.trim()) setInput((prev) => (prev ? prev.trimEnd() + " " : "") + t.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  async function generate() {
    if (loading || input.trim().length < 10) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "algo falló, intenta otra vez");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "algo falló, intenta otra vez");
    } finally {
      setLoading(false);
    }
  }

  let d = 0;
  const delay = () => ({ "--delay": `${(d += 60)}ms` }) as React.CSSProperties;

  const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const now = new Date();
  const fecha = `${DIAS[now.getDay()]}, ${String(now.getDate()).padStart(2, "0")} ${MESES[now.getMonth()]} ${now.getFullYear()}`;
  const hora = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="w-full pb-24">
      {/* the giant wordmark, edge to edge */}
      <header className="px-2 pt-2">
        <h1 className="reveal" style={delay()}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wordmark.svg"
            alt="carretai"
            className="h-auto w-full"
          />
        </h1>
      </header>

      <div className="mx-auto w-full max-w-2xl px-6">
        {/* counter row */}
        <p
          className="reveal mt-5 max-w-lg text-xl leading-snug [text-wrap:pretty]"
          style={delay()}
        >
          pega o dicta tu proyecto enredado y sale tu pitch de 2 minutos,
          impreso en un recibo.
        </p>
        <p
          className="reveal mt-2 text-sm text-[var(--text-muted)]"
          style={delay()}
        >
          de carreta y cachai. no de ai.
        </p>

        <section className="reveal mt-10" style={delay()}>
          <label
            htmlFor="project"
            className="text-sm text-[var(--text-muted)]"
          >
            tu proyecto, así como lo tienes en la cabeza
          </label>
          {/* AI-chat composer: everything lives inside one box */}
          <div className="composer pill-box mt-3 p-3">
            <textarea
              id="project"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generate();
                }
              }}
              rows={4}
              placeholder="con todo el enredo, sin pulir…"
              className="w-full resize-none bg-transparent p-3 text-base leading-relaxed outline-none placeholder:text-[var(--text-muted)]"
            />
            <div className="flex items-center justify-end gap-2 px-2 pb-1">
                <button
                  onClick={toggleVoice}
                  type="button"
                  aria-label={listening ? "parar dictado" : "dictar tu proyecto"}
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)] ${
                    listening
                      ? "animate-pulse bg-[var(--accent)] text-[var(--on-accent)]"
                      : "text-[var(--text)] hover:bg-[rgba(20,20,19,0.08)]"
                  }`}
                >
                  {listening ? (
                    <StopIcon size={20} weight="fill" />
                  ) : (
                    <MicrophoneIcon size={22} weight="regular" />
                  )}
                </button>
                <button
                  onClick={generate}
                  disabled={loading || input.trim().length < 10}
                  className="print-key"
                >
                  {loading ? "imprimiendo…" : "échale carreta →"}
                </button>
            </div>
          </div>
          {error && (
            <p className="mt-3 text-sm text-[var(--accent)]">{error}</p>
          )}
        </section>

      {/* the artifact — a literal thermal receipt, fed out of the printer */}
      {result && (
        <div ref={printerRef} className="mx-auto mt-14 w-full max-w-[460px] scroll-mt-8">
          <div className="print-slot" aria-hidden />
          <div className="print-feed printing">
            <div ref={receiptRef} className="px-[14px] pt-4">
          <article className="launch-card paper-grain overflow-hidden">
            <span className="stamp absolute right-4 top-5">pitch 2:00</span>
            <div className="px-7 pt-8">
              {/* printed store header */}
              <div className="reveal text-center" style={delay()}>
                <p className="display text-2xl tracking-tight">carretai.</p>
                <p className="thermal-label mt-2">build night bogotá</p>
                <p className="thermal mt-2">{fecha}</p>
                <p className="thermal">ORDEN #0001 · {hora}</p>
              </div>

              <p className="asterisks my-5" aria-hidden>
                * * * * * * * * * * * * * * * * * *
              </p>

              {/* the name, printed big like the store logo — auto-fits the paper */}
              <div className="reveal text-center" style={delay()}>
                <p
                  className="display uppercase leading-[0.95] [text-wrap:balance]"
                  style={{
                    fontSize: `${Math.min(52, Math.max(24, Math.round(430 / result.names[0].name.length)))}px`,
                  }}
                >
                  {result.names[0].name}
                </p>
                <p className="thermal mt-4 [text-wrap:pretty]">
                  <span className="highlight">{result.oneliner}</span>
                </p>
                {result.names.length > 1 && (
                  <p className="thermal-label mt-3">
                    alt: {result.names.slice(1).map((n) => n.name).join(" / ")}
                  </p>
                )}
              </div>

              <div className="dashed-rule my-6" aria-hidden />

              {/* the priced item table — tu pitch, first because it's what you say */}
              <div className="reveal" style={delay()}>
                <p className="thermal-label text-center">tu pitch, dilo así</p>
                <div className="thermal mt-3 grid grid-cols-[2.5rem_1fr_auto] gap-x-2 border-y border-[#26241f] py-1 font-bold uppercase">
                  <span>cant</span>
                  <span>item</span>
                  <span className="text-right">min</span>
                </div>
                <ol className="mt-2 space-y-3">
                  {PITCH_STEPS.map((s) => (
                    <li key={s.key}>
                      <div className="thermal grid grid-cols-[2.5rem_1fr_auto] gap-x-2 font-bold uppercase">
                        <span>1</span>
                        <span>{s.label}</span>
                        <span className="text-right tabular-nums">{s.dur}</span>
                      </div>
                      <p className="thermal mt-0.5 pl-[2.5rem] opacity-80 [text-wrap:pretty]">
                        {result.pitch[s.key]}
                      </p>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 border-t border-[#26241f] pt-2">
                  <div className="thermal flex justify-between">
                    <span>ITEMS: {PITCH_STEPS.length}</span>
                    <span></span>
                  </div>
                  <div className="thermal flex justify-between text-[0.9375rem] font-bold">
                    <span>TOTAL</span>
                    <span className="tabular-nums">2:00</span>
                  </div>
                </div>
              </div>

              {/* para tu landing — copy assets, clearly not the spoken pitch */}
              <div className="dashed-rule my-6" aria-hidden />
              <div className="reveal" style={delay()}>
                <p className="thermal-label text-center">
                  para tu landing, no para decirlo
                </p>
                <p className="thermal mt-3 text-center text-[0.9375rem] font-bold uppercase leading-snug [text-wrap:balance]">
                  {result.hero.headline}
                </p>
                <p className="thermal mt-1 text-center [text-wrap:pretty]">
                  {result.hero.subhead}
                </p>
                <ul className="mt-4 space-y-2">
                  {result.bullets.map((b, i) => (
                    <li key={b} className="thermal flex gap-3">
                      <span className="shrink-0 font-bold text-[var(--card-accent)]">
                        {i + 1}x
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* descuentos — slop rewrites */}
              {result.slop.length > 0 && (
                <>
                  <div className="dashed-rule my-6" aria-hidden />
                  <div className="reveal" style={delay()}>
                    <p className="thermal-label text-center">descuento slop</p>
                    <ul className="mt-3 space-y-3">
                      {result.slop.map((s) => (
                        <li key={s.before}>
                          <p className="thermal line-through opacity-50">
                            {s.before}
                          </p>
                          <p className="thermal font-bold">{s.after}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* pos footer block */}
              <div className="dashed-rule my-6" aria-hidden />
              <div className="reveal thermal" style={delay()}>
                <p>ATENDIDO POR: GROQ</p>
                <p>CAJA: CLAUDE CODE</p>
                <p>CLIENTE: {result.names[0].name.toUpperCase()}</p>
              </div>

              <p className="asterisks mt-6" aria-hidden>
                * * * * * * * * * * * * * * * * * *
              </p>
              <p className="thermal-label mt-3 pb-1 text-center">
                gracias por echar carreta
              </p>
            </div>

            {/* perforated stub */}
            <div className="perforation reveal mt-5" style={delay()}>
              <div className="flex flex-col items-center gap-2 px-7 py-5">
                <div className="barcode" aria-hidden />
                <p className="thermal-label">hecho con carretai</p>
                <p className="thermal-label text-[var(--card-accent)]">
                  echas la carreta, ¿cachai?
                </p>
              </div>
            </div>
          </article>
          <div className="sawtooth" aria-hidden />
            </div>
          </div>
          <div
            className="reveal mt-6 flex justify-center gap-3"
            style={{ "--delay": "3400ms" } as React.CSSProperties}
          >
            <button onClick={downloadReceipt} className="pill">
              descargar recibo ↓
            </button>
            <button onClick={newOrder} className="pill">
              nuevo pedido
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
