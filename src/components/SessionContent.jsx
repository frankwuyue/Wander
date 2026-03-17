import { COLORS } from "../constants.js";

const Tag = ({ children, color = COLORS.goldDim }) => (
  <span style={{ fontSize: 9, letterSpacing: "0.2em", color, textTransform: "uppercase" }}>
    {children}
  </span>
);

export function OddConnection({ data }) {
  return (
    <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
      <Tag>Two things. One truth.</Tag>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0 20px" }}>
        {[data.thing1, data.thing2].map((t, i) => (
          <div key={i} style={{
            background: "rgba(200,184,154,0.07)", border: `1px solid ${COLORS.border}`,
            borderRadius: 14, padding: "16px 14px",
            animation: `fadeUp 0.5s ease ${i * 0.12}s both`,
          }}>
            <Tag>{t.domain}</Tag>
            <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, margin: "6px 0 8px", lineHeight: 1.3 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: COLORS.textMid, lineHeight: 1.7 }}>{t.blurb}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(200,184,154,0.04)", border: `1px solid rgba(200,184,154,0.2)`, borderRadius: 14, padding: "18px 16px", marginBottom: 20, animation: "fadeUp 0.5s ease 0.28s both" }}>
        <Tag color={COLORS.gold}>⚡ The connection</Tag>
        <div style={{ fontSize: 14, color: "#d4c4a8", lineHeight: 1.75, marginTop: 10 }}>{data.bridge}</div>
      </div>
      <div style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16, animation: "fadeUp 0.5s ease 0.42s both" }}>
        <Tag>Carry this with you</Tag>
        <div style={{ fontSize: 15, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: COLORS.gold, lineHeight: 1.65, marginTop: 8 }}>{data.carry_question}</div>
      </div>
    </div>
  );
}

export function Contrarian({ data }) {
  return (
    <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
      <Tag>Common belief</Tag>
      <div style={{ fontSize: 13, color: COLORS.goldDim, lineHeight: 1.65, margin: "10px 0 20px", textDecoration: "line-through", textDecorationColor: "rgba(200,184,154,0.25)", padding: "12px 14px", background: COLORS.bgCard, borderRadius: 10 }}>{data.common_belief}</div>
      <div style={{ fontSize: 23, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, lineHeight: 1.3, marginBottom: 20, animation: "fadeUp 0.5s ease 0.15s both" }}>{data.flip}</div>
      <div style={{ fontSize: 14, color: COLORS.textMid, lineHeight: 1.85, marginBottom: 18, animation: "fadeUp 0.5s ease 0.28s both" }}>{data.argument}</div>
      <div style={{ background: COLORS.bgCard, borderRadius: 11, padding: "13px 15px", fontSize: 13, color: COLORS.goldDim, lineHeight: 1.65, marginBottom: 22, animation: "fadeUp 0.5s ease 0.38s both" }}>
        <span style={{ color: COLORS.gold, fontWeight: 600 }}>That said: </span>{data.counterpoint}
      </div>
      <div style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16, animation: "fadeUp 0.5s ease 0.5s both" }}>
        <Tag>Carry this with you</Tag>
        <div style={{ fontSize: 15, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: COLORS.gold, lineHeight: 1.65, marginTop: 8 }}>{data.carry_question}</div>
      </div>
    </div>
  );
}

export function FieldTrip({ data }) {
  return (
    <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(200,184,154,0.1)", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧭</div>
        <div>
          <div style={{ fontSize: 14, color: COLORS.text, fontFamily: "'Cormorant Garamond',serif" }}>{data.guide}</div>
          <Tag>{data.world}</Tag>
        </div>
      </div>
      <div style={{ fontSize: 14, color: "#b8a888", lineHeight: 1.95, marginBottom: 22, fontStyle: "italic", animation: "fadeUp 0.5s ease 0.18s both" }}>"{data.dispatch}"</div>
      <div style={{ background: "linear-gradient(135deg,rgba(200,184,154,0.07),rgba(200,184,154,0.03))", border: `1px solid rgba(200,184,154,0.18)`, borderRadius: 13, padding: 16, marginBottom: 20, animation: "fadeUp 0.5s ease 0.34s both" }}>
        <Tag color={COLORS.gold}>The thing you can't unsee</Tag>
        <div style={{ fontSize: 14, color: "#d4c4a8", lineHeight: 1.75, marginTop: 8 }}>{data.the_thing_you_now_cant_unsee}</div>
      </div>
      <div style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16, animation: "fadeUp 0.5s ease 0.48s both" }}>
        <Tag>Carry this with you</Tag>
        <div style={{ fontSize: 15, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: COLORS.gold, lineHeight: 1.65, marginTop: 8 }}>{data.carry_question}</div>
      </div>
    </div>
  );
}

export function IgnoredSignal({ data }) {
  return (
    <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
      <Tag>Quiet signal</Tag>
      <div style={{ fontSize: 21, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text, lineHeight: 1.35, margin: "12px 0 18px" }}>{data.signal}</div>
      <div style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.75, marginBottom: 18, animation: "fadeUp 0.5s ease 0.18s both" }}>
        <span style={{ color: COLORS.goldDim }}>Why you haven't heard this: </span>{data.why_ignored}
      </div>
      <div style={{ fontSize: 14, color: COLORS.textMid, lineHeight: 1.85, marginBottom: 18, animation: "fadeUp 0.5s ease 0.28s both" }}>{data.the_evidence}</div>
      <div style={{ background: COLORS.bgCard, borderRadius: 11, padding: 15, marginBottom: 22, fontSize: 14, color: "#c4b498", lineHeight: 1.75, animation: "fadeUp 0.5s ease 0.38s both" }}>
        <Tag color={COLORS.gold}>Why it might matter</Tag>
        <div style={{ marginTop: 8 }}>{data.why_it_matters}</div>
      </div>
      <div style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16, animation: "fadeUp 0.5s ease 0.5s both" }}>
        <Tag>Carry this with you</Tag>
        <div style={{ fontSize: 15, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: COLORS.gold, lineHeight: 1.65, marginTop: 8 }}>{data.carry_question}</div>
      </div>
    </div>
  );
}

export function DeadGenius({ data }) {
  return (
    <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(200,184,154,0.1)", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏛</div>
        <div>
          <div style={{ fontSize: 14, color: COLORS.text, fontFamily: "'Cormorant Garamond',serif" }}>{data.genius.name}</div>
          <Tag>{data.genius.era}</Tag>
        </div>
      </div>
      <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.7, marginBottom: 18, padding: "10px 14px", background: COLORS.bgCard, borderRadius: 10, animation: "fadeUp 0.5s ease 0.1s both" }}>
        {data.genius.known_for}
      </div>
      <Tag>The modern problem</Tag>
      <div style={{ fontSize: 14, color: COLORS.textMid, lineHeight: 1.85, margin: "10px 0 20px", animation: "fadeUp 0.5s ease 0.18s both" }}>{data.the_problem}</div>
      <div style={{ background: "linear-gradient(135deg,rgba(200,184,154,0.07),rgba(200,184,154,0.03))", border: `1px solid rgba(200,184,154,0.18)`, borderRadius: 13, padding: 16, marginBottom: 18, animation: "fadeUp 0.5s ease 0.28s both" }}>
        <Tag color={COLORS.gold}>Their lens</Tag>
        <div style={{ fontSize: 14, color: "#d4c4a8", lineHeight: 1.75, marginTop: 8 }}>{data.their_lens}</div>
      </div>
      <Tag>The move</Tag>
      <div style={{ fontSize: 14, color: COLORS.textMid, lineHeight: 1.85, margin: "10px 0 18px", animation: "fadeUp 0.5s ease 0.36s both" }}>{data.the_move}</div>
      <div style={{ background: COLORS.bgCard, borderRadius: 11, padding: "13px 15px", fontSize: 13, color: COLORS.goldDim, lineHeight: 1.65, marginBottom: 22, animation: "fadeUp 0.5s ease 0.44s both" }}>
        <span style={{ color: COLORS.gold, fontWeight: 600 }}>The tension: </span>{data.the_tension}
      </div>
      <div style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16, animation: "fadeUp 0.5s ease 0.54s both" }}>
        <Tag>Carry this with you</Tag>
        <div style={{ fontSize: 15, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: COLORS.gold, lineHeight: 1.65, marginTop: 8 }}>{data.carry_question}</div>
      </div>
    </div>
  );
}

export function Detour({ data }) {
  return (
    <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
      {/* Origin */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(200,184,154,0.12)", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: COLORS.gold }}>1</div>
        <div>
          <div style={{ fontSize: 15, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text }}>{data.origin.idea}</div>
          <Tag>{data.origin.domain}</Tag>
        </div>
      </div>
      <div style={{ fontSize: 13, color: COLORS.textMid, lineHeight: 1.75, marginBottom: 20, paddingLeft: 38 }}>{data.origin.setup}</div>

      {/* Hops */}
      {data.hops.map((hop, i) => (
        <div key={i} style={{ animation: `fadeUp 0.5s ease ${0.15 + i * 0.15}s both` }}>
          <div style={{ height: 24, width: 1, background: `linear-gradient(180deg,${COLORS.border},transparent)`, marginLeft: 14, marginBottom: 8 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 2 ? "rgba(200,184,154,0.18)" : "rgba(200,184,154,0.08)", border: `1px solid ${i === 2 ? "rgba(200,184,154,0.3)" : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: COLORS.gold }}>{i + 2}</div>
            <div>
              <div style={{ fontSize: 15, fontFamily: "'Cormorant Garamond',serif", color: COLORS.text }}>{hop.idea}</div>
              <Tag>{hop.domain}</Tag>
            </div>
          </div>
          <div style={{ fontSize: 13, color: COLORS.textMid, lineHeight: 1.75, marginBottom: 16, paddingLeft: 38 }}>{hop.connection}</div>
        </div>
      ))}

      {/* The View */}
      <div style={{ background: "linear-gradient(135deg,rgba(200,184,154,0.07),rgba(200,184,154,0.03))", border: `1px solid rgba(200,184,154,0.18)`, borderRadius: 13, padding: 16, marginBottom: 22, marginTop: 8, animation: "fadeUp 0.5s ease 0.6s both" }}>
        <Tag color={COLORS.gold}>The view from here</Tag>
        <div style={{ fontSize: 14, color: "#d4c4a8", lineHeight: 1.75, marginTop: 8 }}>{data.the_view_from_here}</div>
      </div>

      <div style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16, animation: "fadeUp 0.5s ease 0.72s both" }}>
        <Tag>Carry this with you</Tag>
        <div style={{ fontSize: 15, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: COLORS.gold, lineHeight: 1.65, marginTop: 8 }}>{data.carry_question}</div>
      </div>
    </div>
  );
}

export default function SessionContent({ data, typeId }) {
  if (typeId === "odd_connection") return <OddConnection data={data} />;
  if (typeId === "contrarian") return <Contrarian data={data} />;
  if (typeId === "field_trip") return <FieldTrip data={data} />;
  if (typeId === "ignored_signal") return <IgnoredSignal data={data} />;
  if (typeId === "dead_genius") return <DeadGenius data={data} />;
  if (typeId === "detour") return <Detour data={data} />;
  return null;
}
