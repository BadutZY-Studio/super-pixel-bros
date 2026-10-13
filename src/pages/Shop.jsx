import { items, SLOTS, SLOT_NAMES, inSlot } from "../lib/cosmetics.js";
import { PageHero } from "../components/Chrome.jsx";
import { Section, Reveal, CountUp } from "../components/Ui.jsx";
import { HeroBuilder } from "../components/HeroBuilder.jsx";

export default function Shop() {
  return (
    <>
      <PageHero title="Shop Kosmetik" theme="sky" sprite="heroFireRun">{items().length} kosmetik dibeli dengan koin hasil bermain. Padukan sesukamu dan lihat hasilnya langsung.</PageHero>

      <Section title="Ruang Ganti" sprite="coin" lead="Pilih item di katalog — hero di atas langsung berganti. Semua digambar dari kode kosmetik asli game, lengkap dengan trail dan sayap yang bergerak.">
        <div className="shop-count">
          {SLOTS.map((s, i) => <Reveal key={s} variant="pop" delay={i * 50} className="shop-chip"><b><CountUp to={inSlot(s).length} /></b>{SLOT_NAMES[s]}</Reveal>)}
        </div>
        <HeroBuilder />
      </Section>
    </>
  );
}
