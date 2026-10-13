import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Wipe } from "../components/Wipe.jsx";
import { sfx } from "./sound.js";

// Router mini: History API + transisi wipe + prefetch halaman. Tidak butuh library apa pun.
const Ctx = createContext(null);
export const useRouter = () => useContext(Ctx);

const clean = (p) => (p.replace(/\/+$/, "") || "/");
const nextPaint = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

export function RouterProvider({ routes, notFound, children, onReady }) {
  const wipe = useRef(null);
  const busy = useRef(false);
  const match = useCallback((p) => routes.find((r) => r.path === p) || null, [routes]);
  const [view, setView] = useState({ path: clean(location.pathname), Comp: null });
  const pathRef = useRef(view.path);

  const loadRoute = useCallback(async (path) => {
    const r = match(path);
    const mod = await (r ? r.load() : notFound());
    return mod.default;
  }, [match, notFound]);

  // muat halaman pertama
  useEffect(() => {
    let alive = true;
    wipe.current?.setCovered();
    loadRoute(view.path).then(async (Comp) => {
      if (!alive) return;
      setView({ path: view.path, Comp });
      await nextPaint();
      onReady?.(() => wipe.current.reveal());
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback(async (to, { push = true, silent = false } = {}) => {
    const url = new URL(to, location.href);
    const next = clean(url.pathname);
    if (next === pathRef.current && push) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (busy.current) return;
    busy.current = true;
    if (!silent) sfx("pipe");
    const pre = loadRoute(next);
    await Promise.all([wipe.current.cover(), pre]);
    const Comp = await pre;
    if (push) history.pushState({}, "", next + url.search + url.hash);
    pathRef.current = next;
    setView({ path: next, Comp });
    window.scrollTo(0, 0);
    await nextPaint();
    document.getElementById("main")?.focus({ preventScroll: true });
    await wipe.current.reveal();
    busy.current = false;
  }, [loadRoute]);

  useEffect(() => {
    const pop = () => go(location.pathname + location.search, { push: false, silent: true });
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [go]);

  // judul & deskripsi per halaman
  useEffect(() => {
    const r = match(view.path);
    document.title = r?.title || "Halaman tidak ditemukan — Super Pixel Bros";
    const d = r?.description;
    if (d) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", d);
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", d);
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
  }, [view.path, match]);

  const value = useMemo(() => ({ path: view.path, go, prefetch: (p) => match(clean(p))?.load() }), [view.path, go, match]);
  const { Comp } = view;

  return (
    <Ctx.Provider value={value}>
      {children(Comp, view.path)}
      <Wipe ref={wipe} />
    </Ctx.Provider>
  );
}

export function Link({ to, children, className, onClick, onMouseEnter, sound = true, ...rest }) {
  const { go, prefetch, path } = useRouter();
  const active = clean(to) === path;
  return (
    <a
      href={to}
      className={className}
      aria-current={active ? "page" : undefined}
      data-active={active || undefined}
      onMouseEnter={(e) => { prefetch(to); onMouseEnter?.(e); }}
      onFocus={() => prefetch(to)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === "_blank") return;
        e.preventDefault();
        go(to, { silent: !sound });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
