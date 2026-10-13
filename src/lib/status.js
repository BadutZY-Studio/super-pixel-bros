import { STATUS as RAW_STATUS, LINKS } from "../config.js";

// Alias supaya salah ketik / bahasa Inggris tetap terbaca.
const ALIAS = {
  "belum-rilis": "belum-rilis", "belum rilis": "belum-rilis", belum_rilis: "belum-rilis", unreleased: "belum-rilis", soon: "belum-rilis", locked: "belum-rilis",
  beta: "beta",
  rilis: "rilis", release: "rilis", released: "rilis", live: "rilis",
};

function normalize(v) {
  const key = String(v ?? "").trim().toLowerCase();
  if (ALIAS[key]) return ALIAS[key];
  console.warn(`[config] STATUS "${v}" tidak dikenal. Pakai "belum-rilis", "beta", atau "rilis". Sementara dianggap "belum-rilis".`);
  return "belum-rilis";
}

// Saat `npm run dev` kamu bisa pratinjau status lain lewat URL: /download?status=rilis (TIDAK aktif di produksi).
function devOverride() {
  if (!import.meta.env?.DEV || typeof location === "undefined") return null;
  const q = new URLSearchParams(location.search).get("status");
  return q ? normalize(q) : null;
}

export const status = devOverride() ?? normalize(RAW_STATUS);

export const STATUS_INFO = {
  "belum-rilis": { label: "BELUM RILIS", short: "SEGERA", tone: "red", headline: "Game sedang disiapkan" },
  beta: { label: "BETA TERBUKA", short: "BETA", tone: "gold", headline: "Versi beta sudah bisa dicoba" },
  rilis: { label: "SUDAH RILIS", short: "RILIS", tone: "green", headline: "Game resmi rilis" },
};

export const PLATFORMS = [
  { id: "windows", os: "Windows", file: "SuperPixelBros-Windows.zip", req: "Windows 10/11 · 64-bit", icon: "windows" },
  { id: "linux", os: "Linux", file: "SuperPixelBros-Linux.x86_64", req: "Ubuntu 20.04+ · x86_64", icon: "linux" },
  { id: "macos", os: "macOS", file: "SuperPixelBros-macOS.zip", req: "macOS 11 Big Sur+ · Intel & Apple Silicon", icon: "apple" },
  { id: "android", os: "Android", file: "SuperPixelBros.apk", req: "Android 7.0+ · Gamepad didukung", icon: "android" },
];

/**
 * Status tombol download satu platform.
 *  state: "open"   → bisa di-klik & di-download
 *         "locked" → terkunci (reason menjelaskan kenapa)
 */
export function downloadState(platformId, st = status) {
  const url = (LINKS[platformId] || "").trim();
  if (st === "belum-rilis") return { state: "locked", reason: "belum-rilis", url: "", label: "Terkunci", note: "Game belum rilis" };
  if (!url) return { state: "locked", reason: "tanpa-link", url: "", label: "Menyusul", note: st === "beta" ? "Build beta platform ini belum diunggah" : "Platform ini segera menyusul" };
  return { state: "open", reason: null, url, label: st === "beta" ? "Download Beta" : "Download", note: st === "beta" ? "Versi beta — mungkin masih ada bug" : "Versi resmi" };
}

export const anyOpen = () => PLATFORMS.some((p) => downloadState(p.id).state === "open");
export const openCount = () => PLATFORMS.filter((p) => downloadState(p.id).state === "open").length;

export function detectOS() {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return null;
  if (/mac/i.test(ua)) return "macos";
  if (/win/i.test(ua)) return "windows";
  if (/linux|x11/i.test(ua)) return "linux";
  return null;
}
