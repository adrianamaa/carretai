# carretai

**carreta** (CO: *echar carreta* — to spin the story) + **cachai** (CL: *you get it?*).
You spin the story. They get it.

<img src="./project-logo.png?v=2" alt="Carretai logo" width="200" />

Hacker:

- Adriana Forero ([@adrianamaa](https://github.com/adrianamaa))

## What it is

**Live at [carretai.vercel.app](https://carretai.vercel.app)**

Every build night ends the same way: great builds that lose the room in the first
sentence. Carretai fixes the part engineers skip: **the story**.

Paste (or dictate, by voice) a messy description of what you built. Get back:

- a sharp **name** (with alternatives)
- a **one-liner** that passes the "you get it in 5 seconds" test
- **homepage hero copy** (headline + subhead)
- a timed **2-minute pitch** whose items sum to exactly 2:00
- your generic AI-slop phrases, struck through and **rewritten like a human**

…printed live as a **thermal receipt**: order number, real timestamp, sawtooth
cut, barcode, ITEMS + TOTAL. Downloadable as an image you'll actually want to keep.

## Stack

Next.js 16 · Tailwind 4 · Groq (gpt-oss-120b) · built from zero at Build Night Bogotá with Claude Code, by a designer who ships.

## Run it

```bash
npm install
echo "GROQ_API_KEY=gsk_..." > .env.local
npm run dev
```
