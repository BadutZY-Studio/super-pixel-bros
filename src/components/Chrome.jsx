import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "../lib/router.jsx";
import { G } from "../lib/data.js";
import { setSound, sfx, useSound } from "../lib/sound.js";
import { useCoins } from "../lib/store.js";
import { status, STATUS_INFO, anyOpen } from "../lib/status.js";
import { coinIconUrl } from "../lib/cosmetics.js";
import { Icon } from "./Icons.jsx";
import { Sprite } from "./Sprite.jsx";
import { ThemeBackdrop, Ground, Decor } from "./Scene.jsx";
import { Reveal } from "./Ui.jsx";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/fitur", label: "Fitur" },
  { to: "/dunia", label: "Dunia" },
  { to: "/power-up", label: "Power-Up" },
  { to: "/musuh", label: "Musuh" },
  { to: "/shop", label: "Shop" },
  { to: "/kontrol", label: "Kontrol" },
];

function CoinCounter() {
  const coins = useCoins();
  const [bump, setBump] = useState(0);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } setBump((b) => b + 1); }, [coins]);
  return (
    <div className="hud-coins" title="Koin yang kamu kumpulkan di website" aria-label={`${coins} koin`}>
      <img src={coinIconUrl()} alt="" width="16" height="16" />
      <span key={bump} className={bump ? "bump" : ""}>×{String(coins).padStart(3, "0")}</span>
    </div>
  );
}

export function SiteHeader() {
  const sound = useSound();
  const { path } = useRouter();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const runner = useRef(null);
  const info = STATUS_INFO[status];
  const open_ = anyOpen();

  // progres scroll = pelari kecil berlari menuju bendera
  useEffect(() => {
    let raf = 0;
    const upd = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      if (runner.current) runner.current.style.transform = `translate3d(${p * (runner.current.parentElement.clientWidth - 40)}px,0,0)`;
      setStuck(scrollY > 8);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    upd();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [path]);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => { removeEventListener("keydown", esc); document.body.classList.remove("no-scroll"); };
  }, [open]);

  return (
    <header className={`hud ${stuck ? "stuck" : ""}`}>
      <div className="hud-bar wrap">
        <Link to="/" className="hud-brand" aria-label="Super Pixel Bros — Beranda">
          <img src={`${G}/icon.png`} alt="" width="40" height="40" />
          <span>SUPER<br />PIXEL BROS</span>
        </Link>
        <nav className="hud-nav" aria-label="Menu utama">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="hud-link" sound={false} onMouseEnter={() => sfx("select", { throttle: 120 })}>{n.label}</Link>)}
        </nav>
        <div className="hud-right">
          <CoinCounter />
          <button className="hud-icon" aria-label={sound ? "Matikan suara" : "Nyalakan suara"} aria-pressed={sound} onClick={() => { setSound(!sound); if (!sound) sfx("oneup", { force: true }); }}>
            <Icon name={sound ? "volume" : "mute"} size={20} />
          </button>
          <Link to="/download" className={`btn btn-${open_ ? "red" : "night"} btn-sm hud-dl`} onClick={() => sfx("powerup")}>
            <span className="btn-face">{open_ ? <Icon name="download" size={14} /> : <Icon name="lock" size={14} />}<span className="hud-dl-t">{open_ ? "Download" : info.short === "SEGERA" ? "Segera" : "Download"}</span></span>
          </Link>
          <button className="hud-icon hud-burger" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="drawer" onClick={() => { setOpen(!open); sfx("click"); }}>
            <Icon name={open ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>
      <div className="hud-track" aria-hidden="true">
        <div className="hud-runner" ref={runner}><Sprite name="heroSmallRun" scale={1} /></div>
        <Sprite className="hud-flag" name="flag" scale={1} />
      </div>
      <div id="drawer" className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Menu seluler">
          {NAV.map((n, i) => (
            <Link key={n.to} to={n.to} className="drawer-link" style={{ "--i": i }} tabIndex={open ? 0 : -1}><Icon name="play" size={12} />{n.label}</Link>
          ))}
          <Link to="/download" className="btn btn-red btn-lg drawer-dl" style={{ "--i": NAV.length }} tabIndex={open ? 0 : -1}><span className="btn-face"><Icon name={open_ ? "download" : "lock"} size={16} /> {open_ ? "Download" : "Info Rilis"}</span></Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot-strip" aria-hidden="true">
        <ThemeBackdrop theme="night" animate={false} />
        <Decor theme="night" scale={3} mscale={2} count={7} seed={4} />
        <div className="foot-walk"><Sprite name="goomba" scale={3} mscale={2} /></div>
        <div className="foot-walk foot-walk-2"><Sprite name="heroSmallRun" scale={3} mscale={2} /></div>
        <Ground theme="night" rows={2} scale={3} mscale={2} />
      </div>
      <div className="foot-body wrap">
        <Reveal className="foot-brand">
          <img src={`${G}/ui/logo.png`} alt="Super Pixel Bros" width="224" />
          <p>Platformer pixel klasik dengan Godot 4. Semua aset — sprite, musik, efek suara — dibuat dari nol.</p>
        </Reveal>
        <Reveal delay={80} className="foot-links">
          {NAV.map((n) => <Link key={n.to} to={n.to}><Icon name="play" size={10} />{n.label}</Link>)}
          <Link to="/download" className="foot-dl"><Icon name="download" size={12} />Download</Link>
        </Reveal>
        <Reveal delay={160} className="foot-sprites">
          <Sprite name="goomba" scale={3} /><Sprite name="coin" scale={3} /><Sprite name="star" scale={3} /><Sprite name="heroFireRun" scale={3} />
        </Reveal>
      </div>
      <p className="foot-copy">© {new Date().getFullYear()} SUPER PIXEL BROS · DIBUAT DENGAN GODOT ENGINE</p>
    </footer>
  );
}

/** Hero halaman dalam: latar dunia + ground + judul yang masuk per kata. */
export function PageHero({ title, children, theme = "night", sprite }) {
  const words = title.split(" ");
  return (
    <section className="phero">
      <ThemeBackdrop theme={theme} />
      <div className="phero-in wrap">
        <h1 className="phero-title" aria-label={title}>
          {words.map((w, i) => <span key={i} className="word" style={{ "--i": i }} aria-hidden="true">{w}&nbsp;</span>)}
        </h1>
        {children && <p className="phero-sub">{children}</p>}
        {sprite && <div className="phero-sprite"><Sprite name={sprite} scale={6} mscale={4} /></div>}
      </div>
      <Decor theme={theme} scale={4} mscale={3} count={8} seed={theme.length} />
      <Ground theme={theme} rows={2} scale={4} mscale={3} />
    </section>
  );
}
