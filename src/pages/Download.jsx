import { useState } from "react";
import { status, STATUS_INFO, PLATFORMS } from "../lib/status.js";
import { VERSION, RELEASE_DATE, ISSUES_URL } from "../config.js";
import { sfx } from "../lib/sound.js";
import { burst, centerOf, toast } from "../lib/fx.js";
import { PageHero } from "../components/Chrome.jsx";
import { Section, Panel, Reveal, Accordion, Btn } from "../components/Ui.jsx";
import { Sprite } from "../components/Sprite.jsx";
import { Icon } from "../components/Icons.jsx";
import { DesktopShowcase, AndroidShowcase, StatusBadge, StatusBanner } from "../components/Release.jsx";

const STEPS = [
  { k: "belum-rilis", t: "Pengembangan", d: "Level, aset, dan musik dipoles. Download masih terkunci." },
  { k: "beta", t: "Beta Terbuka", d: "Build percobaan dibagikan per platform. Bug mungkin masih ada." },
  { k: "rilis", t: "Rilis Resmi", d: "Semua platform terbuka dan siap dimainkan." },
];
const INSTALL = {
  windows: "Ekstrak file .zip, lalu jalankan SuperPixelBros.exe. Jika muncul SmartScreen, pilih \"More info\" → \"Run anyway\".",
  linux: "Beri izin eksekusi dengan chmod +x SuperPixelBros.x86_64, lalu jalankan filenya.",
  macos: "Ekstrak lalu pindahkan ke Applications. Saat pertama dibuka, klik kanan → Open untuk melewati Gatekeeper.",
  android: "Unduh file .apk, izinkan \"Install unknown apps\" untuk browser-mu, lalu pasang. Gamepad Bluetooth didukung.",
};
const FAQ = [
  { q: "Apakah game ini gratis?", a: "Ya. Super Pixel Bros gratis, tanpa iklan, dan semua kosmetik dibeli dengan koin hasil bermain — bukan uang asli." },
  { q: "Apakah perlu menginstal Godot?", a: "Tidak. File download sudah berisi game yang siap dijalankan. Godot hanya dibutuhkan jika kamu ingin membuka project-nya." },
  { q: "Di mana progres game disimpan?", a: "Otomatis di perangkatmu: level terbuka, skor terbaik, koin, dan kosmetik yang dipakai." },
  { q: "Bisa main pakai gamepad?", a: "Bisa. Controller USB/Bluetooth didukung penuh, termasuk rebind tombol di menu Controls." },
  { q: "Menemukan bug, lapor ke mana?", a: "Klik tombol \"Laporkan Masalah\" di halaman ini. Kamu akan diarahkan ke halaman Issues di GitHub. Sertakan platform, versi game, langkah untuk mengulang bug, dan screenshot bila ada." },
  { q: "Kenapa tombol download terkunci?", a: status === "belum-rilis" ? "Game belum resmi rilis. Tombol akan terbuka otomatis saat status berubah ke Beta atau Rilis." : "Link untuk platform tersebut belum diunggah. Platform yang sudah punya link bisa langsung di-download." },
];

const REPORT_TIPS = ["Platform & versi game", "Langkah mengulang bug", "Screenshot atau video"];

/** Kartu "Laporkan Masalah" — mengarah ke halaman Issues GitHub (link diatur di config.js → ISSUES_URL). */
function ReportIssue() {
  const url = (ISSUES_URL || "").trim();
  const open = url !== "";
  const onClick = (e) => {
    const btn = e.currentTarget;
    if (!open) {
      e.preventDefault();
      sfx("bump", { force: true });
      btn.classList.remove("shake"); void btn.offsetWidth; btn.classList.add("shake");
      toast("Link laporan belum tersedia. Coba lagi nanti ya!", { sprite: "checkpoint", tone: "red" });
      return;
    }
    sfx("powerup", { force: true });
    const { x, y } = centerOf(btn);
    burst(x, y, { n: 10 });
  };
  return (
    <div className={`bug ${open ? "open" : "locked"}`}>
      <div className="bug-ico" aria-hidden="true"><Icon name="bug" size={44} /></div>
      <div className="bug-body">
        <span className="bug-tag"><Icon name="bug" size={12} />BUG REPORT</span>
        <h3>Menemukan bug atau masalah?</h3>
        <p>Bantu kami membuat Super Pixel Bros lebih baik. Laporkan lewat halaman Issues di GitHub - setiap laporan sangat berarti.</p>
        <ul className="bug-tips" aria-label="Info yang sebaiknya disertakan">
          {REPORT_TIPS.map((t) => <li key={t}><Icon name="check" size={12} />{t}</li>)}
        </ul>
      </div>
      <div className="bug-cta">
        <a
          href={open ? url : "#"}
          target={open ? "_blank" : undefined}
          rel={open ? "noopener noreferrer" : undefined}
          aria-disabled={!open}
          onClick={onClick}
          className={`btn btn-${open ? "red" : "ghost"} btn-lg ${open ? "" : "is-locked"}`}
        >
          <span className="btn-face"><Icon name={open ? "bug" : "lock"} size={16} />{open ? "Laporkan Masalah" : "Segera Hadir"}</span>
        </a>
        <small>{open ? "Laporkan melalui Github" : "Link laporan akan segera tersedia"}</small>
      </div>
    </div>
  );
}

export default function Download() {
  const [os, setOs] = useState("windows");
  const info = STATUS_INFO[status];
  const idx = STEPS.findIndex((s) => s.k === status);
  return (
    <>
      <PageHero title="Pilih Platformmu" theme="space" sprite="heroFireRun">Gratis, ringan, dan siap dimainkan. Ukuran kecil — semua aset dibuat dari nol.</PageHero>

      <Section title="Download Game" sprite="coin" lead={`Versi ${VERSION} · ${info.headline}${status === "belum-rilis" && RELEASE_DATE ? ` · target ${RELEASE_DATE}` : ""}`}>
        <Reveal><div className="dl-status"><StatusBadge /></div></Reveal>
        <Reveal><h3 className="dl-group"><Icon name="windows" size={16} />Komputer · Windows, Linux, macOS</h3></Reveal>
        <Reveal variant="pop"><DesktopShowcase /></Reveal>

        <Reveal><h3 className="dl-group dl-group-android"><Icon name="android" size={16} />Perangkat Mobile · Android</h3></Reveal>
        <Reveal variant="pop"><AndroidShowcase /></Reveal>

        <Reveal><StatusBanner /></Reveal>
        <Reveal variant="pop"><ReportIssue /></Reveal>
      </Section>

      <Section title="Perjalanan Rilis" sprite="flag" lead="Dari pengembangan sampai rilis resmi — kamu bisa melihat di tahap mana game saat ini.">
        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.k} variant="pop" delay={i * 120} className={`step ${i < idx ? "done" : i === idx ? "now" : ""}`}>
              <div className="step-dot">{i < idx ? <Icon name="check" size={20} /> : i + 1}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section title="Cara Instalasi" sprite="pipeArrow">
        <div className="tabs" role="tablist">
          {PLATFORMS.map((p) => <Btn key={p.id} variant="ghost" size="sm" role="tab" aria-selected={os === p.id} aria-pressed={os === p.id} onClick={() => setOs(p.id)}><Icon name={p.icon} size={14} />{p.os}</Btn>)}
        </div>
        <Panel key={os} className="install">
          <h3>{PLATFORMS.find((p) => p.id === os).os}</h3>
          <p>{INSTALL[os]}</p>
          <p className="install-req">{PLATFORMS.find((p) => p.id === os).req}</p>
        </Panel>
      </Section>

      <Section title="Pertanyaan Umum" sprite="mushroom">
        <Accordion items={FAQ} />
        <div className="row-center" style={{ marginTop: 48 }}><Sprite name="heroFireRun" scale={4} /><Sprite name="coin" scale={4} /><Sprite name="star" scale={4} /></div>
      </Section>
    </>
  );
}