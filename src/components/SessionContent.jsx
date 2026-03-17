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

export default function SessionContent({ data, typeId }) {
  if (typeId === "odd_connection") return <OddConnection data={data} />;
  if (typeId === "contrarian") return <Contrarian data={data} />;
  if (typeId === "field_trip") return <FieldTrip data={data} />;
  if (typeId === "ignored_signal") return <IgnoredSignal data={data} />;
  return null;
}
