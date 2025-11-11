import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { InsertCard } from "@shared/schema";

const uploadDir = path.join(process.cwd(), "uploads");

fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use("/uploads", (await import("express")).static(uploadDir));

  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getCards();
      res.json(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  });

  app.post("/api/cards/upload", upload.array("files", 50), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const existingCards = await storage.getCards();
      let position = existingCards.length;

      const newCards = await Promise.all(
        req.files.map(async (file) => {
          const card: InsertCard = {
            imageUrl: `/uploads/${file.filename}`,
            type: "uploaded",
            originalFileName: file.originalname,
            position: (position++).toString(),
          };
          return storage.createCard(card);
        })
      );

      res.json(newCards);
    } catch (error) {
      console.error("Error uploading cards:", error);
      res.status(500).json({ error: "Failed to upload cards" });
    }
  });

  app.delete("/api/cards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const card = await storage.getCard(id);

      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }

      if (card.type === "uploaded" && card.imageUrl.startsWith("/uploads/")) {
        const filename = path.basename(card.imageUrl);
        const filepath = path.join(uploadDir, filename);
        try {
          await fs.unlink(filepath);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }

      await storage.deleteCard(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting card:", error);
      res.status(500).json({ error: "Failed to delete card" });
    }
  });

  app.post("/api/cards/reorder", async (req, res) => {
    try {
      const { cardIds } = req.body;

      if (!Array.isArray(cardIds)) {
        return res.status(400).json({ error: "Invalid card IDs" });
      }

      await storage.reorderCards(cardIds);
      const cards = await storage.getCards();
      res.json(cards);
    } catch (error) {
      console.error("Error reordering cards:", error);
      res.status(500).json({ error: "Failed to reorder cards" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
