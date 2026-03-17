// ─── Share Image Generator ──────────────────────────────────────────────────
// Generates a styled image of the carry question using Canvas API,
// then shares via Web Share API or downloads as fallback.

const WIDTH = 1080;
const HEIGHT = 1080;

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateShareImage(carryQuestion) {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");

  // Background
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, "#141008");
  bg.addColorStop(0.5, "#0f0d0a");
  bg.addColorStop(1, "#0c0b08");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle border
  ctx.strokeStyle = "rgba(200,184,154,0.12)";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, WIDTH - 120, HEIGHT - 120);

  // Top label
  ctx.font = "500 22px 'DM Mono', monospace";
  ctx.fillStyle = "#3a2f22";
  ctx.letterSpacing = "6px";
  ctx.textAlign = "center";
  ctx.fillText("CARRY THIS TODAY", WIDTH / 2, 160);

  // Decorative line
  const lineGrad = ctx.createLinearGradient(200, 0, WIDTH - 200, 0);
  lineGrad.addColorStop(0, "transparent");
  lineGrad.addColorStop(0.5, "rgba(200,184,154,0.2)");
  lineGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, 200);
  ctx.lineTo(WIDTH - 200, 200);
  ctx.stroke();

  // Question text
  ctx.font = "italic 48px 'Cormorant Garamond', Georgia, serif";
  ctx.fillStyle = "#b0a080";
  ctx.textAlign = "center";
  ctx.letterSpacing = "0px";
  const lines = wrapText(ctx, carryQuestion, WIDTH - 240);
  const lineHeight = 72;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (HEIGHT / 2) - (totalTextHeight / 2) + 40;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], WIDTH / 2, startY + i * lineHeight);
  }

  // Bottom decorative line
  ctx.strokeStyle = lineGrad;
  ctx.beginPath();
  ctx.moveTo(200, HEIGHT - 200);
  ctx.lineTo(WIDTH - 200, HEIGHT - 200);
  ctx.stroke();

  // Wander branding
  ctx.font = "300 20px 'DM Mono', monospace";
  ctx.fillStyle = "#3a2f22";
  ctx.letterSpacing = "8px";
  ctx.fillText("WANDER", WIDTH / 2, HEIGHT - 140);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export async function shareCarryQuestion(carryQuestion) {
  const blob = await generateShareImage(carryQuestion);
  const file = new File([blob], "wander-question.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return "shared";
    } catch (e) {
      if (e.name === "AbortError") return "cancelled";
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wander-question.png";
  a.click();
  URL.revokeObjectURL(url);
  return "downloaded";
}
