import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [convexClient(), crossDomainClient()],
});

export const signUpUser = (name: string, email: string, password: string) =>
  authClient.signUp({ name, email, password });

export const signInUser = (email: string, password: string) =>
  authClient.signIn({ email, password });

export const signOutUser = () => authClient.signOut();