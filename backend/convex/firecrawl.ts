import { action } from "./_generated/server";
import { v } from "convex/values";

// Placeholder Firecrawl integration file.
// Future work: wire up Firecrawl's scrape API to crawl competitor sites
// and surface structured data for the deck builder.

export const scrapeCompetitors = action({
  args: {
    deckId: v.id("decks"),
    domains: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    console.log("firecrawl.scrapeCompetitors invoked with", args);
    return {
      status: "pending",
      message: "Firecrawl integration not yet implemented.",
      domains: args.domains,
    };
  },
});
