import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "./env.js";
import { prisma } from "./prisma.js";

export interface AuthedRequest extends Request {
  userId?: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: "30d" });
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(env.cookieName, { path: "/" });
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[env.cookieName];
  if (!token) {
    res.status(401).json({ error: "Non autenticato" });
    return;
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
    const exists = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true } });
    if (!exists) {
      res.status(401).json({ error: "Sessione non valida" });
      return;
    }
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Sessione scaduta" });
  }
}

/**
 * CSRF defence for cookie-based auth: for any state-changing method, require the
 * request Origin (or Referer) to belong to an allowed origin. Combined with the
 * SameSite=Lax cookie this blocks cross-site forgery.
 */
export function csrfGuard(allowedOrigins: string[]) {
  const safe = new Set(["GET", "HEAD", "OPTIONS"]);
  return (req: Request, res: Response, next: NextFunction): void => {
    if (safe.has(req.method)) {
      next();
      return;
    }
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const candidate = origin ?? (referer ? safeOrigin(referer) : undefined);
    if (candidate && allowedOrigins.includes(candidate)) {
      next();
      return;
    }
    // Allow same-host requests when origin header is absent (e.g. same-origin served behind proxy).
    if (!origin && !referer) {
      next();
      return;
    }
    res.status(403).json({ error: "Richiesta cross-site non consentita" });
  };
}

function safeOrigin(url: string): string | undefined {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return undefined;
  }
}
