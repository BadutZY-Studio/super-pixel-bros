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

export function PlatformGrid() {
  const os = detectOS();
  return (
    <div className="grid g4 plat-grid">
      {PLATFORMS.map((p) => <PlatformCard key={p.id} p={p} recommended={os === p.id && downloadState(p.id).state === "open"} />)}
    </div>
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
