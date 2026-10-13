import { useEffect, useRef, useState } from "react";
import { G } from "../lib/data.js";
import { sfx } from "../lib/sound.js";
import { floatText, centerOf } from "../lib/fx.js";
import { Sprite, Tile } from "./Sprite.jsx";
import { Ground } from "./Scene.jsx";
import { Panel } from "./Ui.jsx";
import { Icon } from "./Icons.jsx";
import { useTileUrls } from "../lib/hooks.js";

/** Pembungkus kartu demo: area panggung 168px + judul + deskripsi. */
export function DemoCard({ title, desc, hint, children, theme = "grass" }) {
  return (
    <Panel className="demo">
      <div className="demo-stage sc" style={{ "--sc": 3, "--msc": 3 }}>
        <div className="demo-sky" />
        {children}
        <Ground theme={theme} rows={1} scale={3} className="demo-ground" />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {hint && <span className="demo-hint"><Icon name="play" size={10} />{hint}</span>}
    </Panel>
  );
}
const useTimer = () => { const t = useRef([]); useEffect(() => () => t.current.forEach(clearTimeout), []); return (fn, ms) => t.current.push(setTimeout(fn, ms)); };
const GY = 16 * 3; // tinggi 1 baris ground (px)

export function QBlockDemo() {
  const [hits, setHits] = useState(0);
  const [bump, setBump] = useState(0);
  const [coins, setCoins] = useState([]);
  const used = hits >= 3;
  const onClick = (e) => {
    if (used) { setHits(0); sfx("click"); return; }
    sfx("bump"); setBump((b) => b + 1);
    setTimeout(() => { sfx("coin"); const id = Date.now(); setCoins((c) => [...c, id]); setTimeout(() => setCoins((c) => c.filter((x) => x !== id)), 800); }, 120);
    setHits(hits + 1);
  };
  return (
    <DemoCard title="Blok ?" desc="Sundul dari bawah untuk koin atau power-up. Setelah kosong berubah jadi blok coklat." hint={used ? "Klik untuk reset" : "Klik blok"}>
      <button className="demo-obj" key={bump} onClick={onClick} style={{ left: "50%", bottom: GY + 36, marginLeft: -24, animation: bump ? "q-hit .35s var(--ease-pop)" : "none" }} aria-label="Sundul blok">
        <Tile theme="grass" index={used ? 4 : 11} anim={used ? 0 : 3} scale={3} />
      </button>
      {coins.map((id) => <span key={id} className="demo-pop" style={{ left: "50%", bottom: GY + 84, marginLeft: -24 }}><Sprite name="coin" scale={3} /></span>)}
    </DemoCard>
  );
}

const quarters = [[0, 0, -1, -1], [1, 0, 1, -1], [0, 1, -0.6, 0.2], [1, 1, 0.6, 0.2]];
export function BrickDemo() {
  const [state, setState] = useState("idle"); // idle | bumped | broken
  const later = useTimer();
  const [url] = useTileUrls("grass", [2]);
  const click = () => {
    if (state === "broken") return;
    if (state === "idle") { sfx("bump"); setState("bumped"); later(() => setState("idle"), 300); later(() => setState("armed"), 310); return; }
    sfx("break"); setState("broken"); later(() => setState("idle"), 1500);
  };
  return (
    <DemoCard title="Blok Bata" desc="Hero kecil hanya menggoyang bata. Setelah jadi Big, sundulan memecahkannya jadi serpihan." hint="Klik dua kali: goyang, lalu pecah">
      {state !== "broken" && <button className={`demo-obj ${state === "bumped" ? "bumped" : ""}`} onClick={click} style={{ left: "50%", bottom: GY + 36, marginLeft: -24 }} aria-label="Sundul bata"><Tile theme="grass" index={2} scale={3} /></button>}
      {state === "broken" && quarters.map(([qx, qy, dx, dy], i) => (
        <i key={i} className="debris" style={{ left: "50%", bottom: GY + 36 + (1 - qy) * 24, marginLeft: -24 + qx * 24, width: 24, height: 24, backgroundImage: url ? `url(${G}/tiles/tiles_grass.png)` : "none", backgroundSize: "768px 48px", backgroundPosition: `${-(2 * 48 + qx * 24)}px ${-qy * 24}px`, "--dx": `${dx * 70}px`, "--dy": `${dy * 40}px` }} />
      ))}
    </DemoCard>
  );
}

export function PipeDemo() {
  const [phase, setPhase] = useState("idle");
  const later = useTimer();
  const go = () => { if (phase !== "idle") return; sfx("pipe"); setPhase("down"); later(() => setPhase("up"), 1300); later(() => setPhase("idle"), 2300); };
  return (
    <DemoCard title="Warp Pipe" desc="Tekan ↓ di atas pipa berpanah untuk masuk ke ruang bonus atau jalan pintas rahasia." hint="Klik pipa">
      <div className={`pipe-hero ${phase}`} style={{ left: "50%", bottom: GY + 48 + 8 - 48, marginLeft: -24 }}><Sprite name="heroSmall" scale={3} still /></div>
      <button className="demo-obj pipe-obj" onClick={go} style={{ left: "50%", bottom: GY, marginLeft: -48 }} aria-label="Masuk pipa">
        <span className="pipe-row"><Tile index={5} scale={3} /><Tile index={6} scale={3} /></span>
        <span className="pipe-row"><Tile index={7} scale={3} /><Tile index={8} scale={3} /></span>
        <span className="pipe-row"><Tile index={7} scale={3} /><Tile index={8} scale={3} /></span>
      </button>
      <span className="demo-pop-s" style={{ left: "50%", bottom: GY + 48 * 3 + 6, marginLeft: -18 }}><Sprite name="pipeArrow" scale={3} /></span>
    </DemoCard>
  );
}

export function SpringDemo() {
  const [phase, setPhase] = useState("idle");
  const later = useTimer();
  const go = () => { if (phase !== "idle") return; setPhase("press"); sfx("jump_big"); later(() => setPhase("fly"), 130); later(() => setPhase("idle"), 1500); };
  return (
    <DemoCard title="Spring" desc="Injak untuk terlontar jauh lebih tinggi dari lompatan biasa — tahan lompat untuk lebih tinggi lagi." hint="Klik spring">
      <div className={`spring-hero ${phase}`} style={{ left: "50%", bottom: GY + 48, marginLeft: -24 }}><Sprite name={phase === "fly" ? "heroSmallJump" : "heroSmall"} scale={3} still /></div>
      <button className="demo-obj" onClick={go} style={{ left: "50%", bottom: GY, marginLeft: -24 }} aria-label="Injak spring"><Sprite name={phase === "press" ? "springDown" : phase === "fly" ? "springUp" : "spring"} scale={3} /></button>
    </DemoCard>
  );
}

export function MovingDemo() {
  return (
    <DemoCard title="Platform Bergerak" desc="Naik dan ikuti geraknya. Ada yang bergerak horizontal, ada yang vertikal." hint="Otomatis bergerak">
      <div className="move-plat" style={{ bottom: GY + 40 }}>
        <Sprite name="platform" scale={3} />
        <span className="move-hero"><Sprite name="heroSmallRun" scale={3} /></span>
      </div>
    </DemoCard>
  );
}

export function FallDemo() {
  const [phase, setPhase] = useState("idle");
  const later = useTimer();
  const go = () => { if (phase !== "idle") return; setPhase("shake"); sfx("bump"); later(() => { setPhase("fall"); }, 800); later(() => setPhase("idle"), 2400); };
  return (
    <DemoCard title="Falling Platform" desc="Jangan berdiam lama di atasnya — platform bergetar lalu jatuh ke jurang." hint="Klik untuk menginjak">
      <button className={`demo-obj fall-${phase}`} onClick={go} style={{ left: "50%", bottom: GY + 70, marginLeft: -72 }} aria-label="Injak platform">
        <Sprite name="platform" scale={3} />
        <span className="fall-hero"><Sprite name="heroSmall" scale={3} still /></span>
      </button>
    </DemoCard>
  );
}

export function CheckpointDemo() {
  const [on, setOn] = useState(false);
  return (
    <DemoCard title="Checkpoint" desc="Sentuh bendera tengah level — bila kehilangan nyawa, kamu mulai lagi dari sini." hint={on ? "Klik untuk reset" : "Klik bendera"}>
      <button className="demo-obj" onClick={() => { setOn(!on); sfx(on ? "click" : "checkpoint"); }} style={{ left: "50%", bottom: GY, marginLeft: -24 }} aria-label="Sentuh checkpoint"><Sprite name={on ? "checkpointOn" : "checkpoint"} scale={3} /></button>
      <span className="demo-pop-s" style={{ left: "26%", bottom: GY }}><Sprite name="heroSmallRun" scale={3} /></span>
    </DemoCard>
  );
}

const TIERS = [[0.82, 100], [0.62, 400], [0.42, 800], [0.2, 2000], [0, 5000]];
export function FlagDemo() {
  const [slide, setSlide] = useState(null);
  const later = useTimer();
  const pole = useRef(null);
  const go = (e) => {
    if (slide) return;
    const r = pole.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    const score = TIERS.find(([t]) => y >= t)[1];
    sfx("flag", { force: false }); setSlide({ y, score });
    floatText(r.left + r.width / 2, e.clientY, `${score}`);
    later(() => setSlide(null), 2600);
  };
  return (
    <DemoCard title="Tiang Bendera" desc="Makin tinggi kamu menyentuh tiang, makin besar skornya — sampai 5000 poin!" hint="Klik tiang di ketinggian berbeda">
      <button ref={pole} className="flagpole" onClick={go} aria-label="Sentuh tiang bendera" style={{ "--y": slide ? slide.y : 0 }}>
        <span className="fp-ball"><Sprite name="flagBall" scale={3} /></span>
        <span className="fp-pole" />
        <span className={`fp-flag ${slide ? "slide" : ""}`}><Sprite name="flag" scale={3} /></span>
        {slide && <span className="fp-hero" style={{ "--from": `${slide.y * 100}%` }}><Sprite name="heroSmall" scale={3} still /></span>}
      </button>
      {slide && <span className="fp-score">+{slide.score}</span>}
    </DemoCard>
  );
}
