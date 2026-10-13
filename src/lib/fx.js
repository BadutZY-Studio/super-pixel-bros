import { G } from "./data.js";
import { prefersReducedMotion } from "./hooks.js";

// ---- toast
const listeners = new Set();
let uid = 1;
export function toast(message, opts = {}) {
  const t = { id: uid++, message, sprite: opts.sprite, tone: opts.tone || "gold", ms: opts.ms || 2600 };
  listeners.forEach((f) => f(t));
}
export const onToast = (f) => (listeners.add(f), () => listeners.delete(f));

// ---- partikel koin / teks melayang (WAAPI → berjalan di kompositor, mulus)
export function burst(x, y, { n = 10, spread = 140 } = {}) {
  if (prefersReducedMotion()) return;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span");
    el.className = "fx-coin";
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    el.style.backgroundImage = `url(${G}/sprites/coin.png)`;
    document.body.appendChild(el);
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const dist = spread * (0.5 + Math.random() * 0.7);
    const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
    const a = el.animate([
      { transform: "translate3d(-50%,-50%,0) scale(.6)", opacity: 1 },
      { transform: `translate3d(calc(-50% + ${dx}px),calc(-50% + ${dy}px),0) scale(1)`, opacity: 1, offset: 0.45 },
      { transform: `translate3d(calc(-50% + ${dx * 1.15}px),calc(-50% + ${dy + 90}px),0) scale(.9)`, opacity: 0 },
    ], { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.4,1)", delay: i * 12 });
    a.onfinish = () => el.remove();
  }
}
export function floatText(x, y, text, cls = "") {
  if (prefersReducedMotion()) return;
  const el = document.createElement("span");
  el.className = `fx-float ${cls}`;
  el.textContent = text;
  el.style.left = `${x}px`; el.style.top = `${y}px`;
  document.body.appendChild(el);
  const a = el.animate([
    { transform: "translate3d(-50%,0,0) scale(.7)", opacity: 0 },
    { transform: "translate3d(-50%,-18px,0) scale(1.1)", opacity: 1, offset: 0.25 },
    { transform: "translate3d(-50%,-52px,0) scale(1)", opacity: 0 },
  ], { duration: 900, easing: "ease-out" });
  a.onfinish = () => el.remove();
}
export const centerOf = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
