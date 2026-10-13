// Daftar halaman. `load` = import dinamis (code-splitting: tiap halaman jadi file terpisah).
export const routes = [
  { path: "/", load: () => import("./pages/Home.jsx"), title: "Super Pixel Bros - Game Platformer Pixel Klasik", description: "Lari, lompat, dan injak musuh di 20 level & 9 dunia. Super Pixel Bros: platformer pixel dengan power-up, warp pipe, dan 55 kosmetik." },
  { path: "/fitur", load: () => import("./pages/Features.jsx"), title: "Fitur Game - Super Pixel Bros", description: "Fisika lompat modern, combo, checkpoint, save otomatis, shop kosmetik, musik chiptune, dan museum aset Super Pixel Bros." },
  { path: "/dunia", load: () => import("./pages/Worlds.jsx"), title: "Dunia & Level - Super Pixel Bros", description: "Jelajahi 20 level di 9 tema dunia: pratinjau dunia, musik, dan penjelajah level interaktif dari data asli game." },
  { path: "/power-up", load: () => import("./pages/PowerUps.jsx"), title: "Power-Up & Item - Super Pixel Bros", description: "Super Mushroom, Fire Flower, Star, koin, ? block, warp pipe, spring, dan platform — coba langsung demonya." },
  { path: "/musuh", load: () => import("./pages/Enemies.jsx"), title: "Musuh & Rintangan - Super Pixel Bros", description: "Kenali Goomba, Koopa, Piranha Plant, Bat, Crusher, lava, spike, fire bar, dan es licin." },
  { path: "/shop", load: () => import("./pages/Shop.jsx"), title: "Shop Kosmetik - Super Pixel Bros", description: "55 kosmetik: skin, suit, topi, aksesori wajah, sayap & jetpack, serta trail. Padukan dan lihat langsung." },
  { path: "/kontrol", load: () => import("./pages/Controls.jsx"), title: "Kontrol - Super Pixel Bros", description: "Panduan kontrol keyboard, sentuh, dan gamepad Super Pixel Bros. Coba langsung di halaman." },
  { path: "/download", load: () => import("./pages/Download.jsx"), title: "Download - Super Pixel Bros", description: "Download Super Pixel Bros untuk Windows, Linux, macOS, dan Android. Cek status rilis dan kebutuhan sistem." },
];
export const notFound = () => import("./pages/NotFound.jsx");
