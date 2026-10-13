import { PageHero } from "../components/Chrome.jsx";
import { Section, LinkBtn } from "../components/Ui.jsx";
import { Sprite } from "../components/Sprite.jsx";

export default function NotFound() {
  return (
    <>
      <PageHero title="404 Halaman Hilang" theme="cave">Kamu jatuh ke jurang! Halaman yang dicari tidak ada atau sudah dipindahkan.</PageHero>
      <Section title="Kembali ke level" sprite="heroSmallDie">
        <div className="row-center"><Sprite name="goomba" scale={6} mscale={4} /><LinkBtn to="/" variant="red" size="lg">Ke Beranda</LinkBtn></div>
      </Section>
    </>
  );
}
