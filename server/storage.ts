import { type User, type InsertUser, type AccessKey, type InsertAccessKey, type UserRole, type PhotoSection, type InsertPhotoSection, type PageContent, type InsertPageContent, accessKeys, users, photoSections, pageContent } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Access Key operations
  getAccessKey(key: string): Promise<AccessKey | undefined>;
  getAccessKeyById(id: string): Promise<AccessKey | undefined>;
  createAccessKey(key: InsertAccessKey): Promise<AccessKey>;
  getAllAccessKeys(): Promise<AccessKey[]>;
  updateAccessKey(id: string, updates: Partial<AccessKey>): Promise<AccessKey | undefined>;
  deleteAccessKey(id: string): Promise<boolean>;

  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByKeyId(keyId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  deleteUser(id: string): Promise<boolean>;

  // Photo Section operations
  createPhotoSection(section: InsertPhotoSection & { createdBy: string }): Promise<PhotoSection>;
  getAllPhotoSections(): Promise<PhotoSection[]>;
  deletePhotoSection(id: string): Promise<boolean>;

  // Page Content operations
  getPageContent(page: string): Promise<PageContent[]>;
  getContentByKey(page: string, key: string): Promise<PageContent | undefined>;
  updatePageContent(page: string, section: string, key: string, content: string, updatedBy: string): Promise<PageContent>;
  getAllContent(): Promise<PageContent[]>;

  // Discord notifications
  sendDiscordNotification(webhookUrl: string, title: string, description: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private accessKeys: Map<string, AccessKey>;
  private users: Map<string, User>;
  private photoSections: Map<string, PhotoSection>;
  private pageContents: Map<string, PageContent>;

  constructor() {
    this.accessKeys = new Map();
    this.users = new Map();
    this.photoSections = new Map();
    this.pageContents = new Map();
  }

  // Access Key operations
  async getAccessKey(key: string): Promise<AccessKey | undefined> {
    return Array.from(this.accessKeys.values()).find(
      (ak) => ak.key === key,
    );
  }

  async getAccessKeyById(id: string): Promise<AccessKey | undefined> {
    return this.accessKeys.get(id);
  }

  async createAccessKey(insertKey: InsertAccessKey): Promise<AccessKey> {
    const id = randomUUID();
    const accessKey: AccessKey = { ...insertKey, id };
    this.accessKeys.set(id, accessKey);
    return accessKey;
  }

  async getAllAccessKeys(): Promise<AccessKey[]> {
    return Array.from(this.accessKeys.values());
  }

  async updateAccessKey(id: string, updates: Partial<AccessKey>): Promise<AccessKey | undefined> {
    const existing = this.accessKeys.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.accessKeys.set(id, updated);
    return updated;
  }

  async sendDiscordNotification(webhookUrl: string, title: string, description: string): Promise<void> {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: `Key Management: ${title}`,
              description: description,
              color: 3447003,
              timestamp: new Date().toISOString(),
              footer: { text: "T.E.S Access System" },
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
    }
  }

  async deleteAccessKey(id: string): Promise<boolean> {
    return this.accessKeys.delete(id);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByKeyId(keyId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.keyId === keyId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const accessKey = await this.getAccessKeyById(insertUser.keyId);
    const user: User = {
      ...insertUser,
      id,
      role: accessKey?.role || "none",
    };
    this.users.set(id, user);
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Photo Section operations
  async createPhotoSection(section: InsertPhotoSection & { createdBy: string }): Promise<PhotoSection> {
    const id = randomUUID();
    const photoSection: PhotoSection = {
      ...section,
      id,
      createdAt: new Date().toISOString(),
    };
    this.photoSections.set(id, photoSection);
    return photoSection;
  }

  async getAllPhotoSections(): Promise<PhotoSection[]> {
    return Array.from(this.photoSections.values());
  }

  async deletePhotoSection(id: string): Promise<boolean> {
    return this.photoSections.delete(id);
  }

  async getPageContent(page: string): Promise<PageContent[]> {
    return Array.from(this.pageContents.values()).filter(pc => pc.page === page);
  }

  async getContentByKey(page: string, key: string): Promise<PageContent | undefined> {
    return Array.from(this.pageContents.values()).find(pc => pc.page === page && pc.key === key);
  }

  async updatePageContent(page: string, section: string, key: string, content: string, updatedBy: string): Promise<PageContent> {
    const existing = Array.from(this.pageContents.values()).find(pc => pc.page === page && pc.key === key);
    const id = existing?.id || randomUUID();
    const pageContentItem: PageContent = {
      id,
      page,
      section,
      key,
      content,
      updatedBy,
      updatedAt: new Date().toISOString(),
    };
    this.pageContents.set(id, pageContentItem);
    return pageContentItem;
  }

  async getAllContent(): Promise<PageContent[]> {
    return Array.from(this.pageContents.values());
  }
}

export class DatabaseStorage implements IStorage {
  constructor(private db: any) {}

  // Access Key operations
  async getAccessKey(key: string): Promise<AccessKey | undefined> {
    const result = await this.db
      .select()
      .from(accessKeys)
      .where(eq(accessKeys.key, key))
      .limit(1);
    return result[0];
  }

  async getAccessKeyById(id: string): Promise<AccessKey | undefined> {
    const result = await this.db
      .select()
      .from(accessKeys)
      .where(eq(accessKeys.id, id))
      .limit(1);
    return result[0];
  }

  async createAccessKey(insertKey: InsertAccessKey): Promise<AccessKey> {
    const result = await this.db
      .insert(accessKeys)
      .values(insertKey)
      .returning();
    return result[0];
  }

  async getAllAccessKeys(): Promise<AccessKey[]> {
    return this.db.select().from(accessKeys);
  }

  async updateAccessKey(id: string, updates: Partial<AccessKey>): Promise<AccessKey | undefined> {
    const result = await this.db
      .update(accessKeys)
      .set(updates)
      .where(eq(accessKeys.id, id))
      .returning();
    return result[0];
  }

  async deleteAccessKey(id: string): Promise<boolean> {
    const result = await this.db
      .delete(accessKeys)
      .where(eq(accessKeys.id, id))
      .returning();
    return result.length > 0;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByKeyId(keyId: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.keyId, keyId))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const accessKey = await this.getAccessKeyById(insertUser.keyId);
    const result = await this.db
      .insert(users)
      .values({
        ...insertUser,
        role: accessKey?.role || "none",
      })
      .returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return result.length > 0;
  }

  // Photo Section operations
  async createPhotoSection(section: InsertPhotoSection & { createdBy: string }): Promise<PhotoSection> {
    const result = await this.db
      .insert(photoSections)
      .values({
        ...section,
        createdAt: new Date().toISOString(),
      })
      .returning();
    return result[0];
  }

  async getAllPhotoSections(): Promise<PhotoSection[]> {
    return this.db.select().from(photoSections);
  }

  async deletePhotoSection(id: string): Promise<boolean> {
    const result = await this.db
      .delete(photoSections)
      .where(eq(photoSections.id, id))
      .returning();
    return result.length > 0;
  }

  async getPageContent(page: string): Promise<PageContent[]> {
    return this.db.select().from(pageContent).where(eq(pageContent.page, page));
  }

  async getContentByKey(page: string, key: string): Promise<PageContent | undefined> {
    const result = await this.db
      .select()
      .from(pageContent)
      .where(and(eq(pageContent.page, page), eq(pageContent.key, key)))
      .limit(1);
    return result[0];
  }

  async updatePageContent(page: string, section: string, key: string, content: string, updatedBy: string): Promise<PageContent> {
    const existing = await this.getContentByKey(page, key);
    if (existing) {
      const result = await this.db
        .update(pageContent)
        .set({ content, updatedBy, updatedAt: new Date().toISOString() })
        .where(eq(pageContent.id, existing.id))
        .returning();
      return result[0];
    }
    const result = await this.db
      .insert(pageContent)
      .values({ page, section, key, content, updatedBy, updatedAt: new Date().toISOString() })
      .returning();
    return result[0];
  }

  async getAllContent(): Promise<PageContent[]> {
    return this.db.select().from(pageContent);
  }

  async sendDiscordNotification(webhookUrl: string, title: string, description: string): Promise<void> {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: `Key Management: ${title}`,
              description: description,
              color: 3447003,
              timestamp: new Date().toISOString(),
              footer: { text: "T.E.S Access System" },
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Failed to send Discord notification:", error);
    }
  }
}

// Use environment variable to determine which storage to use
async function initializeStorage(): Promise<IStorage> {
  if (process.env.DATABASE_URL) {
    const { db } = await import("./db");
    return new DatabaseStorage(db);
  } else {
    return new MemStorage();
  }
}

export { initializeStorage };
