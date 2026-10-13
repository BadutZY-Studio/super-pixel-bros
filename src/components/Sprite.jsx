import { memo } from "react";
import { SPRITES, G } from "../lib/data.js";

/**
 * Sprite pixel-art yang dianimasikan murni dengan CSS transform (kompositor GPU → mulus, tanpa repaint).
 *  - name: kunci di SPRITES, atau `def` untuk definisi kustom
 *  - scale: skala desktop (bilangan bulat supaya piksel tetap tajam), mscale: skala mobile (≤700px)
 *  - still: matikan animasi, flip: cermin horizontal
 */
export const Sprite = memo(function Sprite({ name, def, scale = 4, mscale, still, flip, className = "", style, label, paused }) {
  const d = def || SPRITES[name];
  const n = still ? 1 : d.frames || 1;
  const s = {
    "--fw": d.fw, "--fh": d.fh, "--sheet": d.sheet, "--start": d.start || 0, "--n": n, "--dur": `${d.dur || 0.6}s`,
    "--sc": scale, "--msc": mscale ?? scale, ...style,
  };
  return (
    <span
      className={`spr ${n > 1 ? "anim" : ""} ${paused ? "paused" : ""} ${flip ? "flip" : ""} ${className}`}
      style={s}
      data-m={mscale ? "" : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <img src={d.url || `${G}/sprites/${d.src}.png`} alt="" draggable="false" decoding="async" />
    </span>
  );
});

/** Satu tile dari atlas tema (ukuran 16px × scale). */
export const Tile = memo(function Tile({ theme = "grass", index = 0, scale = 4, mscale, className = "", style, anim }) {
  return (
    <span
      aria-hidden="true"
      className={`tile ${anim ? "tile-anim" : ""} ${className}`}
      style={{ "--sc": scale, "--msc": mscale ?? scale, "--ti": index, "--tn": anim || 1, ...style }}
      data-m={mscale ? "" : undefined}
    >
      <img src={`${G}/tiles/tiles_${theme}.png`} alt="" draggable="false" decoding="async" />
    </span>
  );
});
