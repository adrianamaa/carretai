"use client";

import { useState } from "react";

type Result = {
  names: { name: string; why: string }[];
  oneliner: string;
  hero: { headline: string; subhead: string };
  bullets: string[];
  pitch: { hook: string; what: string; demo: string; why: string; close: string };
  slop: { before: string; after: string }[];
};

const PITCH_STEPS: { key: keyof Result["pitch"]; label: string; time: string }[] = [
  { key: "hook", label: "hook", time: "0:00" },
  { key: "what", label: "qué construiste", time: "0:20" },
  { key: "demo", label: "demo en vivo", time: "0:40" },
  { key: "why", label: "tech + por qué", time: "1:30" },
  { key: "close", label: "cierre", time: "1:40" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

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
  const fecha = `${String(now.getDate()).padStart(2, "0")} ${MESES[now.getMonth()]} ${now.getFullYear()}`;
  const hora = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      {/* workbench chrome */}
      <header className="mb-10 flex items-baseline justify-between">
        <h1 className="display text-2xl tracking-tight">
          carretai<span className="text-[var(--accent)]">.</span>
        </h1>
        <p className="label text-[var(--text-muted)]">echas la carreta, cachan</p>
      </header>

      <section>
        <label htmlFor="project" className="label text-[var(--text-muted)]">
          tu proyecto, así como lo tienes en la cabeza
        </label>
        <textarea
          id="project"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder="pega acá la descripción cruda, sin pulir, con todo el enredo…"
          className="mt-3 w-full resize-none border-2 border-[var(--border)] bg-[var(--surface)] p-4 text-base leading-relaxed outline-none transition-[border-color] duration-[var(--duration-fast)] focus:border-[var(--accent)]"
        />
        <button
          onClick={generate}
          disabled={loading || input.trim().length < 10}
          className="mt-4 border-2 border-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent)] transition-[background-color,color,transform] duration-[var(--duration-fast)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] active:translate-y-[1px] disabled:opacity-40"
        >
          {loading ? "echando carreta…" : "échale carreta →"}
        </button>
        {error && (
          <p className="mt-3 font-mono text-sm text-[var(--accent)]">{error}</p>
        )}
      </section>

      {/* the artifact — a literal thermal receipt */}
      {result && (
        <div className="mx-auto mt-14 w-full max-w-[420px]">
          <article className="launch-card paper-grain overflow-hidden">
            <span className="stamp absolute right-4 top-5">pitch 2:00</span>
            <div className="px-7 pt-8">
              {/* printed store header */}
              <div className="reveal text-center" style={delay()}>
                <p className="display text-xl tracking-tight">
                  carretai<span className="text-[var(--card-accent)]">.</span>
                </p>
                <p className="thermal-label mt-2">build night bogotá</p>
                <p className="thermal mt-1">
                  {fecha} {hora} · PEDIDO #001
                </p>
              </div>

              <p className="asterisks my-5" aria-hidden>
                * * * * * * * * * * * * * * * * * *
              </p>

              {/* the name, printed big like the store logo */}
              <div className="reveal text-center" style={delay()}>
                <p className="display text-4xl uppercase leading-[0.95] [text-wrap:balance] sm:text-5xl">
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

              {/* hero */}
              <div className="reveal" style={delay()}>
                <p className="thermal-label text-center">hero</p>
                <p className="thermal mt-2 text-center text-[0.9375rem] font-bold uppercase leading-snug [text-wrap:balance]">
                  {result.hero.headline}
                </p>
                <p className="thermal mt-2 text-center [text-wrap:pretty]">
                  {result.hero.subhead}
                </p>
              </div>

              <div className="dashed-rule my-6" aria-hidden />

              {/* items */}
              <div className="reveal" style={delay()}>
                <p className="thermal-label text-center">qué hace</p>
                <ul className="mt-3 space-y-2">
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

              <div className="dashed-rule my-6" aria-hidden />

              {/* pitch timeline */}
              <div className="reveal" style={delay()}>
                <p className="thermal-label text-center">tu pitch, 2 minutos</p>
                <ol className="mt-4 space-y-4">
                  {PITCH_STEPS.map((s) => (
                    <li key={s.key} className="grid grid-cols-[3rem_1fr] gap-3">
                      <span className="thermal pt-px font-bold tabular-nums text-[var(--card-accent)]">
                        {s.time}
                      </span>
                      <div>
                        <p className="thermal-label">{s.label}</p>
                        <p className="thermal mt-0.5 [text-wrap:pretty]">
                          {result.pitch[s.key]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* slop rewrites */}
              {result.slop.length > 0 && (
                <>
                  <div className="dashed-rule my-6" aria-hidden />
                  <div className="reveal" style={delay()}>
                    <p className="thermal-label text-center">menos slop</p>
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

              {/* total */}
              <div className="dashed-rule my-6" aria-hidden />
              <div className="reveal" style={delay()}>
                <div className="thermal flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>1 NOMBRE + {Math.max(result.names.length - 1, 0)} ALT</span>
                </div>
                <div className="thermal flex justify-between">
                  <span></span>
                  <span>1 HERO + {result.bullets.length} ITEMS</span>
                </div>
                <div className="thermal mt-1 flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>1 PITCH DE 2:00</span>
                </div>
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
                  echas la carreta, cachan
                </p>
              </div>
            </div>
          </article>
          <div className="sawtooth" aria-hidden />
        </div>
      )}
    </div>
  );
}
