import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// DECK MUTATIONS (Write Operations)
// ============================================================================

export const createDeck = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const deckId = await ctx.db.insert("decks", {
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
    
    return deckId;
  },
});

export const updateDeck = mutation({
  args: {
    deckId: v.id("decks"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.deckId, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

// ============================================================================
// DECK QUERIES (Read Operations)
// ============================================================================

export const getDecks = query({
  args: {},
  handler: async (ctx) => {
    const decks = await ctx.db
      .query("decks")
      .order("desc")
      .collect();
    
    return decks;
  },
});

export const getDeck = query({
  args: {
    deckId: v.id("decks"),
  },
  handler: async (ctx, args) => {
    // Get the deck
    const deck = await ctx.db.get(args.deckId);
    
    if (!deck) {
      throw new Error("Deck not found");
    }
    
    // Get all slides for this deck (simplified query)
    const slides = await ctx.db
      .query("slides")
      .filter(q => q.eq(q.field("deckId"), args.deckId))
      .order("asc")
      .collect();
    
    return {
      ...deck,
      slides,
    };
  },
}); 