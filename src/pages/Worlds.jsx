import { useRef, useState } from "react";
import { LEVELS, THEMES, THEME_ORDER, DECOR_KEY } from "../lib/data.js";
import { PageHero } from "../components/Chrome.jsx";
import { Section, Panel, Reveal, Btn } from "../components/Ui.jsx";
import { Sprite, Tile } from "../components/Sprite.jsx";
import { ThemeBackdrop, Ground, Decor, Particles } from "../components/Scene.jsx";
import { LevelExplorer } from "../components/LevelExplorer.jsx";
import { Icon } from "../components/Icons.jsx";
import { playMusic, stopMusic, useTrack, sfx } from "../lib/sound.js";

function WorldScene({ theme }) {
  const t = THEMES[theme];
  const sky = t.sdecor.map((k, i) => ({ key: DECOR_KEY[k], x: 12 + i * 34, y: 10 + i * 12 }));
  return (
    <div className="wscene" data-theme={theme} key={theme}>
      <ThemeBackdrop theme={theme} farSpeed={50} nearSpeed={24} />
      {sky.map((c, i) => <span key={i} className="wcloud" style={{ left: `${c.x}%`, top: `${c.y}%`, animationDelay: `${-i * 9}s` }}><Sprite name={c.key} scale={3} mscale={2} /></span>)}
      <Particles kind={t.fxKind} />
      <Decor theme={theme} scale={4} mscale={3} count={7} seed={theme.length * 3} />
      <div className="wblocks" aria-hidden="true">
        <Tile theme={theme} index={2} scale={4} mscale={3} /><Tile theme={theme} index={11} anim={3} scale={4} mscale={3} /><Tile theme={theme} index={2} scale={4} mscale={3} />
      </div>
      <div className={`wrunner ${t.grav < 1 ? "lowg" : ""}`}><Sprite name="heroSmallRun" scale={4} mscale={3} /></div>
      <Ground theme={theme} rows={2} scale={4} mscale={3} run speed={0.5} />
    </div>
  );
}

export default function Worlds() {
  const [theme, setTheme] = useState("grass");
  const [chapter, setChapter] = useState(0);
  const [idx, setIdx] = useState(0);
  const track = useTrack();
  const t = THEMES[theme];
  const explorer = useRef(null);
  const levels = LEVELS.slice(chapter * 10, chapter * 10 + 10);

  return (
    <>
      <PageHero title="20 Level di 9 Dunia Berbeda" theme="desert" sprite="palm">Setiap dunia punya tileset, latar parallax, efek cuaca, dan lagu chiptune sendiri.</PageHero>

      <Section title="Pratinjau Dunia" sprite="cloudS" lead="Pilih dunia — lihat langsung tile, dekorasi, dan suasananya.">
        <div className="tabs">
          {THEME_ORDER.map((k) => (
            <Btn key={k} variant="ghost" size="sm" aria-pressed={k === theme} sound="select" onClick={() => { setTheme(k); if (track) playMusic(THEMES[k].music); }}>{THEMES[k].label}</Btn>
          ))}
        </div>
        <Reveal variant="pop">
          <div className="pframe wframe">
            <WorldScene theme={theme} />
            <div className="winfo" key={`i-${theme}`}>
              <h3>{t.label.toUpperCase()}</h3>
              <p>{t.desc}</p>
              <p className="winfo-m">Efek: {t.fx} · Gravitasi {Math.round(t.grav * 100)}%</p>
              <Btn variant="red" size="sm" onClick={() => (track === t.music ? stopMusic() : playMusic(t.music))}>
                <Icon name={track === t.music ? "stop" : "play"} size={12} />{track === t.music ? "Stop" : "Putar Musik"}
              </Btn>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section title="Penjelajah Level" sprite="flag" lead="Peta ini digambar langsung dari data level asli game — tile, musuh, koin, pipa, dan checkpoint di posisi sebenarnya.">
        <div ref={explorer}>
          <Reveal variant="pop"><div className="pframe"><LevelExplorer index={idx} onIndex={setIdx} /></div></Reveal>
        </div>
      </Section>

      <Section title="Daftar Level" sprite="castle">
        <div className="tabs">
          {["Chapter 1", "Chapter 2"].map((c, i) => <Btn key={c} variant="ghost" size="sm" aria-pressed={chapter === i} onClick={() => setChapter(i)}>{c}</Btn>)}
        </div>
        <div className="lvgrid" key={chapter}>
          {levels.map((l, i) => (
            <button key={l.n} className={`lvcard ${idx === l.n - 1 ? "on" : ""}`} style={{ "--i": i }} onClick={() => { setIdx(l.n - 1); sfx("pipe"); explorer.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>
              <span className="lvcard-art"><ThemeBackdrop theme={l.theme} animate={false} /></span>
              <span className="lvcard-b">
                <small>WORLD {Math.floor((l.n - 1) / 5) + 1}-{((l.n - 1) % 5) + 1}</small>
                <b>{l.name}</b>
                <span className="lvcard-m"><Icon name="clock" size={12} /> {l.time}s · {THEMES[l.theme].label}</span>
              </span>
            </button>
          ))}
        </div>
        <Panel className="note"><p>Chapter 2 terbuka setelah menyelesaikan level 10. Di layar pilih level, gunakan tombol <b className="gold">Q / E</b> atau <b className="gold">LB / RB</b> untuk berpindah chapter.</p></Panel>
      </Section>
    </>
  );
}
