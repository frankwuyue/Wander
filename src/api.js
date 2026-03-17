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
