import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { InsertCard, InsertTopic } from "@shared/schema";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage instead of disk storage for Cloudinary upload
const upload = multer({
  storage: multer.memoryStorage(),
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
          // Upload to Cloudinary
          const uploadResult = await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "flashcards",
                resource_type: "image",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result!.secure_url);
              }
            );
            uploadStream.end(file.buffer);
          });

          const card: InsertCard = {
            imageUrl: uploadResult,
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

      // Delete from Cloudinary if it's a Cloudinary URL
      if (card.type === "uploaded" && card.imageUrl.includes("cloudinary.com")) {
        try {
          // Extract public_id from Cloudinary URL
          const urlParts = card.imageUrl.split("/");
          const publicIdWithExt = urlParts.slice(urlParts.indexOf("flashcards")).join("/");
          const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // Remove extension

          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Error deleting from Cloudinary:", err);
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

  // Topic routes
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  app.post("/api/topics", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Topic name is required" });
      }
      const topic: InsertTopic = { name };
      const newTopic = await storage.createTopic(topic);
      res.json(newTopic);
    } catch (error) {
      console.error("Error creating topic:", error);
      res.status(500).json({ error: "Failed to create topic" });
    }
  });

  app.post("/api/topics/:topicId/cards", async (req, res) => {
    try {
      const { topicId } = req.params;
      const { cardIds } = req.body;

      if (!Array.isArray(cardIds)) {
        return res.status(400).json({ error: "Invalid card IDs" });
      }

      await storage.addCardsToTopic(topicId, cardIds);
      const cards = await storage.getCardsByTopic(topicId);
      res.json(cards);
    } catch (error) {
      console.error("Error adding cards to topic:", error);
      res.status(500).json({ error: "Failed to add cards to topic" });
    }
  });

  app.get("/api/topics/:topicId/cards", async (req, res) => {
    try {
      const { topicId } = req.params;
      const cards = await storage.getCardsByTopic(topicId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching topic cards:", error);
      res.status(500).json({ error: "Failed to fetch topic cards" });
    }
  });

  app.delete("/api/topics/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTopic(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting topic:", error);
      res.status(500).json({ error: "Failed to delete topic" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
