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
    // Persistent storage outside of dist
    let uploadPath = path.resolve(__dirname, "..", "storage", "uploads");
    
    // In development, we might want them in client public too, 
    // but for VPS, root/storage/uploads is safest and most persistent.
    if (process.env.NODE_ENV !== "production") {
      uploadPath = path.resolve(__dirname, "..", "client", "public", "uploads");
    }

    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    cb(null, `project-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // Increase to 100MB

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
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));
  app.use(requestIp.mw());

  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "client", "public");

  app.use(express.static(staticPath));

  // Serve persistent uploads folder
  const persistentUploadsPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "..", "storage", "uploads")
    : path.resolve(__dirname, "..", "client", "public", "uploads");
  
  app.use("/uploads", express.static(persistentUploadsPath));

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
    try {
      const db = readDb();
      const activeProjects = db.projects.filter(p => !p.archived);
      res.json([...activeProjects].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Admin: Get All Projects (including archived)
  app.get("/api/admin/projects", (_req, res) => {
    try {
      const db = readDb();
      res.json([...db.projects].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

// Admin: Get Leads
  app.get("/api/admin/leads", (_req, res) => {
    try {
      const db = readDb();
      res.json([...db.leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Admin: Archive Lead
  app.post("/api/admin/leads/:id/archive", (req, res) => {
    try {
      const id = Number(req.params.id);
      const db = readDb();
      const lead = db.leads.find(l => l.id === id);
      if (lead) {
        // @ts-ignore
        lead.archived = !lead.archived;
        writeDb(db);
        res.json({ success: true, archived: lead.archived });
      } else {
        res.status(404).json({ error: "Lead not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to archive lead" });
    }
  });

  // Admin: Send Reply
  app.post("/api/admin/leads/:id/reply", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { message } = req.body;
      if (!message) return res.status(400).json({ error: "Wiadomość jest wymagana" });

      const db = readDb();
      const lead = db.leads.find(l => l.id === id);
      
      if (!lead) return res.status(404).json({ error: "Lead not found" });

      // Send Email
      if (EMAIL_USER && EMAIL_PASS) {
        const transporter = nodemailer.createTransport({ 
          service: "gmail", 
          auth: { user: EMAIL_USER, pass: EMAIL_PASS } 
        });
        
        await transporter.sendMail({ 
          from: EMAIL_USER, 
          to: lead.email, 
          subject: `Re: Zapytanie Fachowo.eu - ${lead.branch}`, 
          text: `${message}\n\n---\nZ poważaniem,\nZespół Fachowo.eu\nwww.fachowo.eu` 
        });
      }

      // Save reply to DB
      if (!lead.replies) lead.replies = [];
      lead.replies.push({
        id: Date.now(),
        message,
        created_at: new Date().toISOString()
      });
      
      writeDb(db);
      res.json({ success: true });
    } catch (error) {
      console.error("Reply error:", error);
      res.status(500).json({ error: "Nie udało się wysłać odpowiedzi" });
    }
  });

  // Admin: Get Stats
  app.get("/api/admin/stats", (_req, res) => {
    try {
      const db = readDb();
      res.json({ 
          totalLeads: db.leads.length,
          uniqueVisitors: 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/projects", upload.array("images", 50), (req, res) => {
    try {
      console.log("[Portfolio] Received project upload request:", req.body);
      const validated = projectSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        console.error("[Portfolio] Upload failed: No images provided");
        return res.status(400).json({ error: "Proszę wybrać co najmniej jedno zdjęcie." });
      }

      console.log(`[Portfolio] Processing ${files.length} images...`);
      const imageUrls = files.map(f => `/uploads/${f.filename}`);
      const db = readDb();
      
      const newProject = { 
        id: Date.now(), 
        ...validated, 
        image: imageUrls[0], 
        images: imageUrls, 
        created_at: new Date().toISOString() 
      };
      
      db.projects.push(newProject);
      writeDb(db);
      console.log("[Portfolio] Project added successfully:", newProject.title);
      res.json({ success: true });
    } catch (e) { 
      if (e instanceof z.ZodError) {
        return res.status(400).json({ error: e.errors[0].message });
      }
      console.error("[Portfolio] SYSTEM ERROR DURING UPLOAD:", e);
      res.status(500).json({ error: "Błąd systemowy podczas wgrywania projektu." }); 
    }
  });

  // Admin: Update Project
  app.put("/api/admin/projects/:id", upload.array("images", 50), (req, res) => {
    try {
      const id = Number(req.params.id);
      const validated = projectSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];
      
      const db = readDb();
      const index = db.projects.findIndex(p => p.id === id);
      
      if (index === -1) return res.status(404).json({ error: "Projekt nie istnieje" });

      const currentProject = db.projects[index];
      let imageUrls = currentProject.images || [currentProject.image];

      // If new files uploaded, we can either replace or append. 
      // For simplicity, let's replace if new ones are provided.
      if (files && files.length > 0) {
        imageUrls = files.map(f => `/uploads/${f.filename}`);
      }

      db.projects[index] = {
        ...currentProject,
        ...validated,
        image: imageUrls[0],
        images: imageUrls
      };

      writeDb(db);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Błąd podczas aktualizacji projektu" });
    }
  });

  // Admin: Archive Project (Soft Delete)
  app.delete("/api/admin/projects/:id", (req, res) => {
    try {
      const id = Number(req.params.id);
      const db = readDb();
      const project = db.projects.find(p => p.id === id);
      
      if (!project) return res.status(404).json({ error: "Projekt nie istnieje" });

      // @ts-ignore
      project.archived = true;
      writeDb(db);
      res.json({ success: true, archived: true });
    } catch (e) {
      res.status(500).json({ error: "Błąd podczas archiwizacji projektu" });
    }
  });

  // Admin: Permanent Delete Project
  app.delete("/api/admin/projects/:id/permanent", (req, res) => {
    try {
      const id = Number(req.params.id);
      const db = readDb();
      db.projects = db.projects.filter(p => p.id !== id);
      writeDb(db);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Błąd podczas trwałego usuwania projektu" });
    }
  });

  // Admin: Restore Project
  app.post("/api/admin/projects/:id/restore", (req, res) => {
    try {
      const id = Number(req.params.id);
      const db = readDb();
      const project = db.projects.find(p => p.id === id);
      
      if (!project) return res.status(404).json({ error: "Projekt nie istnieje" });

      // @ts-ignore
      project.archived = false;
      writeDb(db);
      res.json({ success: true, archived: false });
    } catch (e) {
      res.status(500).json({ error: "Błąd podczas przywracania projektu" });
    }
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
