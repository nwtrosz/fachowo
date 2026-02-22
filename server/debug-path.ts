import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__dirname:", __dirname);
const logPath = path.join(__dirname, '..', 'email-debug.log');
console.log("Log path:", logPath);

try {
    fs.writeFileSync(logPath, "Test logu z debugera");
    console.log("Zapisano log pomyślnie.");
} catch (e) {
    console.error("Błąd zapisu:", e);
}
