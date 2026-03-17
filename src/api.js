// ─── AI API ───────────────────────────────────────────────────────────────────
// Calls the local API proxy (/api/session) which forwards to Anthropic.
// In dev: Vite proxy handles the forwarding.
// In prod: Cloudflare Worker at the same origin serves /api/session.
// The API key never reaches the browser.

export async function generateSession(prompt) {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model: "claude-sonnet-4-20250514", max_tokens: 1000 }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.find((b) => b.type === "text")?.text ?? "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function generateAnnualReview(journalEntries) {
  const summary = journalEntries.map(e =>
    `[${e.date}] ${e.sessionTitle} → "${e.carryQuestion}"${e.mood ? ` (${e.mood})` : ""}`
  ).join("\n");

  const prompt = `You are the reflection engine for "Wander" — a mindfulness and creativity app. The user has been collecting carry questions over time. Here is their Question Journal:

${summary}

Write a warm, insightful "Year in Questions" reflection. This is NOT a report — it's a letter to the wanderer. Observe patterns, themes, and evolution in what they've been thinking about. Be specific — reference actual questions and sessions. Keep it under 300 words.

Respond ONLY with a JSON object — no markdown, no backticks, no preamble.

{"title":"A poetic 3-6 word title for their journey","reflection":"The 200-300 word reflection, written in second person","themes":["theme1","theme2","theme3"],"closing_question":"One final question that synthesizes everything they've been exploring"}`;

  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model: "claude-sonnet-4-20250514", max_tokens: 1500 }),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data = await res.json();
  const text = data.content?.find((b) => b.type === "text")?.text ?? "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
