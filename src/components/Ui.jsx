import { useEffect, useRef, useState } from "react";
import { Link } from "../lib/router.jsx";
import { observeOnce, prefersReducedMotion } from "../lib/hooks.js";
import { onToast } from "../lib/fx.js";
import { sfx } from "../lib/sound.js";
import { Sprite } from "./Sprite.jsx";

/** Tombol 3D bergaya game. variant: gold | red | pipe | ghost | night */
export function Btn({ as: Tag = "button", variant = "gold", size = "md", locked, className = "", sound = "click", children, onClick, ...rest }) {
  const props = { className: `btn btn-${variant} btn-${size} ${locked ? "is-locked" : ""} ${className}`, "data-locked": locked ? "" : undefined, ...rest };
  if (Tag === "button") props.type = rest.type || "button";
  return (
    <Tag {...props} onClick={(e) => { if (sound) sfx(sound); onClick?.(e); }}>
      <span className="btn-face">{children}</span>
    </Tag>
  );
}
export function LinkBtn({ to, variant, size, className = "", children, sound = "select", ...rest }) {
  return (
    <Link to={to} className={`btn btn-${variant || "gold"} btn-${size || "md"} ${className}`} onClick={() => sound && sfx(sound)} {...rest}>
      <span className="btn-face">{children}</span>
    </Link>
  );
}

/** Muncul saat masuk layar. variant: up | pop | left | right */
export function Reveal({ as: Tag = "div", variant = "up", delay = 0, className = "", children, style, ...rest }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) { setOn(true); return undefined; }
    return observeOnce(ref.current, () => setOn(true));
  }, []);
  return (
    <Tag ref={ref} className={`rv rv-${variant} ${on ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

export function Panel({ children, className = "", as: Tag = "div", interactive, ...rest }) {
  return <Tag className={`panel ${interactive ? "panel-i" : ""} ${className}`} {...rest}>{children}</Tag>;
}

/** Blok section dengan judul. sprite = ikon kecil beranimasi di samping judul. */
export function Section({ id, title, lead, sprite, children, className = "", tone }) {
  return (
    <section id={id} className={`sec ${tone ? `sec-${tone}` : ""} ${className}`}>
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="sec-title">
            {sprite && <Sprite name={sprite} scale={3} mscale={2} />}
            <h2>{title}</h2>
          </div>
          <span className="sec-rule" aria-hidden="true" />
          {lead && <p className="lead">{lead}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function Badge({ tone = "gold", children, pulse, className = "" }) {
  return <span className={`badge badge-${tone} ${pulse ? "pulse" : ""} ${className}`}><i className="badge-dot" />{children}</span>;
}

/** Hitung naik saat terlihat. */
export function CountUp({ to, ms = 1100 }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) { setV(to); return undefined; }
    return observeOnce(ref.current, () => {
      const t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }, [to, ms]);
  return <span ref={ref}>{String(v).padStart(String(to).length >= 2 ? 2 : 1, "0")}</span>;
}

export function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => onToast((t) => {
    setItems((l) => [...l.slice(-2), t]);
    setTimeout(() => setItems((l) => l.map((x) => (x.id === t.id ? { ...x, out: true } : x))), t.ms);
    setTimeout(() => setItems((l) => l.filter((x) => x.id !== t.id)), t.ms + 350);
  }), []);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast toast-${t.tone} ${t.out ? "out" : ""}`}>
          {t.sprite && <Sprite name={t.sprite} scale={2} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/** Accordion sederhana & aksesibel. */
export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="acc">
      {items.map((it, i) => (
        <div key={it.q} className={`acc-item ${open === i ? "open" : ""}`}>
          <button className="acc-q" aria-expanded={open === i} onClick={() => { setOpen(open === i ? -1 : i); sfx("click"); }}>
            <span>{it.q}</span><i className="acc-chev" aria-hidden="true" />
          </button>
          <div className="acc-a" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}><div><p>{it.a}</p></div></div>
        </div>
      ))}
    </div>
  );
}
