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
}

const defaultDB: DB = {
  leads: [],
  projects: []
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

// Write DB
export const writeDb = (data: DB) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("DB Write Error:", e);
  }
};
