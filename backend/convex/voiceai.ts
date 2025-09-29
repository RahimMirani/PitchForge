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
  
      const systemPrompt = `You are a top-tier venture capitalist representing ${args.firmTag}. 
    Your persona is sharp, insightful, and skeptical but fair. You are not easily impressed.
    Your goal is to rigorously pressure-test a startup founder's pitch. 
    
    Here are your instructions:
    1.  **Be Critical:** Ask tough, pointed questions about their business model, market size, traction, and competitive landscape.
    2.  **Stay Focused:** Do not get sidetracked. Your questions should be concise and directly related to evaluating a startup for investment.
    3.  **Maintain the Persona:** Do not break character. You are a busy VC with high standards.
    4.  **Listen Carefully:** Pay close attention to the user's answers and ask relevant follow-up questions.
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