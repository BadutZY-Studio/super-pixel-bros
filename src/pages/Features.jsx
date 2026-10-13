import { MOVEMENT, SYSTEMS, UI_FEATURES } from "../lib/data.js";
import { PageHero } from "../components/Chrome.jsx";
import { Section, Panel, Reveal, LinkBtn } from "../components/Ui.jsx";
import { Sprite } from "../components/Sprite.jsx";
import { JumpLab, SoundLab, AssetMuseum } from "../components/Labs.jsx";
import { Icon } from "../components/Icons.jsx";

export default function Features() {
  return (
    <>
      <PageHero title="Semua yang Ada di Dalam Game" theme="sky" sprite="heroBigJump">Super Pixel Bros memadukan rasa platformer klasik dengan kontrol modern yang responsif.</PageHero>

      <Section title="Fisika Lompat Modern" sprite="heroBigJump" lead="Coba sendiri: tahan tombol untuk merasakan variable jump.">
        <div className="split">
          <Reveal variant="left"><JumpLab /></Reveal>
          <div className="grid g2">
            {MOVEMENT.map((m, i) => (
              <Reveal key={m.name} variant="pop" delay={(i % 2) * 80 + Math.floor(i / 2) * 60}>
                <Panel className="mini"><h3>{m.name}</h3><p>{m.desc}</p></Panel>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Gameplay Inti" sprite="checkpointOn">
        <div className="grid g3">
          {SYSTEMS.map((s, i) => (
            <Reveal key={s.t} variant="pop" delay={(i % 3) * 90}>
              <Panel interactive className="sys">
                <div className="sys-art"><Sprite name={s.s} scale={3} /></div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section title="UI Pixel yang Hidup" sprite="star">
        <Reveal><Panel>
          <ul className="uilist">
            {UI_FEATURES.map((u) => <li key={u}><Icon name="star" size={14} />{u}</li>)}
          </ul>
        </Panel></Reveal>
      </Section>

      <Section title="Sound Lab" sprite="coin" lead="Semua suara dari game bisa kamu dengarkan di sini — tidak perlu menyalakan tombol suara.">
        <SoundLab />
      </Section>

      <Section title="Museum Aset" sprite="castle" lead="Seluruh sprite, tileset, dan latar parallax dibuat dari nol lewat script Python — bebas hak cipta.">
        <AssetMuseum />
        <div className="row-btns">
          <LinkBtn to="/dunia" variant="pipe">Lihat Dunia</LinkBtn>
          <LinkBtn to="/shop" variant="gold">Shop Kosmetik</LinkBtn>
        </div>
      </Section>
    </>
  );
}
