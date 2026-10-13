import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { G, SPRITES, THEMES, SKY_IMG } from "../lib/data.js";
import { buildLevel, T } from "../lib/levels.js";
import { loadImage, useFrame, useMedia } from "../lib/hooks.js";
import { sfx } from "../lib/sound.js";
import { Sprite, Tile } from "./Sprite.jsx";
import { Particles } from "./Scene.jsx";
import { Btn } from "./Ui.jsx";
import { Icon } from "./Icons.jsx";

const worldLabel = (i) => `WORLD ${Math.floor(i / 5) + 1}-${(i % 5) + 1}`;

/** Gambar lapisan statis level (tile, dekor, bendera, kastil) ke canvas 1×. */
async function paintLevel(canvas, lv) {
  const theme = lv.themeName;
  const [atlas, ...decorImgs] = await Promise.all([
    loadImage(`${G}/tiles/tiles_${theme}.png`),
    ...[...new Set([...lv.decor, ...lv.skyDecor].map((d) => d.key))].map((k) => loadImage(SPRITES[k].url).then((img) => [k, img])),
    loadImage(SPRITES.castle.url), loadImage(SPRITES.flag.url), loadImage(SPRITES.flagBall.url),
  ]);
  const imgs = Object.fromEntries(decorImgs.filter(Array.isArray));
  const [castle, flag, ball] = decorImgs.slice(-3);
  canvas.width = lv.width; canvas.height = lv.height;
  const g = canvas.getContext("2d");
  g.imageSmoothingEnabled = false;
  g.clearRect(0, 0, lv.width, lv.height);
  if (lv.cols > lv.main) { // ruang bonus: latar gelap seperti di game
    g.fillStyle = "#0d0d21"; g.fillRect(lv.main * T, 0, (lv.cols - lv.main) * T, lv.height);
    g.fillStyle = "#171733";
    for (let k = lv.main * T + 24; k < lv.width - 16; k += 48) g.fillRect(k, 48, 24, 144);
  }
  g.globalAlpha = 0.92;
  for (const d of lv.skyDecor) if (imgs[d.key]) g.drawImage(imgs[d.key], Math.round(d.x), Math.round(d.y));
  g.globalAlpha = 1;
  for (const d of lv.decor) if (imgs[d.key]) g.drawImage(imgs[d.key], d.x, d.y);
  if (lv.castle) g.drawImage(castle, lv.castle.x, lv.castle.y);
  if (lv.flag) {
    const f = lv.flag;
    g.fillStyle = "#d9e6f2"; g.fillRect(f.x, f.top, 2, f.base - f.top);
    g.fillStyle = "#73808f"; g.fillRect(f.x + 1, f.top, 1, f.base - f.top);
    g.drawImage(ball, f.x + 1 - 4, f.top - 3 - 4);
    g.drawImage(flag, f.x - 7 - 8, f.top + 10 - 8);
  }
  for (const [c, r, idx] of lv.tiles) g.drawImage(atlas, idx * 16, 0, 16, 16, c * T, r * T, 16, 16);
}

const Ent = memo(function Ent({ e, Z, theme, groundY }) {
  const pos = { left: e.x * Z, top: e.y * Z };
  switch (e.k) {
    case "coin": return <span className="le" style={pos}><Sprite name="coin" scale={Z} /></span>;
    case "goomba": return <span className="le patrol" style={{ ...pos, "--pz": `${28 * Z}px` }}><Sprite name="goomba" scale={Z} /></span>;
    case "koopa": return <span className="le patrol-flip" style={{ ...pos, "--pz": `${32 * Z}px` }}><Sprite name="koopa" scale={Z} /></span>;
    case "bat": return <span className="le bat-sway" style={{ ...pos, "--pz": `${14 * Z}px` }}><Sprite name="bat" scale={Z} /></span>;
    case "spring": return <span className="le" style={pos}><Sprite name="spring" scale={Z} /></span>;
    case "checkpoint": return <span className="le" style={pos}><Sprite name="checkpoint" scale={Z} /></span>;
    case "crusher": return <span className="le crush" style={{ ...pos, "--pz": `${(groundY - e.y - 24) * Z}px` }}><Sprite name="crusher" scale={Z} /></span>;
    case "platform": return <span className={`le ${e.move ? `plat-${e.move}` : e.fall ? "plat-fall" : ""}`} style={{ ...pos, "--pz": `${e.range * Z}px` }}><Sprite name="platform" scale={Z} /></span>;
    case "qblock": return <span className="le" style={pos}><Tile theme={theme} index={11} anim={3} scale={Z} /></span>;
    case "warp": return <span className="le warp" style={pos}><Sprite name="pipeArrow" scale={Z} /></span>;
    case "firebar": return (
      <span className="le firebar" style={{ left: e.x * Z, top: e.y * Z }}>
        <i style={{ "--z": Z }}>{[1, 2, 3, 4, 5].map((n) => <b key={n} style={{ left: n * 7 * Z, "--z": Z }}><Sprite name="fireball" scale={Z} /></b>)}</i>
      </span>
    );
    default: return null;
  }
});

export function LevelExplorer({ initial = 0, index, onIndex }) {
  const [own, setOwn] = useState(initial);
  const idx = index ?? own;
  const setIdx = onIndex || setOwn;
  const big = useMedia("(min-width: 1100px) and (min-height: 900px)");
  const Z = big ? 3 : 2;
  const lv = useMemo(() => buildLevel(idx), [idx]);
  const theme = THEMES[lv.themeName];
  const vp = useRef(null), world = useRef(null), far = useRef(null), near = useRef(null), cv = useRef(null), range = useRef(null);
  const cam = useRef({ x: 0, v: 0, drag: false, px: 0, tour: false, vpw: 0, last: -1 });
  const [win, setWin] = useState(0);
  const [tour, setTour] = useState(false);
  const [ready, setReady] = useState(false);
  const worldW = lv.width * Z;

  useEffect(() => { setReady(false); paintLevel(cv.current, lv).then(() => setReady(true)).catch(() => {}); }, [lv]);
  useEffect(() => { cam.current.x = 0; cam.current.v = 0; cam.current.tour = false; setTour(false); cam.current.last = -1; setWin(0); }, [idx, Z]);

  const clamp = (x) => Math.max(0, Math.min(Math.max(0, worldW - (vp.current?.clientWidth || 0)), x));

  useFrame((dt) => {
    const c = cam.current, v = vp.current;
    if (!v) return;
    c.vpw = v.clientWidth;
    if (!c.drag) {
      if (c.tour) { c.x += 150 * (Z / 2) * dt; if (c.x >= worldW - c.vpw) { c.tour = false; setTour(false); } }
      else if (Math.abs(c.v) > 8) { c.x += c.v * dt; c.v *= Math.exp(-dt * 3.6); } else c.v = 0;
    }
    c.x = clamp(c.x);
    if (c.x !== c.last) {
      c.last = c.x;
      world.current.style.transform = `translate3d(${-c.x}px,0,0)`;
      const tw = 256 * Z;
      far.current.style.transform = `translate3d(${-((c.x * theme.far) % tw)}px,0,0)`;
      near.current.style.transform = `translate3d(${-((c.x * theme.near) % tw)}px,0,0)`;
      const max = Math.max(1, worldW - c.vpw);
      if (range.current) range.current.value = Math.round((c.x / max) * 1000);
      const w = Math.floor(c.x / Math.max(300, c.vpw / 2));
      setWin((o) => (o === w ? o : w));
    }
  });

  // drag / wheel / keyboard
  useEffect(() => {
    const el = vp.current;
    const c = cam.current;
    let lastT = 0;
    const down = (e) => { c.drag = true; c.tour = false; setTour(false); c.px = e.clientX; c.v = 0; lastT = performance.now(); el.setPointerCapture(e.pointerId); el.classList.add("grab"); };
    const move = (e) => { if (!c.drag) return; const now = performance.now(); const dx = e.clientX - c.px; c.px = e.clientX; c.x = clamp(c.x - dx); const dt = Math.max(1, now - lastT) / 1000; c.v = -dx / dt * 0.6 + c.v * 0.4; lastT = now; };
    const up = () => { c.drag = false; el.classList.remove("grab"); if (performance.now() - lastT > 90) c.v = 0; };
    const wheel = (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); c.tour = false; setTour(false); c.x = clamp(c.x + e.deltaX); } };
    const key = (e) => {
      const step = 200;
      if (e.key === "ArrowRight") { e.preventDefault(); c.v = 0; c.x = clamp(c.x + step); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); c.v = 0; c.x = clamp(c.x - step); }
      else if (e.key === "Home") c.x = 0; else if (e.key === "End") c.x = 1e9;
    };
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false }); el.addEventListener("keydown", key);
    return () => { el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); el.removeEventListener("wheel", wheel); el.removeEventListener("keydown", key); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Z, worldW]);

  const toggleTour = () => { const c = cam.current; if (c.x >= worldW - c.vpw - 4) c.x = 0; c.tour = !c.tour; setTour(c.tour); c.v = 0; sfx(c.tour ? "powerup" : "click"); };
  const goBonus = () => { cam.current.x = clamp(lv.main * T * Z); cam.current.v = 0; sfx("pipe"); };

  // entitas hanya dirender di sekitar kamera (menjaga DOM tetap ringan)
  const span = Math.max(300, (cam.current.vpw || 800) / 2);
  const from = (win - 2) * span, to = (win + 4) * span;
  const visible = lv.ents.filter((e) => e.x * Z >= from - 200 && e.x * Z <= to + 200);
  const under = visible.filter((e) => e.k === "piranha");
  const over = visible.filter((e) => e.k !== "piranha");
  const skyImg = SKY_IMG[lv.themeName];
  const s = lv.stats;

  return (
    <div className="lvx">
      <div className="lvx-head">
        <div>
          <p className="lvx-w">{worldLabel(idx)} · {theme.label.toUpperCase()}</p>
          <h3>{lv.name}</h3>
        </div>
        <div className="lvx-stats">
          {[["coin", s.coins, "Koin"], ["goomba", s.enemies, "Musuh"], ["qblock", s.blocks, "Blok ?"], ["checkpoint", s.checkpoints, "Checkpoint"]].map(([k, n, l]) => (
            <span key={l} className="lvx-stat">{k === "qblock" ? <Tile theme={lv.themeName} index={11} scale={1} /> : <Sprite name={k} scale={1} still />}<b>{n}</b>{l}</span>
          ))}
          <span className="lvx-stat"><Icon name="clock" size={14} /><b>{lv.time}</b>detik</span>
        </div>
      </div>

      <div className={`lvx-vp ${ready ? "ready" : ""}`} ref={vp} tabIndex={0} role="group" aria-label={`Peta level ${lv.name}. Geser atau gunakan tombol panah.`} style={{ height: lv.height * Z, "--top": theme.top, "--bot": theme.bot }}>
        {skyImg && <div className="bd-sky" style={{ backgroundImage: `url(${G}/bg/${skyImg}.png)` }} />}
        <div className="lvx-layer" ref={far} style={{ backgroundImage: `url(${G}/bg/bg_${lv.themeName}_far.png)`, height: 128 * Z, backgroundSize: `${256 * Z}px 100%`, width: `calc(100% + ${256 * Z}px)` }} />
        <div className="lvx-layer" ref={near} style={{ backgroundImage: `url(${G}/bg/bg_${lv.themeName}_near.png)`, height: 72 * Z, backgroundSize: `${256 * Z}px 100%`, width: `calc(100% + ${256 * Z}px)` }} />
        <Particles kind={theme.fxKind} count={18} />
        <div className="lvx-world" ref={world} style={{ width: worldW, height: lv.height * Z }}>
          <div className="lvx-under">{under.map((e, i) => <span key={`${e.x}${e.y}${i}`} className="le pir" style={{ left: e.x * Z, top: e.y * Z, "--pz": `${24 * Z}px` }}><Sprite name="piranha" scale={Z} /></span>)}</div>
          <canvas ref={cv} className="lvx-cv" style={{ width: worldW, height: lv.height * Z }} />
          <div className="lvx-ents">
            {lv.spawn && <span className="le" style={{ left: lv.spawn.x * Z, top: lv.spawn.y * Z }}><Sprite name="heroSmall" scale={Z} still /></span>}
            {over.map((e, i) => <Ent key={`${e.k}${e.x}${e.y}${i}`} e={e} Z={Z} theme={lv.themeName} groundY={192} />)}
          </div>
        </div>
        {!ready && <div className="lvx-load">MEMUAT…</div>}
        <div className="lvx-hint" aria-hidden="true"><Icon name="arrow" size={12} className="rot-l" /> geser <Icon name="arrow" size={12} /></div>
      </div>

      <div className="lvx-bar">
        <Btn variant={tour ? "red" : "pipe"} size="sm" onClick={toggleTour}><Icon name={tour ? "stop" : "play"} size={12} />{tour ? "Berhenti" : "Tur Otomatis"}</Btn>
        <input ref={range} className="lvx-range" type="range" min="0" max="1000" defaultValue="0" aria-label="Posisi di dalam level"
          onChange={(e) => { const c = cam.current; c.tour = false; setTour(false); c.v = 0; c.x = clamp((e.target.value / 1000) * Math.max(0, worldW - c.vpw)); }} />
        {lv.cols > lv.main && <Btn variant="ghost" size="sm" onClick={goBonus}><Icon name="arrow" size={12} />Ruang Bonus</Btn>}
      </div>
    </div>
  );
}
