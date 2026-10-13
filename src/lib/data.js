// Semua data konten website. Sumber: kode & aset game (Godot).
export const G = "/game";

/** Definisi sprite: fw/fh = ukuran 1 frame, sheet = lebar seluruh gambar, frames+dur = animasi, start = frame awal. */
export const SPRITES = {
  heroSmallRun: { src: "player_small", fw: 16, fh: 16, sheet: 112, frames: 3, start: 1, dur: 0.3 },
  heroBigRun: { src: "player_big", fw: 16, fh: 32, sheet: 112, frames: 3, start: 1, dur: 0.3 },
  heroFireRun: { src: "player_fire", fw: 16, fh: 32, sheet: 112, frames: 3, start: 1, dur: 0.3 },
  heroSmall: { src: "player_small", fw: 16, fh: 16, sheet: 112 },
  heroBig: { src: "player_big", fw: 16, fh: 32, sheet: 112 },
  heroFire: { src: "player_fire", fw: 16, fh: 32, sheet: 112 },
  heroSmallJump: { src: "player_small", fw: 16, fh: 16, sheet: 112, start: 4 },
  heroBigJump: { src: "player_big", fw: 16, fh: 32, sheet: 112, start: 4 },
  heroFireJump: { src: "player_fire", fw: 16, fh: 32, sheet: 112, start: 4 },
  heroSmallSkid: { src: "player_small", fw: 16, fh: 16, sheet: 112, start: 5 },
  heroSmallDie: { src: "player_small", fw: 16, fh: 16, sheet: 112, start: 6 },
  coin: { src: "coin", fw: 16, fh: 16, sheet: 64, frames: 4, dur: 0.6 },
  goomba: { src: "goomba", fw: 16, fh: 16, sheet: 48, frames: 2, dur: 0.4 },
  goombaFlat: { src: "goomba", fw: 16, fh: 16, sheet: 48, start: 2 },
  koopa: { src: "koopa", fw: 16, fh: 24, sheet: 32, frames: 2, dur: 0.4 },
  shell: { src: "shell", fw: 16, fh: 16, sheet: 64, frames: 4, dur: 0.3 },
  shellStill: { src: "shell", fw: 16, fh: 16, sheet: 64 },
  piranha: { src: "piranha", fw: 16, fh: 24, sheet: 32, frames: 2, dur: 0.4 },
  bat: { src: "bat", fw: 16, fh: 16, sheet: 48, frames: 2, dur: 0.35 },
  batHang: { src: "bat", fw: 16, fh: 16, sheet: 48, start: 2 },
  crusher: { src: "crusher", fw: 24, fh: 24, sheet: 48 },
  crusherAngry: { src: "crusher", fw: 24, fh: 24, sheet: 48, start: 1 },
  mushroom: { src: "mushroom", fw: 16, fh: 16, sheet: 16 },
  flower: { src: "flower", fw: 16, fh: 16, sheet: 16 },
  star: { src: "star", fw: 16, fh: 16, sheet: 32, frames: 2, dur: 0.3 },
  fireball: { src: "fireball", fw: 8, fh: 8, sheet: 16, frames: 2, dur: 0.2 },
  spring: { src: "spring", fw: 16, fh: 16, sheet: 48 },
  springDown: { src: "spring", fw: 16, fh: 16, sheet: 48, start: 1 },
  springUp: { src: "spring", fw: 16, fh: 16, sheet: 48, start: 2 },
  checkpoint: { src: "checkpoint", fw: 16, fh: 32, sheet: 32 },
  checkpointOn: { src: "checkpoint", fw: 16, fh: 32, sheet: 32, start: 1 },
  flag: { src: "flag", fw: 16, fh: 16, sheet: 16 },
  flagBall: { src: "flag_ball", fw: 8, fh: 8, sheet: 8 },
  platform: { src: "platform", fw: 48, fh: 10, sheet: 48 },
  torch: { src: "torch", fw: 16, fh: 32, sheet: 16 },
  castle: { src: "castle", fw: 80, fh: 80, sheet: 80 },
  pipeArrow: { src: "pipe_arrow", fw: 12, fh: 10, sheet: 24, frames: 2, dur: 0.6 },
  // dekorasi dunia
  cloudL: { src: "cloud_l", fw: 48, fh: 24, sheet: 48 },
  cloudS: { src: "cloud_s", fw: 32, fh: 16, sheet: 32 },
  hillL: { src: "hill_l", fw: 80, fh: 40, sheet: 80 },
  hillS: { src: "hill_s", fw: 48, fh: 24, sheet: 48 },
  bushL: { src: "bush_l", fw: 48, fh: 16, sheet: 48 },
  bushS: { src: "bush_s", fw: 32, fh: 16, sheet: 32 },
  cactus: { src: "cactus", fw: 20, fh: 32, sheet: 20 },
  palm: { src: "palm", fw: 24, fh: 40, sheet: 24 },
  pine: { src: "pine", fw: 24, fh: 40, sheet: 24 },
  fern: { src: "fern", fw: 24, fh: 24, sheet: 24 },
  crystal: { src: "crystal", fw: 16, fh: 24, sheet: 16 },
};
for (const d of Object.values(SPRITES)) d.url = `${G}/sprites/${d.src}.png`;

/** Nama berkas dekor di game (gdecor/sdecor) → kunci SPRITES. */
export const DECOR_KEY = { hill_l: "hillL", hill_s: "hillS", bush_s: "bushS", bush_l: "bushL", cactus: "cactus", palm: "palm", crystal: "crystal", pine: "pine", fern: "fern", torch: "torch", cloud_s: "cloudS", cloud_l: "cloudL" };

export const THEME_ORDER = ["grass", "desert", "cave", "snow", "night", "sky", "castle", "jungle", "space"];

export const THEMES = {
  grass: { label: "Grass", music: "grass", fx: "—", fxKind: null, desc: "Bukit hijau cerah, tempat petualangan dimulai.", top: "#5c94fc", bot: "#b0e0ff", far: 0.15, near: 0.35, grav: 1, gdecor: ["hill_l", "hill_s", "bush_s", "bush_l"], sdecor: ["cloud_s", "cloud_l"], day: true },
  desert: { label: "Desert", music: "desert", fx: "Debu", fxKind: "dust", desc: "Gurun panas dengan kaktus, palem, dan reruntuhan kuno.", top: "#faaa64", bot: "#ffe6aa", far: 0.12, near: 0.3, grav: 1, gdecor: ["cactus", "palm", "cactus"], sdecor: ["cloud_s"], day: true },
  cave: { label: "Cave", music: "cave", fx: "Debu gua", fxKind: "dust", desc: "Gua gelap berkilau kristal dan dihuni kelelawar.", top: "#080818", bot: "#1e2042", far: 0.15, near: 0.35, grav: 1, gdecor: ["crystal", "crystal"], sdecor: [] },
  snow: { label: "Snow", music: "snow", fx: "Salju", fxKind: "snow", desc: "Puncak beku dengan lantai es licin dan badai salju.", top: "#8cb9eb", bot: "#ebf5ff", far: 0.12, near: 0.3, grav: 1, gdecor: ["pine", "pine", "bush_s"], sdecor: ["cloud_s", "cloud_l"], day: true },
  night: { label: "Night", music: "night", fx: "—", fxKind: null, desc: "Lari di bawah bulan purnama di langit ungu tengah malam.", top: "#08082c", bot: "#462c78", far: 0.12, near: 0.3, grav: 1, gdecor: ["bush_s", "bush_l", "hill_s"], sdecor: ["cloud_s"] },
  sky: { label: "Sky", music: "sky", fx: "—", fxKind: null, desc: "Melompat dari awan ke awan di atas langit.", top: "#3896ff", bot: "#c8f0ff", far: 0.1, near: 0.25, grav: 1, gdecor: [], sdecor: ["cloud_s", "cloud_l"], day: true },
  castle: { label: "Castle", music: "castle", fx: "Bara api", fxKind: "embers", desc: "Benteng berlava, tongkat api, dan obor menyala.", top: "#18000a", bot: "#6e1a18", far: 0.15, near: 0.35, grav: 1, gdecor: ["torch", "torch"], sdecor: [] },
  jungle: { label: "Jungle", music: "grass", fx: "—", fxKind: null, desc: "Hutan tropis lebat penuh pipa warp rahasia.", top: "#288c82", bot: "#b0e8be", far: 0.14, near: 0.34, grav: 1, gdecor: ["fern", "bush_l", "fern", "palm", "bush_s"], sdecor: ["cloud_s"], day: true },
  space: { label: "Space", music: "sky", fx: "Gravitasi rendah", fxKind: "dust", desc: "Permukaan bulan dengan gravitasi 55% — lompatan melayang!", top: "#040216", bot: "#2c1a60", far: 0.08, near: 0.22, grav: 0.55, gdecor: [], sdecor: [] },
};
/** Lapisan gambar langit tambahan yang tersedia di aset. */
export const SKY_IMG = { cave: "bg_cave_sky", desert: "bg_desert_sky", night: "bg_night_sky", space: "bg_space_sky" };

export const LEVELS = [
  ["GREEN HILLS", "grass", 300], ["DUNE RUN", "desert", 320], ["CRYSTAL CAVE", "cave", 340], ["FROSTY PEAKS", "snow", 340],
  ["MIDNIGHT RUN", "night", 330], ["SKY HIGH", "sky", 320], ["ANCIENT RUINS", "desert", 350], ["BLIZZARD PASS", "snow", 360],
  ["FIRE FORTRESS", "castle", 380], ["FINAL CASTLE", "castle", 420], ["WARP VALLEY", "jungle", 330], ["VINE RUN", "jungle", 340],
  ["BAT CAVE", "cave", 350], ["SPRING DUNES", "desert", 350], ["ICE STEPS", "snow", 360], ["MOONWALK", "space", 340],
  ["CRATER CRUSH", "space", 360], ["MIDNIGHT BATS", "night", 370], ["LAVA FORGE", "castle", 400], ["KING'S RETURN", "castle", 440],
].map(([name, theme, time], i) => ({ n: i + 1, name, theme, time, chapter: i < 10 ? 1 : 2 }));

export const ENEMIES = [
  { id: "goomba", name: "Goomba", sprite: "goomba", chapter: 1, how: "Injak, tembak api, atau pakai Star", desc: "Musuh jamur yang berjalan bolak-balik. Injak beruntun untuk combo skor yang makin besar." },
  { id: "koopa", name: "Koopa", sprite: "koopa", chapter: 1, how: "Injak lalu tendang cangkangnya", desc: "Kura-kura yang bersembunyi di cangkang saat diinjak. Tendang cangkangnya untuk menyapu musuh lain!" },
  { id: "piranha", name: "Piranha Plant", sprite: "piranha", chapter: 1, how: "Fireball atau Star", desc: "Tanaman lapar yang muncul-tenggelam dari pipa. Perhatikan ritmenya sebelum melewatinya." },
  { id: "bat", name: "Bat", sprite: "bat", chapter: 2, how: "Injak, fireball, atau Star", desc: "Kelelawar yang menggantung di langit-langit lalu menukik ke arahmu di gua dan malam hari." },
  { id: "crusher", name: "Crusher", sprite: "crusher", chapter: 2, how: "Hindari — tidak bisa dikalahkan", desc: "Balok batu raksasa yang menghantam tanah. Tunggu ia naik, lalu lari di bawahnya." },
];

export const HAZARDS = [
  { id: "spike", name: "Spike", desc: "Duri tajam — langsung melukai saat disentuh." },
  { id: "lava", name: "Lava", desc: "Kolam lava di benteng. Jatuh berarti kehilangan nyawa." },
  { id: "pit", name: "Jurang", desc: "Lompatan meleset = jatuh ke bawah layar." },
  { id: "firebar", name: "Fire Bar", desc: "Tongkat api berputar di kastil (Chapter 2)." },
  { id: "ice", name: "Es Licin", desc: "Lantai es di level salju membuatmu meluncur." },
  { id: "time", name: "Waktu", desc: "Timer habis = nyawa hilang. Musik 'hurry' berbunyi saat waktu menipis." },
];

export const POWERUPS = [
  { name: "Super Mushroom", sprite: "mushroom", desc: "Tumbuh menjadi besar. Bisa memecahkan blok bata dan menahan satu serangan tambahan." },
  { name: "Fire Flower", sprite: "flower", desc: "Berubah menjadi Fire form dan tembakkan bola api yang memantul untuk mengalahkan musuh dari jauh." },
  { name: "Star", sprite: "star", desc: "Tak terkalahkan selama 9 detik! Tabrak semua musuh yang menghalangi. (Chapter 2: Star Block)" },
  { name: "Coin", sprite: "coin", desc: "Kumpulkan 100 koin untuk 1UP. Koin juga jadi mata uang di Shop kosmetik." },
];

export const MOVEMENT = [
  { name: "Variable Jump", desc: "Tahan tombol lompat lebih lama untuk lompatan lebih tinggi." },
  { name: "Coyote Time", desc: "Masih bisa melompat sepersekian detik setelah keluar dari pinggiran." },
  { name: "Jump Buffer", desc: "Tekan lompat sedikit sebelum mendarat — tetap terhitung." },
  { name: "Run & Skid", desc: "Tahan lari untuk kecepatan penuh, dan rasakan efek skid saat berbalik arah." },
  { name: "Stomp Combo", desc: "Injak musuh beruntun tanpa menyentuh tanah untuk skor berlipat hingga 1UP." },
  { name: "Low Gravity", desc: "Level Space memakai gravitasi 55% untuk lompatan melayang." },
];

export const SYSTEMS = [
  { t: "Nyawa & 1UP", d: "Kumpulkan 100 koin atau combo injak panjang untuk nyawa ekstra. Habis nyawa = Game Over.", s: "mushroom" },
  { t: "Checkpoint", d: "Bendera di tengah level menyimpan posisimu saat kehilangan nyawa.", s: "checkpointOn" },
  { t: "Flagpole & Bonus", d: "Skor berdasarkan ketinggian sentuhan tiang, lalu sisa waktu dihitung jadi bonus.", s: "flag" },
  { t: "High Score & Save", d: "Progres, level terbuka, skor terbaik, koin & kosmetik tersimpan otomatis.", s: "coin" },
  { t: "Warp Pipe", d: "Masuk pipa berpanah untuk ruang bonus atau jalan pintas rahasia.", s: "pipeArrow" },
  { t: "Efek Tiap Tema", d: "Salju turun, bara api melayang, debu gua — atmosfer berbeda di tiap dunia.", s: "torch" },
];

export const UI_FEATURES = [
  "Transisi wipe kotak pixel antar layar",
  "Menu judul animasi: logo jatuh memantul & pelari pengumpul koin",
  "Tombol 3D dengan panah berkedip dan kilau",
  "Pilih level: kartu bertema, bintang, gembok, pindah chapter",
  "HUD dengan skor berputar dan bar waktu berwarna",
  "Layar intro level, pause, course clear (confetti) & game over",
  "Options: slider volume musik & SFX, fullscreen, reset progress",
  "8 lagu chiptune orisinal + 21 efek suara",
];

export const CONTROLS = [
  { action: "Gerak", keys: ["←", "→", "A", "D"], pad: "D-pad / Stick kiri" },
  { action: "Lompat (tahan = tinggi)", keys: ["SPACE", "Z", "W", "↑", "K"], pad: "A" },
  { action: "Lari + Tembak api", keys: ["SHIFT", "X", "J"], pad: "X / B" },
  { action: "Masuk pipa", keys: ["↓", "S"], pad: "D-pad bawah" },
  { action: "Pause", keys: ["P", "ESC"], pad: "Start" },
  { action: "Ganti chapter / tab", keys: ["Q", "E"], pad: "LB / RB" },
];

/** 8 lagu & 21 efek suara dari game. */
export const MUSIC = [
  { id: "menu", label: "Menu Utama", where: "Layar judul & pilih level" },
  { id: "grass", label: "Green Hills", where: "Grass · Jungle" },
  { id: "desert", label: "Dune Run", where: "Desert" },
  { id: "cave", label: "Crystal Cave", where: "Cave" },
  { id: "snow", label: "Frosty Peaks", where: "Snow" },
  { id: "night", label: "Midnight Run", where: "Night" },
  { id: "sky", label: "Sky High", where: "Sky · Space" },
  { id: "castle", label: "Fire Fortress", where: "Castle" },
];
export const SFX = [
  ["click", "Klik menu"], ["select", "Pilih menu"], ["coin", "Ambil koin"], ["jump", "Lompat"], ["jump_big", "Lompat (besar)"], ["stomp", "Injak musuh"],
  ["kick", "Tendang cangkang"], ["bump", "Sundul blok"], ["break", "Pecah bata"], ["powerup_appear", "Power-up muncul"], ["powerup", "Ambil power-up"], ["fireball", "Tembak api"],
  ["oneup", "Nyawa ekstra"], ["pipe", "Masuk pipa"], ["checkpoint", "Checkpoint"], ["flag", "Tiang bendera"], ["win", "Course clear"], ["die", "Mati"],
  ["gameover", "Game over"], ["hurry", "Waktu menipis"], ["tick", "Hitung bonus waktu"],
];

/** Semua sprite di folder aset game, dipakai di Museum Aset. */
export const ASSET_SPRITES = [
  ["heroSmallRun", "player_small"], ["heroBigRun", "player_big"], ["heroFireRun", "player_fire"], ["goomba", "goomba"], ["koopa", "koopa"], ["shell", "shell"], ["piranha", "piranha"],
  ["bat", "bat"], ["crusher", "crusher"], ["coin", "coin"], ["mushroom", "mushroom"], ["flower", "flower"], ["star", "star"], ["fireball", "fireball"], ["spring", "spring"],
  ["checkpointOn", "checkpoint"], ["flag", "flag"], ["flagBall", "flag_ball"], ["platform", "platform"], ["pipeArrow", "pipe_arrow"], ["torch", "torch"], ["castle", "castle"],
  ["cloudL", "cloud_l"], ["cloudS", "cloud_s"], ["hillL", "hill_l"], ["hillS", "hill_s"], ["bushL", "bush_l"], ["bushS", "bush_s"], ["cactus", "cactus"], ["palm", "palm"],
  ["pine", "pine"], ["fern", "fern"], ["crystal", "crystal"],
];
