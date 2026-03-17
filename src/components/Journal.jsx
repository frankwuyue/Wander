import { useState } from "react";
import { COLORS } from "../constants.js";

const TYPE_ICON = {
  odd_connection: "⚡",
  contrarian: "🔄",
  field_trip: "🌍",
  ignored_signal: "📡",
};

const Tag = ({ children, color = COLORS.goldDim }) => (
  <span style={{ fontSize: 9, letterSpacing: "0.2em", color, textTransform: "uppercase" }}>{children}</span>
);

export default function Journal({ journal, onBack }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "52px 24px 32px", animation: "fadeUp 0.4s ease forwards" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.goldDim, fontSize: 20, cursor: "pointer", padding: 0, lineHeight: 1 }}>←</button>
        <div>
          <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text }}>Question Journal</div>
          <Tag>{journal.length} session{journal.length !== 1 ? "s" : ""} carried</Tag>
        </div>
      </div>

      {journal.length === 0 ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16 }}>
          <div style={{ fontSize: 36 }}>🌀</div>
          <div style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.8 }}>
            Your questions will appear here<br />after your first session.
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {[...journal].reverse().map((entry, i) => (
            <div
              key={entry.id}
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              style={{
                border: `1px solid ${expanded === entry.id ? "rgba(200,184,154,0.3)" : COLORS.border}`,
                borderRadius: 14, padding: 16,
                background: expanded === entry.id ? "rgba(200,184,154,0.06)" : COLORS.bgCard,
                cursor: "pointer", transition: "all 0.2s ease",
                animation: `fadeUp 0.4s ease ${i * 0.04}s both`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13 }}>{TYPE_ICON[entry.typeId]}</span>
                    <Tag>{entry.date}</Tag>
                  </div>
                  <div style={{ fontSize: 14, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, lineHeight: 1.4 }}>{entry.sessionTitle}</div>
                </div>
                <div style={{ color: COLORS.goldFaint, fontSize: 14, marginLeft: 8, transition: "transform 0.2s", transform: expanded === entry.id ? "rotate(90deg)" : "none" }}>›</div>
              </div>

              {expanded === entry.id && (
                <div style={{ marginTop: 14, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, animation: "fadeUp 0.3s ease forwards" }}>
                  <Tag>The question you carried</Tag>
                  <div style={{ fontSize: 14, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: COLORS.gold, lineHeight: 1.65, marginTop: 8 }}>
                    {entry.carryQuestion}
                  </div>
                  {entry.seed && (
                    <div style={{ marginTop: 12, fontSize: 11, color: COLORS.textDim }}>
                      <Tag>Seeded with </Tag>
                      <span style={{ color: COLORS.goldDim }}> {entry.seed}</span>
                    </div>
                  )}
                  <div style={{ marginTop: 10, fontSize: 11, color: COLORS.textDim }}>
                    Session lasted {entry.duration}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
