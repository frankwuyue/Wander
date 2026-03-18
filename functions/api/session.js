// Pages Function — proxies /api/session to the wander-api Worker via Service Binding.
// Requires a Service Binding named "WORKER" pointing to wander-api in Pages Settings.
export async function onRequestPost({ request, env }) {
  return env.WORKER.fetch(request);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
