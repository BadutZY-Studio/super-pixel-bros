// Mengubah data level ASLI game (ASCII 14 baris) menjadi tile + entitas yang bisa digambar di web.
// Aturan pemetaan mengikuti scripts/level.gd (_build_world / _build_decor).
import { LEVEL_MAPS } from "../data/levelMaps.js";
import { THEMES, DECOR_KEY, SPRITES } from "./data.js";

export const T = 16;
export const ROWS = 14;
const SOLID = "GXTtLlYyRg";

function decodeRow(s) {
  let out = "";
  for (let i = 0; i < s.length; ) {
    const ch = s[i];
    if (s[i + 1] !== undefined && /\d/.test(s[i + 1])) {
      let j = i + 1, n = "";
      while (/\d/.test(s[j])) n += s[j++];
      if (s[j] === "~") { out += ch.repeat(parseInt(n, 10)); i = j + 1; continue; }
    }
    out += ch; i++;
  }
  return out;
}

function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const levelCount = LEVEL_MAPS.length;

/** Bangun level ke-`index` (0-based). */
export function buildLevel(index) {
  const raw = LEVEL_MAPS[index];
  const grid = raw.rows.map(decodeRow);
  const cols = Math.max(...grid.map((r) => r.length));
  const cell = (c, r) => (r < 0 || r >= ROWS || c < 0 || c >= cols ? "." : grid[r][c] ?? ".");
  const theme = THEMES[raw.theme];
  const rng = mulberry32(index * 7919 + 13);

  const tiles = [];     // [c, r, idx] digambar ke canvas
  const ents = [];      // entitas DOM beranimasi
  const stats = { coins: 0, enemies: 0, blocks: 0, bricks: 0, pipes: 0, checkpoints: 0 };
  let spawn = null, flag = null, castle = null;

  for (let r = 0; r < ROWS; r++) for (let c = 0; c < cols; c++) {
    const ch = cell(c, r);
    const x = c * T, y = r * T;
    switch (ch) {
      case "G": { const a = cell(c, r - 1); tiles.push([c, r, !(SOLID.includes(a) && a !== ".") ? 0 : 1]); break; }
      case "g": { const a = cell(c, r - 1); tiles.push([c, r, SOLID.includes(a) && a !== "." ? 1 : 0]); break; }
      case "X": tiles.push([c, r, 3]); break;
      case "Y": case "T": tiles.push([c, r, 5]); if (ch === "Y") ents.push({ k: "warp", x: x + 10, y: y - 12 }); stats.pipes++; break;
      case "y": case "t": tiles.push([c, r, 6]); break;
      case "L": tiles.push([c, r, 7]); break;
      case "l": tiles.push([c, r, 8]); break;
      case "V": tiles.push([c, r, 9]); break;
      case "v": tiles.push([c, r, 10]); break;
      case "-": tiles.push([c, r, 15]); break;
      case "S": tiles.push([c, r, 14]); break;
      case "R": tiles.push([c, r, 3]); ents.push({ k: "firebar", x: x + 8, y: y + 8 }); break;
      case "B": tiles.push([c, r, 2]); stats.bricks++; break;
      case "?": case "M": case "*": ents.push({ k: "qblock", x, y, star: ch === "*" }); stats.blocks++; break;
      case "C": ents.push({ k: "coin", x, y }); stats.coins++; break;
      case "E": ents.push({ k: "goomba", x, y }); stats.enemies++; break;
      case "K": ents.push({ k: "koopa", x, y: y + 16 - 24 }); stats.enemies++; break;
      case "F": ents.push({ k: "piranha", x: (c + 1) * T - 8, y: (r + 1) * T - 24 }); stats.enemies++; break;
      case "A": ents.push({ k: "bat", x, y }); stats.enemies++; break;
      case "J": ents.push({ k: "spring", x, y }); break;
      case "O": ents.push({ k: "crusher", x: x - 4, y }); stats.enemies++; break;
      case "f": ents.push({ k: "platform", x: x + 8 - 24, y: y + 8 - 5, move: null, fall: true }); break;
      case "N": ents.push({ k: "platform", x: x + 8 - 24, y: y + 8 - 5, move: "x", range: 48 }); break;
      case "n": ents.push({ k: "platform", x: x + 8 - 24, y: y + 8 - 5, move: "x", range: 64 }); break;
      case "W": ents.push({ k: "platform", x: x + 8 - 24, y: y + 8 - 5, move: "y", range: 40 }); break;
      case "c": ents.push({ k: "checkpoint", x, y: y + 16 - 32 }); stats.checkpoints++; break;
      case "P": spawn = { x, y }; break;
      case "Z": flag = { x: x + 7, base: (r + 1) * T, top: (r + 1) * T - 9 * T }; break;
      case "D": castle = { x, y: (r + 1) * T - 80 }; break;
      default: break;
    }
  }

  // dekor tanah (ikut _build_decor)
  const decor = [];
  if (theme.gdecor.length) {
    let c = 3;
    while (c < raw.main - 16) {
      let groundRow = -1;
      for (let r = 0; r < ROWS; r++) if (cell(c, r) === "G") { groundRow = r; break; }
      if (groundRow === 12 && cell(c + 1, 12) === "G" && cell(c + 2, 12) === "G" && cell(c, 11) === "." && cell(c + 1, 11) === ".") {
        const nm = theme.gdecor[Math.floor(rng() * theme.gdecor.length)];
        const key = DECOR_KEY[nm];
        const d = SPRITES[key];
        decor.push({ key, x: c * T, y: 12 * T - d.fh });
        c += Math.ceil(d.fw / 16) + 2 + Math.floor(rng() * 6);
      } else c++;
    }
  }
  const skyDecor = [];
  if (theme.sdecor.length) {
    let x = 40;
    while (x < cols * T) {
      const key = DECOR_KEY[theme.sdecor[Math.floor(rng() * theme.sdecor.length)]];
      skyDecor.push({ key, x, y: 14 + rng() * 66 });
      x += 90 + rng() * 110;
    }
  }

  return { index, name: raw.name, themeName: raw.theme, time: raw.time, main: raw.main, warps: raw.warps, cols, width: cols * T, height: ROWS * T, tiles, ents, decor, skyDecor, spawn, flag, castle, stats };
}
