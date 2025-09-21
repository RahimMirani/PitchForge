import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Decks table - stores pitch deck information
  decks: defineTable({
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Slides table - stores individual slide content
  slides: defineTable({
    deckId: v.id("decks"),           // Foreign key to decks table
    type: v.union(                  // Enum-like field
      v.literal("title"),
      v.literal("problem"), 
      v.literal("solution"),
      v.literal("product"),
      v.literal("market"),
      v.literal("competition"),
      v.literal("business_model"),
      v.literal("traction"),
      v.literal("team"),
      v.literal("roadmap"),
      v.literal("ask")
    ),
    content: v.string(),
    order: v.number(),              // Position in the deck
    createdAt: v.number(),
  }).index("by_deck", ["deckId"]),  // Index for fast queries by deckId

  // Messages table - stores chat conversation history
  messages: defineTable({
    deckId: v.id("decks"),          // Which deck this conversation belongs to
    role: v.union(                  // Who sent the message
      v.literal("user"),
      v.literal("assistant")
    ),
    content: v.string(),
    timestamp: v.number(),
  }).index("by_deck", ["deckId"]),  // Index for fast queries by deckId
}); 