import { memo, useMemo } from "react";
import { G, THEMES, SKY_IMG } from "../lib/data.js";
import { useTileUrls } from "../lib/hooks.js";
import { Sprite } from "./Sprite.jsx";

/** Latar dunia: gradasi langit + lapisan far/near yang bergeser mulus (transform, bukan background-position). */
export const ThemeBackdrop = memo(function ThemeBackdrop({ theme = "grass", animate = true, farSpeed = 70, nearSpeed = 32, className = "" }) {
  const t = THEMES[theme] || THEMES.grass;
  const sky = SKY_IMG[theme];
  return (
    <div aria-hidden="true" className={`backdrop ${className}`} style={{ "--top": t.top, "--bot": t.bot }}>
      {sky && <div className="bd-sky" style={{ backgroundImage: `url(${G}/bg/${sky}.png)` }} />}
      {theme === "night" && <img className="bd-moon" src={`${G}/bg/bg_night_moon.png`} alt="" />}
      <div className={`plx plx-far ${animate ? "run" : ""}`} style={{ backgroundImage: `url(${G}/bg/bg_${theme}_far.png)`, "--speed": `${farSpeed}s`, "--bh": 128 }} />
      <div className={`plx plx-near ${animate ? "run" : ""}`} style={{ backgroundImage: `url(${G}/bg/bg_${theme}_near.png)`, "--speed": `${nearSpeed}s`, "--bh": 72 }} />
    </div>
  );
});

/** Lantai dari tile asli tema. rows = jumlah baris tile (atas = rumput/permukaan). */
export const Ground = memo(function Ground({ theme = "grass", rows = 2, scale = 4, mscale, run = false, speed = 4, className = "" }) {
  const [top, fill] = useTileUrls(theme, [0, 1]);
  return (
    <div className={`ground sc ${className}`} style={{ "--sc": scale, "--msc": mscale ?? scale, "--rows": rows }} data-m={mscale ? "" : undefined} aria-hidden="true">
      <div className={`ground-in ${run ? "run" : ""} ${top ? "ready" : ""}`} style={{ backgroundImage: top ? `url(${top}),url(${fill})` : "none", "--speed": `${speed}s` }} />
    </div>
  );
});

/** Partikel suasana tema (salju, bara, debu). Posisi acak tetap (seed) → tidak berubah tiap render. */
export const Particles = memo(function Particles({ kind, count = 26 }) {
  const dots = useMemo(() => {
    let s = 7;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: count }, () => ({ x: r() * 100, d: 4 + r() * 6, dl: -r() * 8, sw: 10 + r() * 30, z: r() < 0.3 ? 6 : 4 }));
  }, [count]);
  if (!kind) return null;
  return (
    <div className={`fx fx-${kind}`} aria-hidden="true">
      {dots.map((p, i) => <i key={i} style={{ left: `${p.x}%`, width: p.z, height: p.z, animationDuration: `${p.d}s`, animationDelay: `${p.dl}s`, "--sw": `${p.sw}px` }} />)}
    </div>
  );
});

/** Dekor tanah di atas Ground (bukit, semak, kaktus…) — memakai sprite asli game. */
export function Decor({ theme, ground = 2, scale = 4, mscale, seed = 1, count = 6, className = "" }) {
  const t = THEMES[theme] || THEMES.grass;
  const list = useMemo(() => {
    let s = seed * 9301 + 49297;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const keys = { hill_l: "hillL", hill_s: "hillS", bush_s: "bushS", bush_l: "bushL", cactus: "cactus", palm: "palm", crystal: "crystal", pine: "pine", fern: "fern", torch: "torch" };
    if (!t.gdecor.length) return [];
    return Array.from({ length: count }, (_, i) => ({ key: keys[t.gdecor[Math.floor(r() * t.gdecor.length)]], x: ((i + 0.15 + r() * 0.7) / count) * 100 }));
  }, [t, seed, count]);
  return (
    <div className={`decor sc ${className}`} style={{ "--sc": scale, "--msc": mscale ?? scale, "--rows": ground }} data-m={mscale ? "" : undefined} aria-hidden="true">
      {list.map((d, i) => <span key={i} className="decor-i" style={{ left: `${d.x}%` }}><Sprite name={d.key} scale={scale} mscale={mscale} /></span>)}
    </div>
  );
}
