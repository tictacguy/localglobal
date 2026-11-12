import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

const isProd = process.env.NODE_ENV === "production";

export const env = {
  isProd,
  port: parseInt(process.env.PORT ?? "8080", 10),
  databaseUrl: required("DATABASE_URL", isProd ? undefined : "postgresql://localglobal:localglobal@localhost:5432/localglobal"),
  // In production JWT_SECRET must be provided; dev falls back to an ephemeral value.
  jwtSecret: required("JWT_SECRET", isProd ? undefined : "dev-only-insecure-secret-change-me"),
  // Comma separated list of allowed browser origins (for CORS + CSRF origin checks).
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173,http://localhost:4173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  cookieName: "lg_session",
  // Cookie secure flag: on in prod (HTTPS), off in local dev.
  cookieSecure: isProd,
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "",
};
