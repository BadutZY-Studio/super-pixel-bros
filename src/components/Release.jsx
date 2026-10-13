import { useRef } from "react";
import { status, STATUS_INFO, PLATFORMS, downloadState, anyOpen, detectOS } from "../lib/status.js";
import { RELEASE_DATE, VERSION } from "../config.js";
import { sfx } from "../lib/sound.js";
import { burst, centerOf, toast } from "../lib/fx.js";
import { Badge, LinkBtn, Panel } from "./Ui.jsx";
import { Icon } from "./Icons.jsx";
import { Sprite } from "./Sprite.jsx";

/** Lencana status (BELUM RILIS / BETA TERBUKA / SUDAH RILIS) — otomatis dari config.js */
export function StatusBadge({ className = "" }) {
  const i = STATUS_INFO[status];
  const text = status === "belum-rilis" && RELEASE_DATE ? `${i.label} · ${RELEASE_DATE}` : status === "rilis" ? `${i.label} · v${VERSION}` : status === "beta" ? `${i.label} · v${VERSION}` : i.label;
  return <Badge tone={i.tone} pulse className={className}>{text}</Badge>;
}

/** Tombol CTA utama yang menyesuaikan status. */
export function PrimaryCTA({ size = "lg", variant }) {
  const open = anyOpen();
  const label = status === "belum-rilis" ? "Segera Hadir" : status === "beta" ? (open ? "Coba Beta" : "Info Beta") : open ? "Download Gratis" : "Info Download";
  return (
    <LinkBtn to="/download" size={size} variant={variant || (open ? "red" : "night")} sound="powerup">
      <Icon name={open ? "download" : "lock"} size={size === "lg" ? 18 : 14} />{label}
    </LinkBtn>
  );
}

export function handleDownload(e, p) {
  const st = downloadState(p.id);
  const btn = e.currentTarget;
  if (st.state === "locked") {
    e.preventDefault();
    sfx("bump", { force: true });
    btn.classList.remove("shake"); void btn.offsetWidth; btn.classList.add("shake");
    toast(st.reason === "belum-rilis" ? `Game belum rilis — tombol ${p.os} masih terkunci.` : `Build ${p.os} belum tersedia. ${st.note}.`, { sprite: "checkpoint", tone: "red" });
    return;
  }
  sfx("powerup", { force: true });
  const { x, y } = centerOf(btn);
  burst(x, y, { n: 12 });
}

export function PlatformCard({ p, recommended }) {
  const st = downloadState(p.id);
  const open = st.state === "open";
  const ref = useRef(null);
  return (
    <Panel className={`plat ${open ? "open" : "locked"} ${recommended ? "rec" : ""}`}>
      {recommended && <span className="plat-rec"><Icon name="star" size={12} /> Cocok untuk perangkatmu</span>}
      <div className="plat-top">
        <div className="plat-ico"><Icon name={p.icon} size={44} /></div>
        <span className="plat-state" data-open={open || undefined}><Icon name={open ? "check" : "lock"} size={12} />{open ? (status === "beta" ? "BETA" : "TERSEDIA") : "TERKUNCI"}</span>
      </div>
      <h3>{p.os}</h3>
      <p className="plat-req">{p.req}</p>
      <p className="plat-file">{p.file}</p>
      <p className="plat-note">{st.note}</p>
      <a
        ref={ref}
        href={open ? st.url : "#"}
        target={open ? "_blank" : undefined}
        rel={open ? "noopener noreferrer" : undefined}
        aria-disabled={!open}
        onClick={(e) => handleDownload(e, p)}
        className={`btn btn-${open ? (p.id === "android" ? "pipe" : "red") : "ghost"} btn-full ${open ? "" : "is-locked"}`}
      >
        <span className="btn-face"><Icon name={open ? "download" : "lock"} size={14} />{st.label}</span>
      </a>
    </Panel>
  );
}

const DESKTOP_IDS = ["windows", "linux", "macos"];

/** Grid platform desktop (Windows, Linux, macOS). */
export function DesktopGrid() {
  const os = detectOS();
  return (
    <div className="grid g3 plat-grid">
      {PLATFORMS.filter((p) => DESKTOP_IDS.includes(p.id)).map((p) => <PlatformCard key={p.id} p={p} recommended={os === p.id && downloadState(p.id).state === "open"} />)}
    </div>
  );
}

const DESK_FEATS = [
  { i: "star", t: "Keyboard & Gamepad", d: "Rebind tombol sesukamu" },
  { i: "clock", t: "Ringan & Cepat", d: "Jalan mulus di PC biasa" },
  { i: "check", t: "Langsung Main", d: "Ekstrak, klik, selesai" },
];

/** Satu baris platform desktop di dalam showcase. */
function OsRow({ p, recommended }) {
  const st = downloadState(p.id);
  const open = st.state === "open";
  return (
    <div className={`os-row ${open ? "open" : "locked"} ${recommended ? "rec" : ""}`}>
      <div className="os-ico"><Icon name={p.icon} size={30} /></div>
      <div className="os-txt">
        <h4>{p.os}{recommended && <span className="os-rec"><Icon name="star" size={10} /> Cocok untukmu</span>}</h4>
        <p>{p.req}</p>
        <small>{p.file}</small>
      </div>
      <a
        href={open ? st.url : "#"}
        target={open ? "_blank" : undefined}
        rel={open ? "noopener noreferrer" : undefined}
        aria-disabled={!open}
        onClick={(e) => handleDownload(e, p)}
        className={`btn btn-${open ? "red" : "ghost"} btn-sm os-btn ${open ? "" : "is-locked"}`}
      >
        <span className="btn-face"><Icon name={open ? "download" : "lock"} size={14} />{st.label}</span>
      </a>
    </div>
  );
}

/** Kartu Desktop — Windows, Linux, macOS dalam satu showcase bergaya monitor. */
export function DesktopShowcase() {
  const os = detectOS();
  const list = PLATFORMS.filter((p) => DESKTOP_IDS.includes(p.id));
  const anyDesk = list.some((p) => downloadState(p.id).state === "open");
  return (
    <div className={`desk ${anyDesk ? "open" : "locked"}`}>
      <div className="desk-stage" aria-hidden="true">
        <div className="mon">
          <div className="mon-screen">
            <span className="mon-hud"><b>SCORE</b> 001250<b>COIN</b> x12<b>WORLD</b> 1-1<b>TIME</b> 300</span>
            <span className="mon-cloud"><Sprite name="cloudS" scale={3} /></span>
            <span className="mon-qb">?</span>
            <span className="mon-coin mc1"><Sprite name="coin" scale={2} /></span>
            <span className="mon-coin mc2"><Sprite name="coin" scale={2} /></span>
            <span className="mon-coin mc3"><Sprite name="coin" scale={2} /></span>
            <span className="mon-hero"><Sprite name="heroFireRun" scale={3} /></span>
            <span className="mon-foe"><Sprite name="goomba" scale={3} /></span>
            <span className="mon-pipe"><i /></span>
            <span className="mon-ground" />
          </div>
          <span className="mon-led" />
        </div>
        <span className="mon-neck" />
        <span className="mon-base" />
        <div className="kbd">
          <span className="key">←</span><span className="key">→</span>
          <span className="key key-wide">SPACE</span>
          <span className="key">X</span>
        </div>
        <span className="droid-spark ds1"><Sprite name="star" scale={3} mscale={2} /></span>
        <span className="droid-spark ds2"><Sprite name="mushroom" scale={3} mscale={2} /></span>
      </div>

      <div className="droid-info desk-info">
        <div className="droid-top">
          <span className="droid-tag desk-tag"><Icon name="windows" size={14} />DESKTOP EDITION</span>
          <span className="plat-state" data-open={anyDesk || undefined}><Icon name={anyDesk ? "check" : "lock"} size={12} />{anyDesk ? (status === "beta" ? "BETA" : "TERSEDIA") : "TERKUNCI"}</span>
        </div>
        <h3>Petualangan penuh di layar besar</h3>
        <p className="droid-desc">Mainkan Super Pixel Bros di komputermu dengan visual tajam dan kontrol presisi. Pilih sistem operasimu, unduh, lalu langsung lari menuju bendera.</p>

        <ul className="droid-feats">
          {DESK_FEATS.map((f) => <li key={f.t}><Icon name={f.i} size={22} /><span><b>{f.t}</b>{f.d}</span></li>)}
        </ul>

        <div className="os-list">
          {list.map((p) => <OsRow key={p.id} p={p} recommended={os === p.id && downloadState(p.id).state === "open"} />)}
        </div>
      </div>
    </div>
  );
}

const DROID_FEATS = [
  { i: "play", t: "Kontrol Sentuh", d: "Tombol layar yang nyaman" },
  { i: "star", t: "Gamepad Bluetooth", d: "Colok & main tanpa setup" },
  { i: "heart", t: "Gratis, Tanpa Iklan", d: "Semua dibeli dengan koin" },
];
const DROID_STEPS = ["Unduh file .apk", "Izinkan \"Install unknown apps\"", "Buka file, pasang, main!"];

/** Kartu Android — dipisah dari platform desktop. */
export function AndroidShowcase() {
  const p = PLATFORMS.find((x) => x.id === "android");
  const st = downloadState("android");
  const open = st.state === "open";
  const recommended = detectOS() === "android" && open;
  return (
    <div className={`droid ${open ? "open" : "locked"} ${recommended ? "rec" : ""}`}>
      <div className="droid-stage" aria-hidden="true">
        <div className="phone">
          <span className="phone-notch" />
          <div className="phone-screen">
            <span className="phone-hud">SCORE 000450</span>
            <span className="phone-coin pc1"><Sprite name="coin" scale={2} /></span>
            <span className="phone-coin pc2"><Sprite name="coin" scale={2} /></span>
            <span className="phone-coin pc3"><Sprite name="coin" scale={2} /></span>
            <span className="phone-item"><Sprite name="mushroom" scale={2} /></span>
            <span className="phone-hero"><Sprite name="heroFireRun" scale={2} /></span>
            <span className="phone-ground" />
            <span className="phone-pad"><i /><i /></span>
            <span className="phone-btn">A</span>
          </div>
        </div>
        <span className="droid-spark ds1"><Sprite name="star" scale={3} mscale={2} /></span>
        <span className="droid-spark ds2"><Sprite name="coin" scale={3} mscale={2} /></span>
      </div>

      <div className="droid-info">
        {recommended && <span className="plat-rec droid-rec"><Icon name="star" size={12} /> Cocok untuk perangkatmu</span>}
        <div className="droid-top">
          <span className="droid-tag"><Icon name="android" size={14} />ANDROID EDITION</span>
          <span className="plat-state" data-open={open || undefined}><Icon name={open ? "check" : "lock"} size={12} />{open ? (status === "beta" ? "BETA" : "TERSEDIA") : "TERKUNCI"}</span>
        </div>
        <h3>Main di mana saja, langsung dari HP-mu</h3>
        <p className="droid-desc">Bawa petualangan Super Pixel Bros ke saku. Pasang file APK sekali, lalu lompat, tendang, dan kumpulkan koin kapan pun kamu mau.</p>

        <ul className="droid-feats">
          {DROID_FEATS.map((f) => (
            <li key={f.t}><Icon name={f.i} size={22} /><span><b>{f.t}</b>{f.d}</span></li>
          ))}
        </ul>

        <div className="droid-meta"><span>{p.req}</span><span>{p.file}</span></div>

        <div className="droid-cta">
          <a
            href={open ? st.url : "#"}
            target={open ? "_blank" : undefined}
            rel={open ? "noopener noreferrer" : undefined}
            aria-disabled={!open}
            onClick={(e) => handleDownload(e, p)}
            className={`btn btn-${open ? "pipe" : "ghost"} btn-lg ${open ? "" : "is-locked"}`}
          >
            <span className="btn-face"><Icon name={open ? "download" : "lock"} size={16} />{open ? `${st.label} untuk Android` : st.label}</span>
          </a>
        </div>
        <p className="droid-note">{st.note}</p>

        <ol className="droid-steps">
          {DROID_STEPS.map((t, i) => <li key={t}><b>{i + 1}</b>{t}</li>)}
        </ol>
      </div>
    </div>
  );
}

/** Semua platform: desktop dulu, Android terpisah di bawahnya. */
export function PlatformGrid() {
  return (
    <>
      <DesktopShowcase />
      <AndroidShowcase />
    </>
  );
}

export function StatusBanner() {
  const i = STATUS_INFO[status];
  const msg = {
    "belum-rilis": `Game masih dalam pengembangan${RELEASE_DATE ? ` — target rilis ${RELEASE_DATE}` : ""}. Semua tombol download terkunci sampai resmi rilis.`,
    beta: "Platform yang sudah punya link bisa langsung di-download; sisanya menyusul. Mohon maklum jika masih ada bug.",
    rilis: "Super Pixel Bros sudah resmi rilis! Pilih platformmu dan mulai bermain. Platform tanpa link akan menyusul.",
  }[status];
  return (
    <div className={`banner banner-${i.tone}`}>
      <Sprite name={status === "rilis" ? "star" : status === "beta" ? "flower" : "checkpoint"} scale={3} mscale={2} />
      <div><strong>{i.headline}</strong><p>{msg}</p></div>
    </div>
  );
}