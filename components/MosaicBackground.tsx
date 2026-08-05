"use client";

import { useEffect, useRef } from "react";

type RGB = { r: number; g: number; b: number };

// 柔和低饱和调色板：灰白 / 米色 / 淡蓝 / 灰绿 / 淡杏
const PALETTE: RGB[] = [
  { r: 245, g: 240, b: 232 },
  { r: 232, g: 228, b: 218 },
  { r: 221, g: 227, b: 230 },
  { r: 214, g: 210, b: 201 },
  { r: 205, g: 214, b: 212 },
  { r: 227, g: 225, b: 231 },
  { r: 240, g: 234, b: 226 },
  { r: 216, g: 220, b: 217 },
  { r: 198, g: 208, b: 214 },
  { r: 228, g: 222, b: 210 },
];

interface Cell {
  cur: RGB;
  target: RGB;
  progress: number;
  duration: number;
}

const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const randomColor = (): RGB =>
  PALETTE[Math.floor(Math.random() * PALETTE.length)];

/**
 * 马赛克风格动画背景：
 * 整块画布被划分为网格，每 70ms 随机唤醒一批格子，
 * 让它们以 ease-in-out 平滑过渡到调色板中的另一个颜色，
 * 鼠标滑过区域微亮，形成「活的马赛克壁画在缓慢呼吸」的效果。
 */
export default function MosaicBackground({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let cells: Cell[] = [];
    let rafId = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = (): void => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? window.innerWidth;
      height = rect?.height ?? window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 按约 48px 的格子尺寸推导行列数
      cols = Math.max(8, Math.ceil(width / 48));
      rows = Math.max(6, Math.ceil(height / 48));

      cells = Array.from({ length: cols * rows }, () => {
        const c = randomColor();
        return { cur: c, target: c, progress: 1, duration: 400 };
      });
    };

    // 随机唤醒若干格子开始变色
    const wakeCells = (count: number): void => {
      for (let n = 0; n < count; n++) {
        const idx = Math.floor(Math.random() * cells.length);
        const cell = cells[idx];
        // 已经正在过渡中的格子，半概率跳过，制造错落的节奏
        if (cell.progress < 1 && Math.random() < 0.55) continue;
        cell.target = randomColor();
        cell.progress = 0;
        cell.duration = 320 + Math.random() * 260;
      }
    };

    const mouse = { x: -9999, y: -9999 };
    const onMouseMove = (e: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = (): void => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    let lastTick = performance.now();
    let timer = 0;

    const frame = (now: number): void => {
      const dt = Math.min(now - lastTick, 100);
      lastTick = now;
      timer += dt;

      // 每 70ms 唤醒一批格子，形成波浪般的呼吸节奏
      if (timer >= 70) {
        wakeCells(Math.floor(cells.length * 0.07));
        timer = 0;
      }

      const cellW = width / cols;
      const cellH = height / rows;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        if (cell.progress < 1) {
          cell.progress = Math.min(1, cell.progress + dt / cell.duration);
          const t = easeInOut(cell.progress);
          cell.cur = {
            r: lerp(cell.cur.r, cell.target.r, t),
            g: lerp(cell.cur.g, cell.target.g, t),
            b: lerp(cell.cur.b, cell.target.b, t),
          };
        }

        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = col * cellW + cellW / 2;
        const cy = row * cellH + cellH / 2;

        // 鼠标附近的格子微微提亮
        const dist = Math.hypot(cx - mouse.x, cy - mouse.y);
        const glow = dist < 130 ? 1 - dist / 130 : 0;

        const r = Math.min(255, cell.cur.r + glow * 16);
        const g = Math.min(255, cell.cur.g + glow * 16);
        const b = Math.min(255, cell.cur.b + glow * 16);

        ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
        ctx.fillRect(col * cellW + 0.5, row * cellH + 0.5, cellW - 1, cellH - 1);
      }

      rafId = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseLeave);
    rafId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
