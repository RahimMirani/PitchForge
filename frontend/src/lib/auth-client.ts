import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [convexClient(), crossDomainClient()],
});

export const signUpUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
  });

  if (error) {
    throw new Error(error.message ?? "Unable to sign up. Please try again.");
  }

  return data;
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message ?? "Invalid credentials. Please try again.");
  }

  return data;
};

export const signOutUser = () => authClient.signOut();
