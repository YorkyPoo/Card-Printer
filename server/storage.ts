import { type Card, type InsertCard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  deleteCard(id: string): Promise<void>;
  updateCardPosition(id: string, position: number): Promise<Card | undefined>;
  reorderCards(cardIds: string[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private cards: Map<string, Card>;

  constructor() {
    this.cards = new Map();
  }

  async getCards(): Promise<Card[]> {
    return Array.from(this.cards.values()).sort((a, b) => 
      parseInt(a.position) - parseInt(b.position)
    );
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = { 
      ...insertCard, 
      id,
      createdAt: new Date()
    };
    this.cards.set(id, card);
    return card;
  }

  async deleteCard(id: string): Promise<void> {
    this.cards.delete(id);
  }

  async updateCardPosition(id: string, position: number): Promise<Card | undefined> {
    const card = this.cards.get(id);
    if (!card) return undefined;
    
    const updatedCard = { ...card, position: position.toString() };
    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  async reorderCards(cardIds: string[]): Promise<void> {
    cardIds.forEach((id, index) => {
      const card = this.cards.get(id);
      if (card) {
        this.cards.set(id, { ...card, position: index.toString() });
      }
    });
  }
}

export const storage = new MemStorage();
