import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// MESSAGE MUTATIONS (Write Operations)
// ============================================================================

export const sendMessage = mutation({
  args: {
    deckId: v.id("decks"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      deckId: args.deckId,
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    });
    
    return messageId;
  },
});

export const clearChatHistory = mutation({
  args: {
    deckId: v.id("decks"),
  },
  handler: async (ctx, args) => {
    // Get all messages for this deck
    const messages = await ctx.db
      .query("messages")
      .filter(q => q.eq(q.field("deckId"), args.deckId))
      .collect();
    
    // Delete each message
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});

// ============================================================================
// MESSAGE QUERIES (Read Operations)
// ============================================================================

export const getMessages = query({
  args: {
    deckId: v.id("decks"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter(q => q.eq(q.field("deckId"), args.deckId))
      .order("asc") // Oldest first (chronological order)
      .collect();
    
    return messages;
  },
});

export const getLatestMessage = query({
  args: {
    deckId: v.id("decks"),
  },
  handler: async (ctx, args) => {
    const latestMessage = await ctx.db
      .query("messages")
      .filter(q => q.eq(q.field("deckId"), args.deckId))
      .order("desc") // Newest first
      .first(); // Get only the latest one
    
    return latestMessage;
  },
}); 