import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";

// Declare process for TypeScript
declare const process: { env: { [key: string]: string | undefined } };

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
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

    // 4. Enhanced system prompt for slide creation and chat
    const systemPrompt = {
      role: "system" as const,
      content: `You are an expert pitch deck consultant/creator specialized in creating pitch decks for startups. You are also a great pitch deck coach helping entrepreneurs create compelling presentations/pitch decks.

You can help with:
- Creating slide content (problem, solution, market, etc.)
- Improving existing content
- Structuring the pitch flow
- Making content more engaging
- Researching the market and the competition

IMPORTANT: You can create slides automatically! When the user asks you to create a slide, respond with a JSON object followed by your explanation.

For slide creation requests, start your response with:
SLIDE_CREATE: {"title": "Slide Title Here", "content": "Detailed slide content here"}

You have access to the following functions to create slides and other actions related to slides:
- api.slides.createSlide
- api.slides.deleteSlide
- api.slides.reorderSlides
- api.slides.updateSlide

Then continue with your normal conversational response explaining what you created.

Examples:
- User: "Create a title slide" → Start with SLIDE_CREATE: {"title": "...", "content": "..."}
- User: "Help me with a problem slide" → Start with SLIDE_CREATE: {"title": "...", "content": "..."}
- User: "What should I include in my solution?" → Just give advice (no SLIDE_CREATE)

Be concise, actionable, and focus on what investors want to see.`,
    };

    try {
      // 5. Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [systemPrompt, ...openaiMessages],
        max_tokens: 800,
        temperature: 0.5,
      });

      const aiResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

      // 6. Check if AI wants to create a slide using existing slide functions
      let slideCreated: { id: string; title: string; content: string } | null = null;
      let cleanResponse = aiResponse;

      if (aiResponse.includes("SLIDE_CREATE:")) {
        try {
          // Extract the JSON from the response
          const slideMatch = aiResponse.match(/SLIDE_CREATE:\s*({[^}]*})/);
          if (slideMatch) {
            const slideData = JSON.parse(slideMatch[1]);
            
            // Use existing slide creation function (proper architecture!)
            const slideId = await ctx.runMutation(api.slides.createSlide, {
              deckId: args.deckId,
              title: slideData.title,
              content: slideData.content,
            });
            
            slideCreated = {
              id: slideId,
              title: slideData.title,
              content: slideData.content,
            };
            
            // Remove the SLIDE_CREATE part from the response
            cleanResponse = aiResponse.replace(/SLIDE_CREATE:\s*{[^}]*}\s*/, "").trim();
            
            // Add slide creation confirmation to response
            cleanResponse = `✅ I've created a new slide: "${slideData.title}"\n\n${cleanResponse}`;
          }
        } catch (error) {
          console.error("Failed to parse or create slide:", error);
          // Continue with normal response if slide creation fails
        }
      }

      // 7. Save AI response to database
      await ctx.runMutation(api.messages.sendMessage, {
        deckId: args.deckId,
        role: "assistant",
        content: cleanResponse,
      });

      return {
        success: true,
        response: cleanResponse,
        slideCreated: slideCreated,
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
        slideCreated: null,
      };
    }
  },
});

export const generateDeckFromBrief = action({
  args: {
    deckId: v.id("decks"),
    title: v.string(),
    startupName: v.string(),
    overview: v.string(),
  },
  handler: async (ctx, args) => {
    const planningPrompt = `You are an expert pitch deck strategist.

Startup name: ${args.startupName}
Pitch deck title: ${args.title}
Overview: ${args.overview}

Design a compelling investor deck outline tailored to this startup.
- Generate between 8 and 10 slides depending on what best communicates the story.
- Prioritise clarity, momentum, and investor expectations (Problem, Solution, Market, Product, Traction, Business Model, Competition, Team, Roadmap, Ask, etc.).
- For each slide, create a strong title and punchy narrative copy with crisp bullet-style sentences (separated by newline characters).
- Narrative should avoid markdown bullets, just start each sentence with a dash (e.g. "- Growing ARR 40% QoQ").

Respond strictly as minified JSON with this schema:
{"slides":[{"title":"string","content":"string"},...]}
The content string should keep newline-separated dash bullets.
Do not include any commentary outside the JSON.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You transform startup briefs into succinct, investor-ready slide outlines.",
          },
          {
            role: "user",
            content: planningPrompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 900,
      });

      const rawContent = response.choices[0]?.message?.content ?? "";
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse slide plan from model response");
      }

      let plan: { slides?: Array<{ title: string; content: string }> };
      try {
        plan = JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.error("JSON parse error from generateDeckFromBrief", rawContent, error);
        throw new Error("Invalid slide plan format");
      }

      const slides = plan.slides?.filter(
        (slide) =>
          slide?.title &&
          slide?.content &&
          typeof slide.title === "string" &&
          typeof slide.content === "string"
      );

      if (!slides || slides.length === 0) {
        throw new Error("The generated plan did not include any slides");
      }

      const createdSlides: string[] = [];
      for (const slide of slides) {
        const slideId = await ctx.runMutation(api.slides.createSlide, {
          deckId: args.deckId,
          title: slide.title.trim().slice(0, 120),
          content: slide.content.trim(),
        });
        createdSlides.push(slideId);
      }

      return {
        success: true,
        slideCount: createdSlides.length,
        slideIds: createdSlides,
      };
    } catch (error) {
      console.error("generateDeckFromBrief failed", error);
      throw error;
    }
  },
}); 