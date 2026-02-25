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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple session token
let adminToken = "";

// Global Error Handlers
process.on('uncaughtException', (error) => {
    try { fs.appendFileSync(path.join(__dirname, '..', 'crash.log'), `CRASH: ${error.message}\n`); } catch {}
    process.exit(1);
});

// Email configuration
const EMAIL_USER = "fachowo.eu@gmail.com"; 
const EMAIL_PASS = "xxcw tyjh rbtr eflj"; 

// Configure Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    let uploadPath;
    try {
        if (process.env.NODE_ENV === "production") {
          uploadPath = path.resolve(__dirname, "public", "uploads");
        } else {
          uploadPath = path.resolve(__dirname, "..", "client", "public", "uploads");
        }
    
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        fs.appendFileSync(path.join(__dirname, '..', 'upload-debug.log'), `Saving to: ${uploadPath}\n`);
        cb(null, uploadPath);
    } catch (e) {
        cb(e as Error, '');
    }
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "project-" + uniqueSuffix + ext);
  },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
});

function seedProjects() {
  const db = readDb();
  
  if (db.projects.length === 0) {
    console.log("Seeding projects...");
    const initialProjects = [
      {
        id: 1,
        title: 'Remont Biura w Centrum',
        category: 'Komercyjne',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800',
        description: 'Nowoczesne wykończenie biura open space',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Remont Mieszkania',
        category: 'Mieszkaniowe',
        image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800',
        description: 'Kompleksowy remont mieszkania z nowoczesnym wykończeniem',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Układanie Podłóg',
        category: 'Podłogi',
        image: 'https://images.unsplash.com/photo-1581858726768-fdff21ac91a1?auto=format&fit=crop&w=800',
        description: 'Montaż i wykończenie podłóg drewnianych',
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Salon Fryzjerski',
        category: 'Komercyjne',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800',
        description: 'Adaptacja lokalu pod ekskluzywny salon fryzjerski',
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Apartament w Kamienicy',
        category: 'Mieszkaniowe',
        image: 'https://images.unsplash.com/photo-1502005229766-939cb9342722?auto=format&fit=crop&w=800',
        description: 'Renowacja zabytkowego apartamentu ze sztukaterią',
        created_at: new Date().toISOString()
      }
    ];

    db.projects = initialProjects;
    writeDb(db);
    console.log("Seeded initial projects.");
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

  const indexPath = process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public", "index.html")
    : path.resolve(__dirname, "..", "client", "index.html");

  console.log(`[Fachowo.eu] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Fachowo.eu] Static Path: ${staticPath}`);
  console.log(`[Fachowo.eu] Index Path: ${indexPath}`);

  // Sprawdź czy plik index.html istnieje
  if (!fs.existsSync(indexPath)) {
    console.error(`🔴 KRYTYCZNY BŁĄD: Nie znaleziono pliku index.html w lokalizacji: ${indexPath}`);
  }

  app.use(express.static(staticPath));

  // --- API Endpoints ---

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "popek" && password === "admin123") {
      adminToken = nanoid();
      res.json({ success: true, token: adminToken });
    } else {
      res.status(401).json({ success: false, error: "Błędna nazwa użytkownika lub hasło" });
    }
  });

  app.get("/api/projects", (_req, res) => {
    try {
      const db = readDb();
      res.json(db.projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // POST Project (with error handling wrapper)
  app.post("/api/admin/projects", (req, res) => {
    upload.array("images", 50)(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err);
            return res.status(500).json({ error: err.message });
        }

        try {
            const validatedData = projectSchema.parse(req.body);
            const { title, category, description } = validatedData;
            // req.files is available here
            const files = req.files as Express.Multer.File[];
      
            if (!files || files.length === 0) {
              return res.status(400).json({ error: "At least one image is required" });
            }
      
            const imageUrls = files.map(f => `/uploads/${f.filename}`);
            const db = readDb();
            
            const newProject = {
              id: Date.now(),
              title,
              category,
              image: imageUrls[0],
              images: imageUrls,
              description,
              created_at: new Date().toISOString()
            };
      
            db.projects.push(newProject);
            writeDb(db);
      
            res.json({ success: true, id: newProject.id, images: imageUrls });
        } catch (error) {
            console.error("Error adding project logic:", error);
            res.status(500).json({ error: "Failed to add project logic" });
        }
    });
  });

  // PUT Project (Update)
  app.put("/api/admin/projects/:id", (req, res) => {
    upload.array("images", 50)(req, res, (err) => {
        if (err) {
            console.error("Upload Update Error:", err);
            return res.status(500).json({ error: err.message });
        }

        try {
            const id = parseInt(req.params.id);
            const validatedData = projectSchema.partial().parse(req.body);
            const { title, category, description } = validatedData;
            const files = req.files as Express.Multer.File[];
      
            const db = readDb();
            const projectIndex = db.projects.findIndex(p => p.id === id);
            
            if (projectIndex === -1) {
              return res.status(404).json({ error: "Project not found" });
            }
      
            const currentProject = db.projects[projectIndex];
            let currentImages = currentProject.images || (currentProject.image ? [currentProject.image] : []);
      
            if (files && files.length > 0) {
              const newUrls = files.map(f => `/uploads/${f.filename}`);
              currentImages = [...currentImages, ...newUrls];
            }
      
            db.projects[projectIndex] = {
              ...currentProject,
              title: title || currentProject.title,
              category: category || currentProject.category,
              description: description || currentProject.description,
              image: currentImages.length > 0 ? currentImages[0] : "",
              images: currentImages
            };
      
            writeDb(db);
            res.json({ success: true, project: db.projects[projectIndex] });
        } catch (error) {
            console.error("Error updating project logic:", error);
            res.status(500).json({ error: "Failed to update project" });
        }
    });
  });

  app.delete("/api/admin/projects/:id", (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const db = readDb();
      db.projects = db.projects.filter(p => p.id !== id);
      writeDb(db);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Contact Form Endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      const { name, email, phone, message } = validatedData;

      const clientIp = req.clientIp || req.ip;
      const geo = geoip.lookup(clientIp || "");
      const userAgent = req.headers["user-agent"] || "";

      const location = geo ? `${geo.city}, ${geo.country}` : "Unknown";

      // Save to JSON DB
      const db = readDb();
      const newLead = {
        id: Date.now(),
        name,
        email,
        phone,
        message,
        ip: clientIp,
        country: geo?.country || "",
        city: geo?.city || "",
        user_agent: userAgent,
        created_at: new Date().toISOString()
      };
      
      db.leads.push(newLead);
      writeDb(db);

      console.log(`Received contact form from ${name} (${email}). Sending email via Gmail...`);

      // Email Transporter (Gmail)
      if (EMAIL_USER && EMAIL_PASS) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: EMAIL_USER,
              pass: EMAIL_PASS,
            },
            logger: true,
            debug: true
          });

          const mailOptions = {
            from: EMAIL_USER,
            to: "fachowo.eu@gmail.com",
            subject: `Wiadomość ze strony: ${name}`,
            text: `Imię: ${name}\nEmail: ${email}\nTelefon: ${phone}\n\nWiadomość:\n${message}`
          };
          
          try {
             const info = await transporter.sendMail(mailOptions);
             console.log("Email sent successfully. ID:", info.messageId);
          } catch (emailError) {
             console.error("FAILED TO SEND EMAIL. Error details:", emailError);
          }
      }

      res.status(200).json({ success: true, message: "Message received" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, error: error.issues[0].message });
      }
      console.error("Error processing contact form:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Admin: Get Leads
  app.get("/api/admin/leads", (_req, res) => {
    try {
      const db = readDb();
      res.json(db.leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
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

  app.get("*", (_req, res) => {
    res.sendFile(indexPath);
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
