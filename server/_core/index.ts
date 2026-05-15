import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

export async function createApp() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // Dev login route - ONLY FOR DEVELOPMENT
  app.get("/api/auth/dev-login", async (req: express.Request, res: express.Response) => {
    const { COOKIE_NAME, ONE_YEAR_MS } = await import("@shared/const");
    const { sdk } = await import("./sdk");
    const { getSessionCookieOptions } = await import("./cookies");
    const { upsertUser } = await import("../db");

    const devUser = {
      openId: "dev-admin-id",
      name: "Developer Admin",
      email: "dev@example.com",
      loginMethod: "mock",
      lastSignedIn: new Date(),
      role: "admin" as const,
    };

    await upsertUser(devUser);

    const sessionToken = await sdk.createSessionToken(devUser.openId, {
      name: devUser.name,
      expiresInMs: ONE_YEAR_MS,
    });

    const cookieOptions = getSessionCookieOptions(req as any);
    res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
    res.redirect("/");
  });

  // Custom Local Login Flow
  app.post("/api/auth/local-login", async (req: express.Request, res: express.Response) => {
    try {
      const { name, role } = req.body;
      if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
      }
      
      const { COOKIE_NAME, ONE_YEAR_MS } = await import("@shared/const");
      const { sdk } = await import("./sdk");
      const { getSessionCookieOptions } = await import("./cookies");
      const { upsertUser } = await import("../db");

      // Generate a deterministic stable ID for this user Name so they can return
      const openId = `local_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      
      const userRole: "admin" | "user" = role === "admin" ? "admin" : "user";
      
      const localUser = {
        openId,
        name: name,
        email: `${openId}@example.com`,
        loginMethod: "local",
        lastSignedIn: new Date(),
        role: userRole,
      };

      await upsertUser(localUser);

      const sessionToken = await sdk.createSessionToken(localUser.openId, {
        name: localUser.name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req as any);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.status(200).json({ success: true, user: localUser });
    } catch (e: any) {
      console.error("Local login failed", e);
      res.status(500).json({ error: "Local login failed" });
    }
  });

  // tRPC API
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

async function startServer() {
  const { server } = await createApp();
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
