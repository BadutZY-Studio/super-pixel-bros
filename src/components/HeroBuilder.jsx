import { useEffect, useMemo, useRef, useState } from "react";
import { SLOTS, SLOT_NAMES, REMOVABLE, items, inSlot, byId, defaultLoadout, frameCanvas, frameHeight, FRAME_W, makeTrailParticle, drawTrailParticle, thumbUrl, coinIconUrl, loadoutPrice, noneIconUrl } from "../lib/cosmetics.js";
import { useFrame, useReducedMotion } from "../lib/hooks.js";
import { sfx } from "../lib/sound.js";
import { Btn, Panel } from "./Ui.jsx";
import { Sprite } from "./Sprite.jsx";
import { Icon } from "./Icons.jsx";

const LW = 112, LH = 96, GROUND = 84;
const POSE_SEQ = [["idle", 1.3], ["run", 2.4], ["jump", 0.95]];

function Stage({ lo, form, pose }) {
  const cv = useRef(null);
  const st = useRef({ t: 0, parts: [], acc: 0, n: 0 });
  const reduced = useReducedMotion();

  useFrame((dt) => {
    const c = cv.current;
    if (!c) return;
    const s = st.current;
    s.t += dt;
    let p = pose, local = s.t;
    if (pose === "auto") {
      const total = POSE_SEQ.reduce((a, b) => a + b[1], 0);
      let t = s.t % total;
      for (const [name, d] of POSE_SEQ) { if (t < d) { p = name; local = t; break; } t -= d; }
    }
    let frame = "idle", lift = 0;
    if (p === "run") frame = `run${(Math.floor(local * 9) % 3) + 1}`;
    else if (p === "jump") { frame = "jump"; lift = Math.sin(Math.min(1, local / 0.95) * Math.PI) * 30; }
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    g.clearRect(0, 0, LW, LH);
    const fc = frameCanvas(lo, form, frame);
    const x0 = Math.round((LW - FRAME_W) / 2) - 4;
    const feetY = GROUND - Math.round(lift);
    // trail
    const trail = byId(lo.trail);
    if (trail && p !== "idle") {
      s.acc += dt;
      if (s.acc >= trail.rate) { s.acc = 0; s.parts.push(makeTrailParticle(trail, { x: x0 + 8 + 8 - 4, y: feetY }, 1, s.n++, 1)); }
    }
    s.parts = s.parts.filter((q) => drawTrailParticle(g, q, dt));
    g.drawImage(fc, x0, feetY - frameHeight(form) + (form ? 0 : 0));
  }, !reduced);

  useEffect(() => { // frame statis untuk reduced-motion
    if (!reduced) return;
    const c = cv.current, g = c.getContext("2d");
    g.imageSmoothingEnabled = false; g.clearRect(0, 0, LW, LH);
    g.drawImage(frameCanvas(lo, form, "idle"), Math.round((LW - FRAME_W) / 2) - 4, GROUND - frameHeight(form));
  }, [reduced, lo, form]);

  return <canvas ref={cv} width={LW} height={LH} className="hb-cv" aria-label="Pratinjau hero dengan kosmetik terpilih" role="img" />;
}

export function HeroBuilder() {
  const [lo, setLo] = useState(defaultLoadout);
  const [form, setForm] = useState(0);
  const [pose, setPose] = useState("auto");
  const [slot, setSlot] = useState("skin");
  const list = useMemo(() => inSlot(slot), [slot]);
  const total = loadoutPrice(lo);
  const equipped = SLOTS.map((s) => byId(lo[s])).filter(Boolean);

  const equip = (it) => {
    setLo((o) => {
      const on = o[it.slot] === it.id;
      return { ...o, [it.slot]: on && REMOVABLE.includes(it.slot) ? "" : it.id };
    });
    sfx("select");
  };
  const none = () => { setLo((o) => ({ ...o, [slot]: "" })); sfx("click"); };
  const randomize = () => {
    const nl = { ...defaultLoadout() };
    for (const s of SLOTS) {
      const l = inSlot(s);
      if (REMOVABLE.includes(s) && Math.random() < 0.3) continue;
      nl[s] = l[Math.floor(Math.random() * l.length)].id;
    }
    setLo(nl); sfx("powerup");
  };
  const reset = () => { setLo(defaultLoadout()); sfx("click"); };

  return (
    <div className="hb">
      <Panel className="hb-view">
        <div className="hb-stage">
          <div className="hb-sky" />
          <Stage lo={lo} form={form} pose={pose} />
          <div className="hb-ground" />
        </div>
        <div className="hb-ctrl">
          <div className="hb-row" style={{ "--c": 3 }}>
            <span className="hb-l">Bentuk</span>
            {["Small", "Big", "Fire"].map((n, i) => <Btn key={n} variant="ghost" size="sm" aria-pressed={form === i} sound="select" onClick={() => setForm(i)}>{n}</Btn>)}
          </div>
          <div className="hb-row" style={{ "--c": 4 }}>
            <span className="hb-l">Pose</span>
            {[["auto", "Auto"], ["idle", "Diam"], ["run", "Lari"], ["jump", "Lompat"]].map(([k, n]) => <Btn key={k} variant="ghost" size="sm" aria-pressed={pose === k} sound="select" onClick={() => setPose(k)}>{n}</Btn>)}
          </div>
          <div className="hb-row" style={{ "--c": 2 }}>
            <Btn variant="red" size="sm" onClick={randomize}><Icon name="star" size={12} />Acak</Btn>
            <Btn variant="ghost" size="sm" onClick={reset}>Reset</Btn>
          </div>
        </div>
        <div className="hb-sum">
          <ul>{equipped.length ? equipped.map((e) => <li key={e.id}>{e.name}</li>) : <li>CLASSIC</li>}</ul>
          <div className="hb-total"><img src={coinIconUrl()} alt="" width="16" height="16" /> <b>{total}</b><small>total harga set</small></div>
        </div>
      </Panel>

      <div className="hb-shop">
        <div className="tabs hb-tabs">
          {SLOTS.map((s) => <Btn key={s} variant="ghost" size="sm" sound="select" aria-pressed={slot === s} onClick={() => setSlot(s)}>{SLOT_NAMES[s]} <small className="hb-n">{inSlot(s).length}</small></Btn>)}
        </div>
        <div className="hb-grid" key={slot}>
          {REMOVABLE.includes(slot) && (
            <button className={`it ${!lo[slot] ? "on" : ""}`} style={{ "--i": 0 }} onClick={none}>
              <span className="it-art"><img src={noneIconUrl()} alt="" /></span><b>TANPA</b><span className="it-p">—</span>
            </button>
          )}
          {list.map((it, i) => (
            <button key={it.id} className={`it ${lo[slot] === it.id ? "on" : ""}`} style={{ "--i": i + 1 }} onClick={() => equip(it)} aria-pressed={lo[slot] === it.id} title={it.desc}>
              <span className="it-art"><img src={thumbUrl(it)} alt="" /></span>
              <b>{it.name}</b>
              <span className="it-p">{it.price ? <><img src={coinIconUrl()} alt="" width="12" height="12" />{it.price}</> : "GRATIS"}</span>
              <small>{it.desc}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
