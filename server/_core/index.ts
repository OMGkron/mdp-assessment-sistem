import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";

import { appRouter } from "../routers";
import { createContext } from "./context";

import { serveStatic, setupVite } from "./vite";

export async function createApp() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return { app, server };
}

if (process.env.NODE_ENV !== "production") {
  async function startServer() {
    const { server } = await createApp();

    const port = Number(process.env.PORT || 3000);

    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }

  startServer().catch(console.error);
}