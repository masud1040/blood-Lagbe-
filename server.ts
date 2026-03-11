import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("blood_donation.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    is_admin INTEGER DEFAULT 0,
    donation_count INTEGER DEFAULT 0,
    last_donation_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS cms_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    sender_type TEXT NOT NULL DEFAULT 'admin', -- 'admin' or 'user'
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  INSERT OR IGNORE INTO cms_settings (key, value) VALUES ('site_name', 'ব্লাড লাগবে?');
  INSERT OR IGNORE INTO cms_settings (key, value) VALUES ('hero_title', 'ব্লাড লাগবে?');
  INSERT OR IGNORE INTO cms_settings (key, value) VALUES ('hero_subtitle', 'রক্ত খুঁজুন, জীবন বাঁচান');
  INSERT OR IGNORE INTO cms_settings (key, value) VALUES ('important_notice', 'জরুরী প্রয়োজনে আমাদের হটলাইনে কল করুন: +৮৮০ ১২৩৪৫৬৭৮৯০');
`);

// Ensure last_donation_date column exists for existing databases
try {
  db.exec("ALTER TABLE users ADD COLUMN last_donation_date TEXT");
} catch (e) {
  // Column already exists or table doesn't exist yet (which shouldn't happen due to CREATE TABLE above)
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth & User Routes
  app.get("/api/cms", (req, res) => {
    const settings = db.prepare("SELECT * FROM cms_settings").all();
    const cms: Record<string, string> = {};
    settings.forEach((s: any) => cms[s.key] = s.value);
    res.json(cms);
  });

  app.post("/api/register", (req, res) => {
    const { name, email, blood_group, phone, location, donation_count, last_donation_date } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (name, email, blood_group, phone, location, donation_count, last_donation_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
      stmt.run(name, email, blood_group, phone, location, donation_count || 0, last_donation_date || null);
      res.json({ success: true, message: "Registration successful. Waiting for admin verification." });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.get("/api/donors", (req, res) => {
    const { blood_group, location } = req.query;
    let query = "SELECT id, name, blood_group, location, phone, donation_count, last_donation_date FROM users WHERE is_verified = 1";
    const params: any[] = [];

    if (blood_group) {
      query += " AND blood_group = ?";
      params.push(blood_group);
    }
    if (location) {
      query += " AND location LIKE ?";
      params.push(`%${location}%`);
    }

    const donors = db.prepare(query).all(...params);
    res.json(donors);
  });

  app.get("/api/donors/:id", (req, res) => {
    const donor = db.prepare("SELECT id, name, blood_group, location, phone, donation_count, last_donation_date FROM users WHERE id = ? AND is_verified = 1").get(req.params.id);
    if (donor) {
      res.json(donor);
    } else {
      res.status(404).json({ message: "Donor not found" });
    }
  });

  app.get("/api/leaderboard", (req, res) => {
    const topDonors = db.prepare("SELECT name, blood_group, donation_count FROM users WHERE is_verified = 1 ORDER BY donation_count DESC LIMIT 10").all();
    res.json(topDonors);
  });

  app.get("/api/stats", (req, res) => {
    const totalDonors = db.prepare("SELECT COUNT(*) as count FROM users WHERE is_verified = 1").get() as any;
    const bloodDist = db.prepare("SELECT blood_group, COUNT(*) as count FROM users WHERE is_verified = 1 GROUP BY blood_group").all();
    const recentDonors = db.prepare("SELECT name, blood_group, location FROM users WHERE is_verified = 1 ORDER BY created_at DESC LIMIT 5").all();
    
    res.json({
      totalDonors: totalDonors.count,
      bloodDist,
      recentDonors
    });
  });

  // User to Admin Message
  app.post("/api/messages", (req, res) => {
    const { phone, message } = req.body;
    try {
      // Find user by phone to link the message
      const user = db.prepare("SELECT id FROM users WHERE phone = ?").get(phone) as any;
      if (!user) {
        return res.status(404).json({ success: false, message: "আপনার ফোন নম্বরটি নিবন্ধিত নয়।" });
      }
      db.prepare("INSERT INTO messages (user_id, message, sender_type) VALUES (?, ?, 'user')").run(user.id, message);
      res.json({ success: true, message: "আপনার মেসেজটি অ্যাডমিনের কাছে পাঠানো হয়েছে।" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // Admin Routes (Simplified for demo, usually needs auth middleware)
  app.get("/api/admin/users", (req, res) => {
    const users = db.prepare("SELECT * FROM users").all();
    res.json(users);
  });

  app.get("/api/admin/messages", (req, res) => {
    const messages = db.prepare(`
      SELECT m.*, u.name as user_name, u.phone as user_phone 
      FROM messages m 
      JOIN users u ON m.user_id = u.id 
      ORDER BY m.sent_at DESC
    `).all();
    res.json(messages);
  });

  app.post("/api/admin/verify", (req, res) => {
    const { id, verify } = req.body;
    db.prepare("UPDATE users SET is_verified = ? WHERE id = ?").run(verify ? 1 : 0, id);
    res.json({ success: true });
  });

  app.put("/api/admin/users/:id", (req, res) => {
    const { name, blood_group, phone, location, donation_count, last_donation_date, is_verified } = req.body;
    try {
      db.prepare(`
        UPDATE users 
        SET name = ?, blood_group = ?, phone = ?, location = ?, donation_count = ?, last_donation_date = ?, is_verified = ?
        WHERE id = ?
      `).run(name, blood_group, phone, location, donation_count, last_donation_date, is_verified ? 1 : 0, req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.post("/api/admin/message", (req, res) => {
    const { user_id, message } = req.body;
    try {
      db.prepare("INSERT INTO messages (user_id, message, sender_type) VALUES (?, ?, 'admin')").run(user_id, message);
      // In a real app, you might trigger an SMS/Email here
      res.json({ success: true, message: "Message sent and logged successfully." });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.post("/api/admin/cms", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO cms_settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
