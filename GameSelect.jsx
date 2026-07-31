import React, { useState, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  X,
  ArrowRight,
  Copy,
  GripVertical,
  Gamepad2,
  Camera,
  ListOrdered,
  Search,
  Trophy,
  Mail,
  Phone,
  Star,
  Sparkles,
} from "lucide-react";

// ---------------------------------------------------------------------------
// 📸 IMAGE STORAGE RECOMMENDATION:
// ---------------------------------------------------------------------------
// Best practice: Place images in `/public/images/covers/` locally,
// OR use a CDN (Cloudinary, Imgix, Vercel Blob) for production.
// ❌ Avoid Google Drive direct links — CORS issues break <img>.
// ---------------------------------------------------------------------------

const CUSTOM_GAMES = [];

const BASE_GAMES = [
  { id: "gowr", title: "God of War Ragnarök", genre: "Action / Adventure", year: 2022, studio: "PLAYSTATION", rating: 94 },
  { id: "sm2", title: "Marvel's Spider-Man 2", genre: "Action / Adventure", year: 2023, studio: "PLAYSTATION", rating: 90 },
  { id: "hfw", title: "Horizon Forbidden West", genre: "Action RPG", year: 2022, studio: "PLAYSTATION", rating: 88 },
  { id: "ds", title: "Demon's Souls", genre: "Action RPG", year: 2020, studio: "PLAYSTATION", rating: 92 },
  { id: "rc", title: "Ratchet & Clank: Rift Apart", genre: "Platformer", year: 2021, studio: "PLAYSTATION", rating: 88 },
  { id: "got", title: "Ghost of Tsushima: Director's Cut", genre: "Action / Adventure", year: 2021, studio: "PLAYSTATION", rating: 87 },
  { id: "ff16", title: "Final Fantasy XVI", genre: "Action RPG", year: 2023, studio: "MULTIPLATFORM", rating: 87 },
  { id: "er", title: "Elden Ring", genre: "Action RPG", year: 2022, studio: "MULTIPLATFORM", rating: 96 },
  { id: "ret", title: "Returnal", genre: "Roguelike Shooter", year: 2021, studio: "PLAYSTATION", rating: 86 },
  { id: "gt7", title: "Gran Turismo 7", genre: "Racing Sim", year: 2022, studio: "PLAYSTATION", rating: 87 },
  { id: "tlou", title: "The Last of Us Part I", genre: "Action / Horror", year: 2022, studio: "PLAYSTATION", rating: 89 },
  { id: "tlou2r", title: "The Last of Us Part II", genre: "Action / Horror", year: 2024, studio: "PLAYSTATION", rating: 89 },
  { id: "dsdc", title: "Death Stranding: Director's Cut", genre: "Action", year: 2021, studio: "PLAYSTATION", rating: 86 },
  { id: "bg3", title: "Baldur's Gate 3", genre: "RPG", year: 2023, studio: "MULTIPLATFORM", rating: 96 },
  { id: "cp77", title: "Cyberpunk 2077", genre: "RPG", year: 2020, studio: "MULTIPLATFORM", rating: 86 },
  { id: "re4", title: "Resident Evil 4", genre: "Survival Horror", year: 2023, studio: "MULTIPLATFORM", rating: 93 },
  { id: "sf6", title: "Street Fighter 6", genre: "Fighting", year: 2023, studio: "MULTIPLATFORM", rating: 92 },
  { id: "d4", title: "Diablo IV", genre: "Action RPG", year: 2023, studio: "MULTIPLATFORM", rating: 86 },
  { id: "hl", title: "Hogwarts Legacy", genre: "Action RPG", year: 2023, studio: "MULTIPLATFORM", rating: 83 },
  { id: "itw", title: "It Takes Two", genre: "Co-op Adventure", year: 2021, studio: "MULTIPLATFORM", rating: 88 },
  { id: "sb", title: "Stellar Blade", genre: "Action", year: 2024, studio: "PLAYSTATION", rating: 85 },
  { id: "mm", title: "Marvel's Spider-Man: Miles Morales", genre: "Action / Adventure", year: 2020, studio: "PLAYSTATION", rating: 85 },
  { id: "sack", title: "Sackboy: A Big Adventure", genre: "Platformer", year: 2020, studio: "PLAYSTATION", rating: 79 },
  { id: "dl", title: "Deathloop", genre: "Immersive Sim", year: 2021, studio: "MULTIPLATFORM", rating: 88 },
  { id: "astro", title: "Astro Bot", genre: "Platformer", year: 2024, studio: "PLAYSTATION", rating: 94 },
  { id: "hd2", title: "Helldivers 2", genre: "Co-op Shooter", year: 2024, studio: "MULTIPLATFORM", rating: 82 },
  { id: "aw2", title: "Alan Wake 2", genre: "Survival Horror", year: 2023, studio: "MULTIPLATFORM", rating: 89 },
  { id: "tk8", title: "Tekken 8", genre: "Fighting", year: 2024, studio: "MULTIPLATFORM", rating: 90 },
  { id: "dd2", title: "Dragon's Dogma 2", genre: "Action RPG", year: 2024, studio: "MULTIPLATFORM", rating: 86 },
  { id: "sifu", title: "Sifu", genre: "Action", year: 2022, studio: "MULTIPLATFORM", rating: 81 },
  { id: "gr", title: "Ghostrunner", genre: "Action / Platformer", year: 2020, studio: "MULTIPLATFORM", rating: 79 },
  { id: "wukong", title: "Black Myth: Wukong", genre: "Action RPG", year: 2024, studio: "MULTIPLATFORM", rating: 86 },
  { id: "ff7rb", title: "Final Fantasy VII Rebirth", genre: "Action RPG", year: 2024, studio: "PLAYSTATION", rating: 92 },
  { id: "lop", title: "Lies of P", genre: "Action RPG", year: 2023, studio: "MULTIPLATFORM", rating: 84 },
  { id: "acm", title: "Armored Core VI", genre: "Action / Mech", year: 2023, studio: "MULTIPLATFORM", rating: 86 },
  { id: "coc", title: "Call of Duty: MWIII", genre: "Shooter", year: 2023, studio: "MULTIPLATFORM", rating: 71 },
  { id: "gta5", title: "Grand Theft Auto V", genre: "Open World", year: 2013, studio: "MULTIPLATFORM", rating: 97 },
  { id: "rdr2", title: "Red Dead Redemption 2", genre: "Open World", year: 2018, studio: "MULTIPLATFORM", rating: 97 },
  { id: "tw3", title: "The Witcher 3: Wild Hunt", genre: "Action RPG", year: 2015, studio: "MULTIPLATFORM", rating: 94 },
  { id: "sekiro", title: "Sekiro: Shadows Die Twice", genre: "Action RPG", year: 2019, studio: "MULTIPLATFORM", rating: 90 },
  { id: "bb", title: "Bloodborne", genre: "Action RPG", year: 2015, studio: "PLAYSTATION", rating: 92 },
  { id: "p5r", title: "Persona 5 Royal", genre: "JRPG", year: 2019, studio: "MULTIPLATFORM", rating: 95 },
  { id: "nier", title: "NieR: Automata", genre: "Action RPG", year: 2017, studio: "MULTIPLATFORM", rating: 89 },
  { id: "hades", title: "Hades", genre: "Roguelike", year: 2020, studio: "MULTIPLATFORM", rating: 93 },
  { id: "control", title: "Control Ultimate Edition", genre: "Action / Adventure", year: 2019, studio: "MULTIPLATFORM", rating: 85 },
  { id: "msr", title: "Mortal Shell", genre: "Action RPG", year: 2020, studio: "MULTIPLATFORM", rating: 73 },
  { id: "fc25", title: "FC 25", genre: "Sports", year: 2024, studio: "MULTIPLATFORM", rating: 75 },
  { id: "fc26", title: "FC 26", genre: "Sports", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "ufc5", title: "UFC 5", genre: "Sports", year: 2023, studio: "MULTIPLATFORM", rating: 77 },
  { id: "ufc6", title: "UFC 6", genre: "Sports", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "007fl", title: "007: First Light - Deluxe Edition", genre: "Action / Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "acbfr", title: "Assassin's Creed: Black Flag - Resynced", genre: "Action / Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "cd", title: "Crimson Desert", genre: "Action RPG", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "bf6", title: "Battlefield 6", genre: "Shooter", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "fh6", title: "Forza Horizon 6", genre: "Racing Sim", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "goy", title: "Ghost of Yōtei", genre: "Action / Adventure", year: 2025, studio: "PLAYSTATION", rating: null },
  { id: "co33", title: "Clair Obscur: Expedition 33", genre: "RPG", year: 2025, studio: "MULTIPLATFORM", rating: 91 },
  { id: "f125", title: "F1 25", genre: "Racing Sim", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "gowss", title: "God of War: Sons of Sparta", genre: "Action / Adventure", year: 2025, studio: "PLAYSTATION", rating: null },
  { id: "ijgc", title: "Indiana Jones and the Great Circle", genre: "Action / Adventure", year: 2024, studio: "MULTIPLATFORM", rating: 87 },
  { id: "sf", title: "Split Fiction", genre: "Co-op Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "awo", title: "A Way Out", genre: "Co-op Adventure", year: 2018, studio: "MULTIPLATFORM", rating: 78 },
  { id: "pragma", title: "Pragmata", genre: "Action / Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "mafiatoc", title: "Mafia: The Old Country", genre: "Action / Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "mk1", title: "Mortal Kombat 1", genre: "Fighting", year: 2023, studio: "MULTIPLATFORM", rating: 82 },
  { id: "saros", title: "Saros", genre: "Roguelike Shooter", year: 2025, studio: "PLAYSTATION", rating: null },
  { id: "ds2otb", title: "Death Stranding 2: On the Beach", genre: "Action", year: 2025, studio: "PLAYSTATION", rating: null },
  { id: "tlou2", title: "The Last of Us: Part II - Remastered", genre: "Action / Horror", year: 2024, studio: "PLAYSTATION", rating: null },
  { id: "bmyw", title: "Black Myth: Wukong", genre: "Action RPG", year: 2024, studio: "MULTIPLATFORM", rating: 86 },
  { id: "bop7", title: "Call of Duty: Black Ops 7", genre: "Shooter", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "dgr", title: "Days Gone: Remastered", genre: "Action / Adventure", year: 2024, studio: "PLAYSTATION", rating: null },
  { id: "fc6", title: "Far Cry 6", genre: "Shooter", year: 2021, studio: "MULTIPLATFORM", rating: 73 },
  { id: "hades2", title: "Hades II", genre: "Roguelike", year: 2024, studio: "MULTIPLATFORM", rating: 88 },
  { id: "hiu", title: "Hell Is Us", genre: "Action / Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "nba2k25", title: "NBA 2K25", genre: "Sports", year: 2024, studio: "MULTIPLATFORM", rating: 77 },
  { id: "nioh3", title: "Nioh 3", genre: "Action RPG", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "rereq", title: "Resident Evil: Requiem", genre: "Survival Horror", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "wwe2k25", title: "WWE 2K25", genre: "Sports", year: 2025, studio: "MULTIPLATFORM", rating: 80 },
  { id: "wwe2k26", title: "WWE 2K26", genre: "Sports", year: 2026, studio: "MULTIPLATFORM", rating: null },
  { id: "dbh", title: "Detroit: Become Human", genre: "Adventure", year: 2018, studio: "MULTIPLATFORM", rating: 78 },
  { id: "aptar", title: "A Plague Tale: Requiem", genre: "Action / Adventure", year: 2022, studio: "MULTIPLATFORM", rating: 82 },
  { id: "aitd", title: "Alone in the Dark", genre: "Survival Horror", year: 2024, studio: "MULTIPLATFORM", rating: 68 },
  { id: "acsh", title: "Assassin's Creed: Shadows", genre: "Action RPG", year: 2025, studio: "MULTIPLATFORM", rating: 78 },
  { id: "bang", title: "Banishers: Ghosts of New Eden", genre: "Action RPG", year: 2024, studio: "MULTIPLATFORM", rating: 75 },
  { id: "bp", title: "Blue Prince", genre: "RPG", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "bop6", title: "Call of Duty: Black Ops 6", genre: "Shooter", year: 2024, studio: "MULTIPLATFORM", rating: 80 },
  { id: "comw2", title: "Call of Duty: MWII - Modern Warfare II", genre: "Shooter", year: 2022, studio: "MULTIPLATFORM", rating: 75 },
  { id: "comw3", title: "Call of Duty: MWII - Modern Warfare III", genre: "Shooter", year: 2023, studio: "MULTIPLATFORM", rating: 57 },
  { id: "crnd", title: "Cronos: The New Dawn", genre: "Survival Horror", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "dispatch", title: "Dispatch", genre: "Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "doomda", title: "Doom: The Dark Ages", genre: "Shooter", year: 2025, studio: "MULTIPLATFORM", rating: 85 },
  { id: "dl2", title: "Dying Light 2: Stay Human", genre: "Action RPG", year: 2022, studio: "MULTIPLATFORM", rating: 77 },
  { id: "dltb", title: "Dying Light: The Beast", genre: "Action / Horror", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "ern", title: "Elden Ring: Nightreign", genre: "Action RPG", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "fh5", title: "Forza Horizon 5", genre: "Racing Sim", year: 2021, studio: "MULTIPLATFORM", rating: 91 },
  { id: "hm3", title: "Hitman III", genre: "Action / Stealth", year: 2021, studio: "MULTIPLATFORM", rating: 87 },
  { id: "hksilk", title: "Hollow Knight: Silksong", genre: "Action / Platformer", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "ioa", title: "Immortals of Aveum", genre: "Shooter", year: 2023, studio: "MULTIPLATFORM", rating: 72 },
  { id: "legobat", title: "LEGO Batman: Legacy of the Dark Knight", genre: "Action / Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "mk11u", title: "Mortal Kombat 11: Ultimate", genre: "Fighting", year: 2019, studio: "MULTIPLATFORM", rating: 87 },
  { id: "mklk", title: "Mortal Kombat: Legacy Kollection", genre: "Fighting", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "mousepi", title: "Mouse: P.I. for Hire", genre: "Action / Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "nfsu", title: "NFS: Unbound", genre: "Racing Sim", year: 2022, studio: "MULTIPLATFORM", rating: 77 },
  { id: "ng4", title: "Ninja Gaiden 4", genre: "Action", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "re2", title: "Resident Evil 2", genre: "Survival Horror", year: 2019, studio: "MULTIPLATFORM", rating: 91 },
  { id: "sr", title: "Saints Row", genre: "Open World", year: 2022, studio: "MULTIPLATFORM", rating: 63 },
  { id: "shinobi", title: "Shinobi: Art of Vengeance", genre: "Action", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "sonicrc", title: "Sonic Racing: CrossWorlds", genre: "Racing", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "alters", title: "The Alters", genre: "Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "tw3ce", title: "The Witcher 3: Wild Hunt - Complete Edition", genre: "Action RPG", year: 2022, studio: "MULTIPLATFORM", rating: 94 },
  { id: "tty", title: "Trek to Yomi", genre: "Action", year: 2022, studio: "MULTIPLATFORM", rating: 68 },
  { id: "twm", title: "Twelve Minutes", genre: "Adventure", year: 2021, studio: "MULTIPLATFORM", rating: 67 },
  { id: "wh40k2", title: "Warhammer 40,000: Space Marine II", genre: "Shooter", year: 2024, studio: "MULTIPLATFORM", rating: 80 },
  { id: "awr", title: "Alan Wake: Remastered", genre: "Survival Horror", year: 2021, studio: "MULTIPLATFORM", rating: null },
  { id: "acmi", title: "Assassin's Creed: Mirage", genre: "Action / Adventure", year: 2023, studio: "MULTIPLATFORM", rating: 76 },
  { id: "acv", title: "Assassin's Creed: Valhalla", genre: "Action RPG", year: 2020, studio: "MULTIPLATFORM", rating: 80 },
  { id: "ah", title: "Atomic Heart", genre: "Shooter", year: 2023, studio: "MULTIPLATFORM", rating: 75 },
  { id: "avfp", title: "Avatar: Frontiers of Pandora", genre: "Action / Adventure", year: 2023, studio: "MULTIPLATFORM", rating: 72 },
  { id: "bge20", title: "Beyond Good & Evil: 20th Anniversary", genre: "Action / Adventure", year: 2024, studio: "MULTIPLATFORM", rating: null },
  { id: "bocw", title: "Call of Duty: Black Ops - Cold War", genre: "Shooter", year: 2020, studio: "MULTIPLATFORM", rating: 76 },
  { id: "castd", title: "Castlevania: Dominus Collection", genre: "Action / Platformer", year: 2024, studio: "MULTIPLATFORM", rating: null },
  { id: "deadspace", title: "Dead Space", genre: "Survival Horror", year: 2023, studio: "MULTIPLATFORM", rating: 89 },
  { id: "erik", title: "Eriksholm: The Stolen Dream", genre: "Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "gr2", title: "Ghostrunner II", genre: "Action / Platformer", year: 2023, studio: "MULTIPLATFORM", rating: 74 },
  { id: "hzd", title: "Horizon: Zero Dawn - Remastered", genre: "Action RPG", year: 2024, studio: "PLAYSTATION", rating: 86 },
  { id: "lisr", title: "Life Is Strange: Reunion", genre: "Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "ladi", title: "Like a Dragon: Ishin!", genre: "Action / Adventure", year: 2023, studio: "MULTIPLATFORM", rating: 80 },
  { id: "ln3", title: "Little Nightmares III", genre: "Adventure / Horror", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "lostjud", title: "Lost Judgment", genre: "Action / Adventure", year: 2021, studio: "MULTIPLATFORM", rating: 82 },
  { id: "gotg", title: "Marvel Guardians of the Galaxy", genre: "Action / Adventure", year: 2021, studio: "MULTIPLATFORM", rating: 80 },
  { id: "mgsmc", title: "Metal Gear Solid: Master Collection Vol.1", genre: "Action / Stealth", year: 2023, studio: "MULTIPLATFORM", rating: 83 },
  { id: "metroex", title: "Metro Exodus", genre: "Shooter", year: 2019, studio: "MULTIPLATFORM", rating: 80 },
  { id: "pd3", title: "Payday 3", genre: "Co-op Shooter", year: 2023, studio: "MULTIPLATFORM", rating: 67 },
  { id: "poplc", title: "Prince of Persia: The Lost Crown", genre: "Action / Platformer", year: 2024, studio: "MULTIPLATFORM", rating: 86 },
  { id: "revil", title: "Resident Evil: Village", genre: "Survival Horror", year: 2021, studio: "MULTIPLATFORM", rating: 84 },
  { id: "robocop", title: "RoboCop: Rogue City", genre: "Shooter", year: 2023, studio: "MULTIPLATFORM", rating: 72 },
  { id: "sh2", title: "Silent Hill 2", genre: "Survival Horror", year: 2024, studio: "MULTIPLATFORM", rating: 84 },
  { id: "shf", title: "Silent Hill f", genre: "Survival Horror", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "stray", title: "Stray", genre: "Adventure", year: 2022, studio: "MULTIPLATFORM", rating: 83 },
  { id: "ssktjl", title: "Suicide Squad: Kill the Justice League", genre: "Shooter", year: 2024, studio: "MULTIPLATFORM", rating: 60 },
  { id: "tcp", title: "The Callisto Protocol", genre: "Survival Horror", year: 2022, studio: "MULTIPLATFORM", rating: 69 },
  { id: "rpop", title: "The Rogue Prince of Persia", genre: "Action / Roguelike", year: 2024, studio: "MULTIPLATFORM", rating: 81 },
  { id: "tr123", title: "Tomb Raider I•II•III: Remastered", genre: "Action / Adventure", year: 2024, studio: "MULTIPLATFORM", rating: null },
  { id: "tr456", title: "Tomb Raider IV•V•VI: Remastered", genre: "Action / Adventure", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "ud", title: "Until Dawn", genre: "Survival Horror", year: 2024, studio: "MULTIPLATFORM", rating: null },
  { id: "wff", title: "Wuchang: Fallen Feathers", genre: "Action RPG", year: 2025, studio: "MULTIPLATFORM", rating: null },
  { id: "yakld", title: "Yakuza: Like a Dragon", genre: "RPG", year: 2020, studio: "MULTIPLATFORM", rating: 83 },
  { id: "balatro", title: "BALATRO", genre: "Strategy / Tactics", year: 2024, studio: "MULTIPLATFORM", rating: 92 },

];

function buildGameLibrary(baseGames, customGames) {
  const seenIds = new Set();
  const seenTitles = new Set();
  const games = [];
  for (const game of [...baseGames, ...customGames]) {
    const normalizedTitle = game.title.toLowerCase().trim();
    if (seenIds.has(game.id) || seenTitles.has(normalizedTitle)) continue;
    seenIds.add(game.id);
    seenTitles.add(normalizedTitle);
    games.push(game);
  }
  return games;
}

const GAMES = buildGameLibrary(BASE_GAMES, CUSTOM_GAMES);

function uniqueOrderIds(orderIds) {
  const seenIds = new Set();
  return orderIds.filter((gameId) => {
    if (seenIds.has(gameId)) return false;
    seenIds.add(gameId);
    return true;
  });
}

const GENRE_FA = {
  "Action / Adventure": "اکشن / ماجراجویی",
  "Action RPG": "اکشن نقش‌آفرینی",
  "Platformer": "پلتفرمر",
  "Roguelike Shooter": "تیراندازی روگ‌لایک",
  "Racing Sim": "شبیه‌ساز مسابقه",
  "Action / Horror": "اکشن / ترسناک",
  "Action": "اکشن",
  "RPG": "نقش‌آفرینی",
  "Survival Horror": "ترسناک بقا",
  "Fighting": "مبارزه‌ای",
  "Co-op Adventure": "ماجراجویی مشترک",
  "Immersive Sim": "شبیه‌ساز غوطه‌ور",
  "Co-op Shooter": "تیراندازی مشترک",
  "Action / Platformer": "اکشن / پلتفرمر",
  "Action / Mech": "اکشن / مکانیکی",
  "Shooter": "تیراندازی",
  "Open World": "جهان باز",
  "JRPG": "نقش‌آفرینی ژاپنی",
  "Roguelike": "روگ‌لایک",
  "Sports": "ورزشی",
  "Racing": "مسابقه‌ای",
  "Adventure": "ماجراجویی",
  "Action / Stealth": "اکشن / مخفی‌کاری",
  "Action / Roguelike": "اکشن / روگ‌لایک",
  "Adventure / Horror": "ماجراجویی / ترسناک",
  "Strategy / Tactics": "استراتژی / تاکتیکی",  
};
const genreFa = (g) => GENRE_FA[g] || g;

const SORT_FA = {
  default: "پیش‌فرض",
  az: "الفبا (A-Z)",
  za: "الفبا (Z-A)",
  yearDesc: "سال (جدید‌ترین)",
  yearAsc: "سال (قدیمی‌ترین)",
  ratingDesc: "امتیاز (بالاترین)",
  ratingAsc: "امتیاز (پایین‌ترین)",
};

function hueFor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}

function ratingColor(r) {
  if (r === null || r === undefined) return "rgba(255,255,255,0.25)";
  if (r >= 90) return "#00ff88";
  if (r >= 75) return "#ffd23f";
  if (r >= 50) return "#ff9f1c";
  return "#ff4d6d";
}

// ---------------------------------------------------------------------------
// GLOBAL STYLE SYSTEM
// ---------------------------------------------------------------------------
const GlobalStyle = () => (
  <style>{`
    @import url('https://cdn.jsdelivr.net/fontsource/fonts/orbitron@latest/latin-700-normal.css');
    @import url('https://cdn.jsdelivr.net/fontsource/fonts/orbitron@latest/latin-900-normal.css');
    @import url('https://cdn.jsdelivr.net/fontsource/fonts/vazirmatn@latest/arabic-400-normal.css');
    @import url('https://cdn.jsdelivr.net/fontsource/fonts/vazirmatn@latest/arabic-700-normal.css');

    .font-display { font-family: 'Orbitron', sans-serif; }
    .font-body { font-family: 'Vazirmatn', sans-serif; }
    .ltr-isolate { direction: ltr; unicode-bidi: isolate; display: inline-block; }

    :root {
      --c-cyan: #00f5ff;
      --c-magenta: #ff00aa;
      --c-bg-deep: #030407;
      --c-glass: rgba(15, 18, 25, 0.65);
      --c-glass-border: rgba(255, 255, 255, 0.08);
      --c-glass-highlight: rgba(255, 255, 255, 0.12);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    .cp-root {
      background-color: var(--c-bg-deep);
      background-image: 
        radial-gradient(circle at 15% 5%, rgba(0, 245, 255, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 85% 90%, rgba(255, 0, 170, 0.06) 0%, transparent 40%);
      min-height: 100vh;
      color: #e8f6fb;
      position: relative;
      overflow-x: hidden;
    }

    .cp-noise::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.035;
      z-index: 50;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    .glass-panel {
      background: var(--c-glass);
      backdrop-filter: blur(16px) saturate(1.4);
      -webkit-backdrop-filter: blur(16px) saturate(1.4);
      border: 1px solid var(--c-glass-border);
      box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.5);
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--c-glass-border);
      transition: all 0.3s var(--ease-smooth);
    }

    .glass-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--c-glass-highlight);
      transform: translateY(-4px);
      box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.4);
    }

    .glass-card.is-selected {
      border-color: var(--c-magenta);
      box-shadow: 0 0 0 1px var(--c-magenta), 0 0 20px -4px rgba(255, 0, 170, 0.3);
      background: rgba(255, 0, 170, 0.05);
    }

    .text-glow-cyan { text-shadow: 0 0 12px rgba(0, 245, 255, 0.6); }
    .text-glow-magenta { text-shadow: 0 0 12px rgba(255, 0, 170, 0.6); }

    .clip-tech {
      clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
    }

    .clip-tag {
      clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px);
    }

    .btn-neon {
      background: var(--c-cyan);
      color: #000;
      font-weight: 700;
      transition: all 0.2s var(--ease-spring);
      position: relative;
      overflow: hidden;
    }
    .btn-neon:hover:not(:disabled) {
      transform: scale(1.02);
      box-shadow: 0 0 20px rgba(0, 245, 255, 0.4);
    }
    .btn-neon:active:not(:disabled) { transform: scale(0.98); }
    .btn-neon:disabled { 
      background: rgba(255,255,255,0.05); 
      color: rgba(255,255,255,0.3); 
      cursor: not-allowed; 
      box-shadow: none;
    }

    .icon-btn {
      color: rgba(255,255,255,0.5);
      transition: all 0.2s ease;
    }
    .icon-btn:hover { color: var(--c-magenta); transform: scale(1.1); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-in { animation: fadeUp 0.4s var(--ease-smooth) both; }

    @keyframes popIn {
      from { opacity: 0; transform: scale(0.95) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-pop { animation: popIn 0.25s var(--ease-spring) both; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade { animation: fadeIn 0.2s ease both; }

    .game-grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 16px; 
    }
    @media (min-width: 640px) { .game-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
    @media (min-width: 1024px) { .game-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
    @media (min-width: 1280px) { .game-grid { grid-template-columns: repeat(5, 1fr); } }

    /* Filter bar: search on row 1, genre+sort side-by-side on row 2 (mobile) */
    .filter-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "search search"
        "genre sort";
      gap: 10px;
    }
    .filter-search { grid-area: search; }
    .filter-genre { grid-area: genre; }
    .filter-sort { grid-area: sort; }

    @media (min-width: 640px) {
      .filter-bar {
        grid-template-columns: 1fr auto auto auto;
        grid-template-areas: "search genre sort count";
        gap: 16px;
        align-items: center;
      }
      .filter-count { grid-area: count; }
    }

    /* Priority list row with top-5 highlight */
    .priority-row {
      transition: background-color 0.2s ease;
    }
    .priority-row.is-top5 {
      background: linear-gradient(90deg, rgba(0, 245, 255, 0.06) 0%, rgba(255, 0, 170, 0.04) 100%);
    }
    .priority-row.is-top5:hover {
      background: linear-gradient(90deg, rgba(0, 245, 255, 0.10) 0%, rgba(255, 0, 170, 0.07) 100%);
    }
    .priority-row:not(.is-top5):hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .top5-divider {
      position: relative;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(0, 245, 255, 0.4) 20%, rgba(255, 0, 170, 0.4) 80%, transparent 100%);
      margin: 4px 0;
    }
    .top5-divider::before {
      content: "TOP 5";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: #0a0c12;
      padding: 2px 12px;
      font-family: 'Orbitron', sans-serif;
      font-size: 9px;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 999px;
    }
  `}</style>
);

// ---------------------------------------------------------------------------
// PROCEDURAL COVER ART ENGINE (with star on rating badge)
// ---------------------------------------------------------------------------
function CoverArt({ game, selected }) {
  const [imgError, setImgError] = useState(false);
  const hue = hueFor(game.id);
  const hue2 = (hue + 45) % 360;
  const initials = game.title
    .split(" ")
    .filter((w) => !/^(the|of|a|and)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const hasRating = game.rating !== null && game.rating !== undefined;
  const rColor = hasRating ? ratingColor(game.rating) : "rgba(255,255,255,0.5)";
  const imgUrl = `/images/covers/${game.id}.jpg`;

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden clip-tech bg-black">
      {/* Real image — only rendered if no error */}
      {!imgError ? (
        <img
          src={imgUrl}
          alt={game.title}
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            selected ? "opacity-80 scale-105" : "opacity-90"
          }`}
          loading="lazy"
        />
      ) : null}

      {/* Procedural fallback — shows when image fails or doesn't exist */}
      {imgError && (
        <>
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, hsl(${hue}, 60%, 15%) 0%, hsl(${hue2}, 50%, 8%) 100%)`,
              opacity: selected ? 0.8 : 0.5,
            }}
          />
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display font-black text-4xl tracking-tighter select-none"
              style={{
                color: `hsla(${hue}, 80%, 75%, 0.9)`,
                textShadow: `0 0 30px hsla(${hue}, 80%, 50%, 0.4)`,
              }}
            >
              {initials}
            </span>
          </div>
        </>
      )}

      {/* Selected overlay — always on top */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-[#ff00aa] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,170,0.6)]">
          <Check size={22} strokeWidth={3} color="#000" />
        </div>
      </div>

      {/* PS5 tag — always visible */}
      <div className="absolute top-3 left-3 font-display text-[9px] tracking-widest text-white/60 bg-black/40 px-2 py-1 rounded backdrop-blur-md border border-white/5">
        PS5 · {game.year}
      </div>

      {/* Rating badge — always visible */}
      <div
        className="absolute top-3 right-3 flex items-center gap-1 font-display font-black text-[11px] tracking-wider px-2 py-1 rounded border backdrop-blur-md"
        style={{
          background: "rgba(0,0,0,0.55)",
          color: rColor,
          borderColor: rColor + "55",
          boxShadow: hasRating ? `0 0 12px ${rColor}40` : "none",
        }}
      >
        <Star size={9} fill={hasRating ? rColor : "none"} strokeWidth={2.5} />
        <span>{hasRating ? game.rating : "—"}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FILTER BAR
// ---------------------------------------------------------------------------
function FilterBar({ filters, setFilters, total, filteredCount }) {
  const genres = ["All", ...new Set(GAMES.map((g) => g.genre))];

  return (
    <div
      className="glass-panel rounded-xl p-4 mb-8 animate-in"
      style={{ animationDelay: "0.1s" }}
    >
      <div className="filter-bar">
        {/* Search */}
        <div className="filter-search relative min-w-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
          />
          <input
            type="text"
            placeholder="جستجو در کتابخانه..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00f5ff]/50 focus:bg-black/40 transition-all"
          />
        </div>

        {/* Genre */}
        <select
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          className="filter-genre bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-[#00f5ff]/50 cursor-pointer min-w-0"
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g === "All" ? "همه ژانرها" : genreFa(g)}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="filter-sort bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-[#00f5ff]/50 cursor-pointer min-w-0"
        >
          {Object.entries(SORT_FA).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        {/* Count — desktop only */}
        <span className="filter-count hidden sm:block text-xs font-display text-white/40 tracking-wider whitespace-nowrap text-right">
          {filteredCount} / {total}
        </span>
      </div>

      {/* Mobile count */}
      <div className="sm:hidden flex justify-between items-center mt-3 pt-3 border-t border-white/5">
        <span className="text-[10px] font-display text-white/30 tracking-wider">
          FILTERED
        </span>
        <span className="text-xs font-display text-white/50 tracking-wider">
          {filteredCount} / {total}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONTACT POPUP
// ---------------------------------------------------------------------------
function ContactPopup({ onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade"
      style={{ background: "rgba(3, 4, 7, 0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="glass-panel rounded-2xl max-w-md w-full p-6 relative animate-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, rgba(15,18,25,0.95) 0%, rgba(8,10,16,0.95) 100%)",
          borderColor: "rgba(0, 245, 255, 0.2)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f5ff] to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.3)]">
            <Phone size={18} className="text-black" />
          </div>
          <div>
            <h2 className="font-body font-bold text-lg text-white">تماس با ما</h2>
            <p className="text-[10px] font-display text-white/40 tracking-widest">CONTACT US</p>
          </div>
        </div>

        <div className="mb-5 p-4 rounded-lg bg-[#00f5ff]/5 border border-[#00f5ff]/15">
          <p className="font-body text-sm text-white/85 leading-relaxed">
            برای نصب بازی PS5 روی کنسول خودتون، فقط کافیه لیست بازی های انتخابی خودتون رو برای ما بفرستین و کنسولتون رو بیارین تا ما براتون نصبشون کنیم.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-black/30 border border-white/5">
            <p className="font-body font-bold text-[#00f5ff] text-base mb-0.5">گیم روم قنات</p>
            <p className="font-display text-[10px] tracking-widest text-white/50">GG - GHANAT GAMEROOM</p>
          </div>

          <div className="p-3 rounded-lg bg-black/30 border border-white/5 flex items-start gap-2">
            <Mail size={14} className="text-[#ff00aa] mt-1 flex-shrink-0" />
            <p className="font-body text-sm text-white/80 leading-relaxed">
              تهران - خیابان دولت - خیابان رحمانی - پلاک 10
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <a
              href="https://t.me/GhanatGameroom"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-black/30 border border-white/5 hover:border-[#00f5ff]/30 transition-all flex items-center gap-3 group"
            >
              <div className="w-7 h-7 rounded bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-[9px] text-[#00f5ff] font-black">TG</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-display text-white/40 tracking-widest">TELEGRAM</p>
                <p className="font-body text-sm text-white/90 ltr-isolate group-hover:text-[#00f5ff] transition-colors">
                  @GhanatGameroom
                </p>
              </div>
            </a>
            <a
              href="#"
              className="p-3 rounded-lg bg-black/30 border border-white/5 hover:border-[#ff00aa]/30 transition-all flex items-center gap-3 group"
            >
              <div className="w-7 h-7 rounded bg-[#ff00aa]/10 border border-[#ff00aa]/30 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-[9px] text-[#ff00aa] font-black">BL</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-display text-white/40 tracking-widest">BALE</p>
                <p className="font-body text-sm text-white/90 ltr-isolate group-hover:text-[#ff00aa] transition-colors">
                  @GhanatGameroom
                </p>
              </div>
            </a>
            <a
              href="https://instagram.com/GhanatGameroom"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-black/30 border border-white/5 hover:border-[#ff00aa]/30 transition-all flex items-center gap-3 group"
            >
              <div className="w-7 h-7 rounded bg-[#ff00aa]/10 border border-[#ff00aa]/30 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-[9px] text-[#ff00aa] font-black">IG</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-display text-white/40 tracking-widest">INSTAGRAM</p>
                <p className="font-body text-sm text-white/90 ltr-isolate group-hover:text-[#ff00aa] transition-colors">
                  @GhanatGameroom
                </p>
              </div>
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full btn-neon rounded-lg py-3 text-sm font-display font-bold tracking-wider"
        >
          CLOSE
        </button>
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// MAIN GRID PAGE
// ---------------------------------------------------------------------------
function GridPage({ selectedIds, toggle, onOpenPriority, filters, setFilters, onOpenContact }) {
  const filteredGames = useMemo(() => {
    const filtered = GAMES.filter((g) => {
      const matchSearch = g.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchGenre = filters.genre === "All" || g.genre === filters.genre;
      return matchSearch && matchGenre;
    });

    const sorted = [...filtered];
    switch (filters.sort) {
      case "az":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "yearDesc":
        sorted.sort((a, b) => b.year - a.year);
        break;
      case "yearAsc":
        sorted.sort((a, b) => a.year - b.year);
        break;
      case "ratingDesc":
        sorted.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
        break;
      case "ratingAsc":
        sorted.sort((a, b) => (a.rating ?? 999) - (b.rating ?? 999));
        break;
      default:
        break;
    }
    return sorted;
  }, [filters]);

  const selectedCount = selectedIds.size;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-32 pt-8 transition-all duration-500">
      <header className="flex items-center justify-between gap-3 mb-8 animate-in">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f5ff] to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.3)] flex-shrink-0">
            <Gamepad2 size={24} className="text-black" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight flex items-center gap-2">
              NEXUS <span className="text-[#ff00aa] text-glow-magenta">//</span> GG
            </h1>
            <p className="text-white/40 text-xs font-display tracking-[0.2em] mt-1">
              GAME LIBRARY SYSTEM
            </p>
          </div>
        </div>

        <button
          onClick={onOpenContact}
          className="group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg border border-[#ff00aa]/30 bg-[#ff00aa]/5 hover:bg-[#ff00aa]/15 hover:border-[#ff00aa]/60 transition-all flex-shrink-0 whitespace-nowrap"
        >
          <Phone size={16} className="text-[#ff00aa] group-hover:scale-110 transition-transform flex-shrink-0" />
          <span className="font-body font-bold text-sm text-[#ff00aa]">تماس با ما</span>
        </button>
      </header>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        total={GAMES.length}
        filteredCount={filteredGames.length}
      />

      <div className="game-grid">
        {filteredGames.map((g, i) => {
          const isSel = selectedIds.has(g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`glass-card group relative rounded-xl overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-[#00f5ff] animate-in`}
              style={{ animationDelay: `${Math.min(i * 0.02, 0.5)}s` }}
            >
              <CoverArt game={g} selected={isSel} />
              <div className="p-4">
                <h3 className="font-body font-bold text-white text-sm leading-snug line-clamp-2 mb-2 ltr-isolate group-hover:text-[#00f5ff] transition-colors">
                  {g.title}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-white/50 truncate">{genreFa(g.genre)}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded border ${
                      g.studio === "PLAYSTATION"
                        ? "bg-[#00f5ff]/10 border-[#00f5ff]/30 text-[#00f5ff]"
                        : "bg-white/5 border-white/10 text-white/40"
                    }`}
                  >
                    {g.studio === "PLAYSTATION" ? "انحصاری" : "چندسکویی"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="py-20 text-center animate-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
            <Search size={32} className="text-white/20" />
          </div>
          <p className="text-white/40 font-body">هیچ بازی‌ای با این مشخصات یافت نشد.</p>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-6 bg-gradient-to-t from-[#030407] via-[#030407]/90 to-transparent pointer-events-none">
          <button
            onClick={onOpenPriority}
            className="w-full max-w-md mx-auto btn-neon clip-tag px-6 py-5 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-in pointer-events-auto text-base"
          >
            <ListOrdered size={22} />
            <span className="font-display font-bold">اولویت‌بندی {selectedCount} بازی</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PRIORITY RANKING PAGE (with TOP-5 highlight + divider)
// ---------------------------------------------------------------------------
function PriorityPage({ orderIds, onReorder, onBack, toggle }) {
  const [copyState, setCopyState] = useState("idle");
  const gamesById = useMemo(
    () => Object.fromEntries(GAMES.map((game) => [game.id, game])),
    []
  );
  const sorted = useMemo(
    () => uniqueOrderIds(orderIds).map((id) => gamesById[id]).filter(Boolean),
    [orderIds, gamesById]
  );
  const exportText = sorted.map((g, i) => `${i + 1}. ${g.title}`).join("\n");
  const [dragId, setDragId] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [clone, setClone] = useState(null);
  const rowRefs = useRef({});
  const grabOffset = useRef({ x: 0, y: 0 });
  const filteredIds = dragId ? orderIds.filter((id) => id !== dragId) : orderIds;

  const computeDropIndex = (clientY) => {
    let count = 0;
    for (const id of orderIds) {
      if (id === dragId) continue;
      const el = rowRefs.current[id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top + rect.height / 2 < clientY) count++;
    }
    return count;
  };

  const handlePointerDown = (e, id) => {
    const el = rowRefs.current[id];
    if (!el) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const rect = el.getBoundingClientRect();
    grabOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setClone({ x: rect.left, y: rect.top, width: rect.width, title: gamesById[id]?.title || "" });
    setDragId(id);
    setDropIndex(orderIds.indexOf(id));
  };

  const handlePointerMove = (e) => {
    if (!dragId) return;
    setClone((c) =>
      c ? { ...c, x: e.clientX - grabOffset.current.x, y: e.clientY - grabOffset.current.y } : c
    );
    setDropIndex(computeDropIndex(e.clientY));
  };

  const endDrag = () => {
    if (!dragId) return;
    const filtered = orderIds.filter((id) => id !== dragId);
    const idx = Math.max(0, Math.min(dropIndex ?? filtered.length, filtered.length));
    filtered.splice(idx, 0, dragId);
    onReorder(uniqueOrderIds(filtered));
    setDragId(null);
    setDropIndex(null);
    setClone(null);
  };

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(exportText);
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
        return;
      }
    } catch (e) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = exportText;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) {
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
        return;
      }
      throw new Error("execCommand failed");
    } catch (e) {
      setCopyState("failed");
    }
  }, [exportText]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32 animate-in">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="font-display font-black text-2xl text-white flex items-center gap-2">
            PRIORITY <span className="text-[#00f5ff] text-glow-cyan">LIST</span>
          </h1>
          <p className="text-white/40 text-xs tracking-wider mt-1">
            DRAG TO REORDER · COPY LIST
          </p>
        </div>
      </header>

      <div className="glass-panel rounded-xl overflow-hidden mb-24">
        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <span className="font-display text-xs text-[#00f5ff] tracking-widest flex items-center gap-2">
            <Trophy size={14} /> MY TOP LIST
          </span>
          <span className="text-xs text-white/30">{sorted.length} TITLES</span>
        </div>

        <div>
          {sorted.map((g, idx) => {
            const isDragging = g.id === dragId;
            const fIdx = filteredIds.indexOf(g.id);
            const isLastFiltered = filteredIds.length > 0 && fIdx === filteredIds.length - 1;
            const showTop = dragId && !isDragging && fIdx === dropIndex;
            const showBottom = dragId && !isDragging && isLastFiltered && dropIndex === filteredIds.length;

            // POSITION-BASED top-5 highlight (follows the slot, not the game)
            const isTop5 = idx < 5;
            const showDividerAfter = idx === 4 && sorted.length > 5;

            return (
              <React.Fragment key={g.id}>
                <div
                  ref={(el) => (rowRefs.current[g.id] = el)}
                  className={`priority-row flex items-center gap-4 p-4 relative ${isTop5 ? "is-top5" : ""}`}
                  style={{
                    opacity: isDragging ? 0.3 : 1,
                    borderTop: showTop ? "2px solid #ff00aa" : "2px solid transparent",
                    boxShadow: showBottom ? "inset 0 -2px 0 0 #ff00aa" : "none",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <button
                    onPointerDown={(e) => handlePointerDown(e, g.id)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    className="icon-btn touch-none cursor-grab active:cursor-grabbing p-2 -ml-2"
                  >
                    <GripVertical size={20} />
                  </button>
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center font-display font-bold text-sm border ${
                      isTop5
                        ? "bg-gradient-to-br from-[#00f5ff]/20 to-[#ff00aa]/20 border-[#00f5ff]/40 text-[#00f5ff]"
                        : "bg-black/40 border-white/10 text-white/50"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isTop5 && <Sparkles size={12} className="text-[#ffd23f] flex-shrink-0" />}
                      <p className="font-body font-medium text-white truncate ltr-isolate">
                        {g.title}
                      </p>
                    </div>
                    <p className="text-xs text-white/40 hidden sm:block mt-0.5">{genreFa(g.genre)}</p>
                  </div>
                  {g.rating !== null && g.rating !== undefined && (
                    <div
                      className="font-display font-black text-xs px-2 py-1 rounded border flex items-center gap-1"
                      style={{
                        color: ratingColor(g.rating),
                        borderColor: ratingColor(g.rating) + "40",
                        background: "rgba(0,0,0,0.3)",
                      }}
                    >
                      <Star size={9} fill={ratingColor(g.rating)} />
                      {g.rating}
                    </div>
                  )}
                  <button onClick={() => toggle(g.id)} className="icon-btn p-2 hover:text-red-400">
                    <X size={18} />
                  </button>
                </div>

                {showDividerAfter && <div className="top5-divider" />}
              </React.Fragment>
            );
          })}
          {sorted.length === 0 && (
            <div className="p-12 text-center text-white/30 text-sm">
              لیست خالی است. برای افزودن بازی به کتابخانه برگردید.
            </div>
          )}
        </div>
      </div>

      {dragId &&
        clone &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: clone.x,
              top: clone.y,
              width: clone.width,
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <div className="glass-panel p-4 rounded-lg border-[#ff00aa] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3">
              <GripVertical size={20} className="text-[#ff00aa]" />
              <span className="font-body font-bold text-white truncate">{clone.title}</span>
            </div>
          </div>,
          document.body
        )}

      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-6 bg-gradient-to-t from-[#030407] via-[#030407]/95 to-transparent">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleCopy}
            disabled={sorted.length === 0}
            className={`btn-neon py-4 rounded-lg clip-tech flex items-center justify-center gap-2 text-sm ${
              copyState === "copied" ? "!bg-green-400" : ""
            }`}
          >
            <Copy size={18} />
            {copyState === "copied" ? "COPIED TO CLIPBOARD" : "COPY AS TEXT"}
          </button>
          <div className="py-4 rounded-lg border border-white/10 border-dashed flex items-center justify-center gap-2 text-white/40 text-sm bg-[#030407]/80 backdrop-blur-sm">
            <Camera size={18} />
            SCREENSHOT READY ZONE
          </div>
        </div>
      </div>

      {copyState === "failed" && (
        <div className="mt-6 animate-in">
          <p className="text-xs text-[#ff00aa] mb-2">
            Auto-copy blocked. Select and copy manually:
          </p>
          <textarea
            readOnly
            value={exportText}
            onFocus={(e) => e.target.select()}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-xs font-mono text-white/80 focus:outline-none resize-none"
            rows={6}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// APP ROOT
// ---------------------------------------------------------------------------
export default function App() {
  const [view, setView] = useState("grid");
  const [orderIds, setOrderIds] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    genre: "All",
    sort: "default",
  });
  const selectedIds = useMemo(() => new Set(orderIds), [orderIds]);

  const toggle = useCallback((id) => {
    setOrderIds((currentOrderIds) => {
      if (currentOrderIds.includes(id)) {
        return currentOrderIds.filter((gameId) => gameId !== id);
      }
      return uniqueOrderIds([...currentOrderIds, id]);
    });
  }, []);

  const openPriority = useCallback(() => {
    setView((currentView) => {
      if (orderIds.length === 0) return currentView;
      return "priority";
    });
  }, [orderIds.length]);

  const handleReorder = useCallback((nextOrderIds) => {
    setOrderIds(uniqueOrderIds(nextOrderIds));
  }, []);

  return (
    <div className="cp-root cp-noise font-body min-h-screen" dir="rtl" lang="fa">
      <GlobalStyle />
      {view === "grid" ? (
        <GridPage
          selectedIds={selectedIds}
          toggle={toggle}
          onOpenPriority={openPriority}
          filters={filters}
          setFilters={setFilters}
          onOpenContact={() => setShowContact(true)}
        />
      ) : (
        <PriorityPage
          orderIds={orderIds}
          onReorder={handleReorder}
          onBack={() => setView("grid")}
          toggle={toggle}
        />
      )}
      {showContact && <ContactPopup onClose={() => setShowContact(false)} />}
    </div>
  );
}
