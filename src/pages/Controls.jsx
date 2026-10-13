import { useEffect, useRef, useState } from "react";
import { CONTROLS } from "../lib/data.js";
import { PageHero } from "../components/Chrome.jsx";
import { Section, Panel, Reveal, Btn } from "../components/Ui.jsx";
import { Sprite } from "../components/Sprite.jsx";
import { Ground, ThemeBackdrop } from "../components/Scene.jsx";
import { Icon } from "../components/Icons.jsx";
import { useFrame, useIsMobile } from "../lib/hooks.js";
import { sfx } from "../lib/sound.js";
import { addCoins } from "../lib/store.js";

const KEYMAP = {
  ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right",
  " ": "jump", z: "jump", Z: "jump", w: "jump", W: "jump", ArrowUp: "jump", k: "jump", K: "jump",
  Shift: "run", x: "run", X: "run", j: "run", J: "run", ArrowDown: "down", s: "down", S: "down",
};
const CAPS = [["left", "←"], ["down", "↓"], ["right", "→"], ["jump", "SPACE"], ["run", "SHIFT"]];
const COINS = [[18, 70], [34, 110], [50, 70], [66, 110], [82, 70]];

function Playground() {
  const mobile = useIsMobile();
  const s = mobile ? 3 : 4;
  const [form, setForm] = useState(2);
  const [lit, setLit] = useState({});
  const [pad, setPad] = useState(false);
  const [got, setGot] = useState(() => new Set());
  const [fires, setFires] = useState([]);
  const stage = useRef(null), hero = useRef(null), sprite = useRef(null);
  const keys = useRef({});
  const m = useRef({ x: 80, y: 0, vx: 0, vy: 0, face: 1, ground: true, hold: false, runPrev: false, cool: 0 });
  const unit = s / 4;

  const setKey = (k, v) => { keys.current[k] = v; setLit((o) => (o[k] === v ? o : { ...o, [k]: v })); };
  useEffect(() => {
    const dn = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const a = KEYMAP[e.key];
      if (!a) return;
      if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
      const r = stage.current?.getBoundingClientRect();
      if (r && r.bottom > 0 && r.top < innerHeight && (a === "jump" || a === "down" || e.key.startsWith("Arrow"))) e.preventDefault();
      setKey(a, true);
    };
    const up = (e) => { const a = KEYMAP[e.key]; if (a) setKey(a, false); };
    addEventListener("keydown", dn); addEventListener("keyup", up);
    addEventListener("blur", () => { keys.current = {}; setLit({}); });
    return () => { removeEventListener("keydown", dn); removeEventListener("keyup", up); };
  }, []);

  const shoot = () => {
    const o = m.current;
    if (form !== 2 || o.cool > 0) return;
    o.cool = 0.3; sfx("fireball");
    const id = Math.random(); setFires((f) => [...f, { id, x: o.x + (o.face > 0 ? 40 : -10) * unit, y: o.y + 10 * unit, d: o.face }]);
    setTimeout(() => setFires((f) => f.filter((q) => q.id !== id)), 900);
  };

  useFrame((dt) => {
    const o = m.current, k = keys.current;
    const W = stage.current?.clientWidth || 600;
    // gamepad
    const gp = navigator.getGamepads?.().find(Boolean);
    if (gp) {
      if (!pad) setPad(true);
      const ax = gp.axes[0] || 0;
      k.left = k.left || ax < -0.4 || gp.buttons[14]?.pressed;
      k.right = k.right || ax > 0.4 || gp.buttons[15]?.pressed;
      k.jump = k.jump || gp.buttons[0]?.pressed;
      k.run = k.run || gp.buttons[2]?.pressed || gp.buttons[1]?.pressed;
      if (!k.run && o.runPrev === false) { /* noop */ }
    } else if (pad) setPad(false);
    const run = !!k.run;
    if (run && !o.runPrev) shoot();
    o.runPrev = run;
    if (o.cool > 0) o.cool -= dt;
    const max = (run ? 330 : 190) * unit, acc = 1500 * unit;
    const dir = (k.right ? 1 : 0) - (k.left ? 1 : 0);
    if (dir) { o.vx += dir * acc * dt; o.face = dir; } else o.vx -= Math.sign(o.vx) * Math.min(Math.abs(o.vx), acc * 0.9 * dt);
    o.vx = Math.max(-max, Math.min(max, o.vx));
    o.x = Math.max(0, Math.min(W - 16 * s, o.x + o.vx * dt));
    if (k.jump && o.ground) { o.vy = 880 * unit; o.ground = false; o.hold = true; sfx(form ? "jump_big" : "jump"); }
    if (!k.jump) { o.hold = false; if (o.vy > 360 * unit) o.vy = 360 * unit; }
    if (!o.ground) { o.vy -= 2600 * unit * dt * (o.hold && o.vy > 0 ? 0.75 : 1); o.y += o.vy * dt; if (o.y <= 0) { o.y = 0; o.vy = 0; o.ground = true; } }
    // koin
    COINS.forEach(([px, py], i) => {
      if (got.has(i)) return;
      const cx = (px / 100) * W, cy = py * unit;
      if (Math.abs(o.x + 8 * s - cx) < 14 * s && o.y + 16 * s * (form ? 2 : 1) > cy - 8 * s && o.y < cy + 8 * s) {
        setGot((g) => new Set(g).add(i)); sfx("coin"); addCoins(1);
        setTimeout(() => setGot((g) => { const n = new Set(g); n.delete(i); return n; }), 3000);
      }
    });
    if (hero.current) hero.current.style.transform = `translate3d(${o.x}px,${-o.y}px,0) scaleX(${o.face})`;
    if (sprite.current) {
      const moving = Math.abs(o.vx) > 20, turning = dir && Math.sign(o.vx) !== dir && Math.abs(o.vx) > 80;
      const n = o.ground ? (turning ? "skid" : moving ? "run" : "idle") : "jump";
      if (sprite.current.dataset.n !== n) { sprite.current.dataset.n = n; sprite.current.className = `pg-spr pg-${n}`; }
    }
  });

  const hn = ["Small", "Big", "Fire"][form];
  const H = ["heroSmall", "heroBig", "heroFire"][form];
  const R = ["heroSmallRun", "heroBigRun", "heroFireRun"][form];
  const J = ["heroSmallJump", "heroBigJump", "heroFireJump"][form];
  const touch = (k) => ({ onPointerDown: (e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); setKey(k, true); }, onPointerUp: () => setKey(k, false), onPointerCancel: () => setKey(k, false) });

  return (
    <Panel className="pg">
      <div className="pg-stage sc" ref={stage} style={{ "--sc": 4, "--msc": 3 }}>
        <ThemeBackdrop theme="grass" animate={false} />
        {COINS.map(([px, py], i) => !got.has(i) && <span key={i} className="pg-coin" style={{ left: `${px}%`, bottom: `calc(${py * unit}px + ${2 * 16 * s}px)` }}><Sprite name="coin" scale={s} /></span>)}
        {fires.map((f) => <span key={f.id} className="pg-fire" style={{ left: f.x, bottom: `calc(${f.y}px + ${2 * 16 * s}px)`, "--d": f.d }}><Sprite name="fireball" scale={s} /></span>)}
        <div className="pg-hero" ref={hero} style={{ bottom: `calc(${2 * 16 * s}px)` }}>
          <span ref={sprite} className="pg-spr pg-idle" data-n="idle">
            <span className="s-idle"><Sprite name={H} scale={s} /></span>
            <span className="s-skid"><Sprite name={form === 0 ? "heroSmallSkid" : H} scale={s} still /></span>
            <span className="s-run"><Sprite name={R} scale={s} /></span>
            <span className="s-jump"><Sprite name={J} scale={s} /></span>
          </span>
        </div>
        <Ground theme="grass" rows={2} scale={4} mscale={3} />
        <div className="pg-tag"><Icon name="play" size={10} /> {hn.toUpperCase()}{pad ? " · GAMEPAD" : ""}</div>
      </div>
      <div className="pg-bar">
        <div className="caps">{CAPS.map(([k, l]) => <kbd key={k} className={`cap ${lit[k] ? "on" : ""} ${k === "jump" ? "wide" : ""}`}>{l}</kbd>)}</div>
        <div className="pg-forms">{["Small", "Big", "Fire"].map((n, i) => <Btn key={n} variant="ghost" size="sm" aria-pressed={form === i} onClick={() => setForm(i)}>{n}</Btn>)}</div>
      </div>
      <div className="pg-touch" aria-label="Kontrol sentuh">
        <div className="pg-dpad">
          <button aria-label="Kiri" {...touch("left")}><Icon name="arrow" size={20} className="flipx" /></button>
          <button aria-label="Kanan" {...touch("right")}><Icon name="arrow" size={20} /></button>
        </div>
        <div className="pg-ab">
          <button className="b" aria-label="Lari / api" {...touch("run")}>B</button>
          <button className="a" aria-label="Lompat" {...touch("jump")}>A</button>
        </div>
      </div>
      <p className="pg-note">Coba di sini: gerak, lompat (tahan), lari, dan — di bentuk Fire — tembak api dengan <b className="gold">Shift/X</b>. Kumpulkan koin untuk menambah hitungan di header.</p>
    </Panel>
  );
}

export default function Controls() {
  return (
    <>
      <PageHero title="Kontrol Permainan" theme="grass" sprite="heroSmallRun">Keyboard, sentuh, dan gamepad — semua tombol bisa diatur ulang di menu Controls dalam game.</PageHero>

      <Section title="Coba Langsung" sprite="heroFireRun" lead="Gunakan keyboard, atau tombol di layar jika kamu di ponsel. Gamepad yang tersambung terdeteksi otomatis.">
        <Reveal variant="pop"><Playground /></Reveal>
      </Section>

      <Section title="Daftar Tombol" sprite="pipeArrow">
        <Reveal>
          <Panel className="ctl">
            <div className="ctl-h" aria-hidden="true"><span>Aksi</span><span>Keyboard</span><span>Gamepad</span></div>
            {CONTROLS.map((c) => (
              <div key={c.action} className="ctl-r">
                <span className="ctl-a">{c.action}</span>
                <span className="ctl-k">{c.keys.map((k) => <kbd key={k} className="cap sm">{k}</kbd>)}</span>
                <span className="ctl-p"><i>Pad</i>{c.pad}</span>
              </div>
            ))}
          </Panel>
        </Reveal>
      </Section>

      <Section title="Tips Cepat" sprite="star">
        <div className="grid g3">
          {[["Tahan lompat", "Lompatan lebih tinggi saat tombol ditahan; lepas lebih awal untuk lompatan pendek."], ["Lari dulu", "Tahan Shift sebelum melompat — jarak lompat jauh bertambah."], ["Injak beruntun", "Injak musuh tanpa menyentuh tanah untuk combo skor hingga 1UP."]].map(([t, d], i) => (
            <Reveal key={t} variant="pop" delay={i * 90}><Panel className="mini"><h3>{t}</h3><p>{d}</p></Panel></Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
