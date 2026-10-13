import { useEffect, useRef } from "react";
import { RouterProvider } from "./lib/router.jsx";
import { routes, notFound } from "./routes.js";
import { SiteHeader, SiteFooter } from "./components/Chrome.jsx";
import { ToastHost } from "./components/Ui.jsx";
import { loadImage } from "./lib/hooks.js";
import { G } from "./lib/data.js";

const PRELOAD = [`${G}/ui/logo.png`, `${G}/sprites/player_small.png`, `${G}/sprites/coin.png`, `${G}/tiles/tiles_grass.png`, `${G}/bg/bg_grass_far.png`, `${G}/bg/bg_grass_near.png`];

export default function App() {
  const done = useRef(false);

  // Boot: tunggu font + aset utama, lalu buka layar dengan wipe (splash statis ada di index.html).
  const onReady = async (reveal) => {
    if (done.current) return;
    done.current = true;
    const bar = document.getElementById("boot-bar");
    let n = 0;
    const tick = () => { n++; if (bar) bar.style.transform = `scaleX(${Math.min(1, n / (PRELOAD.length + 1))})`; };
    await Promise.race([
      Promise.all([...PRELOAD.map((u) => loadImage(u).then(tick, tick)), (document.fonts?.ready || Promise.resolve()).then(tick)]),
      new Promise((r) => setTimeout(r, 3500)),
    ]);
    await new Promise((r) => setTimeout(r, 250));
    document.getElementById("boot")?.remove();
    await reveal();
    document.documentElement.classList.add("ready");
  };

  useEffect(() => { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; }, []);

  return (
    <RouterProvider routes={routes} notFound={notFound} onReady={onReady}>
      {(Page, path) => (
        <>
          <a className="skip" href="#main">Lewati ke konten</a>
          <SiteHeader />
          <main id="main" tabIndex={-1} key={path}>{Page ? <Page /> : null}</main>
          <SiteFooter />
          <ToastHost />
        </>
      )}
    </RouterProvider>
  );
}
