import { useEffect, useRef, useState } from "react";
import { ENEMIES, HAZARDS } from "../lib/data.js";
import { PageHero } from "../components/Chrome.jsx";
import { Section, Panel, Reveal, Btn, Badge } from "../components/Ui.jsx";
import { Sprite, Tile } from "../components/Sprite.jsx";
import { Ground, ThemeBackdrop } from "../components/Scene.jsx";
import { Icon } from "../components/Icons.jsx";
import { sfx } from "../lib/sound.js";
import { floatText } from "../lib/fx.js";

const GY = 2 * 16 * 4;

/** Arena: tiap musuh punya perilaku & aksi sendiri. Semua animasi = CSS transform. */
function Arena({ enemy }) {
  const [st, setSt] = useState("idle"); // idle | squash | shell | kick | fire | dead
  const [n, setN] = useState(0);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => { setSt("idle"); return () => timers.current.forEach(clearTimeout); }, [enemy.id]);
  const act = (next, snd, ms, score) => { sfx(snd); setSt(next); setN((x) => x + 1); if (score) floatText(window.innerWidth / 2, window.innerHeight / 2, score); if (ms) later(() => setSt("idle"), ms); };

  const actions = {
    goomba: [["Injak", "stomp", "squash", 1300], ["Tembak Api", "fireball", "fire", 1300]],
    koopa: st === "shell" ? [["Tendang", "kick", "kick", 2200]] : [["Injak", "stomp", "shell", 0], ["Tembak Api", "fireball", "fire", 1300]],
    piranha: [["Tembak Api", "fireball", "fire", 1800]],
    bat: [["Injak", "stomp", "fire", 1600], ["Tembak Api", "fireball", "fire", 1600]],
    crusher: [["Coba Injak", "bump", "bump", 700]],
  }[enemy.id];

  return (
    <Panel className="arena">
      <div className="arena-stage sc" style={{ "--sc": 4, "--msc": 3 }}>
        <ThemeBackdrop theme={enemy.chapter === 2 ? "cave" : "grass"} animate={false} key={enemy.chapter} />
        <div className="arena-fx" key={n}>
          {enemy.id === "goomba" && (
            <div className={`ar ar-patrol ${st === "squash" ? "stop" : ""} ${st === "fire" ? "fly" : ""}`}>
              <Sprite name={st === "squash" ? "goombaFlat" : "goomba"} scale={4} mscale={3} />
            </div>
          )}
          {enemy.id === "koopa" && (
            <div className={`ar ${st === "kick" ? "ar-kick" : st === "shell" ? "stop" : st === "fire" ? "fly" : "ar-patrol-flip"}`}>
              <Sprite name={st === "kick" ? "shell" : st === "shell" ? "shellStill" : "koopa"} scale={4} mscale={3} />
            </div>
          )}
          {enemy.id === "piranha" && (
            <>
              <div className={`ar ar-pir ${st === "fire" ? "gone" : ""}`}><Sprite name="piranha" scale={4} mscale={3} /></div>
              <div className="ar-pipe"><span><Tile index={5} scale={4} mscale={3} /><Tile index={6} scale={4} mscale={3} /></span><span><Tile index={7} scale={4} mscale={3} /><Tile index={8} scale={4} mscale={3} /></span></div>
            </>
          )}
          {enemy.id === "bat" && (
            <div className={`ar ar-bat ${st === "fire" ? "fall" : ""}`}><Sprite name={st === "fire" ? "batHang" : "bat"} scale={4} mscale={3} /></div>
          )}
          {enemy.id === "crusher" && (
            <div className={`ar ar-crush ${st === "bump" ? "ouch" : ""}`}>
              <span className="c-calm"><Sprite name="crusher" scale={4} mscale={3} /></span>
              <span className="c-angry"><Sprite name="crusherAngry" scale={4} mscale={3} /></span>
            </div>
          )}
          {st === "fire" && enemy.id !== "bat" && <span className="ar-fire"><Sprite name="fireball" scale={4} mscale={3} /></span>}
        </div>
        <div className="arena-hero"><Sprite name="heroFireRun" scale={4} mscale={3} paused /></div>
        <Ground theme={enemy.chapter === 2 ? "cave" : "grass"} rows={2} scale={4} mscale={3} />
      </div>
      <div className="arena-info">
        <div className="arena-head"><h3>{enemy.name}</h3><Badge tone={enemy.chapter === 2 ? "red" : "green"}>Chapter {enemy.chapter}</Badge></div>
        <p>{enemy.desc}</p>
        <p className="arena-how"><Icon name="check" size={14} /> {enemy.how}</p>
        <div className="arena-btns">
          {actions.map(([l, snd, next, ms]) => <Btn key={l} variant="red" size="sm" onClick={() => act(next, snd, ms)}>{l}</Btn>)}
          {(st === "shell" || st === "kick") && <Btn variant="ghost" size="sm" onClick={() => { setSt("idle"); setN((x) => x + 1); }}>Reset</Btn>}
        </div>
      </div>
    </Panel>
  );
}

function Hazard({ id }) {
  const [on, setOn] = useState(0);
  const poke = () => { setOn((x) => x + 1); if (id === "time") sfx("hurry", { force: false }); else if (id === "lava") sfx("die"); else if (id === "spike") sfx("bump"); };
  const art = {
    spike: <div className="hz-row"><Tile theme="castle" index={14} scale={3} /><Tile theme="castle" index={14} scale={3} /><Tile theme="castle" index={14} scale={3} /><span className="hz-hero hz-ouch" key={on}><Sprite name="heroSmallJump" scale={3} still /></span></div>,
    lava: <div className="hz-lava"><span className="lava-in"><Tile theme="castle" index={9} scale={3} /><Tile theme="castle" index={9} scale={3} /><Tile theme="castle" index={9} scale={3} /><Tile theme="castle" index={9} scale={3} /><Tile theme="castle" index={9} scale={3} /><Tile theme="castle" index={9} scale={3} /><Tile theme="castle" index={9} scale={3} /><Tile theme="castle" index={9} scale={3} /></span><span className="hz-hero hz-sink" key={on}><Sprite name="heroSmallJump" scale={3} still /></span></div>,
    pit: <div className="hz-pit"><span className="pit-g"><Tile index={0} scale={3} /><Tile index={0} scale={3} /></span><span className="pit-g"><Tile index={0} scale={3} /><Tile index={0} scale={3} /></span><span className="hz-hero hz-fall" key={on}><Sprite name="heroSmallJump" scale={3} still /></span></div>,
    firebar: <div className="hz-fire"><Tile theme="castle" index={3} scale={3} /><span className="firebar-d"><i>{[1, 2, 3, 4, 5].map((n) => <b key={n} style={{ left: n * 21 }}><Sprite name="fireball" scale={3} /></b>)}</i></span></div>,
    ice: <div className="hz-ice"><span className="ice-row">{Array.from({ length: 6 }).map((_, i) => <Tile key={i} theme="snow" index={0} scale={3} />)}</span><span className="hz-hero hz-slide" key={on}><Sprite name="heroSmallSkid" scale={3} still /></span></div>,
    time: <div className="hz-time"><Icon name="clock" size={34} /><span className="tbar"><i key={on} /></span></div>,
  }[id];
  return (
    <button className="hz" onClick={poke} aria-label={`Coba rintangan ${id}`}>
      <span className="hz-art">{art}</span>
    </button>
  );
}

export default function Enemies() {
  const [sel, setSel] = useState(0);
  const e = ENEMIES[sel];
  return (
    <>
      <PageHero title="Musuh dan Rintangan" theme="cave" sprite="goomba">Kenali pola tiap musuh — injak, tembak, atau hindari.</PageHero>

      <Section title="Arena Latihan" sprite="goomba" lead="Pilih musuh, lalu coba tiap aksi dan lihat hasilnya.">
        <div className="enemy-tabs">
          {ENEMIES.map((x, i) => (
            <button key={x.id} className={`etab ${sel === i ? "on" : ""}`} onClick={() => { setSel(i); sfx("select"); }} aria-pressed={sel === i}>
              <Sprite name={x.sprite} scale={2} still /><span>{x.name}</span>
            </button>
          ))}
        </div>
        <Reveal variant="pop"><Arena enemy={e} key={e.id} /></Reveal>
      </Section>

      <Section title="Rintangan & Bahaya" sprite="torch" lead="Tidak semua bahaya berupa musuh. Klik tiap kartu untuk melihat apa yang terjadi.">
        <div className="grid g3">
          {HAZARDS.map((h, i) => (
            <Reveal key={h.id} variant="pop" delay={(i % 3) * 90}>
              <Panel className="hzc"><Hazard id={h.id} /><h3>{h.name}</h3><p>{h.desc}</p></Panel>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
