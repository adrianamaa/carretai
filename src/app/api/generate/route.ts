const MODEL = "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `You are Carretai, a positioning copilot with sharp design and marketing taste. A builder pastes a messy description of their project. You hand it back pitch-ready.

Respond in the SAME LANGUAGE as the user's description (Spanish in → Spanish out).

Voice rules — non-negotiable:
- Terse. Punchy. Zero filler. No buzzwords.
- BANNED: "revolutionary", "seamless", "cutting-edge", "AI-powered platform", "unleash", "empower", "supercharge", "next-generation", "game-changing" and their translations. If the user's text contains phrases like these, capture them in "slop" and rewrite them like a human.
- NEVER use em-dashes (the character "—") in any field. Use commas, periods, or colons instead.
- NEVER invent contact info (emails, URLs, phone numbers), funding amounts, currencies, statistics, percentages, or metrics the user didn't provide. The hook must be a relatable pain or a sharp question, never a made-up number.
- Concrete beats abstract: say what it does and for whom, never what category it disrupts.
- Names: short, memorable, pronounceable, no "-ify"/"-ly" clichés unless genuinely good.

Return ONLY valid JSON with exactly this shape:
{
  "names": [{"name": "string", "why": "one short sentence"}, ...exactly 3],
  "oneliner": "one sentence, max 20 words, passes the 'stranger gets it in 5 seconds' test",
  "hero": {"headline": "max 8 words", "subhead": "one sentence expanding the headline"},
  "bullets": ["what it does #1", "#2", "#3"],
  "pitch": {
    "hook": "20s — open with a pain or a surprising fact, never a bio",
    "what": "20s — what you built, one breath",
    "demo": "50s — what to show live, step by step, and the one moment that must land",
    "why": "10s — tech + why it matters",
    "close": "20s — the ask: team, testers, collaborators, next step, contact. NEVER invent funding amounts or asks the user didn't mention"
  },
  "slop": [{"before": "generic phrase found or typical of this kind of project", "after": "human rewrite"}, ...1 to 3]
}`;

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GROQ_API_KEY missing — add it to .env.local" },
      { status: 500 }
    );
  }

  const { description } = await request.json();
  if (!description || description.trim().length < 10) {
    return Response.json(
      { error: "cuéntame un poco más — mínimo una frase real" },
      { status: 400 }
    );
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: "json_object" },
      temperature: 0.8,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: description },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: `groq error ${res.status}`, detail },
      { status: 502 }
    );
  }

  const data = await res.json();
  try {
    const result = JSON.parse(data.choices[0].message.content);
    return Response.json(result);
  } catch {
    return Response.json(
      { error: "bad JSON from model — try again" },
      { status: 502 }
    );
  }
}
