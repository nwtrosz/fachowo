import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import geoip from "geoip-lite";
import requestIp from "request-ip";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import { nanoid } from "nanoid";
import { z } from "zod";
import { initDb, readDb, writeDb } from "./json-db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schemas
const contactSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane"),
  email: z.string().email("Niepoprawny format email"),
  phone: z.string().optional().or(z.literal('')),
  branch: z.enum(["Poznań", "Warszawa"], { errorMap: () => ({ message: "Wybierz filię" }) }),
  message: z.string().min(1, "Wiadomość jest wymagana"),
});

const projectSchema = z.object({
  title: z.string().min(3, "Tytuł jest za krótki"),
  category: z.string().min(1, "Kategoria jest wymagana"),
  description: z.string().min(5, "Opis jest za krótki"),
});

// Admin Session
let adminToken = "";

// Email configuration
const EMAIL_USER = "fachowo.eu@gmail.com"; 
const EMAIL_PASS = "xxcw tyjh rbtr eflj"; 

// Multer Setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    let uploadPath = process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public", "uploads")
      : path.resolve(__dirname, "..", "client", "public", "uploads");

    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    cb(null, `project-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

function seedProjects() {
  const db = readDb();
  if (db.projects.length === 0) {
    db.projects = [
      { id: 1, title: 'Remont Biura', category: 'Komercyjne', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800', description: 'Wykończenie biura', created_at: new Date().toISOString() }
    ];
    writeDb(db);
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  initDb();
  seedProjects();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(requestIp.mw());

  // Kluczowa poprawka ścieżek
  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "client", "public");

  app.use(express.static(staticPath));

  // --- API ---
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "popek" && password === "admin123") {
      adminToken = nanoid();
      res.json({ success: true, token: adminToken });
    } else {
      res.status(401).json({ success: false, error: "Błędne dane" });
    }
  });

  app.get("/api/projects", (_req, res) => {
    res.json([...readDb().projects].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  });

  app.post("/api/admin/projects", upload.array("images", 50), (req, res) => {
    try {
      const validated = projectSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) return res.status(400).json({ error: "No images" });
      const imageUrls = files.map(f => `/uploads/${f.filename}`);
      const db = readDb();
      db.projects.push({ id: Date.now(), ...validated, image: imageUrls[0], images: imageUrls, created_at: new Date().toISOString() });
      writeDb(db);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      console.log("[Contact] Received message request:", req.body);
      const data = contactSchema.parse(req.body);
      const db = readDb();
      
      const newLead = { ...data, id: Date.now(), created_at: new Date().toISOString() };
      db.leads.push(newLead);
      writeDb(db);
      console.log("[Contact] Lead saved to database.");

      if (EMAIL_USER && EMAIL_PASS) {
        console.log("[Contact] Attempting to send email via Nodemailer...");
        const transporter = nodemailer.createTransport({ 
          service: "gmail", 
          auth: { user: EMAIL_USER, pass: EMAIL_PASS } 
        });
        
        try {
          await transporter.sendMail({ 
            from: EMAIL_USER, 
            to: "fachowo.eu@gmail.com", 
            subject: `Nowa wiadomość (${data.branch}): ${data.name}`, 
            text: `Imię: ${data.name}\nEmail: ${data.email}\nTelefon: ${data.phone || 'Nie podano'}\nFilia: ${data.branch}\n\nWiadomość:\n${data.message}` 
          });
          console.log("[Contact] Email sent successfully!");
        } catch (emailError) {
          console.error("[Contact] NODEMAILER ERROR:", emailError);
          // Don't return false to user if DB save worked, but maybe notify about email lag
        }
      }
      
      res.json({ success: true });
    } catch (e) { 
      if (e instanceof z.ZodError) {
        console.log("[Contact] Validation error:", e.errors[0].message);
        return res.status(400).json({ success: false, error: e.errors[0].message });
      }
      console.error("[Contact] DB ERROR:", e);
      res.status(400).json({ success: false, error: "Błąd przetwarzania danych." }); 
    }
  });

  // Obsługa wszystkich innych ścieżek - SERWUJ PLIK Z DIST, NIE Z CLIENT!
  app.get("*", (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).end();
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;
  server.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer().catch(console.error);
