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

      {/* the artifact */}
      {result && (
        <article className="launch-card paper-grain mt-14 overflow-hidden">
          <div className="dogear" aria-hidden />
          <div className="px-8 pt-8 sm:px-10">
            {/* meta row: printer's mark + label + stamp */}
            <div
              className="reveal flex items-start justify-between"
              style={delay()}
            >
              <span className="flex items-center gap-3">
                <span className="hatch-mark" aria-hidden />
                <span className="label text-[var(--card-muted)]">
                  carretai · build night bogotá
                </span>
              </span>
              <span className="stamp mr-4">pitch 2:00</span>
            </div>

            {/* name — the poster */}
            <div className="reveal mt-9" style={delay()}>
              <p className="display text-6xl uppercase leading-[0.95] [text-wrap:balance] sm:text-7xl">
                {result.names[0].name}
              </p>
              <p className="mt-5 text-xl leading-snug [text-wrap:pretty]">
                <span className="highlight">{result.oneliner}</span>
              </p>
              {result.names.length > 1 && (
                <p className="label mt-5 text-[var(--card-muted)]">
                  alt:&nbsp;
                  {result.names.slice(1).map((n) => n.name).join(" / ")}
                </p>
              )}
            </div>

            <div className="hatch my-9" aria-hidden />

            {/* hero copy */}
            <div className="reveal" style={delay()}>
              <p className="label text-[var(--card-muted)]">hero</p>
              <p className="display mt-3 text-3xl leading-tight [text-wrap:balance]">
                {result.hero.headline}
              </p>
              <p className="mt-3 leading-relaxed text-[var(--card-muted)] [text-wrap:pretty]">
                {result.hero.subhead}
              </p>
            </div>

            {/* bullets */}
            <div className="reveal mt-9" style={delay()}>
              <p className="label text-[var(--card-muted)]">qué hace</p>
              <ul className="mt-3 space-y-2">
                {result.bullets.map((b) => (
                  <li key={b} className="flex gap-3 leading-relaxed">
                    <span aria-hidden className="font-semibold text-[var(--card-accent)]">
                      →
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hatch my-9" aria-hidden />

            {/* pitch timeline */}
            <div className="reveal" style={delay()}>
              <p className="label text-[var(--card-muted)]">tu pitch, 2 minutos</p>
              <ol className="mt-5 space-y-6">
                {PITCH_STEPS.map((s) => (
                  <li key={s.key} className="grid grid-cols-[3.5rem_1fr] gap-4">
                    <span className="pt-0.5 font-mono text-sm font-semibold tabular-nums text-[var(--card-accent)]">
                      {s.time}
                    </span>
                    <div>
                      <p className="label text-[var(--card-muted)]">{s.label}</p>
                      <p className="mt-1 leading-relaxed [text-wrap:pretty]">
                        {result.pitch[s.key]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* slop rewrites */}
            {result.slop.length > 0 && (
              <div className="reveal mt-9" style={delay()}>
                <p className="label text-[var(--card-muted)]">menos slop</p>
                <ul className="mt-3 space-y-4">
                  {result.slop.map((s) => (
                    <li key={s.before}>
                      <p className="font-mono text-sm text-[var(--card-muted)] line-through">
                        {s.before}
                      </p>
                      <p className="mt-1 leading-relaxed">{s.after}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* perforated stub */}
          <div className="perforation reveal mt-10" style={delay()}>
            <div className="flex items-baseline justify-between px-8 py-5 sm:px-10">
              <span className="label text-[var(--card-muted)]">
                hecho con carretai
              </span>
              <span className="label font-semibold text-[var(--card-accent)]">
                echas la carreta → cachan
              </span>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
