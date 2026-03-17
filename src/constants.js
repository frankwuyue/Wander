// ─── Session Types ────────────────────────────────────────────────────────────
// Each session type defines the UI label, icon, tagline, and the AI prompt
// builder. The prompt builder accepts an optional seed string (the user's
// "what's on your mind" input) and weaves it into the session if provided.

export const SESSION_TYPES = [
  {
    id: "odd_connection",
    label: "The Odd Connection",
    icon: "⚡",
    tagline: "Two worlds. One hidden truth.",
    buildPrompt: (seed) => `You are the content engine for "Wander" — a mindfulness and creativity app used during quiet, private moments of reflection.

Generate a single "Odd Connection" session. Pick two completely unrelated things from different domains (e.g. a 1920s farming technique + a modern startup problem, evolutionary biology + architecture, a historical battle strategy + parenting).${seed ? ` The user is thinking about: "${seed}". Weave one of the two things loosely toward their situation, but keep it surprising.` : ""}

Respond ONLY with a JSON object — no markdown, no backticks, no preamble.

{"thing1":{"title":"short name","domain":"field it comes from","blurb":"2 sentences explaining it"},"thing2":{"title":"short name","domain":"field it comes from","blurb":"2 sentences explaining it"},"bridge":"2-3 sentences revealing the surprising connection between them","carry_question":"One open question to carry today — no answer given","session_title":"A poetic 3-5 word title"}`
  },
  {
    id: "contrarian",
    label: "The Contrarian Take",
    icon: "🔄",
    tagline: "A belief flipped on its head.",
    buildPrompt: (seed) => `You are the content engine for "Wander" — a mindfulness and creativity app.

Generate a "Contrarian Take" session. A widely-held idea, genuinely challenged. NOT conspiracy — a thoughtful intellectual provocation backed by real evidence.${seed ? ` The user is sitting with: "${seed}". Make the contrarian idea relevant to their world if possible.` : ""}

Respond ONLY with a JSON object — no markdown, no backticks, no preamble.

{"common_belief":"The widely held idea in one sentence","flip":"Contrarian headline — punchy, max 8 words","argument":"3-4 sentences with a real example or evidence","counterpoint":"One sentence steelmanning the original belief","carry_question":"One open question","session_title":"A poetic 3-5 word title"}`
  },
  {
    id: "field_trip",
    label: "The Field Trip",
    icon: "🌍",
    tagline: "See through someone else's eyes.",
    buildPrompt: (seed) => `You are the content engine for "Wander" — a mindfulness and creativity app.

Generate a "Field Trip" — drop the reader into the mind of someone with a niche, unusual, or overlooked expertise. Written in first person, immersive, specific. Make it feel like seeing the world through completely different eyes.${seed ? ` The user is thinking about: "${seed}". Choose a guide whose world offers an unexpected angle on this.` : ""}

Respond ONLY with a JSON object — no markdown, no backticks, no preamble.

{"guide":"Name and role (fictional but grounded, e.g. 'Mira, competitive memory athlete')","world":"The domain they inhabit","dispatch":"200-250 word first-person narrative. Specific, sensory, surprising. Reveal how they see everyday things differently.","the_thing_you_now_cant_unsee":"One insight that changes how the reader sees something ordinary","carry_question":"One open question","session_title":"A poetic 3-5 word title"}`
  },
  {
    id: "ignored_signal",
    label: "The Ignored Signal",
    icon: "📡",
    tagline: "What the world isn't watching.",
    buildPrompt: (seed) => `You are the content engine for "Wander" — a mindfulness and creativity app.

Generate an "Ignored Signal" — something real and quiet happening in the world that almost no one is tracking. NOT trending news, NOT politics. Demographic, scientific, behavioral, material, ecological. The kind of thing that seems small but probably matters in 10 years.${seed ? ` The user is interested in: "${seed}". If relevant, choose a signal that touches this domain.` : ""}

Respond ONLY with a JSON object — no markdown, no backticks, no preamble.

{"signal":"One sentence headline","why_ignored":"1-2 sentences on why it flies under the radar","the_evidence":"2-3 sentences of concrete, specific detail","why_it_matters":"2-3 sentences of open implications — not alarmist","carry_question":"One open question","session_title":"A poetic 3-5 word title"}`
  },
  {
    id: "dead_genius",
    label: "Dead Genius",
    icon: "🏛",
    tagline: "Think through a legendary mind.",
    buildPrompt: (seed) => `You are the content engine for "Wander" — a mindfulness and creativity app.

Generate a "Dead Genius" session. Pick a real historical thinker (philosopher, scientist, artist, strategist, inventor — anyone brilliant and dead). Apply their unique way of thinking to a real, modern problem.${seed ? ` The user is wrestling with: "${seed}". Choose a thinker whose framework offers a genuinely useful lens on this.` : " Choose a surprising thinker and a modern problem that feels urgent but mundane."}

The genius should NOT just give advice — show how their *mental model* reframes the problem entirely. Be specific about their actual ideas, not generic wisdom.

Respond ONLY with a JSON object — no markdown, no backticks, no preamble.

{"genius":{"name":"Full name","era":"e.g. Ancient Rome, 1800s Germany","known_for":"One sentence — their big idea or contribution"},"the_problem":"A modern, relatable problem stated in 1-2 sentences","their_lens":"2-3 sentences: how this thinker would specifically reframe or approach the problem, referencing their actual philosophy or method","the_move":"2-3 sentences: a concrete action or shift in thinking that follows from their framework","the_tension":"1 sentence: what this approach gets wrong or ignores — steelman the counterargument","carry_question":"One open question","session_title":"A poetic 3-5 word title"}`
  },
  {
    id: "detour",
    label: "The Detour",
    icon: "🔀",
    tagline: "Three hops to somewhere new.",
    buildPrompt: (seed) => `You are the content engine for "Wander" — a mindfulness and creativity app.

Generate a "Detour" session — a random walk of ideas. Start with one concept${seed ? ` related to "${seed}"` : " (anything interesting)"}, then make exactly 3 unexpected hops. Each hop should feel like a surprising but real connection — not random, but non-obvious. The reader should end up somewhere completely different from where they started.

Each hop should be 2-3 sentences explaining the connection and the new territory. The final destination should feel like a revelation.

Respond ONLY with a JSON object — no markdown, no backticks, no preamble.

{"origin":{"idea":"Starting concept in a few words","domain":"The field it belongs to","setup":"1-2 sentences introducing this idea"},"hops":[{"idea":"Second concept","domain":"Different field","connection":"2-3 sentences: how we got here from the previous idea — the surprising link"},{"idea":"Third concept","domain":"Yet another field","connection":"2-3 sentences: the next unexpected leap"},{"idea":"Final destination","domain":"A field far from the origin","connection":"2-3 sentences: the last hop — make it land with weight"}],"the_view_from_here":"2 sentences: standing at the destination, what do you now see about where you started?","carry_question":"One open question","session_title":"A poetic 3-5 word title"}`
  }
];

// ─── Design Tokens ────────────────────────────────────────────────────────────
export const COLORS = {
  bg: "#0f0d0a",
  bgCard: "rgba(200,184,154,0.05)",
  border: "rgba(200,184,154,0.14)",
  borderActive: "rgba(200,184,154,0.35)",
  gold: "#c8b89a",
  goldDim: "#8a7a65",
  goldFaint: "#4a3a28",
  text: "#e8dcc8",
  textMid: "#b0a088",
  textDim: "#6a5a44",
  textFaint: "#3a2f22",
};
