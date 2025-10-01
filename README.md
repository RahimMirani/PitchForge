# PitchForge
Made for Convex Modern Stack Hackathon ()

PitchForge turns a founder’s raw intake — text or voice — into a VC-ready pitch deck, live insights, and a mock investor practice room. Built for the Convex Modern Stack Hackathon, it showcases how the Convex ecosystem and sponsor tools combine to ship a production-grade, AI-assisted fundraising workflow in days.

## Why PitchForge

- Compress pitch creation from days to minutes by pairing AI drafting with collaborative editing.
- Keep decks grounded in sourced facts through automated research and citations.
- Rehearse with a voice-driven mock VC that asks the tough questions investors really care about.
- Share polished decks instantly with teammates or advisors via PDF export and email delivery.

## Product Tour

### 1. Landing & Authentication
- Better-Auth handles secure email/password login with Convex session sync.
- Founders see the high-level value prop, feature highlights, and sign-in/sign-up CTAs.

### 2. Dashboard (`frontend/src/pages/Dashboard.tsx`)
- Personalized welcome surface with quick actions to generate decks or launch practice.
- Live list of investor decks sourced from Convex queries, including timestamps and open actions.
- Recent voice sessions show transcripts saved from the mock VC practice.

### 3. Deck Creation Studio (`frontend/src/pages/DeckCreation.tsx`)
- Slide rail (`SlideNavigation`) keeps titles, sync status, and quick compose actions handy.
- `DeckCanvas` renders slides with edit/view modes, AI generated content, and inline editing.
- `ChatSidebar` embeds an AI copilot for drafting slides, refining sections, and creating new content via OpenAI actions.
- Onboarding modal captures brief (title, startup name, overview) to seed automatic slide generation.
- Generate, edit, and reorder slides without leaving the page; sessions persist via Convex mutations and live queries.

### 4. Voice Practice Studio (`frontend/src/pages/VoicePractice.tsx`)
- Pick an investor persona (a16z, YC, Sequoia, Lightspeed) and bind it to an existing deck or freestyle mode.
- `VapiSession` spins up an in-browser voice call with Vapi, Deepgram transcription, and AI follow-ups.
- Full transcript displays in realtime; after the session, transcripts and metadata persist to Convex.

### 5. Export & Delivery
- Decks export to polished PDF via Playwright/Puppeteer pipeline.
- Resend integration (planned) will email decks and session notes directly to stakeholders.

## Architecture

- **Frontend**: React + TypeScript + Vite, Tailwind CSS, shadcn-inspired components for polished UI.
- **State & Data**: Convex serverless database, live queries, mutations, and actions for AI orchestration.
- **AI Orchestration**: Convex actions wrap OpenAI GPT-4/GPT-4o-mini for chat, slide generation, and investor personas.
- **Auth**: Better-Auth with Convex adapter and cross-domain plugin, delivering secure sessions out of the box.
- **Voice**: Vapi provides browser-native voice interactions; Deepgram handles speech-to-text.
- **Research**: Firecrawl integration stub ready for live market/competitor data ingestion.
- **Export & Email**: Playwright/Puppeteer for HTML→PDF; Resend for emailing decks and recaps.


## Sponsors Used

- **Convex**: Primary data backbone, auth enforcement, real-time deck updates, and AI action orchestration.
- **Firecrawl**: Planned search & scraping service to pull competitor pricing, testimonials, and market stats for slide citations.
- **Vapi**: Browser-based mock VC sessions with programmable persona prompts and voice UX.
- **Better-Auth**: Drop-in authentication flows with Convex integration, powering quick email/password onboarding.
- **Resend:** Upcoming email delivery for sending PDF decks and voice session summaries to founders/coaches. Also used for email communications and email confirmations of accounts.
- **OpenAI**: Generates slide outlines, chat guidance, and persona-driven questioning via GPT-4 & GPT-4o-mini models.
- **Autumn**: Optional knowledge base connector for future pitch review analytics (reserved for post-hackathon).

## Getting Started

### Prerequisites
- Node.js 18+
- Convex account & project (`convex` CLI configured)
- API keys: `OPENAI_API_KEY`, `BETTER_AUTH_SECRET`, `SITE_URL`, `VITE_CONVEX_SITE_URL`, `VITE_VAPI_PUBLIC_KEY`, optional Firecrawl/Resend credentials.

### Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Local Development

```bash
# Terminal 1: Convex dev server
cd backend
npx convex dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Ensure `.env` files contain required secrets for backend and frontend (Vite) environments.

### Build

```bash
cd frontend
npm run build
```


## Team & Acknowledgements

- Built during the Convex Modern Stack Hackathon to showcase full-stack AI workflows.
- Huge thanks to sponsors Convex, Firecrawl, Vapi, Better-Auth, Autumn, Resend, and OpenAI for tooling access and inspiration.