import { useState } from "react";
import { COLORS } from "../constants.js";

const steps = [
  {
    icon: "🌀",
    title: "Welcome to Wander",
    body: "This isn't a feed. There's no algorithm deciding what you see.\n\nWander gives you one idea per day — chosen to shift how you think, not to keep you scrolling.",
  },
  {
    icon: "⏳",
    title: "One session.\nTen minutes.",
    body: "Each day, you choose a session type. The AI generates a unique piece of thinking — a connection, a contrarian take, a dispatch from someone else's world.\n\nThen it's gone. No replays. No archive of content. Just one question to carry.",
  },
  {
    icon: "✦",
    title: "Flush & carry",
    body: "When you're done reading, you flush the session. The content disappears.\n\nAll that remains is the carry question — one open question saved to your journal, designed to follow you through the day.",
  },
  {
    icon: "📖",
    title: "Your Question Journal",
    body: "Over time, your journal becomes a map of what you've been thinking about.\n\nNo scores. No streaks. No guilt.\nJust the quiet accumulation of better questions.",
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      padding: "56px 30px 40px", position: "relative", zIndex: 1,
    }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 8, marginBottom: 48 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8, borderRadius: 4,
            background: i === step ? COLORS.gold : COLORS.border,
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(200,184,154,.12),transparent)",
        border: `1px solid rgba(200,184,154,.2)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, marginBottom: 32,
        animation: "fadeUp 0.5s ease forwards",
      }}>
        {current.icon}
      </div>

      {/* Title */}
      <div key={`title-${step}`} style={{
        fontSize: 26, fontFamily: "'Cormorant Garamond',serif",
        color: COLORS.text, lineHeight: 1.35, marginBottom: 20,
        whiteSpace: "pre-line",
        animation: "fadeUp 0.5s ease forwards",
      }}>
        {current.title}
      </div>

      {/* Body */}
      <div key={`body-${step}`} style={{
        fontSize: 13, color: COLORS.textDim, lineHeight: 1.9,
        whiteSpace: "pre-line",
        animation: "fadeUp 0.5s ease 0.1s both",
      }}>
        {current.body}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          className="btn"
          onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
          style={{
            padding: 16,
            background: "rgba(200,184,154,0.1)",
            border: `1px solid rgba(200,184,154,0.3)`,
            borderRadius: 14, color: COLORS.gold,
            fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase",
          }}
        >
          {isLast ? "Begin wandering" : "Continue"}
        </button>
        {step > 0 && !isLast && (
          <button
            className="btn"
            onClick={() => setStep(s => s - 1)}
            style={{
              padding: 13, border: `1px solid ${COLORS.border}`,
              borderRadius: 14, color: COLORS.textDim,
              fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
            }}
          >
            Back
          </button>
        )}
        {!isLast && (
          <button
            className="btn"
            onClick={onComplete}
            style={{
              padding: 10, border: "none", borderRadius: 12,
              color: COLORS.textFaint, fontSize: 10,
              letterSpacing: "0.15em", textTransform: "uppercase",
            }}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
