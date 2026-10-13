import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useInView, useIsMobile, useReducedMotion } from "../lib/hooks.js";
import { sfx } from "../lib/sound.js";
import { addCoins } from "../lib/store.js";
import { floatText, centerOf, toast } from "../lib/fx.js";
import { Sprite, Tile } from "./Sprite.jsx";
import { Ground } from "./Scene.jsx";

const FORMS = ["Small", "Big", "Fire"];
const HERO = {
  run: ["heroSmallRun", "heroBigRun", "heroFireRun"],
  jump: ["heroSmallJump", "heroBigJump", "heroFireJump"],
  height: [16, 32, 32],
};

/**
 * Mini-game di hero: tap/klik/Space untuk lompat (tahan = lebih tinggi). Kumpulkan koin, injak Goomba,
 * sundul blok ? untuk power-up (Mushroom → Fire Flower → Star), tembak api dengan X / Shift / tombol 🔥.
 * Seluruh gerakan memakai transform (diperbarui di rAF) → mulus 60fps.
 */
export function Runner({ paused = false }) {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const s = mobile ? 3 : 4;
  const [wrapRef, seen] = useInView();
  const stage = useRef(null);
  const heroEl = useRef(null);
  const blockEl = useRef(null);
  const [form, setForm] = useState(0);
  const [air, setAir] = useState(false);
  const [star, setStar] = useState(false);
  const [hurt, setHurt] = useState(false);
  const [score, setScore] = useState(0);
  const [list, setList] = useState([]);
  const [item, setItem] = useState(null);
  const [bumped, setBumped] = useState(0);
  const [visible, setVisible] = useState(true);

  const w = useRef({ y: 0, vy: 0, holding: false, form: 0, star: 0, hurt: 0, ents: [], next: 1.0, id: 1, cool: 0, score: 0 });
  const unit = s; // px per game-pixel
  const vWorld = 300 * (unit / 4);
  const G_ = 2700 * (unit / 4);
  const V0 = 930 * (unit / 4);

  useEffect(() => { w.current.form = form; }, [form]);

  // jeda saat tab section di luar layar
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [wrapRef]);

  const jump = useCallback(() => {
    const m = w.current;
    if (m.y <= 1) { m.vy = V0; m.holding = true; setAir(true); sfx(m.form ? "jump_big" : "jump"); }
  }, [V0]);
  const release = useCallback(() => { const m = w.current; m.holding = false; if (m.vy > V0 * 0.45) m.vy = V0 * 0.45; }, [V0]);

  const shoot = useCallback(() => {
    const m = w.current;
    if (m.form !== 2 || m.cool > 0) return;
    m.cool = 0.28;
    const W = stage.current.clientWidth;
    const id = m.id++;
    m.ents.push({ id, kind: "fire", x: W * 0.2 + 12 * unit, y: m.y + 8 * unit, vx: vWorld * 2.2, vy: 0, w: 8 * unit, h: 8 * unit });
    setList((l) => [...l, { id, kind: "fire" }]);
    sfx("fireball");
  }, [unit, vWorld]);

  useEffect(() => {
    const down = (e) => {
      if (!visible || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ([" ", "ArrowUp", "w", "W", "z", "Z", "k", "K"].includes(e.key)) { e.preventDefault(); jump(); }
      else if (["x", "X", "j", "J", "Shift"].includes(e.key)) shoot();
    };
    const up = (e) => { if ([" ", "ArrowUp", "w", "W", "z", "Z", "k", "K"].includes(e.key)) release(); };
    addEventListener("keydown", down); addEventListener("keyup", up);
    return () => { removeEventListener("keydown", down); removeEventListener("keyup", up); };
  }, [visible, jump, release, shoot]);

  const kill = (m, e) => { e.dead = true; e.el?.classList.add("dead"); };

  useFrame((dt) => {
    const m = w.current;
    const W = stage.current?.clientWidth || 800;
    const hx = W * 0.2;
    // hero fisika
    if (m.cool > 0) m.cool -= dt;
    if (m.y > 0 || m.vy > 0) {
      m.vy -= G_ * dt * (m.holding && m.vy > 0 ? 0.78 : 1);
      m.y += m.vy * dt;
      if (m.y <= 0) { m.y = 0; m.vy = 0; m.holding = false; setAir(false); }
    }
    if (m.star > 0) { m.star -= dt; if (m.star <= 0) setStar(false); }
    if (m.hurt > 0) { m.hurt -= dt; if (m.hurt <= 0) setHurt(false); }
    const hh = HERO.height[m.form] * unit;
    if (heroEl.current) heroEl.current.style.transform = `translate3d(${hx}px,${-m.y}px,0)`;

    // spawn
    m.next -= dt;
    if (m.next <= 0) {
      m.next = 1.3 + Math.random() * 1.2;
      const r = Math.random();
      const add = (kind, x, y, extra = {}) => { const id = m.id++; m.ents.push({ id, kind, x, y, w: 16 * unit, h: 16 * unit, ...extra }); setList((l) => [...l, { id, kind }]); };
      if (r < 0.4) { for (let i = 0; i < 5; i++) add("coin", W + 40 + i * 22 * unit * 0.9, 18 * unit + Math.sin((i / 4) * Math.PI) * 54 * unit); }
      else if (r < 0.8) add("goomba", W + 40, 0, { vx: -vWorld * 0.25 });
      else { add("goomba", W + 40, 0, { vx: -vWorld * 0.25 }); for (let i = 0; i < 3; i++) add("coin", W + 40 + (i + 4) * 22 * unit, 20 * unit + i * 8 * unit); }
    }

    // entitas
    let dirty = false;
    for (const e of m.ents) {
      if (e.dead && e.kind !== "goomba") continue;
      const vx = (e.kind === "fire" ? 0 : -vWorld) + (e.vx || 0);
      if (e.kind === "fire") { e.x += e.vx * dt; e.vy -= G_ * 0.55 * dt; e.y += e.vy * dt; if (e.y <= 0) { e.y = 0; e.vy = 330 * (unit / 4); } if (e.x > W + 40) e.gone = true; }
      else e.x += vx * dt;
      if (e.kind === "goomba" && e.dead) { e.x -= vWorld * 0 ; e.t = (e.t || 0) + dt; if (e.t > 0.5) e.gone = true; }
      if (e.x < -120) e.gone = true;
      if (e.el) {
        if (e.kind === "goomba" && e.dead && e.star) e.el.style.transform = `translate3d(${e.x}px,${-(e.y + 60 * e.t * unit)}px,0) rotate(${e.t * 600}deg)`;
        else e.el.style.transform = `translate3d(${e.x}px,${-e.y}px,0)`;
      }
      if (e.dead || e.gone) { if (e.gone) dirty = true; continue; }
      // tabrakan dengan hero
      const hxL = hx + 3 * unit, hxR = hx + 13 * unit;
      if (e.kind === "coin") {
        if (e.x < hxR && e.x + e.w > hxL && e.y < m.y + hh && e.y + e.h > m.y) {
          e.dead = true; e.gone = true; dirty = true;
          const up1 = addCoins(1); sfx("coin", { throttle: 30 });
          m.score += 10; setScore(m.score);
          if (up1) { sfx("oneup"); toast("1UP! 100 koin terkumpul", { sprite: "mushroom" }); }
          e.el && floatText(e.el.getBoundingClientRect().left + 12, e.el.getBoundingClientRect().top, "+1");
        }
      } else if (e.kind === "goomba") {
        const over = e.x + 2 * unit < hxR && e.x + 14 * unit > hxL && m.y < 14 * unit;
        if (over) {
          if (m.star > 0) { kill(m, e); e.star = true; sfx("kick"); m.score += 200; setScore(m.score); }
          else if (m.vy < 0 && m.y > 6 * unit) { kill(m, e); m.vy = V0 * 0.62; m.holding = false; setAir(true); sfx("stomp"); m.score += 100; setScore(m.score); const r = e.el?.getBoundingClientRect(); r && floatText(r.left + 20, r.top - 6, "+100"); }
          else if (m.hurt <= 0) {
            m.hurt = 1.3; setHurt(true); m.vy = V0 * 0.55; m.holding = false; setAir(true); sfx("bump");
            kill(m, e); e.star = true;
            if (m.form > 0) { setForm(m.form - 1); toast(m.form === 2 ? "Kembali ke Big form" : "Kembali ke Small form", { sprite: "goomba" }); }
          }
        }
      } else if (e.kind === "fire") {
        for (const g of m.ents) {
          if (g.kind !== "goomba" || g.dead || g.gone) continue;
          if (e.x < g.x + 14 * unit && e.x + e.w > g.x + 2 * unit && e.y < 14 * unit) { kill(m, g); g.star = true; e.gone = true; dirty = true; sfx("kick"); m.score += 150; setScore(m.score); }
        }
      }
    }
    if (dirty) {
      const goneIds = new Set(m.ents.filter((e) => e.gone).map((e) => e.id));
      m.ents = m.ents.filter((e) => !e.gone);
      setList((l) => l.filter((x) => !goneIds.has(x.id)));
    }
  }, !reduced && visible && !paused);

  const hitBlock = (e) => {
    e.stopPropagation();
    const m = w.current;
    setBumped((n) => n + 1);
    sfx("bump");
    const r = Math.random();
    const { x, y } = centerOf(blockEl.current);
    if (r < 0.55) {
      const up1 = addCoins(1); sfx("coin"); floatText(x, y - 40, "+1"); m.score += 10; setScore(m.score);
      if (up1) toast("1UP! 100 koin terkumpul", { sprite: "mushroom" });
      setItem({ k: "coin", n: Date.now() });
    } else {
      const kind = r < 0.7 ? (m.form === 0 ? "mushroom" : "flower") : r < 0.85 ? "flower" : "star";
      setItem({ k: kind, n: Date.now() });
      setTimeout(() => {
        sfx("powerup");
        if (kind === "mushroom") setForm(Math.max(1, w.current.form));
        else if (kind === "flower") setForm(2);
        else { w.current.star = 9; setStar(true); toast("Star! Tak terkalahkan 9 detik", { sprite: "star" }); }
      }, 420);
      sfx("powerup_appear");
    }
    setTimeout(() => setItem(null), 900);
  };

  const heroName = air ? HERO.jump[form] : HERO.run[form];

  return (
    <div className="runner" ref={wrapRef}>
      <div className="runner-hud" aria-live="off">
        <span>SKOR {String(score).padStart(5, "0")}</span>
        <span className="runner-form">{FORMS[form].toUpperCase()}{star ? " ★" : ""}</span>
      </div>
      <div
        className="stage sc"
        ref={stage}
        style={{ "--sc": s, "--msc": 3, "--rows": 2 }}
        onPointerDown={(e) => { if (e.target.closest("button")) return; jump(); }}
        onPointerUp={release}
        onPointerCancel={release}
        role="presentation"
      >
        <div className="stage-lane">
          <button className={`qblock ${bumped ? "hit" : ""}`} key={bumped} ref={blockEl} aria-label="Sundul blok tanda tanya" onClick={hitBlock} onPointerDown={(e) => e.stopPropagation()}>
            <Tile index={11} anim={3} scale={s} mscale={3} />
          </button>
          {item && <span className="qitem" key={item.n}><Sprite name={item.k === "coin" ? "coin" : item.k} scale={s} mscale={3} /></span>}
          {list.map((e) => (
            <span key={e.id} className={`ent ent-${e.kind}`} ref={(el) => { const o = w.current.ents.find((x) => x.id === e.id); if (o) { o.el = el; if (el) el.style.transform = `translate3d(${o.x}px,${-o.y}px,0)`; } }}>
              {e.kind === "coin" && <Sprite name="coin" scale={s} mscale={3} />}
              {e.kind === "goomba" && (<><span className="n"><Sprite name="goomba" scale={s} mscale={3} /></span><span className="f"><Sprite name="goombaFlat" scale={s} mscale={3} /></span></>)}
              {e.kind === "fire" && <Sprite name="fireball" scale={s} mscale={3} />}
            </span>
          ))}
          <span className={`rhero ${star ? "star" : ""} ${hurt ? "hurt" : ""}`} ref={heroEl}>
            <Sprite def={null} name={heroName} scale={s} mscale={3} still={air} />
          </span>
        </div>
      </div>
      <Ground theme="grass" rows={2} scale={s} mscale={3} run={!reduced && visible} speed={(16 * s) / vWorld} />
      {form === 2 && <button className="fire-btn" onClick={shoot} aria-label="Tembak api (X)"><Sprite name="fireball" scale={3} /></button>}
    </div>
  );
}
