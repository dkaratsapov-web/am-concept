import { useEffect, useRef } from "react";

interface Vec {
  x: number;
  y: number;
}
interface RGB {
  r: number;
  g: number;
  b: number;
}

const GOLD: RGB = { r: 198, g: 166, b: 92 };
const CREAM: RGB = { r: 234, g: 223, b: 203 };

class Particle {
  pos: Vec = { x: 0, y: 0 };
  vel: Vec = { x: 0, y: 0 };
  acc: Vec = { x: 0, y: 0 };
  target: Vec = { x: 0, y: 0 };
  closeEnoughTarget = 100;
  maxSpeed = 1;
  maxForce = 0.1;
  size = 2.5;
  isKilled = false;
  startColor: RGB = { r: 0, g: 0, b: 0 };
  targetColor: RGB = { r: 0, g: 0, b: 0 };
  colorWeight = 0;
  colorBlendRate = 0.01;

  move() {
    let prox = 1;
    const dx = this.pos.x - this.target.x;
    const dy = this.pos.y - this.target.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.closeEnoughTarget) prox = dist / this.closeEnoughTarget;

    let tx = this.target.x - this.pos.x;
    let ty = this.target.y - this.pos.y;
    const m = Math.sqrt(tx * tx + ty * ty);
    if (m > 0) {
      tx = (tx / m) * this.maxSpeed * prox;
      ty = (ty / m) * this.maxSpeed * prox;
    }
    let sx = tx - this.vel.x;
    let sy = ty - this.vel.y;
    const sm = Math.sqrt(sx * sx + sy * sy);
    if (sm > 0) {
      sx = (sx / sm) * this.maxForce;
      sy = (sy / sm) * this.maxForce;
    }
    this.acc.x += sx;
    this.acc.y += sy;
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1);
    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
  }

  kill(w: number, h: number) {
    if (this.isKilled) return;
    const rp = randomPos(w / 2, h / 2, (w + h) / 2, w, h);
    this.target = rp;
    this.startColor = {
      r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
      g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
      b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
    };
    this.targetColor = { r: 14, g: 14, b: 12 };
    this.colorWeight = 0;
    this.isKilled = true;
  }
}

function randomPos(x: number, y: number, mag: number, w: number, h: number): Vec {
  const rx = Math.random() * w;
  const ry = Math.random() * h;
  let dx = rx - x;
  let dy = ry - y;
  const m = Math.sqrt(dx * dx + dy * dy);
  if (m > 0) {
    dx = (dx / m) * mag;
    dy = (dy / m) * mag;
  }
  return { x: x + dx, y: y + dy };
}

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onComplete();
      return;
    }

    const W = 1100;
    const H = 420;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const PIXEL_STEPS = 4;
    const particles: Particle[] = [];

    const build = (word: string) => {
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const octx = off.getContext("2d")!;
      octx.fillStyle = "white";
      octx.font = '900 104px Georgia, "Times New Roman", serif';
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(word, W / 2, H / 2);
      const pixels = octx.getImageData(0, 0, W, H).data;

      const coords: number[] = [];
      for (let i = 0; i < pixels.length; i += PIXEL_STEPS * 4) coords.push(i);
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]];
      }

      let idx = 0;
      for (const ci of coords) {
        if (pixels[ci + 3] > 0) {
          const x = (ci / 4) % W;
          const y = Math.floor(ci / 4 / W);
          let p: Particle;
          if (idx < particles.length) {
            p = particles[idx];
            p.isKilled = false;
            idx++;
          } else {
            p = new Particle();
            const rp = randomPos(W / 2, H / 2, (W + H) / 2, W, H);
            p.pos = rp;
            p.maxSpeed = Math.random() * 1.6 + 1.4; // медленнее → читаемо
            p.maxForce = p.maxSpeed * 0.09;
            p.size = Math.random() * 1.4 + 2; // чуть крупнее точки
            p.colorBlendRate = Math.random() * 0.02 + 0.006;
            particles.push(p);
          }
          p.startColor = {
            r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
            g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
            b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
          };
          p.targetColor = Math.random() < 0.45 ? CREAM : GOLD;
          p.colorWeight = 0;
          p.target = { x, y };
        }
      }
      for (let i = idx; i < particles.length; i++) particles[i].kill(W, H);
    };

    let raf = 0;
    const loop = () => {
      ctx.fillStyle = "rgba(14,14,12,0.28)"; // короче шлейф → чёткие точки
      ctx.fillRect(0, 0, W, H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.move();
        p.draw(ctx);
        if (p.isKilled && (p.pos.x < 0 || p.pos.x > W || p.pos.y < 0 || p.pos.y > H)) {
          particles.splice(i, 1);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    build("A&M CONCEPT");
    loop();

    const t = window.setTimeout(onComplete, 4200); // дольше держим читаемый текст
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="preloader__canvas"
      aria-hidden="true"
    />
  );
}
