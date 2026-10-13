import { useSyncExternalStore } from "react";
import { G } from "./data.js";

// Mesin suara: efek pakai WebAudio (latensi rendah), musik pakai <audio> dengan fade.
// Suara default MATI (browser memblokir autoplay) dan pilihan pengunjung diingat.
const KEY = "spb.sound";
let enabled = false;
try { enabled = localStorage.getItem(KEY) === "1"; } catch { /* abaikan */ }
let track = null;
const subs = new Set();
const emit = () => subs.forEach((f) => f());

let ctx = null;
const buffers = new Map();
let music = null;

function getCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx = new AC(); } catch { ctx = null; }
  return ctx;
}
function load(name) {
  if (buffers.has(name)) return buffers.get(name);
  const c = getCtx();
  if (!c) return Promise.resolve(null);
  const p = fetch(`${G}/audio/sfx_${name}.mp3`)
    .then((r) => r.arrayBuffer())
    .then((b) => new Promise((res, rej) => c.decodeAudioData(b, res, rej)))
    .catch(() => null);
  buffers.set(name, p);
  return p;
}

const last = {};
/** Mainkan efek suara. force = tetap bunyi walau suara dimatikan (mis. tombol tes di Sound Lab). */
export function sfx(name, opts = {}) {
  const { force = false, vol = 0.55, throttle = 60 } = opts;
  if (!enabled && !force) return;
  const now = performance.now();
  if (last[name] && now - last[name] < throttle) return;
  last[name] = now;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  load(name).then((buf) => {
    if (!buf) return;
    const src = c.createBufferSource();
    const g = c.createGain();
    g.gain.value = vol;
    src.buffer = buf;
    src.connect(g).connect(c.destination);
    src.start();
  });
}

export const preloadSfx = (names) => names.forEach((n) => load(n));

export function setSound(v) {
  enabled = v;
  try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* abaikan */ }
  if (v) {
    const c = getCtx();
    if (c && c.state === "suspended") c.resume().catch(() => {});
    preloadSfx(["coin", "select", "click", "jump", "powerup", "stomp", "bump"]);
  } else stopMusic();
  emit();
}
export const isSoundOn = () => enabled;

// Autoplay: kalau pengunjung sebelumnya menyalakan suara, aktifkan audio pada interaksi pertama.
if (typeof window !== "undefined" && enabled) {
  const wake = () => { const c = getCtx(); if (c && c.state === "suspended") c.resume().catch(() => {}); preloadSfx(["coin", "select", "click", "jump"]); window.removeEventListener("pointerdown", wake); };
  window.addEventListener("pointerdown", wake, { once: true });
}

function fade(el, to, ms, done) {
  cancelAnimationFrame(el._raf);
  const from = el.volume, t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k < 1) el._raf = requestAnimationFrame(step); else done?.();
  };
  el._raf = requestAnimationFrame(step);
}

export function playMusic(id) {
  const old = music;
  if (old) { fade(old, 0, 250, () => { old.pause(); }); }
  const a = new Audio(`${G}/audio/music_${id}.mp3`);
  a.loop = true; a.volume = 0;
  a.play().then(() => fade(a, 0.45, 500)).catch(() => {});
  music = a; track = id;
  emit();
}
export function stopMusic() {
  const old = music;
  music = null; track = null;
  if (old) fade(old, 0, 250, () => old.pause());
  emit();
}

export const useSound = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => enabled, () => false);
export const useTrack = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => track, () => null);
