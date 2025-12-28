import type { Express } from "express";
import { createServer, type Server } from "http";
import { initializeStorage } from "./storage";
import { insertAccessKeySchema, insertUserSchema, insertPhotoSectionSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const storage = await initializeStorage();

  // Initialize with default keys if none exist
  const existingKeys = await storage.getAllAccessKeys();
  if (existingKeys.length === 0) {
    await storage.createAccessKey({
      key: "TES-ADMIN-8B4X-2P9Q",
      role: "directors_office",
      used: false,
      assignedTo: null,
      username: "Admin",
    });
    await storage.createAccessKey({
      key: "TES-DIRECTOR-7K2M-5L8P",
      role: "directors_office",
      used: false,
      assignedTo: null,
      username: "Directors Office",
    });
  }

  // Get access key
  app.get("/api/access-key/:key", async (req, res) => {
    try {
      const accessKey = await storage.getAccessKey(req.params.key);
      if (!accessKey) {
        return res.status(404).json({ error: "Key not found" });
      }
      res.json(accessKey);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch access key" });
    }
  });

  // Create user (login/register)
  app.post("/api/users/register", async (req, res) => {
    try {
      const validationResult = insertUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const { keyId, password } = validationResult.data;

      // Check if key exists and is not used
      const accessKey = await storage.getAccessKeyById(keyId);
      if (!accessKey || accessKey.used) {
        return res.status(400).json({ error: "Invalid or already used key" });
      }

      // Check if user already exists for this key
      const existingUser = await storage.getUserByKeyId(keyId);
      if (existingUser) {
        return res.status(400).json({ error: "Key already registered" });
      }

      // Create user
      const user = await storage.createUser({ keyId, password });

      // Mark key as used and assign to user
      await storage.updateAccessKey(keyId, { used: true, assignedTo: user.id });

      // Get the username from the access key
      const userWithUsername = { ...user, username: accessKey.username };

      res.json({ user: userWithUsername });
    } catch (error) {
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { key, password } = req.body;

      if (!key || !password) {
        return res.status(400).json({ error: "Missing key or password" });
      }

      const accessKey = await storage.getAccessKey(key);
      if (!accessKey || !accessKey.used) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = await storage.getUserByKeyId(accessKey.id);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Include username from the access key
      const userWithUsername = { ...user, username: accessKey.username };

      res.json({ user: userWithUsername });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Create new access key (directors office only)
  app.post("/api/access-keys/create", async (req, res) => {
    try {
      const { role, username } = req.body;
      const userIdHeader = req.headers["x-user-id"];

      if (!userIdHeader) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!username || !username.trim()) {
        return res.status(400).json({ error: "Username is required" });
      }

      const user = await storage.getUser(userIdHeader as string);
      if (!user) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Check permissions based on user role
      if (user.role === "directors_office") {
        // Directors office can create any role
        if (!role || !["public_relations", "directors_office", "public_relations_lead"].includes(role)) {
          return res.status(400).json({ error: "Invalid role" });
        }
      } else if (user.role === "public_relations_lead") {
        // PR Lead can only create public relations keys
        if (role !== "public_relations") {
          return res.status(403).json({ error: "You can only assign Public Relations keys" });
        }
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Generate unique random key (ensure no overlaps)
      let randomKey: string;
      let keyExists = true;
      while (keyExists) {
        randomKey = `TES-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        keyExists = (await storage.getAccessKey(randomKey)) !== undefined;
      }

      const accessKey = await storage.createAccessKey({
        key: randomKey!,
        role,
        used: false,
        assignedTo: null,
        username: username.trim(),
      });

      // Send Discord notification
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await storage.sendDiscordNotification(
            webhookUrl,
            "New Key Created",
            `Username: **${username.trim()}**\nRole: **${role.replace("_", " ")}**\nKey: \`${randomKey}\``
          );
        } catch (discordError) {
          console.error("Discord notification failed, but key created successfully:", discordError);
        }
      }

      res.json({ accessKey });
    } catch (error) {
      res.status(500).json({ error: "Failed to create key" });
    }
  });

  // Get all access keys (directors office and public relations lead)
  app.get("/api/access-keys", async (req, res) => {
    try {
      const userIdHeader = req.headers["x-user-id"];

      if (!userIdHeader) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await storage.getUser(userIdHeader as string);
      if (!user || !["directors_office", "public_relations_lead"].includes(user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const keys = await storage.getAllAccessKeys();
      res.json({ keys });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch keys" });
    }
  });

  // Create photo section (public relations, public relations lead, and directors office)
  app.post("/api/photo-sections", async (req, res) => {
    try {
      const userIdHeader = req.headers["x-user-id"];

      if (!userIdHeader) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await storage.getUser(userIdHeader as string);
      if (!user || !["public_relations", "public_relations_lead", "directors_office"].includes(user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const validationResult = insertPhotoSectionSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const photoSection = await storage.createPhotoSection({
        ...validationResult.data,
        createdBy: userIdHeader as string,
      });

      // Send Discord notification
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await storage.sendDiscordNotification(
            webhookUrl,
            "Photo Section Added",
            `Title: **${validationResult.data.title}**\nDescription: **${validationResult.data.description}**\nAdded by: **${user.id}** (${user.role.replace("_", " ")})`
          );
        } catch (discordError) {
          console.error("Discord notification failed, but photo section created successfully:", discordError);
        }
      }

      res.json({ photoSection });
    } catch (error) {
      res.status(500).json({ error: "Failed to create photo section" });
    }
  });

  // Get all photo sections (public)
  app.get("/api/photo-sections", async (req, res) => {
    try {
      const photoSections = await storage.getAllPhotoSections();
      res.json({ photoSections });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photo sections" });
    }
  });

  // Delete photo section (public relations and directors office only)
  app.delete("/api/photo-sections/:sectionId", async (req, res) => {
    try {
      const userIdHeader = req.headers["x-user-id"];

      if (!userIdHeader) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await storage.getUser(userIdHeader as string);
      if (!user || !["public_relations", "public_relations_lead", "directors_office"].includes(user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const success = await storage.deletePhotoSection(req.params.sectionId);
      if (!success) {
        return res.status(404).json({ error: "Photo section not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete photo section" });
    }
  });

  // Debug: Create admin key
  app.post("/api/dev/create-admin-key", async (req, res) => {
    try {
      const { username } = req.body;

      if (!username || !username.trim()) {
        return res.status(400).json({ error: "Username is required" });
      }

      let randomKey: string;
      let keyExists = true;
      while (keyExists) {
        randomKey = `TES-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        keyExists = (await storage.getAccessKey(randomKey)) !== undefined;
      }

      const accessKey = await storage.createAccessKey({
        key: randomKey!,
        role: "directors_office",
        used: false,
        assignedTo: null,
        username: username.trim(),
      });

      res.json({ accessKey });
    } catch (error) {
      res.status(500).json({ error: "Failed to create key" });
    }
  });

  // Delete access key (directors office only)
  app.delete("/api/access-keys/:keyId", async (req, res) => {
    try {
      const userIdHeader = req.headers["x-user-id"];

      if (!userIdHeader) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await storage.getUser(userIdHeader as string);
      if (!user || user.role !== "directors_office") {
        return res.status(403).json({ error: "Forbidden" });
      }

      const accessKey = await storage.getAccessKeyById(req.params.keyId);
      if (!accessKey) {
        return res.status(404).json({ error: "Key not found" });
      }

      // If the key is assigned to a user, delete the user first
      if (accessKey.assignedTo) {
        await storage.deleteUser(accessKey.assignedTo);
      }

      // Then delete the access key
      const success = await storage.deleteAccessKey(req.params.keyId);
      if (!success) {
        return res.status(404).json({ error: "Key not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete key" });
    }
  });


  return httpServer;
}
