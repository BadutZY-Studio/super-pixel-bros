import { useEffect, useRef, useState } from "react";
import { MUSIC, SFX, ASSET_SPRITES, SPRITES, THEME_ORDER, G } from "../lib/data.js";
import { sfx, playMusic, stopMusic, useTrack } from "../lib/sound.js";
import { useFrame } from "../lib/hooks.js";
import { Btn, Panel } from "./Ui.jsx";
import { Sprite, Tile } from "./Sprite.jsx";
import { Icon } from "./Icons.jsx";

/** Jump Lab: tahan tombol = lompat lebih tinggi (variable jump) — fisika yang sama dengan game. */
export function JumpLab() {
  const [y, setY] = useState(0);
  const [air, setAir] = useState(false);
  const [best, setBest] = useState(0);
  const m = useRef({ y: 0, vy: 0, hold: false, peak: 0 });
  const el = useRef(null);
  const g = 2600, v0 = 560;

  const press = () => { if (m.current.y <= 0.5) { m.current.vy = v0; m.current.hold = true; m.current.peak = 0; setAir(true); sfx("jump"); } };
  const release = () => { m.current.hold = false; if (m.current.vy > v0 * 0.4) m.current.vy = v0 * 0.4; };

  useFrame((dt) => {
    const s = m.current;
    if (s.y > 0 || s.vy > 0) {
      s.vy -= g * dt * (s.hold && s.vy > 0 ? 0.6 : 1);
      s.y = Math.max(0, s.y + s.vy * dt);
      s.peak = Math.max(s.peak, s.y);
      if (s.y === 0) { s.vy = 0; s.hold = false; setAir(false); setBest(Math.round(s.peak)); }
    }
    if (el.current) el.current.style.transform = `translate3d(0,${-s.y}px,0)`;
  });

  useEffect(() => {
    const down = (e) => { if (e.code === "Space" && e.target === document.getElementById("jumplab-btn")) { e.preventDefault(); if (!e.repeat) press(); } };
    const up = (e) => { if (e.code === "Space") release(); };
    addEventListener("keydown", down); addEventListener("keyup", up);
    return () => { removeEventListener("keydown", down); removeEventListener("keyup", up); };
  }, []);

  return (
    <Panel className="lab jumplab">
      <div className="jumplab-stage">
        <div className="jumplab-rule" style={{ bottom: 16 * 3 + 100 }}><span>tinggi</span></div>
        <div className="jumplab-hero" ref={el}><Sprite name={air ? "heroBigJump" : "heroBig"} scale={4} still /></div>
        <div className="jumplab-ground">{Array.from({ length: 14 }).map((_, i) => <Tile key={i} index={0} scale={3} mscale={2} />)}</div>
      </div>
      <button
        id="jumplab-btn" className="jumplab-btn"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press(); }}
        onPointerUp={release} onPointerCancel={release}
      >
        <Icon name="arrow" size={14} className="rot-up" /> TAHAN UNTUK LOMPAT TINGGI
      </button>
      <p className="lab-note">Ketuk cepat = lompatan pendek · tahan = lompatan penuh. {best > 0 && <b className="gold">Terakhir: {best}px</b>}</p>
    </Panel>
  );
}

/** Sound Lab: semua 21 efek suara + 8 lagu dari game. */
export function SoundLab() {
  const track = useTrack();
  const [pressed, setPressed] = useState("");
  return (
    <div className="grid g2 soundlab">
      <Panel>
        <h3><Icon name="volume" size={14} /> 21 Efek Suara</h3>
        <div className="sfx-grid">
          {SFX.map(([id, label]) => (
            <button key={id} className={`sfx-btn ${pressed === id ? "on" : ""}`} onClick={() => { sfx(id, { force: true, throttle: 0 }); setPressed(id); setTimeout(() => setPressed(""), 260); }}>
              <i /> {label}
            </button>
          ))}
        </div>
      </Panel>
      <Panel>
        <h3><Icon name="play" size={14} /> 8 Lagu Chiptune</h3>
        <ul className="jukebox">
          {MUSIC.map((t) => {
            const on = track === t.id;
            return (
              <li key={t.id}>
                <button className={`jb ${on ? "on" : ""}`} onClick={() => (on ? stopMusic() : playMusic(t.id))} aria-pressed={on}>
                  <span className="jb-ico"><Icon name={on ? "stop" : "play"} size={12} /></span>
                  <span className="jb-t"><b>{t.label}</b><small>{t.where}</small></span>
                  <span className="eq" data-on={on || undefined} aria-hidden="true"><i /><i /><i /><i /></span>
                </button>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

/** Museum Aset: semua sprite, tile & latar dari folder aset game. */
export function AssetMuseum() {
  const [tab, setTab] = useState("sprite");
  return (
    <div>
      <div className="tabs">
        {[["sprite", `Sprite (${ASSET_SPRITES.length})`], ["tile", "Tileset (9)"], ["bg", "Latar (23)"]].map(([k, l]) => (
          <Btn key={k} variant="ghost" size="sm" aria-pressed={tab === k} onClick={() => setTab(k)}>{l}</Btn>
        ))}
      </div>
      {tab === "sprite" && (
        <div className="museum museum-sprites" key="s">
          {ASSET_SPRITES.map(([k, file], i) => (
            <div key={file} className="museum-i" style={{ "--i": i }}>
              <div className="museum-art"><Sprite name={k} scale={SPRITES[k].fw >= 48 ? 1 : SPRITES[k].fh >= 32 ? 2 : 3} /></div>
              <span>{file}</span>
            </div>
          ))}
        </div>
      )}
      {tab === "tile" && (
        <div className="museum museum-tiles" key="t">
          {THEME_ORDER.map((t, i) => (
            <div key={t} className="museum-tile" style={{ "--i": i }}>
              <div className="museum-strip"><img className="atlas" src={`${G}/tiles/tiles_${t}.png`} alt="" /></div>
              <span>tiles_{t}</span>
            </div>
          ))}
        </div>
      )}
      {tab === "bg" && (
        <div className="museum museum-bgs" key="b">
          {THEME_ORDER.map((t, i) => (
            <div key={t} className="museum-bg" style={{ "--i": i }}>
              <div className="bg-stack"><img src={`${G}/bg/bg_${t}_far.png`} alt="" /><img src={`${G}/bg/bg_${t}_near.png`} alt="" /></div>
              <span>bg_{t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
