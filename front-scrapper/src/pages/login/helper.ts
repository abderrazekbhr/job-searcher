const generateCaptchaText = (length = 6) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // omit confusing chars like I,O,1,0
  let s = "";
  for (let i = 0; i < length; i++)
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
};

const scrambleCaptcha = (original: string) => {
  const arr = original.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
};

const drawCaptchaToCanvas = (
  text: string,
  canvas: HTMLCanvasElement | null
) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // background
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#f8fafc");
  grad.addColorStop(1, "#eef2ff");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // add noise background circles
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const radius = Math.random() * 12;
    ctx.fillStyle = `rgba(15,23,42, ${Math.random() * 0.08})`;
    ctx.arc(Math.random() * w, Math.random() * h, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // draw random lines
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * w, Math.random() * h);
    ctx.lineTo(Math.random() * w, Math.random() * h);
    ctx.strokeStyle = `rgba(2,6,23, ${0.06 + Math.random() * 0.12})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.stroke();
  }

  // draw the text with per-character transforms
  const charCount = text.length;
  const fontSize = Math.floor(h * 0.6);
  ctx.textBaseline = "middle";

  for (let i = 0; i < charCount; i++) {
    const char = text[i];
    const x = (w / (charCount + 1)) * (i + 1);
    const y = h / 2 + (Math.random() - 0.5) * 6;

    ctx.save();
    const angle = (Math.random() - 0.5) * 0.5; // rotate a bit
    ctx.translate(x, y);
    ctx.rotate(angle);

    // gradient fill for each character
    const g = ctx.createLinearGradient(
      -fontSize / 2,
      -fontSize / 2,
      fontSize / 2,
      fontSize / 2
    );
    g.addColorStop(0, "#0f172a");
    g.addColorStop(1, `rgba(15,23,42, ${0.6 - Math.random() * 0.2})`);
    ctx.fillStyle = g;
    ctx.font = `${fontSize}px serif`;
    ctx.fillText(char, -fontSize / 4, 0);

    // tiny noise over character
    for (let n = 0; n < 6; n++) {
      ctx.beginPath();
      ctx.arc(
        (Math.random() - 0.5) * fontSize * 0.7,
        (Math.random() - 0.5) * fontSize * 0.6,
        Math.random() * 1.5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(2,6,23, ${0.03 + Math.random() * 0.09})`;
      ctx.fill();
    }

    ctx.restore();
  }

  // final scanline noise
  const imgData = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < w * 2; i++) {
    const y = Math.floor(Math.random() * h);
    const offset = (y * w + Math.floor(Math.random() * w)) * 4;
    imgData.data[offset + 0] =
      imgData.data[offset + 0] ^ Math.floor(Math.random() * 8);
  }
  ctx.putImageData(imgData, 0, 0);
};

const fakeNetworkRequest = (_payload: { email: string; password: string }) => {
  // Fake network request to simulate login latency. Replace with real API call.
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      // a toy logic: accept any password "password123" or else reject — just to demo
      if (_payload.password === "password123") resolve();
      else resolve();
    }, 900);
  });
};


export const captchaUtils= {
    generateCaptchaText,
    scrambleCaptcha,
    drawCaptchaToCanvas,
    fakeNetworkRequest

}