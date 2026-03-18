import { useState, useEffect, useRef } from "react";
import { SESSION_TYPES, COLORS, THEMES } from "./constants.js";
import { loadJournal, saveJournal, loadDailyState, saveDailyState, todayKey, saveLastSession, loadLastSession, loadOnboarded, saveOnboarded } from "./storage.js";
import { generateSession, generateAnnualReview } from "./api.js";
import { shareCarryQuestion } from "./shareImage.js";
import SessionContent from "./components/SessionContent.jsx";
import Journal from "./components/Journal.jsx";
import Onboarding from "./components/Onboarding.jsx";

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --c-bg: #0f0d0a; --c-bg-card: rgba(200,184,154,0.05); --c-border: rgba(200,184,154,0.14);
    --c-border-active: rgba(200,184,154,0.35); --c-gold: #c8b89a; --c-gold-dim: #8a7a65;
    --c-gold-faint: #4a3a28; --c-text: #e8dcc8; --c-text-mid: #b0a088; --c-text-dim: #6a5a44;
    --c-text-faint: #4a3a2e; --c-card-hover-bg: rgba(200,184,154,0.08);
    --c-bg-gradient: linear-gradient(160deg,#141008 0%,#0f0d0a 50%,#0c0b08 100%);
  }
  html, body, #root { height: 100%; background: var(--c-bg); }
  body { font-family: 'DM Mono', monospace; -webkit-font-smoothing: antialiased; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes orbPulse { 0%,100% { opacity:.2; transform:scale(.8); } 50% { opacity:1; transform:scale(1.2); } }
  @keyframes slowSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes rippleOut { 0% { transform:scale(.9); opacity:.6; } 100% { transform:scale(1.5); opacity:0; } }
  .btn { cursor: pointer; transition: all .2s ease; border: none; outline: none; background: none; }
  .btn:active { transform: scale(.97); }
  .card-hover { transition: all .2s ease; cursor: pointer; }
  .card-hover:hover { border-color: var(--c-border-active) !important; background: var(--c-card-hover-bg) !important; transform: translateY(-1px); }
  ::-webkit-scrollbar { width: 0; }
`;

// ─── Shared primitives ────────────────────────────────────────────────────────
const Grain = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E")`,
    opacity: .7,
  }} />
);

const Orbs = () => (
  <div style={{ display: "flex", gap: 10, justifyContent: "center", padding: "48px 0" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: COLORS.gold, animation: `orbPulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
    ))}
  </div>
);

const Divider = ({ margin = "0 24px 24px" }) => (
  <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(200,184,154,0.15),transparent)", margin }} />
);

const Tag = ({ children, color = COLORS.goldDim }) => (
  <span style={{ fontSize: 9, letterSpacing: "0.2em", color, textTransform: "uppercase" }}>{children}</span>
);

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const fmtDuration = (s) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

// ─── App shell ────────────────────────────────────────────────────────────────
const shell = { height: "100dvh", background: COLORS.bg, display: "flex", justifyContent: "center", fontFamily: "'DM Mono',monospace", overflow: "hidden" };
const phone = { width: "100%", maxWidth: 420, height: "100%", background: "var(--c-bg-gradient)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" };

// ─── Main component ───────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedType, setSelectedType] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [seed, setSeed] = useState("");
  const [showSeedInput, setShowSeedInput] = useState(false);
  const [pendingType, setPendingType] = useState(null);
  const [journal, setJournal] = useState([]);
  const [dailyDone, setDailyDone] = useState(false);
  const [loadingStorage, setLoadingStorage] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [lastSession, setLastSession] = useState(null);
  const [onboarded, setOnboarded] = useState(true); // default true to avoid flash
  const [sharing, setSharing] = useState(false);
  const [pendingMood, setPendingMood] = useState(null);
  const [annualReview, setAnnualReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const timerRef = useRef(null);

  const [theme, setTheme] = useState(() => localStorage.getItem("wander-theme") || "ember");

  useEffect(() => {
    const t = THEMES[theme] || THEMES.ember;
    Object.entries(t.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    localStorage.setItem("wander-theme", theme);
  }, [theme]);

  const cycleTheme = () => {
    const keys = Object.keys(THEMES);
    setTheme(keys[(keys.indexOf(theme) + 1) % keys.length]);
  };

  useEffect(() => {
    (async () => {
      const [j, d, ls, ob] = await Promise.all([loadJournal(), loadDailyState(), loadLastSession(), loadOnboarded()]);
      setJournal(j);
      if (d && d.date === todayKey()) setDailyDone(true);
      if (ls) setLastSession(ls);
      setOnboarded(ob);
      setLoadingStorage(false);
    })();
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);

  useEffect(() => {
    if (screen === "session") {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (screen === "home") setElapsed(0);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const handleOnboardingComplete = async () => {
    setOnboarded(true);
    await saveOnboarded();
  };

  const handleShare = async () => {
    if (sharing || !sessionData?.carry_question) return;
    setSharing(true);
    try { await shareCarryQuestion(sessionData.carry_question); } catch {}
    setSharing(false);
  };

  const handleAnnualReview = async () => {
    setScreen("annual-review");
    setLoadingReview(true);
    setAnnualReview(null);
    try {
      const review = await generateAnnualReview(journal);
      setAnnualReview(review);
    } catch {
      setError("Couldn't generate your review. Try again later.");
      setScreen("journal");
    }
    setLoadingReview(false);
  };

  const handleTypeSelect = (type) => { setPendingType(type); setShowSeedInput(true); };

  const startSession = async (type, seedText) => {
    setSelectedType(type);
    setScreen("loading");
    setError(null);
    try {
      const data = await generateSession(type.buildPrompt(seedText?.trim() || null));
      setSessionData(data);
      setScreen("session");
      saveLastSession({ data, typeId: type.id });
      setLastSession({ data, typeId: type.id });
    } catch {
      setError("Something went quiet. Take a breath and try again.");
      setScreen("home");
    }
  };

  const replayLastSession = () => {
    if (!lastSession) return;
    const type = SESSION_TYPES.find(t => t.id === lastSession.typeId) || SESSION_TYPES[0];
    setSelectedType(type);
    setSessionData(lastSession.data);
    setScreen("session");
  };

  const handleFlush = () => {
    setPendingMood(null);
    setScreen("mood");
  };

  const handleMoodSelect = async (mood) => {
    const entry = {
      id: Date.now(),
      date: todayKey(),
      typeId: selectedType.id,
      sessionTitle: sessionData.session_title,
      carryQuestion: sessionData.carry_question,
      seed: seed?.trim() || null,
      duration: fmtDuration(elapsed),
      mood: mood || null,
    };
    const updated = [...journal, entry];
    setJournal(updated);
    await saveJournal(updated);
    await saveDailyState({ date: todayKey() });
    setDailyDone(true);
    setScreen("done");
  };

  // ── Onboarding
  if (!loadingStorage && !onboarded) return (
    <>
      <style>{CSS}</style>
      <div style={shell}><div style={phone}>
        <Grain />
        <Onboarding onComplete={handleOnboardingComplete} />
      </div></div>
    </>
  );

  // ── Seed input overlay
  if (showSeedInput) return (
    <>
      <style>{CSS}</style>
      <div style={shell}><div style={phone}>
        <Grain />
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "56px 28px 40px" }}>
          <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, lineHeight: 1.4, marginBottom: 12, animation: "fadeUp 0.5s ease forwards" }}>
            What's on your mind<br /><span style={{ color: COLORS.gold }}>right now?</span>
          </div>
          <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.8, marginBottom: 28, animation: "fadeUp 0.5s ease 0.1s both" }}>
            Optional. A word, a problem, a mood. Wander will weave your session around it — or surprise you if you leave it blank.
          </div>
          <textarea autoFocus placeholder="e.g. my career feels stuck… or leave blank" value={seed} onChange={e => setSeed(e.target.value)} maxLength={120}
            style={{ background: "rgba(200,184,154,0.05)", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16, color: COLORS.textMid, fontSize: 14, fontFamily: "'DM Mono',monospace", resize: "none", height: 100, outline: "none", lineHeight: 1.7, marginBottom: 8, animation: "fadeUp 0.5s ease 0.2s both" }} />
          <div style={{ fontSize: 10, color: COLORS.textFaint, textAlign: "right", marginBottom: 28 }}>{seed.length}/120</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn" onClick={() => { setShowSeedInput(false); startSession(pendingType, seed); }}
              style={{ padding: 16, background: "rgba(200,184,154,0.1)", border: `1px solid rgba(200,184,154,0.3)`, borderRadius: 14, color: COLORS.gold, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {seed.trim() ? "Begin with this seed" : "Surprise me"}
            </button>
            <button className="btn" onClick={() => { setShowSeedInput(false); setSeed(""); setPendingType(null); }}
              style={{ padding: 13, border: `1px solid ${COLORS.border}`, borderRadius: 14, color: COLORS.textDim, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Go back
            </button>
          </div>
          <div style={{ marginTop: "auto", paddingTop: 28, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 18 }}>{pendingType?.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: COLORS.textMid }}>{pendingType?.label}</div>
              <div style={{ fontSize: 10, color: COLORS.textFaint }}>{pendingType?.tagline}</div>
            </div>
          </div>
        </div>
      </div></div>
    </>
  );

  // ── Journal
  if (screen === "journal") return (
    <>
      <style>{CSS}</style>
      <div style={shell}><div style={phone}>
        <Grain />
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
          <Journal journal={journal} onBack={() => setScreen("home")} onAnnualReview={handleAnnualReview} />
        </div>
      </div></div>
    </>
  );

  // ── Annual Review
  if (screen === "annual-review") return (
    <>
      <style>{CSS}</style>
      <div style={shell}><div style={phone}>
        <Grain />
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "52px 24px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <button onClick={() => setScreen("journal")} style={{ background: "none", border: "none", color: COLORS.goldDim, fontSize: 20, cursor: "pointer", padding: 0, lineHeight: 1 }}>←</button>
            <div>
              <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text }}>Year in Questions</div>
              <Tag color={COLORS.textFaint}>{journal.length} sessions reflected</Tag>
            </div>
          </div>

          {loadingReview ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 20 }}>✦</div>
              <div style={{ fontSize: 12, color: COLORS.textDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Reading your questions</div>
              <div style={{ fontSize: 11, color: COLORS.textFaint }}>Finding the threads…</div>
              <Orbs />
            </div>
          ) : annualReview ? (
            <div style={{ flex: 1, overflowY: "auto", animation: "fadeUp 0.5s ease forwards" }}>
              <div style={{ fontSize: 24, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, lineHeight: 1.35, marginBottom: 24 }}>{annualReview.title}</div>
              <div style={{ fontSize: 14, color: COLORS.textMid, lineHeight: 2, marginBottom: 28, whiteSpace: "pre-line" }}>{annualReview.reflection}</div>
              <Divider margin="0 0 20px" />
              <Tag>Themes</Tag>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0 28px" }}>
                {annualReview.themes?.map((theme, i) => (
                  <span key={i} style={{ padding: "6px 14px", background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 20, fontSize: 12, color: COLORS.goldDim }}>{theme}</span>
                ))}
              </div>
              <div style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16, marginBottom: 32 }}>
                <Tag>A question for the road</Tag>
                <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: COLORS.gold, lineHeight: 1.65, marginTop: 8 }}>{annualReview.closing_question}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div></div>
    </>
  );

  // ── Home
  if (screen === "home") return (
    <>
      <style>{CSS}</style>
      <div style={shell}><div style={phone}>
        <Grain />
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "52px 26px 32px", overflowY: "auto" }}>
          <div style={{ marginBottom: 28, animation: "fadeUp 0.6s ease forwards" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,184,154,.3),transparent)", border: `1px solid rgba(200,184,154,.25)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, position: "relative" }}>
                  🌀
                  <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "1px solid rgba(200,184,154,.1)", animation: "rippleOut 2.5s ease-out infinite" }} />
                </div>
                <span style={{ fontSize: 19, letterSpacing: "0.28em", color: COLORS.gold }}>WANDER</span>
              </div>
              <button className="btn" onClick={cycleTheme} title={`Theme: ${THEMES[theme]?.name}`}
                style={{ fontSize: 16, color: COLORS.goldDim, padding: "4px 8px", border: `1px solid ${COLORS.border}`, borderRadius: 8, letterSpacing: "0.1em", fontSize: 10, color: COLORS.textDim }}>
                {THEMES[theme]?.name}
              </button>
            </div>
            <Tag color={COLORS.textMid}>A sanctuary for the wandering mind</Tag>
          </div>

          {!loadingStorage && (
            <div style={{ marginBottom: 24, animation: "fadeUp 0.6s ease 0.1s both" }}>
              {dailyDone ? (
                <div style={{ background: "rgba(200,184,154,0.06)", border: `1px solid rgba(200,184,154,0.15)`, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 22 }}>✦</div>
                  <div>
                    <div style={{ fontSize: 14, color: COLORS.textMid, marginBottom: 2 }}>Today's session complete.</div>
                    <div style={{ fontSize: 12, color: COLORS.textDim }}>Come back tomorrow. Let the question breathe.</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 24, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, lineHeight: 1.4, marginBottom: 8 }}>
                    You have<br /><span style={{ color: COLORS.gold }}>10 minutes.</span>
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.8 }}>No feed. No algorithm.<br />One idea, chosen to shift how you see today.</div>
                </div>
              )}
            </div>
          )}

          {!dailyDone && (
            <>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", color: COLORS.textDim, textTransform: "uppercase", marginBottom: 10, animation: "fadeUp 0.6s ease 0.2s both" }}>Choose your session</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "fadeUp 0.6s ease 0.25s both" }}>
                {SESSION_TYPES.map((type) => (
                  <div key={type.id} className="card-hover" onClick={() => handleTypeSelect(type)}
                    style={{ border: `1px solid ${COLORS.border}`, borderRadius: 13, padding: "14px 16px", display: "flex", alignItems: "center", gap: 13, background: COLORS.bgCard }}>
                    <span style={{ fontSize: 20 }}>{type.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: COLORS.text, marginBottom: 3 }}>{type.label}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMid }}>{type.tagline}</div>
                    </div>
                    <div style={{ color: COLORS.goldDim, fontSize: 16 }}>›</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop: dailyDone ? 0 : 16, animation: "fadeUp 0.6s ease 0.5s both" }}>
            <button className="btn card-hover" onClick={() => setScreen("journal")}
              style={{ width: "100%", padding: "14px 16px", border: `1px solid ${COLORS.border}`, borderRadius: 13, display: "flex", alignItems: "center", gap: 13 }}>
              <span style={{ fontSize: 18 }}>📖</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 14, color: COLORS.textMid }}>Question Journal</div>
                <div style={{ fontSize: 11, color: COLORS.textDim }}>{journal.length === 0 ? "Your questions accumulate here" : `${journal.length} question${journal.length === 1 ? "" : "s"} collected`}</div>
              </div>
              <div style={{ color: COLORS.goldDim, fontSize: 16 }}>›</div>
            </button>
          </div>

          {error && <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(200,100,80,0.08)", borderRadius: 10, fontSize: 12, color: "#b07060", border: "1px solid rgba(200,100,80,0.18)" }}>{error}</div>}

          {offline && (
            <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(200,184,154,0.06)", borderRadius: 10, fontSize: 11, color: COLORS.textDim, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14 }}>◌</span>
              <span>You're offline.{lastSession ? " You can re-read your last session." : ""}</span>
            </div>
          )}

          {offline && lastSession && (
            <button className="btn card-hover" onClick={replayLastSession}
              style={{ marginTop: 10, width: "100%", padding: "14px 16px", border: `1px solid ${COLORS.border}`, borderRadius: 13, display: "flex", alignItems: "center", gap: 13 }}>
              <span style={{ fontSize: 18 }}>↩</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 13, color: COLORS.textDim }}>Re-read last session</div>
                <div style={{ fontSize: 10, color: COLORS.textFaint }}>{lastSession.data?.session_title || "Your previous session"}</div>
              </div>
              <div style={{ color: COLORS.goldFaint, fontSize: 15 }}>›</div>
            </button>
          )}

          <div style={{ marginTop: "auto", paddingTop: 24, fontSize: 9, color: COLORS.textFaint, letterSpacing: "0.12em", textAlign: "center" }}>No streaks · No scores · Just thinking</div>
        </div>
      </div></div>
    </>
  );

  // ── Loading
  if (screen === "loading") return (
    <>
      <style>{CSS}</style>
      <div style={shell}><div style={phone}>
        <Grain />
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", border: `1px solid rgba(200,184,154,.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 28, position: "relative" }}>
            {selectedType?.icon}
            <div style={{ position: "absolute", inset: -7, borderRadius: "50%", border: `1px solid rgba(200,184,154,.08)`, animation: "slowSpin 4s linear infinite" }} />
          </div>
          <div style={{ fontSize: 11, color: COLORS.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Preparing your session</div>
          <div style={{ fontSize: 10, color: COLORS.textFaint, marginBottom: 24 }}>{selectedType?.label}</div>
          {seed?.trim() && <div style={{ fontSize: 11, color: COLORS.goldDim, padding: "6px 14px", background: "rgba(200,184,154,0.06)", borderRadius: 20, border: `1px solid ${COLORS.border}`, marginBottom: 8 }}>Seeded: {seed.trim()}</div>}
          <Orbs />
        </div>
      </div></div>
    </>
  );

  // ── Session
  if (screen === "session" && sessionData) return (
    <>
      <style>{CSS}</style>
      <div style={shell}><div style={phone}>
        <Grain />
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: COLORS.goldFaint, letterSpacing: "0.18em" }}>{selectedType?.icon} {selectedType?.label?.toUpperCase()}</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'DM Mono',monospace", background: "rgba(200,184,154,0.05)", padding: "4px 10px", borderRadius: 20, border: `1px solid ${COLORS.border}` }}>{fmt(elapsed)}</div>
          </div>
          <div style={{ padding: "14px 22px 18px" }}>
            <div style={{ fontSize: 21, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, lineHeight: 1.35, animation: "fadeUp 0.5s ease forwards" }}>{sessionData.session_title}</div>
            {seed?.trim() && <div style={{ marginTop: 6, fontSize: 10, color: COLORS.textFaint }}>Seeded with: <span style={{ color: COLORS.goldDim }}>{seed.trim()}</span></div>}
          </div>
          <Divider margin="0 22px 20px" />
          <div style={{ padding: "0 22px", flex: 1, overflowY: "auto" }}>
            <SessionContent data={sessionData} typeId={selectedType?.id} />
            <div style={{ height: 24 }} />
          </div>
          <div style={{ padding: "16px 22px 40px" }}>
            <button className="btn" onClick={handleFlush} style={{ width: "100%", padding: 15, background: "rgba(200,184,154,0.08)", border: `1px solid rgba(200,184,154,0.25)`, borderRadius: 14, color: COLORS.gold, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span>🚿</span> Flush & carry the question
            </button>
          </div>
        </div>
      </div></div>
    </>
  );

  // ── Mood picker
  if (screen === "mood") return (
    <>
      <style>{CSS}</style>
      <div style={shell}><div style={phone}>
        <Grain />
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, lineHeight: 1.4, marginBottom: 10, animation: "fadeUp 0.5s ease forwards" }}>
            How did that<br /><span style={{ color: COLORS.gold }}>feel?</span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 36, animation: "fadeUp 0.5s ease 0.1s both" }}>One tap. No scores.</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 36, animation: "fadeUp 0.5s ease 0.2s both" }}>
            {["🌊", "⚡", "🌿", "🔥", "🌙", "✨"].map(emoji => (
              <button key={emoji} className="btn" onClick={() => { setPendingMood(emoji); handleMoodSelect(emoji); }}
                style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${pendingMood === emoji ? "rgba(200,184,154,0.4)" : COLORS.border}`, background: pendingMood === emoji ? "rgba(200,184,154,0.1)" : COLORS.bgCard, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                {emoji}
              </button>
            ))}
          </div>
          <button className="btn" onClick={() => handleMoodSelect(null)}
            style={{ padding: 12, border: `1px solid ${COLORS.textFaint}22`, borderRadius: 12, color: COLORS.textFaint, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", animation: "fadeUp 0.5s ease 0.3s both" }}>
            Skip
          </button>
        </div>
      </div></div>
    </>
  );

  // ── Done
  if (screen === "done") return (
    <>
      <style>{CSS}</style>
      <div style={shell}><div style={phone}>
        <Grain />
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", textAlign: "center" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: "radial-gradient(circle,rgba(200,184,154,.12),transparent)", border: `1px solid rgba(200,184,154,.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 28, animation: "fadeUp 0.5s ease forwards" }}>🌀</div>
          <div style={{ fontSize: 25, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, lineHeight: 1.4, marginBottom: 14, animation: "fadeUp 0.5s ease 0.12s both" }}>
            Go on.<br /><span style={{ color: COLORS.gold }}>The question is yours now.</span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.85, marginBottom: 32, animation: "fadeUp 0.5s ease 0.22s both" }}>
            Session: {fmt(elapsed)}<br />The idea will find its moment today.
          </div>
          <Divider margin="0 0 24px" />
          <div style={{ width: "100%", textAlign: "left", animation: "fadeUp 0.5s ease 0.32s both" }}>
            <Tag color={COLORS.textFaint}>Carry this today</Tag>
            <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: "#b0a080", lineHeight: 1.75, marginTop: 10 }}>{sessionData?.carry_question}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 32, animation: "fadeUp 0.5s ease 0.44s both" }}>
            <button className="btn" onClick={handleShare} disabled={sharing} style={{ padding: 13, background: "rgba(200,184,154,0.1)", border: `1px solid rgba(200,184,154,0.25)`, borderRadius: 12, color: COLORS.gold, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", opacity: sharing ? 0.5 : 1 }}>
              {sharing ? "Creating image…" : "Share this question"}
            </button>
            <button className="btn" onClick={() => setScreen("journal")} style={{ padding: 13, background: "rgba(200,184,154,0.06)", border: `1px solid ${COLORS.border}`, borderRadius: 12, color: COLORS.textMid, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              📖 View question journal
            </button>
            <button className="btn" onClick={() => { setScreen("home"); setSessionData(null); setSelectedType(null); setSeed(""); }} style={{ padding: 12, border: `1px solid ${COLORS.textFaint}22`, borderRadius: 12, color: COLORS.textFaint, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Return home
            </button>
          </div>
        </div>
      </div></div>
    </>
  );

  return null;
}
