import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// SLIDE MUTATIONS (Write Operations)
// ============================================================================

export const createSlide = mutation({
  args: {
    deckId: v.id("decks"),
    title: v.string(),                    // Custom title like "Market Analysis"
    content: v.optional(v.string()),      // Content can be empty initially
    type: v.optional(v.union(             // Optional predefined category
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
      v.literal("ask"),
      v.literal("custom")                 // For completely custom slides
    )),
  },
  handler: async (ctx, args) => {
    // Get the current number of slides in this deck to set order
    const existingSlides = await ctx.db
      .query("slides")
      .filter(q => q.eq(q.field("deckId"), args.deckId))
      .collect();
    
    const slideId = await ctx.db.insert("slides", {
      deckId: args.deckId,
      title: args.title,                  // User-defined title
      content: args.content || "",        // Can be empty initially
      type: args.type || "custom",        // Default to custom if not specified
      order: existingSlides.length + 1,
      createdAt: Date.now(),
    });
    
    return slideId;
  },
});

export const updateSlide = mutation({
  args: {
    slideId: v.id("slides"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.slideId, {
      content: args.content,
    });
  },
});

export const deleteSlide = mutation({
  args: {
    slideId: v.id("slides"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.slideId);
  },
});

export const reorderSlides = mutation({
  args: {
    deckId: v.id("decks"),
    slideOrders: v.array(v.object({
      slideId: v.id("slides"),
      newOrder: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Update order for multiple slides at once
    for (const { slideId, newOrder } of args.slideOrders) {
      await ctx.db.patch(slideId, {
        order: newOrder,
      });
    }
  },
});

// ============================================================================
// SLIDE QUERIES (Read Operations)
// ============================================================================

export const getSlidesByDeck = query({
  args: {
    deckId: v.id("decks"),
  },
  handler: async (ctx, args) => {
    const slides = await ctx.db
      .query("slides")
      .filter(q => q.eq(q.field("deckId"), args.deckId))
      .order("asc")
      .collect();
    
    // Sort by order field to ensure correct slide sequence
    return slides.sort((a, b) => a.order - b.order);
  },
});

export const getSlide = query({
  args: {
    slideId: v.id("slides"),
  },
  handler: async (ctx, args) => {
    const slide = await ctx.db.get(args.slideId);
    
    if (!slide) {
      throw new Error("Slide not found");
    }
    
    return slide;
  },
}); 