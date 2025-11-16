// Following blueprint:javascript_database integration
import { type Card, type InsertCard, type Topic, type InsertTopic, cards, topics } from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  deleteCard(id: string): Promise<void>;
  updateCardPosition(id: string, position: number): Promise<Card | undefined>;
  reorderCards(cardIds: string[]): Promise<void>;
  getTopics(): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  updateTopic(id: string, name: string): Promise<Topic>;
  deleteTopic(id: string): Promise<void>;
  addCardsToTopic(topicId: string | null, cardIds: string[]): Promise<void>;
  getCardsByTopic(topicId: string): Promise<Card[]>;
}

export class DatabaseStorage implements IStorage {
  async getCards(): Promise<Card[]> {
    return await db.select().from(cards).orderBy(asc(cards.position));
  }

  async getCard(id: string): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card || undefined;
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const [card] = await db
      .insert(cards)
      .values({
        ...insertCard,
        originalFileName: insertCard.originalFileName ?? null,
      })
      .returning();
    return card;
  }

  async deleteCard(id: string): Promise<void> {
    await db.delete(cards).where(eq(cards.id, id));
  }

  async updateCardPosition(id: string, position: number): Promise<Card | undefined> {
    const [card] = await db
      .update(cards)
      .set({ position: position.toString() })
      .where(eq(cards.id, id))
      .returning();
    return card || undefined;
  }

  async reorderCards(cardIds: string[]): Promise<void> {
    // Update each card's position based on its index in the array
    await Promise.all(
      cardIds.map((id, index) =>
        db.update(cards).set({ position: index.toString() }).where(eq(cards.id, id))
      )
    );
  }

  async getTopics(): Promise<Topic[]> {
    return await db.select().from(topics).orderBy(asc(topics.createdAt));
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const [topic] = await db
      .insert(topics)
      .values(insertTopic)
      .returning();
    return topic;
  }

  async updateTopic(id: string, name: string): Promise<Topic> {
    const [topic] = await db
      .update(topics)
      .set({ name })
      .where(eq(topics.id, id))
      .returning();
    return topic;
  }

  async deleteTopic(id: string): Promise<void> {
    await db.delete(topics).where(eq(topics.id, id));
  }

  async addCardsToTopic(topicId: string | null, cardIds: string[]): Promise<void> {
    await Promise.all(
      cardIds.map((cardId) =>
        db.update(cards).set({ topicId }).where(eq(cards.id, cardId))
      )
    );
  }

  async getCardsByTopic(topicId: string): Promise<Card[]> {
    return await db.select().from(cards).where(eq(cards.topicId, topicId)).orderBy(asc(cards.position));
  }
}

export const storage = new DatabaseStorage();
