import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./env.js";
import { csrfGuard } from "./auth.js";
import { authRouter } from "./routes/auth.js";
import { apiRouter } from "./routes/api.js";

export function createApp() {
  const app = express();

  // Behind Caddy/NGINX — trust the first proxy for correct client IPs (rate limiting).
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Same-origin / server-to-server requests have no Origin header.
        if (!origin || env.allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("Origin non consentita"));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(csrfGuard(env.allowedOrigins));

  app.get("/api/health", (_req, res) => res.json({ ok: true, service: "localglobal-api" }));

  // Strict limiter on auth endpoints to throttle credential stuffing.
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Troppe richieste, riprova più tardi" },
  });
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/auth", authLimiter, authRouter);
  app.use("/api", apiLimiter, apiRouter);

  // JSON 404 for unknown API routes.
  app.use("/api", (_req, res) => res.status(404).json({ error: "Endpoint non trovato" }));

  // Centralized error handler.
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : "Errore interno";
    if (message === "Origin non consentita") {
      res.status(403).json({ error: message });
      return;
    }
    console.error("[error]", err);
    res.status(500).json({ error: "Errore interno del server" });
  });

  return app;
}
