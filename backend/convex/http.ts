import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

const allowedOrigin = process.env.SITE_URL;

if (!allowedOrigin) {
  throw new Error("SITE_URL env variable is required for Better Auth CORS setup");
}

// CORS handling is required for client side frameworks
authComponent.registerRoutes(http, createAuth, {
  cors: {
    origin: [allowedOrigin],
    credentials: true,
  },
});

export default http;