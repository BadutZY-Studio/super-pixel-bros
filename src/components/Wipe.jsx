import { forwardRef, useImperativeHandle, useRef } from "react";
import { prefersReducedMotion } from "../lib/hooks.js";

const ease = (t) => t * t * (3 - 2 * t);

/**
 * Transisi wipe kotak-pixel (terinspirasi shader transisi di game).
 * Canvas di-render dengan rAF — hanya menggambar kotak, jadi ringan & mulus di mobile.
 */
export const Wipe = forwardRef(function Wipe(_, ref) {
  const cv = useRef(null);
  const state = useRef({ covered: false });

  const run = (cover, ms) => new Promise((resolve) => {
    const c = cv.current;
    if (!c || prefersReducedMotion()) { state.current.covered = cover; if (c) c.style.display = cover ? "block" : "none"; resolve(); return; }
    const w = (c.width = window.innerWidth), h = (c.height = window.innerHeight);
    const cell = Math.max(40, Math.round(Math.min(w, h) / (w < 600 ? 9 : 11)));
    const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
    const g = c.getContext("2d");
    c.style.display = "block";
    const t0 = performance.now();
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      g.clearRect(0, 0, w, h);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const d = ((i + j) / (cols + rows - 2)) * 0.55;
        const lp = Math.max(0, Math.min(1, (p - d) / 0.45));
        const k = cover ? ease(lp) : 1 - ease(lp);
        if (k <= 0.001) continue;
        const s = Math.ceil(cell * k) + (k >= 0.999 ? 1 : 0);
        const x = i * cell + (cell - s) / 2, y = j * cell + (cell - s) / 2;
        g.fillStyle = "#ffd23a";
        g.fillRect(x, y, s, s);
        const b = Math.min(4, s / 4);
        g.fillStyle = "#181020";
        g.fillRect(x + b, y + b, s - b * 2, s - b * 2);
      }
      if (p < 1) requestAnimationFrame(frame);
      else { state.current.covered = cover; if (!cover) c.style.display = "none"; resolve(); }
    };
    requestAnimationFrame(frame);
  });

  useImperativeHandle(ref, () => ({
    cover: () => run(true, 380),
    reveal: () => run(false, 460),
    setCovered: () => { const c = cv.current; if (!c) return; c.width = window.innerWidth; c.height = window.innerHeight; const g = c.getContext("2d"); g.fillStyle = "#181020"; g.fillRect(0, 0, c.width, c.height); c.style.display = "block"; state.current.covered = true; },
  }));

  return <canvas ref={cv} className="wipe" aria-hidden="true" />;
});
