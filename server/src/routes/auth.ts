import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import {
  AuthedRequest,
  clearSessionCookie,
  hashPassword,
  requireAuth,
  setSessionCookie,
  signToken,
  verifyPassword,
} from "../auth.js";
import { privateUser } from "../serialize.js";
import { ALL_INTEREST_KEYS } from "../interests.js";

export const authRouter = Router();

const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8).max(200),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dati non validi", issues: parsed.error.flatten() });
    return;
  }
  const { firstName, lastName, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "Esiste già un account con questa email" });
    return;
  }
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash: await hashPassword(password),
      onboardingStep: 1,
    },
  });
  setSessionCookie(res, signToken(user.id));
  res.status(201).json({ user: privateUser(user) });
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dati non validi" });
    return;
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  // Constant-ish response to avoid user enumeration.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: "Email o password non corretti" });
    return;
  }
  setSessionCookie(res, signToken(user.id));
  res.json({ user: privateUser(user) });
});

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) {
    res.status(404).json({ error: "Utente non trovato" });
    return;
  }
  res.json({ user: privateUser(user) });
});

// Onboarding "Completa il tuo profilo" — multi step persisted.
const onboardingSchema = z.object({
  phone: z.string().trim().max(40).optional(),
  gender: z.string().trim().max(40).optional(),
  birthDate: z.string().datetime().optional().or(z.string().length(0).optional()),
  origin: z.string().trim().max(120).optional(),
  cityResidence: z.string().trim().max(120).optional(),
  languages: z.array(z.string().max(40)).max(20).optional(),
  profession: z.string().trim().max(120).optional(),
  interests: z.array(z.enum(ALL_INTEREST_KEYS as [string, ...string[]])).max(40).optional(),
  bio: z.string().trim().max(600).optional(),
  avatarUrl: z.string().url().max(500).optional().or(z.string().length(0).optional()),
  isLocalEnabled: z.boolean().optional(),
  step: z.number().int().min(0).max(4).optional(),
  documentUploaded: z.boolean().optional(),
});

authRouter.patch("/onboarding", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = onboardingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dati non validi", issues: parsed.error.flatten() });
    return;
  }
  const d = parsed.data;
  const user = await prisma.user.update({
    where: { id: req.userId! },
    data: {
      phone: d.phone,
      gender: d.gender,
      birthDate: d.birthDate ? new Date(d.birthDate) : undefined,
      origin: d.origin,
      cityResidence: d.cityResidence,
      languages: d.languages,
      profession: d.profession,
      interests: d.interests,
      bio: d.bio,
      avatarUrl: d.avatarUrl ? d.avatarUrl : undefined,
      isLocalEnabled: d.isLocalEnabled,
      onboardingStep: d.step,
      documentStatus: d.documentUploaded ? "PENDING" : undefined,
    },
  });
  res.json({ user: privateUser(user) });
});
