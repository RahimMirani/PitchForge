import { query } from "./_generated/server";

export default query({
  // No args needed - we want ALL decks
  args: {},
  
  // The actual function that runs
  handler: async (ctx) => {
    // Get all decks from database, ordered by newest first
    const decks = await ctx.db
      .query("decks")
      .order("desc")  // Newest first (by _creationTime)
      .collect();     // Get all results as array
    
    return decks;
  },
}); 