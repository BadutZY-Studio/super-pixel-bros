# Super Pixel Bros — Website (React + Vite)

Website resmi game **Super Pixel Bros**. Dibangun ulang dengan **React biasa + Vite** (tanpa TanStack, tanpa Tailwind),
siap di-deploy ke **Vercel**. Semua gambar, tile, latar, dan audio diambil langsung dari folder aset game.

---

## 1. Mengubah status rilis (SATU BARIS)

Buka **`src/config.js`**, ubah baris ini:

```js
export const STATUS = "beta";   // "belum-rilis" | "beta" | "rilis"
```

| Status | Perilaku tombol download |
|---|---|
| `"belum-rilis"` | **Semua** tombol terkunci, walaupun link sudah kamu isi. |
| `"beta"` | Tombol yang **link-nya sudah diisi** langsung bisa di-download. Yang link-nya masih kosong tetap terkunci ("Menyusul"). |
| `"rilis"` | Game resmi rilis: semua link yang diisi terbuka penuh. Yang masih kosong tampil "Menyusul". |

Lencana status, tombol di header, hero, banner, dan halaman Download ikut berubah otomatis.

### Mengisi link download

Di file yang sama:

```js
export const LINKS = {
  windows: "https://.../SuperPixelBros-Windows.zip",
  linux:   "",   // kosong = tetap terkunci
  macos:   "",
  android: "https://.../SuperPixelBros.apk",
};
```

Opsional: `VERSION` (nomor versi) dan `RELEASE_DATE` (tanggal target, tampil saat "belum-rilis").

> **Catatan:** penguncian dilakukan di sisi tampilan (client). Jika sebuah link tidak boleh bocor sebelum rilis,
> biarkan link-nya **kosong** sampai waktunya — jangan hanya mengandalkan status "belum-rilis".

---

## 2. Menjalankan di komputer

```bash
npm install
npm run dev        # buka http://localhost:5173
```

Saat `npm run dev` kamu bisa mencoba status lain tanpa mengedit file, cukup tambahkan di URL:
`http://localhost:5173/download?status=rilis` (fitur ini **tidak aktif** di versi produksi).

Build produksi: `npm run build` → hasilnya di folder `dist/`.

## 3. Deploy ke Vercel

1. Upload folder ini ke GitHub (atau pakai Vercel CLI).
2. Di Vercel: **Add New → Project → Import** repositori tersebut.
3. Vercel otomatis mengenali **Vite** (Build `npm run build`, Output `dist`). Tidak ada pengaturan tambahan.
4. File `vercel.json` sudah mengatur agar semua URL (`/dunia`, `/shop`, dst.) diarahkan ke `index.html`
   dan aset game di-cache dengan baik.

Setiap kali kamu mengubah `src/config.js` lalu push, Vercel otomatis men-deploy ulang.

---

## 4. Struktur proyek

```
index.html            ← titik masuk + splash loading
vercel.json           ← rewrite SPA + cache aset
public/game/          ← SEMUA aset game (sprites, tiles, bg, ui, fonts, audio mp3)
src/
  config.js           ← ⭐ STATUS + LINK DOWNLOAD (ubah di sini)
  main.jsx, App.jsx, routes.js
  lib/                ← router buatan sendiri, status, suara, kosmetik (port dari game), level
  data/levelMaps.js   ← 20 level asli game (ASCII, dikompres)
  components/         ← Sprite, Scene, Runner (mini-game hero), LevelExplorer, HeroBuilder, Demos, Labs, ...
  pages/              ← Home, Features, Worlds, PowerUps, Enemies, Shop, Controls, Download, NotFound
  styles/             ← base.css, components.css, pages.css
```

## 5. Yang baru di versi ini

- **Router sendiri** + transisi **wipe kotak-pixel** antar halaman (seperti transisi di game), prefetch halaman saat hover.
- **Hero mini-game**: lompat (tahan = tinggi), kumpulkan koin, injak Goomba, sundul blok ?, power-up Mushroom → Fire → Star.
  Koin tersimpan dan tampil di HUD header; 100 koin = 1UP.
- **Penjelajah Level**: 20 level asli game digambar dari data aslinya (tile, musuh, koin, pipa), bisa digeser, tur otomatis, parallax.
- **Shop / Ruang Ganti**: 55 kosmetik digambar langsung dari kode kosmetik game (di-port ke Canvas), lengkap dengan trail & sayap.
  (Atlas gambar shop versi lama tidak ada di zip, sekarang tidak diperlukan lagi.)
- **Demo interaktif** blok ?, bata, pipa, spring, platform, checkpoint, tiang bendera; arena musuh; rintangan.
- **Sound Lab**: 21 efek suara + 8 lagu chiptune dari game. **Museum Aset**: semua sprite, tileset, dan latar.
- **Kontrol**: playground keyboard / sentuh / gamepad.
- Mobile: header HUD + menu laci, grid simetris, tombol sentuh.
- Animasi hanya memakai `transform`/`opacity` (GPU), berhenti saat tab disembunyikan, dan menghormati
  pengaturan "Reduce motion" di perangkat.

## 6. Mengganti / menambah aset

Timpa file di `public/game/...` dengan nama yang sama. Untuk SFX baru, tambahkan di `SFX` (`src/lib/data.js`).
Font judul (Press Start 2P) ada di `public/game/fonts`; font isi (Pixelify Sans) dimuat dari Google Fonts —
bila offline, otomatis memakai font sistem.
