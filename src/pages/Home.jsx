import { G, LEVELS, ENEMIES, THEME_ORDER } from "../lib/data.js";
import { items } from "../lib/cosmetics.js";
import { STATUS_INFO, status, PLATFORMS } from "../lib/status.js";
import { sfx } from "../lib/sound.js";
import { ThemeBackdrop, Decor } from "../components/Scene.jsx";
import { Runner } from "../components/Runner.jsx";
import { Sprite } from "../components/Sprite.jsx";
import { Link } from "../lib/router.jsx";
import { Panel, Reveal, Section, CountUp, LinkBtn } from "../components/Ui.jsx";
import { Icon } from "../components/Icons.jsx";
import { StatusBadge, PrimaryCTA, StatusBanner } from "../components/Release.jsx";

const COSMETICS = items().length;
const STATS = [[LEVELS.length, "Level"], [THEME_ORDER.length, "Tema Dunia"], [29, "Musik & SFX"], [COSMETICS, "Kosmetik"]];

const PAGES = [
  { to: "/fitur", title: "Fitur Game", sprite: "heroBigJump", desc: "Fisika lompat modern, combo, checkpoint, save otomatis & UI pixel animasi." },
  { to: "/dunia", title: "20 Level · 9 Dunia", sprite: "castle", sc: 1, desc: "Dari Green Hills sampai King's Return — jelajahi peta level asli." },
  { to: "/power-up", title: "Power-Up", sprite: "flower", desc: "Mushroom, Fire Flower, Star, dan blok-blok interaktif." },
  { to: "/musuh", title: "Musuh & Rintangan", sprite: "koopa", desc: "Goomba, Koopa, Piranha, Bat, Crusher, lava & fire bar." },
  { to: "/shop", title: "Shop Kosmetik", sprite: "coin", desc: `${COSMETICS} item: skin, suit, topi, aksesori wajah, punggung & trail.` },
  { to: "/kontrol", title: "Kontrol", sprite: "heroFireRun", desc: "Keyboard, sentuh, dan gamepad — coba langsung di halaman." },
];

export default function Home() {
  const info = STATUS_INFO[status];
  return (
    <>
      <section className="hero">
        <ThemeBackdrop theme="grass" farSpeed={50} nearSpeed={22} />
        <div className="cloud c1"><Sprite name="cloudL" scale={4} mscale={3} /></div>
        <div className="cloud c2"><Sprite name="cloudS" scale={4} mscale={3} /></div>
        <div className="cloud c3"><Sprite name="cloudL" scale={3} mscale={2} /></div>
        <div className="hero-sun" aria-hidden="true" />
        <div className="hero-content wrap">
          <StatusBadge className="hero-badge" />
          <h1 className="hero-logo"><img src={`${G}/ui/logo.png`} alt="Super Pixel Bros" /></h1>
          <p className="hero-tag">Platformer pixel klasik. Lari, lompat, injak, dan selamatkan kerajaan di 20 level penuh rahasia.</p>
          <div className="hero-cta">
            <PrimaryCTA />
            <LinkBtn to="/fitur" variant="gold" size="lg">Lihat Fitur</LinkBtn>
          </div>
          <p className="hero-plat">{PLATFORMS.map((p) => p.os).join(" · ")}</p>
        </div>
        <Runner />
        <p className="hero-hint"><span className="hide-touch">Tekan SPACE</span><span className="show-touch">Ketuk layar</span> untuk melompat — {info.short === "SEGERA" ? "main dulu di sini sambil menunggu rilis!" : "coba kumpulkan koin & sundul blok ?"}</p>
      </section>

      <div className="stats">
        <div className="wrap stats-g">
          {STATS.map(([n, l], i) => (
            <Reveal key={l} variant="pop" delay={i * 80} className="stat">
              <div className="stat-n"><CountUp to={n} /></div>
              <div className="stat-l">{l}</div>
            </Reveal>
          ))}
        </div>
      </div>

      <Section title="Jelajahi Game" lead="Semua yang ada di dalam game, bisa dicoba langsung di website ini." sprite="star">
        <div className="grid g3">
          {PAGES.map((p, i) => (
            <Reveal key={p.to} variant="pop" delay={(i % 3) * 90}>
              <Link to={p.to} className="card" onMouseEnter={() => sfx("select", { throttle: 150 })}>
                <span className="card-art"><Sprite name={p.sprite} scale={p.sc || 3} /></span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="card-go">Masuk <Icon name="arrow" size={14} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section title="Dua Chapter Petualangan" lead="Sepuluh level pertama menuju Final Castle, lalu sepuluh level lagi yang lebih liar." sprite="flag">
        <div className="grid g2">
          {[
            { th: "castle", ch: "Chapter 1 · Level 1–10", t: "Menuju Final Castle", d: "Lewati bukit, gurun, gua kristal, puncak salju, malam, langit, reruntuhan, hingga dua benteng api. Kalahkan Final Castle untuk membuka Chapter 2.", spr: "castle" },
            { th: "space", ch: "Chapter 2 · Level 11–20", t: "The King's Return", d: "Dunia baru Jungle & Space bergravitasi rendah, warp pipe menuju ruang bonus, kelelawar, spring, fire bar, falling platform, dan crusher.", spr: "bat" },
          ].map((c, i) => (
            <Reveal key={c.t} variant={i ? "right" : "left"}>
              <Panel className="chapter" interactive>
                <div className="chapter-art"><ThemeBackdrop theme={c.th} animate={false} /><Sprite name={c.spr} scale={c.spr === "castle" ? 2 : 4} mscale={c.spr === "castle" ? 1 : 3} className="chapter-spr" /></div>
                <p className="chapter-k">{c.ch}</p>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="sec">
        <div className="wrap">
          <Reveal variant="pop">
            <div className="cta">
              <ThemeBackdrop theme="castle" />
              <Decor theme="castle" scale={3} mscale={2} count={4} seed={9} />
              <div className="cta-in">
                <Sprite name="star" scale={4} mscale={3} className="cta-s1" />
                <h2>{status === "rilis" ? "Siap Bermain?" : status === "beta" ? "Beta Sudah Dibuka" : "Siap Menunggu?"}</h2>
                <p>{status === "rilis" ? "Gratis. Tanpa iklan. Main dengan keyboard atau gamepad." : status === "beta" ? "Jadilah yang pertama mencoba — laporkan bug dan bantu bentuk game ini." : "Game sedang dipoles. Sambil menunggu, jelajahi dunianya dan kumpulkan koin di website ini."}</p>
                <PrimaryCTA variant="gold" />
                <Sprite name="mushroom" scale={4} mscale={3} className="cta-s2" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}><StatusBanner /></Reveal>
        </div>
      </section>
    </>
  );
}
