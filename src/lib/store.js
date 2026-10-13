import { useSyncExternalStore } from "react";

// Koin yang dikumpulkan pengunjung di website (disimpan di perangkat).
const KEY = "spb.coins";
const subs = new Set();
let coins = 0;
try { coins = parseInt(localStorage.getItem(KEY) || "0", 10) || 0; } catch { /* storage diblokir */ }

const emit = () => subs.forEach((f) => f());
export const getCoins = () => coins;
export function addCoins(n = 1) {
  const before = coins;
  coins += n;
  try { localStorage.setItem(KEY, String(coins)); } catch { /* abaikan */ }
  emit();
  return Math.floor(coins / 100) > Math.floor(before / 100); // true = dapat 1UP
}
export function useCoins() {
  return useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => coins, () => 0);
}
