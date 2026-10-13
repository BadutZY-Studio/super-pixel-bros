import { useEffect, useRef, useState } from "react";
import { POWERUPS } from "../lib/data.js";
import { PageHero } from "../components/Chrome.jsx";
import { Section, Panel, Reveal, Btn } from "../components/Ui.jsx";
import { Sprite } from "../components/Sprite.jsx";
import { Ground, ThemeBackdrop } from "../components/Scene.jsx";
import { QBlockDemo, BrickDemo, PipeDemo, SpringDemo, MovingDemo, FallDemo, CheckpointDemo, FlagDemo } from "../components/Demos.jsx";
import { sfx } from "../lib/sound.js";
import { floatText, centerOf } from "../lib/fx.js";

const FORM_NAME = ["SMALL", "BIG", "FIRE"];
const HERO = [["heroSmall", "heroSmallJump"], ["heroBig", "heroBigJump"], ["heroFire", "heroFireJump"]];

function EvoDemo() {
  const [form, setForm] = useState(0);
  const [star, setStar] = useState(0);
  const [pop, setPop] = useState(0);
  const [fires, setFires] = useState([]);
  const heroRef = useRef(null);
  const timer = useRef(0);
  useEffect(() => () => clearInterval(timer.current), []);

  const to = (f, snd = "powerup") => { setForm(f); setPop((p) => p + 1); sfx(snd); };
  const startStar = () => {
    sfx("powerup"); setStar(9); setPop((p) => p + 1);
    clearInterval(timer.current);
    timer.current = setInterval(() => setStar((s) => { if (s <= 1) { clearInterval(timer.current); return 0; } return s - 1; }), 1000);
  };
  const shoot = () => {
    if (form !== 2) return;
    sfx("fireball"); const id = Date.now() + Math.random(); setFires((f) => [...f, id]); setTimeout(() => setFires((f) => f.filter((x) => x !== id)), 1100);
  };
  const hurt = () => {
    sfx("bump");
    if (star) { floatText(...Object.values(centerOf(heroRef.current)), "KEBAL!"); return; }
    if (form > 0) setForm(form - 1);
    else floatText(...Object.values(centerOf(heroRef.current)), "Aduh!");
    setPop((p) => p + 1);
  };
  const reset = () => { clearInterval(timer.current); setStar(0); setForm(0); setPop((p) => p + 1); sfx("click"); };

  return (
    <Panel className="evo">
      <div className="evo-stage sc" style={{ "--sc": 4, "--msc": 3 }}>
        <ThemeBackdrop theme="night" animate={false} />
        <div className="evo-hud"><span>{FORM_NAME[form]}</span>{star > 0 && <span className="evo-star">★ {star}s</span>}</div>
        <div className={`evo-hero ${star ? "star" : ""}`} ref={heroRef} key={pop}><Sprite name={HERO[form][0]} scale={4} mscale={3} still /></div>
        {fires.map((id) => <span key={id} className="evo-fire"><Sprite name="fireball" scale={4} mscale={3} /></span>)}
        {star > 0 && <div className="evo-bar"><i style={{ transform: `scaleX(${star / 9})` }} /></div>}
        <Ground theme="night" rows={2} scale={4} mscale={3} />
      </div>
      <div className="evo-btns">
        <Btn variant="red" size="sm" onClick={() => to(Math.max(1, form), "powerup")}><Sprite name="mushroom" scale={1} />Mushroom</Btn>
        <Btn variant="gold" size="sm" onClick={() => to(2)}><Sprite name="flower" scale={1} />Fire Flower</Btn>
        <Btn variant="pipe" size="sm" onClick={startStar}><Sprite name="star" scale={1} />Star</Btn>
        <Btn variant="ghost" size="sm" onClick={hurt}><Sprite name="goomba" scale={1} />Kena Musuh</Btn>
        <Btn variant="night" size="sm" onClick={shoot} aria-disabled={form !== 2} className={form !== 2 ? "is-locked" : ""}><Sprite name="fireball" scale={1} />Tembak</Btn>
        <Btn variant="ghost" size="sm" onClick={reset}>Reset</Btn>
      </div>
    </Panel>
  );
}

export default function PowerUps() {
  return (
    <>
      <PageHero title="Power-Up dan Item" theme="night" sprite="flower">Ambil power-up untuk tumbuh, menyalakan api, atau menjadi tak terkalahkan.</PageHero>

      <Section title="Evolusi Hero" sprite="mushroom" lead="Ambil item, tembak api, atau kena musuh — lihat bagaimana bentuk hero berubah.">
        <div className="split split-evo">
          <Reveal variant="left"><EvoDemo /></Reveal>
          <div className="grid g2 pu-grid">
            {POWERUPS.map((p, i) => (
              <Reveal key={p.name} variant="pop" delay={i * 80}>
                <Panel interactive className="pu">
                  <div className="pu-art"><Sprite name={p.sprite} scale={4} mscale={3} /></div>
                  <h3>{p.name}</h3><p>{p.desc}</p>
                </Panel>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Blok & Objek Interaktif" sprite="pipeArrow" lead="Delapan objek yang kamu temui di level — klik untuk mencoba tiap-tiapnya.">
        <div className="grid g4 demos">
          {[QBlockDemo, BrickDemo, PipeDemo, SpringDemo, MovingDemo, FallDemo, CheckpointDemo, FlagDemo].map((D, i) => (
            <Reveal key={i} variant="pop" delay={(i % 4) * 80}><D /></Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
