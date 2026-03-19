import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On VPS, __dirname is dist/, so we go up one level to root/storage/data.json
// In development, we go up one level to root/server/data.json (legacy) or root/storage/data.json
const DB_DIR = path.resolve(__dirname, "..", "storage");
const DB_PATH = path.join(DB_DIR, 'data.json');

// Interface for DB structure
interface DB {
  leads: any[];
  projects: any[];
  visitors?: any[];
  content?: any;
}

const defaultContent = {
  hero: {
    badge: "Witaj w Fachowo.net.pl",
    title: "Fachowo – Usługi Budowlane <br className=\"hidden sm:block\" /> i Transportowe Poznań & Warszawa",
    subtitle: "Szybkie i niezawodne usługi remontowe, transportowe i sprzątające dla Twojego domu i biura.",
    ctaText: "Poproś o wycenę",
  },
  about: {
    badge: "O Nas",
    title: "Fachowość poparta <br className=\"hidden sm:block\" /> doświadczeniem",
    description: "Fachowo.net.pl to zespół specjalistów z pasją realizujących usługi budowlane, remontowe i transportowe. Dostarczamy solidne wyniki, dbając o każdy detal Twojego projektu.",
    highlights: [
      "Zadowoleni klienci",
      "Przejrzysta komunikacja"
    ],
    stats: {
      years: "10",
      clients: "150",
      projects: "500"
    }
  }
};

const defaultDB: DB = {
  leads: [],
  projects: [],
  visitors: [],
  content: defaultContent
};

// Ensure DB directory and file exist
export const initDb = () => {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(DB_PATH)) {
    console.log("Creating new database file at", DB_PATH);
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
  }
};

// Read DB
export const readDb = (): DB => {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error("DB Read Error:", e);
    return defaultDB;
  }
};

// Atomic & Asynchronous Write DB
export const writeDb = (data: DB) => {
  const tempPath = `${DB_PATH}.tmp`;
  try {
    // Write to a temporary file first
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    // Rename it to the actual DB path (atomic operation in Linux/Unix)
    fs.renameSync(tempPath, DB_PATH);
  } catch (e) {
    console.error("DB Write Error:", e);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
};
