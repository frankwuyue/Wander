// Cloudflare Worker — API proxy for Wander
// Keeps ANTHROPIC_API_KEY server-side. Deploy with `npx wrangler deploy`.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// Simple per-IP rate limiting (1 request per 30s).
// Resets on worker restart — acceptable for a low-traffic app.
const rateMap = new Map();
const RATE_WINDOW_MS = 30_000;

function isRateLimited(ip) {
  const now = Date.now();
  const last = rateMap.get(ip);
  if (last && now - last < RATE_WINDOW_MS) return true;
  rateMap.set(ip, now);
  // Prevent unbounded growth
  if (rateMap.size > 10_000) rateMap.clear();
  return false;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "*";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Only accept POST /api/session
    const url = new URL(request.url);
    if (url.pathname !== "/api/session" || request.method !== "POST") {
      return new Response("Not found", { status: 404, headers: corsHeaders(origin) });
    }

    // Rate limit by IP
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests. Try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    // Validate API key is configured
    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    try {
      const body = await request.json();
      const { prompt, model = "claude-sonnet-4-20250514", max_tokens = 1000 } = body;

      if (!prompt || typeof prompt !== "string") {
        return new Response(JSON.stringify({ error: "Missing prompt" }), {
          status: 400,
          headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        });
      }

      const res = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();

      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Proxy error" }), {
        status: 500,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }
  },
};
