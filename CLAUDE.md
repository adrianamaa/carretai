@AGENTS.md

# Carretai — Build Night Bogotá (2026-07-24)

One-screen app: paste messy project description → Groq → names / one-liner / hero copy / 2-min pitch / slop rewrites, rendered as a **designed launch card**. Design taste is the product. Demo is 2 minutes; wow must land in the first 60s.

## Skills for this project
- **refero-design** — ground the launch card + screen in real references before styling; no generic UI
- **design-taste-frontend** — anti-slop rules; the tool that fights slop cannot look AI-generated
- **web-design-guidelines** — UI audit pass before the demo
- **canvas-design** — the 1000×1000 project-logo.png deliverable (max 500kb)
- **vercel-react-best-practices** — React 19 / Next 16 patterns
- **shadcn MCP** — available for components (prefer custom when taste is the point)
- **playwright MCP** — visual QA loop: screenshot every design change before calling it done
- **ship-it** — gated deploy when going live
- **vercel:deploy / vercel:env** — mirror-repo deploy + GROQ_API_KEY env

## Design direction (LOCKED 2026-07-24)
Street-print artifact. Dark neutral workbench (the machine) + paper-white card (the printed
object). Display: **Archivo Black via next/font** (self-hosted, works offline — the Adobe kit
NEVER loaded, don't reintroduce it). Accent: ONE electric fucsia, CTA + key marks only.
No cream/amber (flagged slop palette). No em-dashes anywhere, incl. Groq output. Perforated
stub stays — it's the memorable detail. Labels: Geist Mono uppercase, rationed.

## Constraints
- Built from zero tonight; ~5 focused hours. One killer screen, no feature creep.
- Demo must work offline-ish (no external deps beyond Groq; record a backup).
- Voice everywhere: lowercase, terse, zero filler. Banned: "revolutionary", "seamless", "AI-powered platform"…
- Deploy: personal mirror repo + dual push remotes (see README) → Vercel.
