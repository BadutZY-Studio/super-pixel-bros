// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  PUSAT PENGATURAN WEBSITE — hanya file ini yang perlu kamu ubah.        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ┌──────────────────────────────────────────────────────────────────────────┐
// │  STATUS GAME  ←←←  UBAH SATU BARIS DI BAWAH INI                          │
// │                                                                          │
// │  "belum-rilis" → SEMUA tombol download terkunci (walau link sudah diisi) │
// │  "beta"        → tombol yang link-nya SUDAH diisi bisa di-download,      │
// │                  yang link-nya masih kosong tetap terkunci               │
// │  "rilis"       → game resmi rilis, semua link yang diisi terbuka penuh   │
// │                  (yang kosong tampil "Segera hadir")                     │
// └──────────────────────────────────────────────────────────────────────────┘
export const STATUS = "rilis";

// Link download per platform. Isi di dalam tanda kutip. Kosongkan ("") jika belum ada.
// Contoh: windows: "https://github.com/akunmu/super-pixel-bros/releases/download/v0.9/SuperPixelBros-Windows.zip",
export const LINKS = {
  windows: "https://github.com/BadutZY-Studio/super-pixel-bros-game/releases/download/Windows/Super.Pixel.Bros.exe",
  linux: "https://github.com/BadutZY-Studio/super-pixel-bros-game/releases/download/Linux/Super.Pixel.Bros.x86_64",
  macos: "https://github.com/BadutZY-Studio/super-pixel-bros-game/releases/download/MacOS/Super.Pixel.Bros.zip",
  android: "https://github.com/BadutZY-Studio/super-pixel-bros-game/releases/download/Android/Super.Pixel.Bros.apk",
};

export const ISSUES_URL = "https://github.com/BadutZY-Studio/super-pixel-bros-game/issues";

// Opsional — tampil di halaman Download dan hero.
export const VERSION = "1.0.0";
export const RELEASE_DATE = ""; // contoh: "1 Desember 2026" (dipakai saat status "belum-rilis"; boleh kosong)