<div align="center">

<img src="public/game/ui/logo.png" width="360" alt="Super Pixel Bros">

# Super Pixel Bros - Website

**Website Resmi Super Pixel Bros, Game Platformer Pixel Klasik dengan 20 Level, 9 Dunia, dan 55 Kosmetik**

[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge)]()
[![Platform](https://img.shields.io/badge/Platform-Web-0078D6?style=for-the-badge)]()
[![Type](https://img.shields.io/badge/Type-Game%20Website-FF6B35?style=for-the-badge)]()
[![Built With](https://img.shields.io/badge/Built%20With-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)]()
[![Bundler](https://img.shields.io/badge/Bundler-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)]()
[![Package Manager](https://img.shields.io/badge/Package%20Manager-npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)]()
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)]()

[Kunjungi Website](#) - [Tentang](#tentang) - [Memulai](#memulai) - [Pengaturan Rilis](#pengaturan-status-rilis-dan-link-download) - [Deployment](#deployment-ke-vercel) - [Disclaimer](#disclaimer)

---

## Tentang

Super Pixel Bros - Website adalah situs resmi untuk **Super Pixel Bros**, game platformer pixel klasik yang dibuat dengan Godot. Website ini memperkenalkan game melalui bahasa visual pixel-art yang konsisten di setiap halaman, mulai dari tipografi, tombol 3D, panel, hingga transisi antar halaman, namun tetap bersih, responsif, dan mudah dinavigasi di desktop maupun perangkat mobile.

Proyek ini menggabungkan hero mini-game yang bisa langsung dimainkan, penjelajah level interaktif, ruang ganti kosmetik, demo item dan musuh, laboratorium suara, panduan kontrol, serta informasi download multi-platform dalam satu pengalaman yang utuh. Seluruh aset (sprite, tile, latar, font, dan audio) diambil langsung dari folder aset game, sehingga tampilan website selalu selaras dengan isi game yang sebenarnya.

---

## Memulai

Tidak perlu instalasi untuk melihat website ini. Cukup buka URL hasil deploy melalui browser. Untuk menjalankan proyek secara lokal atau mengembangkannya, lihat bagian [Pengembangan Lokal](#pengembangan-lokal) di bawah.

---

## Halaman Website

Website terdiri dari halaman-halaman berikut, semuanya dapat diakses dari navigasi utama:

| Halaman | Route | Deskripsi |
|---|---|---|
| Beranda | `/` | Hero mini-game interaktif, statistik game, ringkasan seluruh fitur, dan banner status rilis |
| Fitur | `/fitur` | Fisika lompat modern, sistem gameplay inti, fitur UI, Sound Lab, dan Museum Aset |
| Dunia | `/dunia` | 20 level di 9 tema dunia, pratinjau dunia, dan penjelajah level interaktif dari data asli game |
| Power-Up | `/power-up` | Super Mushroom, Fire Flower, Star, koin, dan demo interaktif blok, pipa, spring, platform, serta checkpoint |
| Musuh | `/musuh` | Daftar musuh dan rintangan beserta cara mengalahkannya, lengkap dengan arena demo |
| Shop | `/shop` | 55 kosmetik yang dapat dipadukan dan dipratinjau langsung pada karakter |
| Kontrol | `/kontrol` | Panduan kontrol keyboard, sentuh, dan gamepad, serta playground untuk mencoba langsung |
| Download | `/download` | Pilihan platform, status rilis, langkah instalasi, perjalanan rilis, dan pertanyaan umum |
| 404 | `*` | Halaman tidak ditemukan dengan navigasi kembali ke beranda |

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| Sistem Desain Pixel-Art | Tampilan pixel yang konsisten pada tipografi, tombol 3D, panel, badge, dan transisi halaman |
| Hero Mini-Game | Lompat (tahan untuk lebih tinggi), kumpulkan koin, injak Goomba, sundul blok `?`, dan ambil power-up langsung di beranda |
| Penjelajah Level | 20 level asli game digambar dari data aslinya (tile, musuh, koin, pipa), dapat digeser, tur otomatis, dan efek parallax |
| Ruang Ganti Kosmetik | 55 kosmetik digambar langsung dari kode kosmetik game, lengkap dengan trail dan sayap |
| Demo Interaktif | Blok `?`, bata, warp pipe, spring, platform, checkpoint, tiang bendera, arena musuh, dan rintangan |
| Sound Lab | 21 efek suara dan 8 lagu chiptune dari game yang dapat didengarkan langsung |
| Museum Aset | Seluruh sprite, tileset, dan latar game dalam satu galeri |
| Playground Kontrol | Uji kontrol keyboard dan sentuh langsung di halaman |
| Sistem Status Rilis | Satu baris konfigurasi mengatur lencana status, tombol, banner, dan halaman Download |
| Download Multi-Platform | Showcase Desktop (Windows, Linux, macOS) dan Android dengan penguncian otomatis sesuai status |
| Deteksi Perangkat | Platform yang cocok dengan perangkat pengunjung ditandai secara otomatis |
| Router Buatan Sendiri | Navigasi SPA dengan transisi wipe kotak-pixel dan prefetch halaman saat hover |
| Koin Tersimpan | Koin hasil bermain di hero tersimpan di perangkat dan tampil di HUD header (100 koin = 1UP) |
| Layout Responsif | Header HUD dengan menu laci di mobile, grid simetris, dan tombol sentuh |

---

## Konten Game yang Ditampilkan

### Level dan Dunia

Game memiliki 20 level yang terbagi dalam dua chapter dan 9 tema dunia: Grass, Desert, Cave, Snow, Night, Sky, Castle, Jungle, dan Space.

| Chapter | Level | Deskripsi |
|---|---|---|
| Chapter 1 | Level 1 sampai 10 | Perjalanan melewati bukit, gurun, gua kristal, puncak salju, malam, langit, reruntuhan, hingga benteng api menuju Final Castle |
| Chapter 2 | Level 11 sampai 20 | The King's Return, dengan dunia Jungle dan Space bergravitasi rendah, warp pipe menuju ruang bonus, kelelawar, spring, fire bar, falling platform, dan crusher |

### Power-Up dan Item

| Item | Fungsi |
|---|---|
| Super Mushroom | Membuat karakter menjadi besar, dapat memecahkan blok bata, dan menahan satu serangan tambahan |
| Fire Flower | Mengubah karakter menjadi Fire form dan menembakkan bola api yang memantul |
| Star | Tak terkalahkan selama 9 detik |
| Coin | 100 koin menghasilkan 1UP, juga menjadi mata uang di Shop kosmetik |

### Musuh dan Rintangan

| Kategori | Isi |
|---|---|
| Musuh | Goomba, Koopa, Piranha Plant, Bat, dan Crusher |
| Rintangan | Spike, Lava, Jurang, Fire Bar, Es Licin, dan Waktu |

### Fisika dan Sistem Gameplay

| Mekanik | Deskripsi |
|---|---|
| Variable Jump | Tahan tombol lompat lebih lama untuk lompatan lebih tinggi |
| Coyote Time | Masih bisa melompat sesaat setelah keluar dari pinggiran |
| Jump Buffer | Tekan lompat sedikit sebelum mendarat tetap terhitung |
| Run dan Skid | Tahan lari untuk kecepatan penuh dan rasakan efek skid saat berbalik arah |
| Stomp Combo | Injak musuh beruntun tanpa menyentuh tanah untuk skor berlipat hingga 1UP |
| Low Gravity | Level Space memakai gravitasi 55% untuk lompatan melayang |
| Checkpoint | Bendera di tengah level menyimpan posisi saat kehilangan nyawa |
| Flagpole dan Bonus | Skor berdasarkan ketinggian sentuhan tiang, ditambah bonus sisa waktu |
| Save Otomatis | Progres, level terbuka, skor terbaik, koin, dan kosmetik tersimpan otomatis |

### Kosmetik

Shop menampilkan 55 kosmetik yang terbagi dalam enam slot: Skin, Suit, Hat, Face, Back, dan Trail. Semuanya dapat dipadukan dan dilihat langsung pada karakter di halaman Shop.

### Audio

Game memiliki 8 lagu chiptune orisinal (menu, grass, desert, cave, snow, night, sky, castle) dan 21 efek suara yang seluruhnya dapat didengarkan di Sound Lab.

### Kontrol

| Aksi | Keyboard | Gamepad |
|---|---|---|
| Gerak | Arrow Left, Arrow Right, A, D | D-pad atau Stick kiri |
| Lompat (tahan untuk lebih tinggi) | Space, Z, W, Arrow Up, K | A |
| Lari dan tembak api | Shift, X, J | X atau B |
| Masuk pipa | Arrow Down, S | D-pad bawah |
| Pause | P, Esc | Start |
| Ganti chapter atau tab | Q, E | LB dan RB |

Pada perangkat sentuh, tersedia tombol layar yang muncul otomatis di playground kontrol.

---

## Pengaturan Status Rilis dan Link Download

Seluruh status rilis dan link download diatur dari satu file: **`src/config.js`**. Tidak ada file lain yang perlu diubah.

### Mengubah Status Rilis

Ubah satu baris berikut:

```js
export const STATUS = "belum-rilis";   // "belum-rilis" | "beta" | "rilis"
```

| Status | Perilaku Tombol Download |
|---|---|
| `"belum-rilis"` | Semua tombol terkunci, walaupun link sudah diisi |
| `"beta"` | Tombol yang link-nya sudah diisi dapat di-download, yang masih kosong tetap terkunci dan bertuliskan "Menyusul" |
| `"rilis"` | Game resmi rilis, semua link yang diisi terbuka penuh, yang masih kosong tampil "Menyusul" |

Lencana status, tombol di header, hero, banner, dan halaman Download ikut berubah otomatis mengikuti nilai ini.

### Mengisi Link Download

Pada file yang sama, isi link untuk tiap platform. Kosongkan (`""`) jika build belum tersedia:

```js
export const LINKS = {
  windows: "https://example.com/SuperPixelBros-Windows.zip",
  linux:   "",   // kosong = tetap terkunci
  macos:   "",
  android: "https://example.com/SuperPixelBros.apk",
};
```

### Pengaturan Opsional

| Konstanta | Fungsi |
|---|---|
| `VERSION` | Nomor versi game yang ditampilkan di lencana dan halaman Download |
| `RELEASE_DATE` | Tanggal target rilis, tampil saat status `"belum-rilis"` (boleh dikosongkan) |

### Catatan Penting

Penguncian tombol dilakukan di sisi tampilan (client). Jika sebuah link tidak boleh diketahui publik sebelum rilis, biarkan link tersebut **kosong** sampai waktunya. Jangan hanya mengandalkan status `"belum-rilis"`.

### Pratinjau Status Saat Pengembangan

Saat menjalankan `npm run dev`, status lain dapat dicoba tanpa mengedit file dengan menambahkan parameter pada URL, misalnya `http://localhost:5173/download?status=rilis`. Fitur ini hanya aktif pada mode pengembangan dan tidak berlaku di versi produksi.

---

## Platform Download

Halaman Download memisahkan platform komputer dan perangkat mobile ke dalam dua showcase tersendiri.

| Platform | File | Kebutuhan Sistem |
|---|---|---|
| Windows | `SuperPixelBros-Windows.zip` | Windows 10/11, 64-bit |
| Linux | `SuperPixelBros-Linux.x86_64` | Ubuntu 20.04 atau lebih baru, x86_64 |
| macOS | `SuperPixelBros-macOS.zip` | macOS 11 Big Sur atau lebih baru, Intel dan Apple Silicon |
| Android | `SuperPixelBros.apk` | Android 7.0 atau lebih baru, gamepad didukung |

Selain tombol download, halaman ini menyediakan:

| Bagian | Deskripsi |
|---|---|
| Lencana dan Banner Status | Menjelaskan status rilis saat ini secara otomatis |
| Perjalanan Rilis | Tiga tahap: Pengembangan, Beta Terbuka, dan Rilis Resmi, dengan tahap aktif ditandai |
| Cara Instalasi | Panduan instalasi per platform dalam bentuk tab |
| Pertanyaan Umum | Informasi seputar harga, kebutuhan Godot, penyimpanan progres, gamepad, dan tombol terkunci |

---

## Sumber Data

Seluruh data game yang tampil di website (level, kosmetik, sprite, musuh, power-up, kontrol, dan audio) berasal langsung dari game Super Pixel Bros. Peta 20 level disimpan dalam bentuk ASCII terkompresi di `src/data/levelMaps.js`, sedangkan definisi sprite, tema, musuh, rintangan, dan kontrol dipusatkan di `src/lib/data.js`. Sistem kosmetik adalah port JavaScript dari `scripts/cosmetics.gd` milik game, sehingga seluruh karakter dan kosmetik digambar ulang dari peta pixel yang sama tanpa membutuhkan atlas gambar tambahan.

---

## Teknologi

| Layer | Teknologi |
|---|---|
| Framework Frontend | React 18 (JavaScript, JSX) |
| Bundler dan Dev Server | Vite 5 dengan `@vitejs/plugin-react` |
| Routing | Router buatan sendiri (`src/lib/router.jsx`) berbasis History API, dengan code-splitting per halaman |
| Styling | CSS biasa (tanpa framework), dipisah menjadi `base.css`, `components.css`, dan `pages.css` |
| Gambar dan Animasi | Sprite sheet pixel-art, Canvas untuk kosmetik, animasi CSS berbasis `transform` dan `opacity` |
| Font | Press Start 2P (lokal) dan Pixelify Sans (Google Fonts, otomatis memakai font sistem jika offline) |
| Audio | File MP3 dari game dengan pemutar buatan sendiri (`src/lib/sound.js`) |
| Package Manager | npm (pnpm juga didukung, lockfile tersedia) |
| Hosting dan Deployment | Vercel |

---

## Pengembangan Lokal

### Prasyarat

- Node.js (disarankan versi 18 atau lebih baru)
- npm

### Instalasi

```sh
git clone <url-repositori-ini>
cd super-pixel-bros-web
npm install
```

### Script yang Tersedia

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan lokal |
| `npm run build` | Membuat build produksi di folder `dist/` |
| `npm run preview` | Menjalankan build produksi secara lokal untuk diuji |

### Menjalankan Proyek

```sh
npm run dev
```

Website dapat dibuka secara lokal pada alamat yang tampil di terminal, secara bawaan `http://localhost:5173`.

---

## Deployment ke Vercel

1. Unggah folder proyek ini ke GitHub, atau gunakan Vercel CLI.
2. Di dashboard Vercel, pilih **Add New**, lalu **Project**, kemudian **Import** repositori tersebut.
3. Vercel mengenali Vite secara otomatis dengan perintah build `npm run build` dan folder output `dist`. Tidak ada pengaturan tambahan yang diperlukan.
4. Setiap kali `src/config.js` diubah dan di-push, Vercel akan melakukan deploy ulang secara otomatis.

File `vercel.json` sudah mengatur hal-hal berikut:

| Pengaturan | Fungsi |
|---|---|
| Rewrite semua URL ke `index.html` | Memastikan route seperti `/dunia` atau `/shop` tetap berfungsi saat dibuka langsung atau di-refresh |
| Cache `/assets/*` selama 1 tahun (immutable) | File hasil build memiliki nama berhash sehingga aman di-cache lama |
| Cache `/game/*` selama 7 hari dengan stale-while-revalidate | Aset game dimuat cepat tanpa menghambat pembaruan |

---

</div>

## Struktur Proyek

```
super-pixel-bros-web/
├── index.html                 # Titik masuk HTML, meta tag, dan splash loading
├── vercel.json                # Rewrite SPA dan aturan cache aset
├── vite.config.js             # Konfigurasi build Vite
├── package.json
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── game/                  # Seluruh aset game
│       ├── sprites/           # Sprite karakter, musuh, item, dan dekorasi
│       ├── tiles/             # Tileset per tema dunia
│       ├── bg/                # Latar parallax per tema
│       ├── ui/                # Logo dan elemen UI
│       ├── fonts/             # Press Start 2P
│       └── audio/             # 8 lagu dan 21 efek suara (MP3)
└── src/
    ├── config.js              # Status rilis, link download, versi, dan tanggal rilis
    ├── main.jsx               # Bootstrap aplikasi React
    ├── App.jsx                # Kerangka aplikasi dan penyajian halaman
    ├── routes.js              # Daftar route, judul, dan deskripsi tiap halaman
    ├── components/            # Sprite, Scene, Runner, LevelExplorer, HeroBuilder, Demos, Labs, Release, Chrome, Ui, Icons, Wipe
    ├── pages/                 # Home, Features, Worlds, PowerUps, Enemies, Shop, Controls, Download, NotFound
    ├── lib/                   # Router, status rilis, suara, kosmetik, level, efek visual, hooks, dan data game
    ├── data/
    │   └── levelMaps.js       # 20 level asli game dalam format ASCII terkompresi
    └── styles/                # base.css, components.css, pages.css
```

<div align="center">

---

## Mengganti atau Menambah Aset

- Untuk mengganti aset, timpa file di `public/game/...` dengan nama file yang sama.
- Untuk menambah efek suara baru, daftarkan pada konstanta `SFX` di `src/lib/data.js`.
- Font judul (Press Start 2P) berada di `public/game/fonts`. Font isi (Pixelify Sans) dimuat dari Google Fonts dan otomatis digantikan font sistem bila perangkat offline.

---

## Performa dan Aksesibilitas

| Aspek | Penerapan |
|---|---|
| Code Splitting | Setiap halaman dimuat sebagai file terpisah dan di-prefetch saat tautan di-hover |
| Animasi Ringan | Animasi hanya memakai `transform` dan `opacity` sehingga dieksekusi oleh GPU, serta berhenti saat tab disembunyikan |
| Reduce Motion | Animasi dikurangi mengikuti pengaturan "Reduce motion" pada perangkat |
| Splash Loading | Layar pemuatan tampil seketika sebelum JavaScript siap, sehingga tidak ada kedipan putih |
| Navigasi Keyboard | Tersedia tautan "Lewati ke konten" dan indikator fokus yang jelas |
| SEO | Judul dan deskripsi unik per halaman, meta tag Open Graph dan Twitter Card, serta `robots.txt` |
| Penyimpanan Aman | Penyimpanan lokal dibungkus penanganan error sehingga website tetap berjalan bila akses penyimpanan diblokir browser |

---

<div align="center">

## Disclaimer

Super Pixel Bros - Website adalah proyek independen yang dibuat untuk memperkenalkan Super Pixel Bros beserta fitur-fiturnya. Seluruh aset, nama, dan konten game yang ditampilkan di website ini merupakan milik proyek Super Pixel Bros. Website ini dibuat semata-mata untuk menyajikan dan mempromosikan game tersebut.

---

*Dibuat untuk Super Pixel Bros.*

[Kembali ke Atas](#super-pixel-bros---website)

</div>