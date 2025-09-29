import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getVapiAssistantConfig = action({
  args: {
    firmTag: v.string(),
    deckOption: v.string(),
  },
  handler: async (ctx, args) => {
    let deckContext = "The user has chosen to freestyle without a specific deck.";

    if (args.deckOption !== 'freestyle') {
      const deck = await ctx.runQuery(api.decks.getDeckWithSlidesByStringId, { deckId: args.deckOption });
      if (deck && deck.slides.length > 0) {
        const slideSummaries = deck.slides.map(s => `- ${s.title}: ${s.content}`).join('\\n');
        deckContext = `The user has selected a pitch deck titled "${deck.title}". You have access to the slide contents below. Base your questions on this specific information.\\n\\n**Pitch Deck Summary:**\\n${slideSummaries}`;
      } else if (deck) {
        deckContext = `The user has selected a pitch deck titled "${deck.title}", but it has no slides. Ask them to describe their business.`;
      }
    }

    const systemPrompt = `You are a top-tier venture capitalist representing ${args.firmTag}. 
    Your persona is sharp, insightful, and skeptical but fair. You are not easily impressed.
    Your goal is to rigorously pressure-test a startup founder's pitch. 
    
    **Pitch Context:**
    ${deckContext}
    
    Here are your instructions:
    1.  **Be Critical:** Ask tough, pointed questions about their business model, market size, traction, and competitive landscape.
    2.  **Stay Focused:** Do not get sidetracked. Your questions should be concise and directly related to evaluating a startup for investment.
    3.  **Maintain the Persona:** Do not break character. You are a busy VC with high standards.
    4.  **Listen Carefully:** Pay close attention to the user's answers and ask relevant follow-up questions based on the provided pitch context.
    5.  **Keep it Conversational:** Despite your critical nature, the interaction should feel like a real, high-stakes meeting, not a robotic interrogation.
    
    The user will start the conversation. Listen to their opening and then begin your questioning.`;

    return {
      model: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
        ],
      },
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'en',
      },
      voice: {
        provider: 'vapi',
        voiceId: 'Elliot',
      },
      firstMessage: `Hi, I'm a partner from ${args.firmTag}. Nice to meet you and thanks for taking the time. Can you please let me know more about your startup?`,
    };
  },
});

export const saveConversation = mutation({
  args: {
    firmTag: v.string(),
    deckId: v.optional(v.string()),
    transcript: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User is not authenticated.");
    }
    const userId = identity.subject;

    await ctx.db.insert("Voiceconversations", {
      userId,
      firmTag: args.firmTag,
      deckId: args.deckId,
      transcript: args.transcript,
    });
  },
}); 