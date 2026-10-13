import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Cek media query secara reaktif. */
export function useMedia(query, ssr = false) {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(query); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia(query).matches,
    () => ssr,
  );
}
export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useIsMobile = () => useMedia("(max-width: 700px)");

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Satu IntersectionObserver bersama untuk semua elemen .rv (lebih hemat dari satu per elemen).
let io = null;
const callbacks = new WeakMap();
function observer() {
  if (io) return io;
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const cb = callbacks.get(e.target);
      io.unobserve(e.target);
      callbacks.delete(e.target);
      cb?.();
    }
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
  return io;
}
export function observeOnce(el, cb) {
  if (!el) return () => {};
  if (typeof IntersectionObserver === "undefined") { cb(); return () => {}; }
  callbacks.set(el, cb);
  observer().observe(el);
  return () => { io?.unobserve(el); callbacks.delete(el); };
}

/** true setelah elemen pertama kali terlihat di layar. */
export function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => observeOnce(ref.current, () => setSeen(true)), []);
  return [ref, seen];
}

/** Jalankan callback tiap frame (dt dalam detik). Berhenti otomatis saat tab tidak terlihat. */
export function useFrame(cb, active = true) {
  const saved = useRef(cb);
  saved.current = cb;
  useEffect(() => {
    if (!active) return undefined;
    let id = 0, last = performance.now();
    const loop = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      saved.current(dt, t);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    const vis = () => { if (document.hidden) cancelAnimationFrame(id); else { last = performance.now(); id = requestAnimationFrame(loop); } };
    document.addEventListener("visibilitychange", vis);
    return () => { cancelAnimationFrame(id); document.removeEventListener("visibilitychange", vis); };
  }, [active]);
}

// ---- gambar & tile
const imgCache = new Map();
export function loadImage(url) {
  if (imgCache.has(url)) return imgCache.get(url);
  const p = new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  imgCache.set(url, p);
  return p;
}

const tileCache = new Map();
const tileSubs = new Set();
/** URL data 16×16 untuk 1 tile dari atlas tema (agar bisa di-repeat lewat CSS). */
export function tileUrl(theme, idx) {
  const key = `${theme}:${idx}`;
  if (tileCache.has(key)) return tileCache.get(key);
  tileCache.set(key, "");
  loadImage(`/game/tiles/tiles_${theme}.png`).then((img) => {
    const c = document.createElement("canvas");
    c.width = 16; c.height = 16;
    c.getContext("2d").drawImage(img, idx * 16, 0, 16, 16, 0, 0, 16, 16);
    tileCache.set(key, c.toDataURL());
    tileSubs.forEach((f) => f());
  }).catch(() => {});
  return "";
}
/** Hook: dapatkan beberapa URL tile sekaligus, re-render saat siap. */
export function useTileUrls(theme, idxs) {
  const [, force] = useState(0);
  useEffect(() => { const f = () => force((n) => n + 1); tileSubs.add(f); return () => tileSubs.delete(f); }, []);
  return idxs.map((i) => tileUrl(theme, i));
}
