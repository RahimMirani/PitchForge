import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { type Id } from "./_generated/dataModel";

// ============================================================================
// DECK MUTATIONS (Write Operations)
// ============================================================================

export const createDeck = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User is not authenticated.");
    }
    const userId = identity.subject;

    const now = Date.now();
    
    const deckId = await ctx.db.insert("decks", {
      userId,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const userId = identity.subject;

    const decks = await ctx.db
      .query("decks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User is not authenticated to view this deck.");
    }
    const userId = identity.subject;

    // Get the deck
    const deck = await ctx.db.get(args.deckId);
    
    if (!deck) {
      throw new Error("Deck not found");
    }

    if (deck.userId !== userId) {
      throw new Error("User is not authorized to view this deck.");
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

export const getDeckWithSlidesByStringId = query({
  args: { deckId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    let deck;
    try {
      const id = args.deckId as Id<"decks">;
      deck = await ctx.db.get(id);
    } catch (e) {
      console.error("Failed to get deck by string ID", e);
      return null;
    }

    if (deck.userId !== userId) {
      // User is not authorized to view this deck
      return null;
    }

    if (!deck) {
      return null;
    }

    const slides = await ctx.db
      .query("slides")
      .filter((q) => q.eq(q.field("deckId"), deck._id))
      .order("asc")
      .collect();

    return {
      ...deck,
      slides,
    };
  },
}); 