// Cloudflare Worker entry point for the Wander frontend.
// Proxies /api/* to the wander-api Worker via service binding.
// All other requests are served from static assets (dist/).
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return env.API.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
