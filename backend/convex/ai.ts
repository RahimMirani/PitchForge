import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// AI ACTIONS (External API Calls)
// ============================================================================

export const chatWithAI = action({
  args: {
    deckId: v.id("decks"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Save user message to database
    await ctx.runMutation(api.messages.sendMessage, {
      deckId: args.deckId,
      role: "user",
      content: args.userMessage,
    });

    // 2. Get chat history for context
    const messages = await ctx.runQuery(api.messages.getMessages, {
      deckId: args.deckId,
    });

    // 3. Format messages for OpenAI
    const openaiMessages = messages.map(msg => ({
      role: msg.role === "user" ? "user" as const : "assistant" as const,
      content: msg.content,
    }));

    // 4. Add system prompt for pitch deck context
    const systemPrompt = {
      role: "system" as const,
      content: `You are an expert pitch deck consultant helping entrepreneurs create compelling presentations. 
      
      You can help with:
      - Creating slide content (problem, solution, market, etc.)
      - Improving existing content
      - Structuring the pitch flow
      - Making content more engaging
      
      Be concise, actionable, and focus on what investors want to see. 
      If the user asks you to create a slide, provide a clear title and compelling content.`,
    };

    try {
      // 5. Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [systemPrompt, ...openaiMessages],
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

      // 6. Save AI response to database
      await ctx.runMutation(api.messages.sendMessage, {
        deckId: args.deckId,
        role: "assistant",
        content: aiResponse,
      });

      return {
        success: true,
        response: aiResponse,
      };

    } catch (error) {
      console.error("OpenAI API error:", error);
      
      // Save error message to chat
      await ctx.runMutation(api.messages.sendMessage, {
        deckId: args.deckId,
        role: "assistant", 
        content: "I'm having trouble connecting to my AI service. Please try again in a moment.",
      });

      return {
        success: false,
        error: "Failed to get AI response",
      };
    }
  },
}); 