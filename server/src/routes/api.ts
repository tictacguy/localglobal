import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { AuthedRequest, requireAuth } from "../auth.js";
import { experienceDto, privateUser, publicUser } from "../serialize.js";
import { INTEREST_CATEGORIES, ALL_INTEREST_KEYS, interestLabel } from "../interests.js";

export const apiRouter = Router();
apiRouter.use(requireAuth);

/* ----------------------------- catalog ----------------------------- */
apiRouter.get("/interests", (_req, res) => {
  res.json({ categories: INTEREST_CATEGORIES });
});

/* -------------------------- profile / mode -------------------------- */
const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(60).optional(),
  lastName: z.string().trim().min(1).max(60).optional(),
  phone: z.string().trim().max(40).optional(),
  cityResidence: z.string().trim().max(120).optional(),
  origin: z.string().trim().max(120).optional(),
  profession: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(600).optional(),
  avatarUrl: z.string().url().max(500).optional(),
  languages: z.array(z.string().max(40)).max(20).optional(),
  interests: z.array(z.enum(ALL_INTEREST_KEYS as [string, ...string[]])).max(40).optional(),
  birthDate: z.string().datetime().optional(),
});

apiRouter.patch("/profile", async (req: AuthedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dati non validi", issues: parsed.error.flatten() });
    return;
  }
  const d = parsed.data;
  const user = await prisma.user.update({
    where: { id: req.userId! },
    data: { ...d, birthDate: d.birthDate ? new Date(d.birthDate) : undefined },
  });
  res.json({ user: privateUser(user) });
});

apiRouter.post("/mode", async (req: AuthedRequest, res) => {
  const current = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!current) {
    res.status(404).json({ error: "Utente non trovato" });
    return;
  }
  const next = current.activeMode === "LOCAL" ? "TOURIST" : "LOCAL";
  const user = await prisma.user.update({
    where: { id: req.userId! },
    data: { activeMode: next, isLocalEnabled: next === "LOCAL" ? true : current.isLocalEnabled },
  });
  res.json({ user: privateUser(user) });
});

/* ----------------------------- locals ------------------------------- */
// Esplora: locals the current user has not swiped yet.
apiRouter.get("/locals", async (req: AuthedRequest, res) => {
  const swiped = await prisma.swipe.findMany({
    where: { swiperId: req.userId! },
    select: { localId: true },
  });
  const excluded = new Set(swiped.map((s) => s.localId));
  excluded.add(req.userId!);
  const locals = await prisma.user.findMany({
    where: { isLocalEnabled: true, id: { notIn: Array.from(excluded) } },
    orderBy: { rating: "desc" },
    take: 30,
  });
  res.json({
    locals: locals.map((u) => ({
      ...publicUser(u),
      age: u.birthDate ? Math.floor((Date.now() - u.birthDate.getTime()) / 3.15576e10) : null,
    })),
  });
});

apiRouter.get("/locals/:id", async (req: AuthedRequest, res) => {
  const local = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { experiences: { orderBy: { startAt: "asc" }, take: 10 } },
  });
  if (!local || !local.isLocalEnabled) {
    res.status(404).json({ error: "Local non trovato" });
    return;
  }
  res.json({
    local: {
      ...publicUser(local),
      age: local.birthDate ? Math.floor((Date.now() - local.birthDate.getTime()) / 3.15576e10) : null,
      birthDate: local.birthDate,
      phone: local.phone,
      experiences: local.experiences.map((e) => experienceDto(e)),
    },
  });
});

const swipeSchema = z.object({
  localId: z.string().min(1),
  direction: z.enum(["LIKE", "PASS"]),
});

apiRouter.post("/swipe", async (req: AuthedRequest, res) => {
  const parsed = swipeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dati non validi" });
    return;
  }
  const { localId, direction } = parsed.data;
  if (localId === req.userId) {
    res.status(400).json({ error: "Non puoi fare swipe su te stesso" });
    return;
  }
  const local = await prisma.user.findUnique({ where: { id: localId } });
  if (!local || !local.isLocalEnabled) {
    res.status(404).json({ error: "Local non trovato" });
    return;
  }
  await prisma.swipe.upsert({
    where: { swiperId_localId: { swiperId: req.userId!, localId } },
    create: { swiperId: req.userId!, localId, direction },
    update: { direction },
  });
  let conversationId: string | null = null;
  if (direction === "LIKE") {
    // Create a locked conversation (paywall: unlocked after booking).
    const convo = await prisma.conversation.upsert({
      where: { touristId_localId: { touristId: req.userId!, localId } },
      create: { touristId: req.userId!, localId },
      update: {},
    });
    conversationId = convo.id;
    await prisma.user.update({ where: { id: req.userId! }, data: { localsMet: { increment: 1 } } });
  }
  res.json({ matched: direction === "LIKE", conversationId });
});

/* --------------------------- experiences ---------------------------- */
// Home feed + search ("Dove si va?", "Quando?", "Quanti siete?").
apiRouter.get("/experiences", async (req: AuthedRequest, res) => {
  const where: Record<string, unknown> = {};
  const q = typeof req.query.where === "string" ? req.query.where.trim() : "";
  const when = typeof req.query.when === "string" ? req.query.when : "";
  if (q) {
    where.OR = [
      { city: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
      { title: { contains: q, mode: "insensitive" } },
    ];
  }
  if (when) {
    const day = new Date(when);
    if (!isNaN(day.getTime())) {
      const start = new Date(day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(day);
      end.setHours(23, 59, 59, 999);
      where.startAt = { gte: start, lte: end };
    }
  }
  const experiences = await prisma.experience.findMany({
    where,
    include: { host: true },
    orderBy: { startAt: "asc" },
    take: 50,
  });
  res.json({ experiences: experiences.map((e) => experienceDto(e)) });
});

apiRouter.get("/experiences/:id", async (req: AuthedRequest, res) => {
  const e = await prisma.experience.findUnique({ where: { id: req.params.id }, include: { host: true } });
  if (!e) {
    res.status(404).json({ error: "Esperienza non trovata" });
    return;
  }
  res.json({ experience: experienceDto(e) });
});

// Local creates an experience (host mode).
const createExpSchema = z.object({
  title: z.string().trim().min(2).max(120),
  city: z.string().trim().min(1).max(80),
  location: z.string().trim().min(1).max(120),
  startAt: z.string().datetime(),
  priceCents: z.number().int().min(0).max(1_000_000),
  imageUrl: z.string().url().max(500),
  tags: z.array(z.enum(ALL_INTEREST_KEYS as [string, ...string[]])).max(10),
  description: z.string().trim().max(1000).optional(),
  capacity: z.number().int().min(1).max(50).optional(),
});

apiRouter.post("/experiences", async (req: AuthedRequest, res) => {
  const parsed = createExpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dati non validi", issues: parsed.error.flatten() });
    return;
  }
  const d = parsed.data;
  await prisma.user.update({ where: { id: req.userId! }, data: { isLocalEnabled: true } });
  const exp = await prisma.experience.create({
    data: {
      hostId: req.userId!,
      title: d.title,
      city: d.city,
      location: d.location,
      startAt: new Date(d.startAt),
      priceCents: d.priceCents,
      imageUrl: d.imageUrl,
      tags: d.tags,
      description: d.description ?? "",
      capacity: d.capacity ?? 6,
    },
    include: { host: true },
  });
  res.status(201).json({ experience: experienceDto(exp) });
});

/* ----------------------------- bookings ----------------------------- */
// "Aggiungi appuntamento" — booking unlocks chat (paywall).
const bookingSchema = z.object({
  experienceId: z.string().min(1),
  startAt: z.string().datetime(),
  people: z.number().int().min(1).max(50),
  note: z.string().trim().max(500).optional(),
});

apiRouter.post("/bookings", async (req: AuthedRequest, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dati non validi", issues: parsed.error.flatten() });
    return;
  }
  const { experienceId, startAt, people, note } = parsed.data;
  const exp = await prisma.experience.findUnique({ where: { id: experienceId } });
  if (!exp) {
    res.status(404).json({ error: "Esperienza non trovata" });
    return;
  }
  if (exp.hostId === req.userId) {
    res.status(400).json({ error: "Non puoi prenotare una tua esperienza" });
    return;
  }
  // NOTE: real payment capture (Stripe) is intentionally NOT performed here.
  // The paid flag is set to false until a payment integration is configured.
  const booking = await prisma.booking.create({
    data: {
      experienceId,
      touristId: req.userId!,
      startAt: new Date(startAt),
      people,
      note: note ?? "",
      status: "CONFIRMED",
      paid: false,
    },
  });
  // Unlock (or create) the conversation with the host — the "Chat (locked)" paywall.
  await prisma.conversation.upsert({
    where: { touristId_localId: { touristId: req.userId!, localId: exp.hostId } },
    create: { touristId: req.userId!, localId: exp.hostId, unlocked: true },
    update: { unlocked: true },
  });
  res.status(201).json({ booking });
});

apiRouter.get("/bookings", async (req: AuthedRequest, res) => {
  const bookings = await prisma.booking.findMany({
    where: { touristId: req.userId! },
    include: { experience: { include: { host: true } } },
    orderBy: { startAt: "asc" },
  });
  res.json({
    bookings: bookings.map((b) => ({
      id: b.id,
      startAt: b.startAt,
      people: b.people,
      note: b.note,
      status: b.status,
      paid: b.paid,
      experience: experienceDto(b.experience),
    })),
  });
});

/* ------------------------- conversations/chat ----------------------- */
apiRouter.get("/conversations", async (req: AuthedRequest, res) => {
  const convos = await prisma.conversation.findMany({
    where: { OR: [{ touristId: req.userId! }, { localId: req.userId! }] },
    include: {
      tourist: true,
      local: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
  res.json({
    conversations: convos.map((c) => {
      const other = c.touristId === req.userId ? c.local : c.tourist;
      const last = c.messages[0];
      return {
        id: c.id,
        unlocked: c.unlocked,
        other: publicUser(other),
        lastMessage: last ? { body: last.body, createdAt: last.createdAt, mine: last.senderId === req.userId } : null,
        updatedAt: c.updatedAt,
      };
    }),
  });
});

apiRouter.get("/conversations/:id", async (req: AuthedRequest, res) => {
  const convo = await prisma.conversation.findUnique({
    where: { id: req.params.id },
    include: { tourist: true, local: true, messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!convo || (convo.touristId !== req.userId && convo.localId !== req.userId)) {
    res.status(404).json({ error: "Conversazione non trovata" });
    return;
  }
  const other = convo.touristId === req.userId ? convo.local : convo.tourist;
  res.json({
    conversation: {
      id: convo.id,
      unlocked: convo.unlocked,
      other: publicUser(other),
      messages: convo.unlocked
        ? convo.messages.map((m) => ({
            id: m.id,
            body: m.body,
            mine: m.senderId === req.userId,
            createdAt: m.createdAt,
          }))
        : [],
    },
  });
});

const messageSchema = z.object({ body: z.string().trim().min(1).max(2000) });

apiRouter.post("/conversations/:id/messages", async (req: AuthedRequest, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Messaggio non valido" });
    return;
  }
  const convo = await prisma.conversation.findUnique({ where: { id: req.params.id } });
  if (!convo || (convo.touristId !== req.userId && convo.localId !== req.userId)) {
    res.status(404).json({ error: "Conversazione non trovata" });
    return;
  }
  if (!convo.unlocked) {
    res.status(402).json({ error: "Prenota un'esperienza per sbloccare la chat" });
    return;
  }
  const message = await prisma.message.create({
    data: { conversationId: convo.id, senderId: req.userId!, body: parsed.data.body },
  });
  await prisma.conversation.update({ where: { id: convo.id }, data: { updatedAt: new Date() } });
  res.status(201).json({ message: { id: message.id, body: message.body, mine: true, createdAt: message.createdAt } });
});

/* ----------------------------- passport ----------------------------- */
apiRouter.get("/passport", async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) {
    res.status(404).json({ error: "Utente non trovato" });
    return;
  }
  const stamps = await prisma.passportStamp.findMany({
    where: { userId: req.userId! },
    orderBy: { visitedAt: "desc" },
  });
  const certifiedMet = await prisma.swipe.count({
    where: { swiperId: req.userId!, direction: "LIKE", local: { verified: true } },
  });
  const missions = [
    { key: "meet3", label: "Incontra 3 Locals", progress: Math.min(user.localsMet, 3), target: 3 },
    { key: "certified", label: "Incontra un Local certificato", progress: Math.min(certifiedMet, 1), target: 1 },
    { key: "europe20", label: "Visita 20 Paesi in Europa", progress: Math.min(stamps.length, 20), target: 20 },
  ];
  const levelTitle = user.localsMet < 3 ? "Principiante" : user.localsMet < 10 ? "Esploratore" : "Avventuriero";
  res.json({
    passport: {
      level: user.passportLevel,
      levelTitle,
      localsMet: user.localsMet,
      countriesVisited: Math.max(user.countriesVisited, stamps.length),
      missions,
      stamps: stamps.map((s) => ({ country: s.country, city: s.city, imageUrl: s.imageUrl, visitedAt: s.visitedAt })),
    },
  });
});

export { interestLabel };
