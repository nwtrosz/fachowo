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
import { format } from "date-fns";
import { pl } from "date-fns/locale";
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
  // Honeypot field - bots will fill this, humans won't
  website: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(3, "Tytuł jest za krótki"),
  category: z.string().min(1, "Kategoria jest wymagana"),
  description: z.string().min(5, "Opis jest za krótki"),
});

// Admin Session Management (Safe, non-global)
const activeSessions = new Map<string, { username: string, role: string }>();

// Email configuration
const EMAIL_USER = "fachowo.eu@gmail.com"; 
const EMAIL_PASS = "xxcw tyjh rbtr eflj"; 

// Multer Setup with Security Validation
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    let uploadPath = path.resolve(__dirname, "..", "storage", "uploads");
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

const upload = multer({ 
  storage, 
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Niedozwolony format pliku. Wybierz JPG, PNG lub WebP.'));
    }
  }
});

// Auth Middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Brak autoryzacji" });
  
  const token = authHeader.replace('Bearer ', '');
  const session = activeSessions.get(token);
  
  if (!session) return res.status(401).json({ error: "Sesja wygasła" });
  
  req.user = session;
  next();
};

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

  // Visitor Tracking
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.includes('.')) return next();
    try {
      const clientIp = req.clientIp || "unknown";
      const today = new Date().toISOString().split('T')[0];
      const db = readDb();
      if (!db.visitors) db.visitors = [];
      
      const alreadyTracked = db.visitors.find(v => v.ip === clientIp && v.date.startsWith(today));
      
      if (!alreadyTracked) {
        db.visitors.push({ ip: clientIp, date: new Date().toISOString() });
        writeDb(db);
      }
    } catch (e) {}
    next();
  });

  const staticPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "client", "public");

  app.use(express.static(staticPath));
  app.use("/uploads", express.static(process.env.NODE_ENV === "production" ? path.resolve(__dirname, "..", "storage", "uploads") : path.resolve(__dirname, "..", "client", "public", "uploads")));
  app.use("/projects", express.static(path.join(staticPath, "projects")));

  // --- API ---
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const users = [
      { username: "popek", password: "admin123", role: "user" },
      { username: "admin", password: "admin123", role: "admin" }
    ];
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const token = nanoid();
      activeSessions.set(token, { username: foundUser.username, role: foundUser.role });
      res.json({ success: true, token, user: foundUser.username });
    } else {
      res.status(401).json({ success: false, error: "Błędne dane" });
    }
  });

  app.get("/api/projects", (_req, res) => {
    try {
      const db = readDb();
      res.json(db.projects.filter(p => !p.archived).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) { res.status(500).end(); }
  });

  app.get("/api/admin/projects", authMiddleware, (_req, res) => {
    try { res.json(readDb().projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())); } catch (e) { res.status(500).end(); }
  });

  app.post("/api/admin/projects", authMiddleware, upload.array("images", 50), (req, res) => {
    try {
      const validated = projectSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) return res.status(400).json({ error: "No images" });
      const imageUrls = files.map(f => `/uploads/${f.filename}`);
      const db = readDb();
      db.projects.push({ id: Date.now(), ...validated, image: imageUrls[0], images: imageUrls, created_at: new Date().toISOString() });
      writeDb(db);
      res.json({ success: true });
    } catch (e) { res.status(500).end(); }
  });

  app.put("/api/admin/projects/:id", authMiddleware, upload.array("images", 50), (req, res) => {
    try {
      const id = Number(req.params.id);
      const validated = projectSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];
      const db = readDb();
      const idx = db.projects.findIndex(p => p.id === id);
      if (idx === -1) return res.status(404).end();
      let images = [...(db.projects[idx].images || [db.projects[idx].image])];
      if (files && files.length > 0) images = [...images, ...files.map(f => `/uploads/${f.filename}`)];
      db.projects[idx] = { ...db.projects[idx], ...validated, image: images[0] || "", images };
      writeDb(db);
      res.json({ success: true, project: db.projects[idx] });
    } catch (e) { res.status(500).end(); }
  });

  app.post("/api/admin/projects/:id/images/delete", authMiddleware, (req, res) => {
    try {
      const id = Number(req.params.id);
      const { imageUrl } = req.body;
      const db = readDb();
      const p = db.projects.find(proj => proj.id === id);
      if (!p) return res.status(404).end();
      p.images = (p.images || []).filter(img => img !== imageUrl);
      if (p.image === imageUrl) p.image = p.images[0] || "";
      
      // Physically delete the image file from storage
      try {
        const fileName = path.basename(imageUrl);
        const filePath = process.env.NODE_ENV === "production"
          ? path.resolve(__dirname, "..", "storage", "uploads", fileName)
          : path.resolve(__dirname, "..", "client", "public", "uploads", fileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) { console.error("Disk cleanup error:", err); }

      writeDb(db);
      res.json({ success: true, images: p.images });
    } catch (e) { res.status(500).end(); }
  });

  app.post("/api/admin/projects/:id/images/reorder", authMiddleware, (req, res) => {
    try {
      const id = Number(req.params.id);
      const { imageUrls } = req.body;
      const db = readDb();
      const p = db.projects.find(proj => proj.id === id);
      if (!p) return res.status(404).end();
      p.images = imageUrls;
      p.image = imageUrls[0] || "";
      writeDb(db);
      res.json({ success: true });
    } catch (e) { res.status(500).end(); }
  });

  app.delete("/api/admin/projects/:id", authMiddleware, (req, res) => {
    try {
      const db = readDb();
      const p = db.projects.find(proj => proj.id === Number(req.params.id));
      if (p) { p.archived = true; writeDb(db); }
      res.json({ success: true });
    } catch (e) { res.status(500).end(); }
  });

  app.delete("/api/admin/projects/:id/permanent", authMiddleware, (req, res) => {
    try {
      const id = Number(req.params.id);
      const db = readDb();
      const projectToDelete = db.projects.find(p => p.id === id);
      
      if (projectToDelete) {
        // --- PHASE 2: DISK CLEANUP ---
        // Delete all images associated with this project from disk
        const images = projectToDelete.images || [projectToDelete.image];
        images.forEach(imgUrl => {
          try {
            const fileName = path.basename(imgUrl);
            const filePath = process.env.NODE_ENV === "production"
              ? path.resolve(__dirname, "..", "storage", "uploads", fileName)
              : path.resolve(__dirname, "..", "client", "public", "uploads", fileName);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          } catch (err) { console.error("File deletion error:", err); }
        });

        db.projects = db.projects.filter(p => p.id !== id);
        writeDb(db);
      }
      res.json({ success: true });
    } catch (e) { res.status(500).end(); }
  });

  app.post("/api/admin/projects/:id/restore", authMiddleware, (req, res) => {
    try {
      const db = readDb();
      const p = db.projects.find(proj => proj.id === Number(req.params.id));
      if (p) { p.archived = false; writeDb(db); }
      res.json({ success: true });
    } catch (e) { res.status(500).end(); }
  });

  app.get("/api/admin/leads", authMiddleware, (_req, res) => {
    try { res.json([...readDb().leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())); } catch (e) { res.status(500).end(); }
  });

  app.post("/api/admin/leads/:id/archive", authMiddleware, (req, res) => {
    try {
      const db = readDb();
      const l = db.leads.find(lead => lead.id === Number(req.params.id));
      if (l) { l.archived = !l.archived; writeDb(db); }
      res.json({ success: true });
    } catch (e) { res.status(500).end(); }
  });

  // Admin: Mark conversation as read
  app.post("/api/admin/leads/:id/read", authMiddleware, (req, res) => {
    try {
      const id = Number(req.params.id);
      const db = readDb();
      const targetLead = db.leads.find(l => l.id === id);
      
      if (targetLead) {
        // Mark all messages from this contact as read
        db.leads.forEach(l => {
          if ((l.email === targetLead.email && targetLead.email) || (l.phone === targetLead.phone && targetLead.phone) || l.id === id) {
            l.read = true;
          }
        });
        writeDb(db);
      }
      res.json({ success: true });
    } catch (e) { res.status(500).end(); }
  });

  app.delete("/api/admin/leads/:id", authMiddleware, (req: any, res) => {
    try {
      if (req.user.username !== "admin") {
        return res.status(403).json({ error: "Brak uprawnień" });
      }
      const id = Number(req.params.id);
      const db = readDb();
      const leadToDelete = db.leads.find(l => l.id === id);
      
      if (leadToDelete) {
        const { email, phone } = leadToDelete;
        // Delete all leads that match this contact's unique identifiers
        db.leads = db.leads.filter(l => {
          const isTargetLead = l.id === id;
          const matchesEmail = email && l.email === email;
          const matchesPhone = phone && l.phone === phone;
          return !(isTargetLead || matchesEmail || matchesPhone);
        });
        writeDb(db);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Błąd podczas usuwania" });
    }
  });

  app.post("/api/admin/leads/:id/reply", authMiddleware, async (req, res) => {
    try {
      const { message } = req.body;
      const db = readDb();
      const l = db.leads.find(lead => lead.id === Number(req.params.id));
      if (!l) return res.status(404).end();
      if (EMAIL_USER && EMAIL_PASS) {
        const transport = nodemailer.createTransport({ service: "gmail", auth: { user: EMAIL_USER, pass: EMAIL_PASS } });
        await transport.sendMail({ from: EMAIL_USER, to: l.email, subject: `Re: Fachowo.net.pl`, text: message });
      }
      if (!l.replies) l.replies = [];
      l.replies.push({ id: Date.now(), message, created_at: new Date().toISOString() });
      writeDb(db);
      res.json({ success: true });
    } catch (e) { res.status(500).end(); }
  });

  app.get("/api/admin/stats", authMiddleware, (_req, res) => {
    try {
      const db = readDb();
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate daily history for the last 7 days
      const history = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const dayLeads = (db.leads || []).filter(l => l.created_at && l.created_at.startsWith(dateStr)).length;
        const dayVisitors = (db.visitors || []).filter(v => v.date === dateStr).length;
        
        history.push({
          date: format(d, "EEE", { locale: pl }),
          leads: dayLeads,
          visitors: dayVisitors
        });
      }

      // Get last 10 recent unique visitors with details
      const recentVisitors = (db.visitors || [])
        .slice(-20) // Take some recent raw logs
        .reverse()
        .filter((v, index, self) => index === self.findIndex((t) => t.ip === v.ip)) // Unique by IP
        .slice(0, 10) // Take top 10
        .map(v => {
          const geo = geoip.lookup(v.ip);
          return {
            ip: v.ip,
            city: geo?.city || "Nieznane",
            country: geo?.country || "",
            last_visit: v.date
          };
        });

      res.json({ 
          totalLeads: db.leads.length,
          uniqueVisitors: (db.visitors || []).filter(v => v.date === today).length,
          history,
          recentVisitors
      });
    } catch (e) { res.status(500).end(); }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactSchema.parse(req.body);
      
      // Honeypot check - bots will fill this, humans won't see it
      if (data.website) {
        console.log("[AntiSpam] Bot detected (Honeypot filled). Returning mock success.");
        return res.json({ success: true });
      }

      const db = readDb();
      const newLead = { 
        ...data, 
        id: Date.now(), 
        ip: req.clientIp || "", 
        created_at: new Date().toISOString(),
        read: false // New inquiries are unread by default
      };
      db.leads.push(newLead);
      writeDb(db);
      if (EMAIL_USER && EMAIL_PASS) {
        const transport = nodemailer.createTransport({ service: "gmail", auth: { user: EMAIL_USER, pass: EMAIL_PASS } });
        
        // 1. Mail to you (Notification)
        await transport.sendMail({ 
          from: EMAIL_USER, 
          to: "fachowo.eu@gmail.com", 
          subject: `Nowa wiadomość: ${data.name}`, 
          text: `Imię: ${data.name}\nEmail: ${data.email}\nFilia: ${data.branch}\n\n${data.message}` 
        });

        // 2. Mail to Customer (Auto-Confirmation)
        await transport.sendMail({
          from: `"Fachowo.net.pl" <${EMAIL_USER}>`,
          to: data.email,
          subject: "Dziękujemy za kontakt - Fachowo.net.pl",
          text: `Witaj ${data.name}!\n\nDziękujemy za przesłanie zapytania do naszej filii w mieście ${data.branch}.\n\nOtrzymaliśmy Twoją wiadomość i nasi specjaliści już nad nią pracują. Skontaktujemy się z Tobą telefonicznie lub mailowo w ciągu najbliższych 24 godzin roboczych, aby omówić szczegóły i przygotować bezpłatną wycenę.\n\n---\nZ poważaniem,\nZespół Fachowo.net.pl\nwww.fachowo.net.pl\nTel: +48 123 456 789`
        });
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
