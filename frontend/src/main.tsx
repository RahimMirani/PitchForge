import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { authClient } from "./lib/auth-client"

const siteUrl = import.meta.env.VITE_CONVEX_SITE_URL
if (!siteUrl) {
  throw new Error('VITE_CONVEX_SITE_URL must be set to your Convex deployment URL (e.g. https://your-app.convex.site)')
}

const convexUrl = siteUrl.replace('.convex.site', '.convex.cloud')
const convex = new ConvexReactClient(convexUrl)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <App />
      </ConvexBetterAuthProvider>
    </ConvexProvider>
  </StrictMode>,
)

