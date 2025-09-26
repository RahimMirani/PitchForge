import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { authClient } from "@/lib/auth-client"

// Initialize Convex client with your deployment URL
const convex = new ConvexReactClient("https://fastidious-mosquito-435.convex.cloud")

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <App />
      </ConvexBetterAuthProvider>
    </ConvexProvider>
  </StrictMode>,
)
