import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  // Define what data this function expects
  args: {
    title: v.string(),
  },
  
  // The actual function that runs
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Insert new deck into database
    const deckId = await ctx.db.insert("decks", {
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
    
    // Return the new deck ID so frontend can use it
    return deckId;
  },
}); 