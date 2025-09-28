import { action } from "./_generated/server";
import { v } from "convex/values";



export const getVapiAssistantConfig = action({
    args: {
      firmTag: v.string(),
      deckOption: v.string(),
    },
    handler: async (ctx, args) => {
      // In the future, you could fetch deck details here based on args.deckOption
      // const deck = await ctx.runQuery(api.decks.getDeck, { deckId: args.deckOption });
  
      const systemPrompt = `You are a venture capitalist from ${args.firmTag}. 
      Your goal is to pressure test the user's pitch. Be critical, ask tough but fair questions, and simulate a real fundraising conversation.
      Keep your responses concise and to the point.`;
  
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
        firstMessage: `Hi, I'm simulating a partner from ${args.firmTag}. Thanks for taking the time. Please, begin your pitch whenever you're ready.`,
      };
    },
  }); 