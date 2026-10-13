// Port JavaScript dari scripts/cosmetics.gd (game Godot).
// Semua sprite pahlawan + kosmetik digambar ulang dari peta pixel yang sama, jadi tidak butuh atlas PNG.

export const SLOTS = ["skin", "suit", "hat", "face", "back", "trail"];
export const SLOT_NAMES = { skin: "Skin", suit: "Suit", hat: "Hat", face: "Face", back: "Back", trail: "Trail" };
export const REMOVABLE = ["hat", "face", "back", "trail"];

const CW = 32, PAD_TOP = 14, BX = 8;
const FIRE_WHITE = "f5f5f5";
const OUTLINE = [24, 16, 32, 255];
export const POSES = ["idle", "run1", "run2", "run3", "jump", "skid", "die"];

const HEAD = ["....KKKKK.......", "...KKKKKKKKK....", "...NNNSSESS.....", "..NSNSSSESSSS...", "..NSNNSSSESSSS..", "..NNSSSSNNNN....", "....SSSSSSS....."];
const HEAD_BARE = ["....NNNNN.......", "...NNNNSSSS....."];
const TORSO = ["...RRRBRRR......", "..RRRRBRRBRRR...", "..RRRRBBBBRRR...", "..WWRBYBBYBWW...", "..WWBBBBBBBBWW..", "..WBBBBBBBBBW..."];
const TORSO_JUMP = ["..WRRRBRRR......", ".WWRRRBRRBRRW...", ".WWRRBBBBRRWW...", "..RRBYBBYBR.....", "...BBBBBBBB.....", "..BBBBBBBBBB...."];
const STAND_TOP = "...BBB..BBB.....";
const LEGS = {
  idle: ["...BBB..BBB.....", ["..OOO....OOO....", ".OOOO....OOOO..."]],
  run1: ["..BBB....BBB....", [".OOO......OOO...", "OOOO.....OOOO..."]],
  run2: ["...BBBBBBB......", ["...OOOOOOO......", "...OOOOOOO......"]],
  run3: ["....BB..BBB.....", ["...OOO...OOOO...", "..OOO....OOOO..."]],
  jump: ["..BBB....BBBB...", ["OOOO.....OOOO...", "OOO.......OOO...."]],
  skid: ["...BB....BB.....", ["..OOO.....OO....", ".OOOO....OOOO..."]],
  die: ["..BBB....BBBB...", ["OOOO.....OOOO...", "OOO.......OOO...."]],
};
const BIG_HEAD_ROWS = { 0: [0], 1: [1], 2: [2], 3: [3, 4], 4: [5, 6], 5: [7], 6: [8] };
const BASE_PAL = { R: "e02424", B: "3454e0", Y: "ffdc3c", W: "fafafa", N: "6e3c14", S: "ffcc9c", E: "141414", O: "8c501e" };

// ---------------------------------------------------------------- katalog
const ITEMS = [];
const INDEX = {};
function add(slot, id, name, price, desc, extra) {
  const d = { slot, id: `${slot}_${id}`, name, price, desc, ...extra };
  ITEMS.push(d);
  INDEX[d.id] = d;
}
// SKINS
add("skin", "classic", "CLASSIC", 0, "THE ORIGINAL HERO", { pal: {} });
add("skin", "emerald", "EMERALD", 40, "ALL GREEN, ALL GOOD", { pal: { R: "2fb350", B: "1d5a3e", Y: "ffe066", N: "5a3a1a", O: "4a3018" } });
add("skin", "ocean", "OCEAN", 40, "FRESH FROM THE DEEP", { pal: { R: "22b8c8", B: "1f5fa8", Y: "fff2a8", N: "3a2a5a", O: "20407a" } });
add("skin", "sakura", "SAKURA", 50, "PINK AND PRETTY", { pal: { R: "ff7eb6", B: "c04a8a", Y: "fff0a0", W: "fff5fa", N: "d84a86", O: "7a2a5a" } });
add("skin", "ember", "EMBER", 60, "BORN IN THE FIRE", { pal: { R: "ff7a1a", B: "8a1c1c", Y: "ffe36b", W: "ffd9a0", N: "3a1a0a", O: "5a2410" } });
add("skin", "violet", "VIOLET", 60, "ROYAL PURPLE VIBES", { pal: { R: "9a52e0", B: "40308a", Y: "ffd84a", N: "2a1450", O: "301860" } });
add("skin", "frost", "FROST", 80, "COOL AS ICE", { pal: { R: "9fd8ff", B: "5b8fd0", Y: "ffffff", W: "ffffff", S: "ffe2d0", N: "dfeaff", O: "6a8ab0" } });
add("skin", "zombie", "ZOMBIE", 90, "BRAAAINS... AND COINS", { pal: { R: "8a8aa8", B: "56704c", Y: "c8c060", W: "9ab08a", S: "8fbf78", N: "4a5a40", E: "d83030", O: "3a3a3a" } });
add("skin", "shadow", "SHADOW", 100, "STRIKES FROM THE DARK", { pal: { R: "3a3a52", B: "1c1c2a", Y: "e04040", W: "2e2e44", S: "e8c9a8", N: "101018", E: "ff4040", O: "202030" } });
add("skin", "robot", "ROBOT", 140, "BEEP BOOP, JUMP JUMP", { pal: { R: "6a86c0", B: "3e4e78", Y: "40e0ff", W: "d0dcec", S: "b8c4d4", N: "5a6a88", E: "ff3a3a", O: "2c3450" } });
add("skin", "skeleton", "SKELETON", 150, "SPOOKY SCARY BONES", { pal: { R: "30303c", B: "484858", Y: "eeeadd", W: "eeeadd", S: "eeeadd", N: "bdb8a8", O: "6a6a72" } });
add("skin", "golden", "GOLDEN", 250, "SOLID GOLD LEGEND", { pal: { R: "ffc828", B: "c87818", Y: "ffffff", W: "fff0a8", S: "ffd870", N: "b87818", E: "40200a", O: "9a5a10" } });
// SUITS
add("suit", "classic", "ORIGINAL", 0, "THE CLASSIC OVERALLS", { pal: {} });
add("suit", "farmer", "FARMER", 25, "READY FOR THE HARVEST", { pal: { R: "f2c230", B: "3f8f3f", Y: "ffffff", W: "f5e6c8" } });
add("suit", "sport", "SPORT", 30, "TRACK STAR STRIPES", { pal: { R: "2a8cff", R2: "ffffff", B: "ffffff", Y: "ff4040", W: "ffffff" } });
add("suit", "camo", "CAMO", 40, "HARD TO SPOT", { pal: { R: "6b8a45", R2: "4a6330", B: "8a7a45", Y: "c8b060", W: "4a6330" } });
add("suit", "sailor", "SAILOR", 45, "ANCHORS AWEIGH", { pal: { R: "f4f4f8", R2: "2a4fd0", B: "1a2f7a", Y: "ffd040", W: "f4f4f8" } });
add("suit", "pirate", "PIRATE", 60, "YO HO HO", { pal: { R: "e8e8ee", R2: "20202a", B: "5a3a24", Y: "ffd040", W: "20202a" } });
add("suit", "arctic", "ARCTIC", 70, "BUILT FOR BLIZZARDS", { pal: { R: "bfe4ff", R2: "ffffff", B: "5a8fd8", Y: "ffffff", W: "ffffff" } });
add("suit", "tuxedo", "TUXEDO", 90, "BLACK TIE AFFAIR", { pal: { R: "24242e", B: "24242e", Y: "e83a3a", W: "ffffff" } });
add("suit", "ninja", "NINJA", 100, "SILENT BUT STYLISH", { pal: { R: "2a2a3c", R2: "3c3c54", B: "2a2a3c", Y: "d83030", W: "2a2a3c" } });
add("suit", "royal", "ROYAL", 120, "FIT FOR A KING", { pal: { R: "7a2cb0", R2: "9a4cd0", B: "55208a", Y: "ffe060", W: "ffe060" } });
add("suit", "lava", "LAVA", 150, "HOT HOT HOT", { pal: { R: "ff6a1a", R2: "ffc030", B: "6a1a1a", Y: "fff08a", W: "ffb060" } });
add("suit", "rainbow", "RAINBOW", 200, "TASTE THE RAINBOW", { pal: { R: "e02424", B: "3a3a8a", Y: "ffffff", W: "ffffff", cycle: ["e02424", "ff8a1a", "ffe03a", "34c04a", "2a8cff", "9a52e0"] } });
// HATS
add("hat", "beanie", "BEANIE", 15, "WARM AND COZY", { y0: -3, pal: { B: "3a6fe0", W: "ffffff", w: "c8d8ff" }, rows: ["......WW........", ".....WWWW.......", "....BBBBBB......", "...BBBBBBBB.....", "...WwWwWwWW....."] });
add("hat", "party", "PARTY HAT", 20, "IT'S PARTY TIME", { y0: -6, pal: { P: "ff5fa8", Y: "ffe14a", D: "c83a80" }, rows: ["......YY........", "......PP........", ".....PPPP.......", ".....PYPD.......", "....PPPPYD......", "....PYPPPD......", "...YYYYYYYY....."] });
add("hat", "catears", "CAT EARS", 25, "PURR-FECT STYLE", { y0: -3, pal: { K: "2a2a34", P: "ff8fb0" }, rows: ["...K......K.....", "...KK....KK.....", "...KPK..KPK.....", "...KKKKKKKK....."] });
add("hat", "tophat", "TOP HAT", 30, "VERY FANCY INDEED", { y0: -7, pal: { K: "26262e", G: "56566a", R: "d02838" }, rows: ["....KKKKK.......", "....KGKKK.......", "....KGKKK.......", "....KGKKK.......", "....KKKKK.......", "....RRRRR.......", "....RRRRR.......", "..KKKKKKKKK....."] });
add("hat", "cowboy", "COWBOY HAT", 35, "YEEHAW PARTNER", { y0: -3, pal: { B: "c08840", D: "8a5a28", K: "5a3414" }, rows: ["....BBDDBB......", "....BBBBBB......", ".B..KKKKKK..B...", ".BBBBBBBBBBBB..."] });
add("hat", "chef", "CHEF HAT", 40, "COOKING UP COINS", { y0: -6, pal: { W: "ffffff", w: "d0d4e8", G: "b8bcd4" }, rows: [".....WWWW.......", "...WWWWWWWW.....", "..WWWWwWWWWW....", "..WWWWWWWWWw....", "...WWWWWWWw.....", "....WWwWWW......", "....WWWWWW......", "...GGGGGGGG....."] });
add("hat", "pirate", "PIRATE HAT", 55, "ARRR, MATEY", { y0: -4, pal: { K: "20202a", W: "f4f4f8", G: "d8a820" }, rows: ["....KKKKK.......", "...KKKKKKK......", "..KKKWWWKKK.....", ".KKKKWKWKKKK....", "GKKKKKKKKKKKG..."] });
add("hat", "viking", "VIKING", 70, "FOR VALHALLA", { y0: -4, pal: { W: "f0ead8", w: "c8c0a8", S: "9aa4b8", s: "c8d0e0", B: "7a4a20" }, rows: [".W..........W..", ".WW........WW..", ".wWSSSSSSSSWw..", "..WSsSSSSSSW...", "...SSSSSSSSS...", "...BBBBBBBBB..."] });
add("hat", "wizard", "WIZARD HAT", 90, "ABRACADABRA", { y0: -9, pal: { P: "6a3ad0", D: "4a24a0", Y: "ffe14a", S: "fff4a0" }, rows: [".........P......", "........PP......", "........PPD.....", ".......PPPD.....", ".......PSPPD....", "......PPPPPD....", ".....PPPPPPPD...", ".....YYYYYYYY...", "..PPPPPPPPPPPP.."] });
add("hat", "halo", "HALO", 120, "ANGELIC VIBES", { y0: -5, float: true, pal: { Y: "fff08a", y: "d89a1a", g: "ffc830" }, rows: ["....yggggy......", "...yYy..yYy.....", "....yggggy......"] });
add("hat", "crown", "CROWN", 200, "LONG LIVE THE KING", { y0: -3, pal: { Y: "ffd23a", D: "c08a10", R: "e83a4a", B: "3a8aff", G: "3ad06a" }, rows: ["...Y..YY..Y.....", "...YYYYYYYY.....", "...YRYYBYGY.....", "...DDDDDDDD....."] });
// FACE
add("face", "roundglasses", "ROUND SPECS", 15, "SMART AND SHARP", { y0: 1, pal: { G: "e8b830" }, rows: ["......GGGGG.....", "....GGG...G.....", "......G...G.....", "......GGGGG....."] });
add("face", "clownnose", "CLOWN NOSE", 20, "HONK HONK", { y0: 3, pal: { R: "e8283a", H: "ff9aa8" }, rows: ["...........HR...", "...........RRR.."] });
add("face", "mask", "MASK", 25, "STAY SAFE OUT THERE", { y0: 4, pal: { M: "8fd0e8", m: "5ea8c8" }, rows: ["......MMMMMMM...", "....mMMMMMMM....", ".....mmmmmm....."] });
add("face", "eyepatch", "EYEPATCH", 30, "ONE EYE ON THE PRIZE", { y0: 1, pal: { K: "18181c" }, rows: [".....KKK........", "......KKKKK.....", ".......KKK......", ".......KKK......"] });
add("face", "shades", "SHADES", 40, "TOO COOL FOR SCHOOL", { y0: 2, pal: { K: "141418", L: "9ad0ff" }, rows: ["....KKKKKKKK....", "......KLKKKK....", "......KKKKKK...."] });
add("face", "glasses3d", "3D GLASSES", 50, "POP OUT OF THE SCREEN", { y0: 2, pal: { K: "20202a", R: "ff3040", C: "30d8ff" }, rows: ["....KKKKKKKKK...", "......KRRCCCK...", "......KRRCCCK...", "......KKKKKKK..."] });
add("face", "beard", "BIG BEARD", 60, "MAJESTIC FACIAL HAIR", { y0: 5, pal: { B: "5a3418", b: "7a4a24" }, rows: ["....BBBBBBBB....", "....bBBBBBB.....", ".....BbBBB......"] });
// BACK
add("back", "backpack", "BACKPACK", 30, "ADVENTURE ESSENTIALS", { kind: "pack", pal: { G: "3c7a3c", g: "5ca85a", D: "28502a", S: "8c5a24" } });
add("back", "shell", "SHELL", 40, "SLOW AND STEADY", { kind: "shell", pal: { G: "36b04a", g: "58d06a", D: "1e7434", Y: "f0dc96", y: "c8b070" } });
add("back", "redcape", "RED CAPE", 60, "EVERY HERO NEEDS ONE", { kind: "cape", pal: { A: "e02a2a", B: "a01820", T: "ffd23a" } });
add("back", "royalcape", "ROYAL CAPE", 90, "VELVET AND GOLD", { kind: "cape", pal: { A: "6a2ab8", B: "46187e", T: "ffffff" } });
add("back", "angelwings", "ANGEL WINGS", 130, "SOAR THROUGH THE SKY", { kind: "wings", pal: { W: "ffffff", L: "c4d4f4", D: "8aa0d0" } });
add("back", "demonwings", "DEMON WINGS", 130, "A LITTLE BIT NAUGHTY", { kind: "wings", pal: { W: "a03ad0", L: "6a1e98", D: "40105e" } });
add("back", "jetpack", "JETPACK", 160, "FLAMES WHEN YOU JUMP", { kind: "jet", pal: { G: "8a96ac", g: "c4cede", D: "56607a", R: "e03030", F: "ff8a1a", f: "ffe45a" } });
// TRAILS
add("trail", "bubbles", "BUBBLES", 25, "POP POP POP", { shape: "bubble", colors: ["bfeaff", "8ad4ff", "e8f8ff"], rate: 0.09 });
add("trail", "snow", "SNOWFALL", 35, "A CHILL IN THE AIR", { shape: "flake", colors: ["ffffff", "d8ecff"], rate: 0.07 });
add("trail", "sparkle", "SPARKLE", 45, "SHINE BRIGHT", { shape: "star", colors: ["ffe45a", "ffffff", "fff0a0"], rate: 0.07 });
add("trail", "hearts", "HEARTS", 55, "SPREAD THE LOVE", { shape: "heart", colors: ["ff5a8a", "ff8aaa", "ff3a6a"], rate: 0.12 });
add("trail", "fire", "FLAMES", 80, "BURNING RUBBER", { shape: "flame", colors: ["ff6a1a", "ffa020", "ffe040"], rate: 0.05 });
add("trail", "rainbow", "RAINBOW", 120, "A TRAIL OF COLOUR", { shape: "dot", colors: ["ff3a3a", "ff9a2a", "ffe03a", "3ad04a", "2a8cff", "9a52e0"], rate: 0.04 });

export const items = () => ITEMS;
export const byId = (id) => INDEX[id] || null;
export const inSlot = (slot) => ITEMS.filter((i) => i.slot === slot);
export const defaultLoadout = () => ({ skin: "skin_classic", suit: "suit_classic", hat: "", face: "", back: "", trail: "" });
export const sig = (lo) => SLOTS.map((s) => lo[s] || "").join("|");
export const loadoutPrice = (lo) => SLOTS.reduce((a, s) => a + (byId(lo[s])?.price || 0), 0);

// ---------------------------------------------------------------- pixel buffer
class Img {
  constructor(w, h) { this.w = w; this.h = h; this.d = new Uint8ClampedArray(w * h * 4); }
  set(x, y, c) { if (x < 0 || y < 0 || x >= this.w || y >= this.h) return; const i = (y * this.w + x) * 4; this.d[i] = c[0]; this.d[i + 1] = c[1]; this.d[i + 2] = c[2]; this.d[i + 3] = c[3] ?? 255; }
  a(x, y) { return x < 0 || y < 0 || x >= this.w || y >= this.h ? 0 : this.d[(y * this.w + x) * 4 + 3]; }
  clone() { const n = new Img(this.w, this.h); n.d.set(this.d); return n; }
}
const colCache = {};
function col(hex) {
  if (!colCache[hex]) colCache[hex] = [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), 255];
  return colCache[hex];
}
function colors(spec) {
  const out = {};
  for (const k in spec) out[k] = Array.isArray(spec[k]) ? spec[k].map(col) : col(spec[k]);
  return out;
}

export function palette(lo, form) {
  const skin = byId(lo.skin) || byId("skin_classic");
  const spec = { ...BASE_PAL, ...skin.pal };
  const suit = byId(lo.suit);
  if (suit && suit.id !== "suit_classic") Object.assign(spec, suit.pal);
  const p = colors(spec);
  p.K = p.R;
  if (form === 2) {
    const white = col(FIRE_WHITE);
    const f = { ...p };
    f.B = p.R; f.R = white; f.W = white; f.K = white;
    delete f.R2; delete f.cycle;
    return f;
  }
  return p;
}

function bodyRows(big, pose, bare) {
  const head = HEAD.slice();
  if (bare) { head[0] = HEAD_BARE[0]; head[1] = HEAD_BARE[1]; }
  const torso = pose === "jump" || pose === "die" ? TORSO_JUMP : TORSO;
  const [blue, shoes] = LEGS[pose];
  const rows = [];
  if (big) {
    for (const i of [0, 1, 2, 3, 3, 4, 4, 5, 6]) rows.push([head[i], 0]);
    for (const i of [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5]) rows.push([torso[i], 1]);
    for (let i = 0; i < 4; i++) rows.push([STAND_TOP, 2]);
    for (let i = 0; i < 5; i++) rows.push([blue, 2]);
    for (const s of shoes) rows.push([s, 2]);
  } else {
    for (const r of head) rows.push([r, 0]);
    for (const r of torso) rows.push([r, 1]);
    rows.push([blue, 2]);
    for (const s of shoes) rows.push([s, 2]);
  }
  return rows;
}

function paintBody(img, pal, big, pose, bare) {
  const rows = bodyRows(big, pose, bare);
  const tlen = rows.filter((r) => r[1] === 1).length;
  let ty = 0;
  rows.forEach(([row, kind], y) => {
    const isTorso = kind === 1;
    for (let x = 0; x < Math.min(row.length, 16); x++) {
      const ch = row[x];
      if (ch === ".") continue;
      let c;
      if (ch === "R" && isTorso) {
        c = pal.R;
        if (pal.cycle) c = pal.cycle[Math.max(0, Math.min(pal.cycle.length - 1, Math.trunc((ty * pal.cycle.length) / tlen)))];
        else if (pal.R2 && ty % 2 === 1) c = pal.R2;
      } else c = pal[ch];
      if (c) img.set(BX + x, PAD_TOP + y, c);
    }
    if (isTorso) ty++;
  });
}

function blitRow(img, row, x0, y, cols) {
  const cy = PAD_TOP + y;
  if (cy < 0 || cy >= img.h) return;
  for (let x = 0; x < row.length; x++) {
    const ch = row[x];
    if (ch === "." || ch === " " || !cols[ch]) continue;
    const cx = BX + x0 + x;
    if (cx >= 0 && cx < CW) img.set(cx, cy, cols[ch]);
  }
}
const blit = (img, rows, x0, y0, cols) => rows.forEach((r, i) => blitRow(img, r, x0, y0 + i, cols));

function paintHeadArt(img, it, big) {
  const cols = colors(it.pal);
  it.rows.forEach((row, i) => {
    const r = it.y0 + i;
    let targets = [r];
    if (big) { if (r >= 0 && r <= 6) targets = BIG_HEAD_ROWS[r]; else if (r > 6) targets = [r + 2]; }
    for (const t of targets) blitRow(img, row, 0, t, cols);
  });
}

function outline(img) {
  const src = img.clone();
  for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
    if (src.a(x, y) > 0) continue;
    if (src.a(x + 1, y) > 0 || src.a(x - 1, y) > 0 || src.a(x, y + 1) > 0 || src.a(x, y - 1) > 0) img.set(x, y, OUTLINE);
  }
}

const WING_UP = ["..WW....", ".WWWW...", "WWLLWW..", "WLLLLWW.", "WLLLLLWW", "WWLLLLLW", ".WWLLLLD", "..WWLLDD", "....WDD."];
const WING_MID = ["........", "WW......", "WWWWW...", "WLLLWWW.", "WLLLLLWW", ".WWLLLLD", "...WWDD."];
const WING_DOWN = [".WW.....", ".WLW....", ".WLLW...", "..WLLW..", "..WLLDW.", "..WWDD..", "...WD..."];
const roundAway = (x) => Math.sign(x) * Math.round(Math.abs(x));

function paintCape(img, cols, top, big, pose, air, phase) {
  const length = big ? 13 : 9;
  let sweep = 0.15;
  if (air) sweep = 0.55;
  else if (pose.startsWith("run")) sweep = [0.38, 0.5, 0.32][phase];
  else if (pose === "skid") sweep = -0.15;
  for (let i = 0; i < length; i++) {
    const shift = roundAway(i * sweep * (big ? 0.75 : 1));
    const xr = 3 - shift;
    const wd = 4 + Math.trunc(i * (big ? 0.28 : 0.45));
    const xl = xr - wd + 1;
    for (let x = Math.max(xl, -8); x <= xr; x++) {
      let ch = "A";
      if (x === xl) ch = "B";
      if (i === length - 1) ch = "T";
      else if (i === length - 2 && x !== xl) ch = "B";
      const cy = PAD_TOP + top + i;
      if (cy < img.h) img.set(BX + x, cy, cols[ch]);
    }
  }
}

function paintBack(img, it, big, pose) {
  const top = big ? 9 : 7;
  const air = pose === "jump" || pose === "die";
  const phase = pose.startsWith("run") ? parseInt(pose.slice(3), 10) - 1 : 0;
  const cols = colors(it.pal);
  if (it.kind === "cape") paintCape(img, cols, top, big, pose, air, phase);
  else if (it.kind === "wings") {
    let art = WING_DOWN, wy = top + 1;
    if (air) { art = WING_UP; wy = top - 4; }
    else if (pose.startsWith("run") || pose === "skid") { art = WING_MID; wy = top + (phase === 1 ? 1 : 0); }
    blit(img, art, -6, wy + (big ? 2 : 0), cols);
  } else if (it.kind === "pack") {
    const rows = big ? ["DDDD", "DGGD", "DGgD", "DGGD", "DGGD", "DGgD", "DGGD", "DSSD", "DDDD"] : ["DDDD", "DGGD", "DGgD", "DGGD", "DSSD", "DDDD"];
    blit(img, rows, -1, top + 1, cols);
    blit(img, ["S"], 2, top + 1, cols);
  } else if (it.kind === "shell") {
    const rows = big ? [".DGGGD.", "DGgGGGD", "DYGYGYD", "DGYGgGD", "DYGYGYD", "DGgGYGD", ".DDDDD."] : [".DGGD.", "DGgGGD", "DYGYGD", "DGYGgD", ".DDDD."];
    blit(img, rows, -3, top + 1, cols);
  } else if (it.kind === "jet") {
    const rows = big ? ["gGgG", "GDGD", "GDGD", "GDGD", "GDGD", "GDGD", "GDGD", "RRRR"] : ["gGgG", "GDGD", "GDGD", "GDGD", "RRRR"];
    blit(img, rows, -2, top + 1, cols);
    if (air) blit(img, ["FfFf", ".FF.", ".F.."], -2, top + 1 + rows.length, cols);
  }
}

const frameCache = new Map();
/** Menyusun satu frame (32 × (16|32)+14) untuk loadout, bentuk (0 small, 1 big, 2 fire) dan pose. */
export function compose(lo, form, pose) {
  const key = `${sig(lo)}#${form}#${pose}`;
  if (frameCache.has(key)) return frameCache.get(key);
  if (frameCache.size > 400) frameCache.clear();
  const big = form > 0;
  const img = new Img(CW, (big ? 32 : 16) + PAD_TOP);
  const hat = byId(lo.hat), face = byId(lo.face), back = byId(lo.back);
  const pal = palette(lo, form);
  if (back) paintBack(img, back, big, pose);
  paintBody(img, pal, big, pose, !!hat);
  if (face) paintHeadArt(img, face, big);
  if (hat && !hat.float) paintHeadArt(img, hat, big);
  outline(img);
  if (hat && hat.float) paintHeadArt(img, hat, big);
  frameCache.set(key, img);
  return img;
}

export const frameHeight = (form) => (form > 0 ? 32 : 16) + PAD_TOP;
export const FRAME_W = CW;

const canvasCache = new Map();
/** Frame sebagai <canvas> (di-cache) supaya cepat digambar ulang tiap frame. */
export function frameCanvas(lo, form, pose) {
  const key = `${sig(lo)}#${form}#${pose}`;
  if (canvasCache.has(key)) return canvasCache.get(key);
  if (canvasCache.size > 300) canvasCache.clear();
  const img = compose(lo, form, pose);
  const c = document.createElement("canvas");
  c.width = img.w; c.height = img.h;
  c.getContext("2d").putImageData(new ImageData(img.d, img.w, img.h), 0, 0);
  canvasCache.set(key, c);
  return c;
}

// ---------------------------------------------------------------- thumbnail
const SHAPES = {
  dot: ["XX", "XX"], star: [".X.", "XXX", ".X."], flake: ["X.X", ".X.", "X.X"],
  heart: [".X.X.", "XXXXX", "XXXXX", ".XXX.", "..X.."], bubble: [".XX.", "X..X", "X..X", ".XX."], flame: [".X.", "XXX", "XXX", ".X."],
};
const shapeCache = new Map();
export function shapeCanvas(shape, hex) {
  const key = shape + hex;
  if (shapeCache.has(key)) return shapeCache.get(key);
  const rows = SHAPES[shape];
  const c = document.createElement("canvas");
  c.width = rows[0].length; c.height = rows.length;
  const g = c.getContext("2d");
  g.fillStyle = `#${hex}`;
  rows.forEach((r, y) => [...r].forEach((ch, x) => ch === "X" && g.fillRect(x, y, 1, 1)));
  shapeCache.set(key, c);
  return c;
}

const thumbCache = new Map();
/** Data-URL thumbnail 2× untuk item katalog (sama seperti Cosmetics.thumb di game). */
export function thumbUrl(it) {
  if (thumbCache.has(it.id)) return thumbCache.get(it.id);
  let out;
  if (it.slot === "trail") {
    const c = document.createElement("canvas");
    c.width = 48; c.height = 30;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    const small = document.createElement("canvas");
    small.width = 24; small.height = 15;
    const sg = small.getContext("2d");
    const spots = [[19, 8], [13, 4], [8, 9], [3, 4], [1, 10], [10, 11]];
    spots.forEach(([x, y], i) => sg.drawImage(shapeCanvas(it.shape, it.colors[i % it.colors.length]), x, y));
    g.drawImage(small, 0, 0, 48, 30);
    out = c.toDataURL();
  } else {
    const lo = defaultLoadout();
    lo[it.slot] = it.id;
    let crop = [8, 14, 16, 14];
    if (it.slot === "hat") crop = [4, 4, 20, 13];
    else if (it.slot === "face") crop = [4, 13, 20, 12];
    else if (it.slot === "back") crop = [2, 17, 24, 14];
    const pose = it.slot === "back" && (it.kind === "jet" || it.kind === "wings") ? "jump" : "idle";
    const src = frameCanvas(lo, 0, pose);
    const c = document.createElement("canvas");
    c.width = crop[2] * 2; c.height = crop[3] * 2;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    g.drawImage(src, crop[0], crop[1], crop[2], crop[3], 0, 0, c.width, c.height);
    out = c.toDataURL();
  }
  thumbCache.set(it.id, out);
  return out;
}

const iconCache = {};
function bitmapUrl(key, rows, cols, scale = 1) {
  if (iconCache[key]) return iconCache[key];
  const c = document.createElement("canvas");
  c.width = rows[0].length * scale; c.height = rows.length * scale;
  const g = c.getContext("2d");
  rows.forEach((r, y) => [...r].forEach((ch, x) => { if (cols[ch]) { g.fillStyle = cols[ch]; g.fillRect(x * scale, y * scale, scale, scale); } }));
  return (iconCache[key] = c.toDataURL());
}
/** Koin kecil 8×8 untuk label harga (Cosmetics.coin_icon). */
export const coinIconUrl = () => bitmapUrl("coin", ["..OOOO..", ".OyyYYO.", "OyYYYYYO", "OyYYyYYO", "OyYYyYYO", "OyYYYYYO", ".OyYYYO.", "..OOOO.."], { O: "#8a5a08", Y: "#ffd23a", y: "#fff2a0" });
/** Ikon keranjang shop 20×15. */
export const basketIconUrl = () => bitmapUrl("basket", [
  "......OOOOOOOO......", ".....OhhhhhhhhO.....", "....Oh........hO....", "....Oh...OO...hO....", "....Oh..OggO..hO....", "..OOOOOOgGgOOOOOO...", ".OBBbBBbBBbBBbBBbO..",
  ".ObbBbbBbbBbbBbbBO..", ".OBBbBBbBBbBBbBBbO..", "..ObbBbbBbbBbbBbO...", "..OBBbBBbBBbBBbBO...", "..ObbBbbBbbBbbBbO...", "...OBBbBBbBBbBBO....", "...ObbBbbBbbBbbO....", "....OOOOOOOOOOO.....",
], { O: "#181020", h: "#c8883a", B: "#e0a050", b: "#a8682a", G: "#fff2a0", g: "#ffc92a" });
export const noneIconUrl = () => bitmapUrl("none", ["R......R", ".R....R.", "..R..R..", "...RR...", "...RR...", "..R..R..", ".R....R.", "R......R"], { R: "#8c94bf" }, 3);

// ---------------------------------------------------------------- trail
/** Partikel trail (Cosmetics.spawn_trail). feet = posisi kaki {x,y}; facing = 1 kanan / -1 kiri; scale = zoom hero. */
export function makeTrailParticle(it, feet, facing, counter, scale = 1, rnd = Math.random) {
  const R = (a, b) => a + (b - a) * rnd();
  let pos = { x: -facing * R(2, 6), y: -R(2, 10) };
  let drift = { x: -facing * R(4, 12), y: 0 };
  let life = 0.5;
  switch (it.shape) {
    case "star": life = 0.45; drift = { x: R(-4, 4), y: R(-6, 2) }; break;
    case "flake": life = 0.9; pos.y -= R(0, 6); drift = { x: -facing * R(2, 8), y: R(8, 16) }; break;
    case "heart": life = 0.8; pos.y -= 6; drift = { x: R(-5, 5), y: -R(12, 20) }; break;
    case "bubble": life = 0.8; pos.y -= 4; drift = { x: R(-6, 6), y: -R(10, 18) }; break;
    case "flame": life = 0.4; drift = { x: -facing * R(2, 6), y: -R(6, 12) }; break;
    case "dot": life = 0.45; pos = { x: pos.x, y: -6 - (counter % 3) * 2 }; drift = { x: -facing * 14, y: 0 }; break;
    default: break;
  }
  const hex = it.colors[counter % it.colors.length];
  return { shape: it.shape, hex, x0: feet.x + pos.x * scale, y0: feet.y + pos.y * scale, dx: drift.x * scale, dy: drift.y * scale, life, t: 0, scale };
}
/** Perbarui + gambar partikel ke ctx. Mengembalikan false jika partikel sudah habis. */
export function drawTrailParticle(ctx, p, dt, unit = 1) {
  p.t += dt;
  const k = Math.min(1, p.t / p.life);
  const x = Math.round(p.x0 + p.dx * k), y = Math.round(p.y0 + p.dy * k);
  const fade = Math.max(0, Math.min(1, (p.t - p.life * 0.35) / p.life));
  if (fade >= 1) return false;
  const s = shapeCanvas(p.shape, p.hex);
  ctx.globalAlpha = 1 - fade;
  ctx.drawImage(s, Math.round(x - (s.width * p.scale * unit) / 2), Math.round(y - (s.height * p.scale * unit) / 2), s.width * p.scale * unit, s.height * p.scale * unit);
  ctx.globalAlpha = 1;
  return true;
}
