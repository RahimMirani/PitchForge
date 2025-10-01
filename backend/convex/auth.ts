import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";

const siteUrlEnv = process.env.SITE_URL ?? "";
const allowedOrigins = siteUrlEnv.split(",").map((origin) => origin.trim()).filter(Boolean);
if (allowedOrigins.length === 0) {
  throw new Error("SITE_URL env var is required (use comma to set multiple origins)");
}
const [primarySiteUrl, ...otherOrigins] = allowedOrigins;
const betterAuthSecret = process.env.BETTER_AUTH_SECRET!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    secret: betterAuthSecret,
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    trustedOrigins: [primarySiteUrl, ...otherOrigins],
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The cross domain plugin is required for client side frameworks
      crossDomain({ siteUrl: primarySiteUrl }),
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await authComponent.getAuthUser(ctx);
    if (!user && !identity) return null;

    const profile = user?.profile ?? {};
    const displayName =
      profile.fullName ||
      profile.name ||
      identity?.name ||
      user?.email ||
      identity?.email ||
      'Founder';

    return {
      id: user?.userId ?? identity?.subject ?? 'unknown',
      email: user?.email ?? identity?.email ?? '',
      name: displayName,
    };
  },
});