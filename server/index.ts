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
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schemas
const contactSchema = z.object({
  name: z.string().min(2, "Imię jest za krótkie"),
  email: z.string().email("Niepoprawny format email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Wiadomość musi mieć min. 10 znaków"),
});

const projectSchema = z.object({
  title: z.string().min(3, "Tytuł jest za krótki"),
  category: z.string().min(1, "Kategoria jest wymagana"),
  description: z.string().min(5, "Opis jest za krótki"),
});

// Admin Session
let adminToken = "";

// Email configuration from environment
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || "fachowo.eu@gmail.com";

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

  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "client", "public");

  app.use(express.static(staticPath));

  // --- API ---
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    
    const envUser = process.env.ADMIN_USER || "popek";
    const envPassHash = process.env.ADMIN_PASSWORD_HASH;

    // Secure comparison using bcrypt
    if (username === envUser && envPassHash && bcrypt.compareSync(password, envPassHash)) {
      adminToken = nanoid();
      res.json({ success: true, token: adminToken });
    } else {
      // Fallback for first setup if .env is missing or incorrect (temporary)
      if (!envPassHash && username === "popek" && password === "admin123") {
         adminToken = nanoid();
         return res.json({ success: true, token: adminToken });
      }
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
      const data = contactSchema.parse(req.body);
      const db = readDb();
      db.leads.push({ ...data, id: Date.now(), created_at: new Date().toISOString() });
      writeDb(db);
      if (EMAIL_USER && EMAIL_PASS) {
        const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: EMAIL_USER, pass: EMAIL_PASS } });
        await transporter.sendMail({ from: EMAIL_USER, to: EMAIL_TO, subject: `Nowa wiadomość: ${data.name}`, text: `Imię: ${data.name}\nEmail: ${data.email}\nTelefon: ${data.phone}\n\nWiadomość:\n${data.message}` });
      }
      res.json({ success: true });
    } catch (e) { res.status(400).json({ success: false }); }
  });

  app.get("*", (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).end();
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;
  server.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer().catch(console.error);
