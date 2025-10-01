import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

const siteUrlEnv = process.env.SITE_URL ?? "*";
const allowedOrigins = siteUrlEnv.split(",").map((value) => value.trim()).filter(Boolean);

// CORS handling is required for client side frameworks
authComponent.registerRoutes(http, createAuth, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : ["*"],
    credentials: true,
  },
});

export default http;