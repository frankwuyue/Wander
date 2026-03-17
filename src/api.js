// ─── AI API ───────────────────────────────────────────────────────────────────
// Currently calls the Anthropic API directly from the client.
// TODO: Move this to a backend API route (e.g. Next.js /api/session, Cloudflare
//       Worker, or Vercel serverless function) before public launch to avoid
//       exposing API credentials in the browser.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// Set your API key in .env as VITE_ANTHROPIC_API_KEY
// Never commit a real key — rotate immediately if you do.
const API_KEY = import.meta.env?.VITE_ANTHROPIC_API_KEY ?? "";

export async function generateSession(prompt) {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // In production, this call should happen server-side only.
      ...(API_KEY ? { "x-api-key": API_KEY } : {}),
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.find((b) => b.type === "text")?.text ?? "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
