import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On VPS, __dirname is dist/, so we go up one level to root/storage/data.json
// In development, __dirname is server/, so we go up one level to root/storage/data.json
const DB_DIR = path.resolve(__dirname, "..", "storage");
const DB_PATH = path.join(DB_DIR, 'data.json');

// Legacy path for migration check - we know it exists in server/data.json
const LEGACY_PATH = path.resolve(__dirname, "data.json");

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
  },
  contact: {
    phoneMain: "+48 123 456 789",
    emailMain: "kontakt@fachowo.net.pl",
    branchPoznanPhone: "+48 61 345 67 89",
    branchPoznanHours: "Pn-Pt: 8:00 - 18:00",
    branchWarszawaPhone: "+48 22 987 65 43",
    branchWarszawaHours: "Pn-Pt: 8:00 - 18:00"
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
    console.log("Creating storage directory:", DB_DIR);
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(DB_PATH)) {
    // Migration logic
    if (fs.existsSync(LEGACY_PATH)) {
      console.log("Migrating database from legacy location:", LEGACY_PATH);
      const legacyData = fs.readFileSync(LEGACY_PATH, 'utf-8');
      try {
        const parsed = JSON.parse(legacyData);
        // Inject default content if missing during migration
        if (!parsed.content) parsed.content = defaultContent;
        if (!parsed.visitors) parsed.visitors = [];
        fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2));
        console.log("Migration successful.");
        return;
      } catch (e) {
        console.error("Migration error:", e);
      }
    }

    console.log("Creating new database file at", DB_PATH);
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
  }
};

// Read DB
export const readDb = (): DB => {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const db = JSON.parse(data);
    // Ensure content exists
    if (!db.content) db.content = defaultContent;
    return db;
  } catch (e) {
    console.error("DB Read Error:", e);
    return defaultDB;
  }
};

// Atomic & Asynchronous Write DB
export const writeDb = (data: DB) => {
  initDb();
  const tempPath = `${DB_PATH}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    fs.renameSync(tempPath, DB_PATH);
  } catch (e) {
    console.error("DB Write Error:", e);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
};
