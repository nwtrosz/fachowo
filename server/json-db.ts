import fs from 'fs';
import path from 'path';

// Use process.cwd() to get the absolute project root reliably on VPS and local
const PROJECT_ROOT = process.cwd();
const DB_DIR = path.resolve(PROJECT_ROOT, "storage");
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

export const initDb = () => {
  if (!fs.existsSync(DB_DIR)) {
    console.log("[DB] Creating storage directory:", DB_DIR);
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(DB_PATH)) {
    console.log("[DB] Creating new database file at absolute path:", DB_PATH);
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
  }
};

export const readDb = (): DB => {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const db = JSON.parse(data);
    if (!db.content) db.content = defaultContent;
    return db;
  } catch (e) {
    console.error("[DB] Read Error:", e);
    return defaultDB;
  }
};

export const writeDb = (data: DB) => {
  initDb();
  const tempPath = `${DB_PATH}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    fs.renameSync(tempPath, DB_PATH);
    console.log("[DB] Successfully saved to:", DB_PATH);
  } catch (e) {
    console.error("[DB] Write Error:", e);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
};
