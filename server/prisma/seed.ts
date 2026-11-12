import { PrismaClient, Mode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const IMG = {
  bacaro: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=70",
  yoga: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=70",
  streetfood: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=70",
  gondola: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=70",
  museum: "https://images.unsplash.com/photo-1566127992631-137a642a90f4?auto=format&fit=crop&w=900&q=70",
  rooftop: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=70",
};

const PORTRAIT = (g: "men" | "women", n: number) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

const STAMP = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`;

async function main() {
  // Clean slate (dev/demo seed).
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.passportStamp.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.user.deleteMany();

  const demoPassword = process.env.SEED_DEMO_PASSWORD || "Password123!";
  const hash = await bcrypt.hash(demoPassword, 12);

  // Demo tourist (the "Profilo" screen persona).
  const alberto = await prisma.user.create({
    data: {
      email: "alberto@localglobal.it",
      passwordHash: hash,
      firstName: "Alberto",
      lastName: "Di Modica",
      phone: "+39 388 112 2334",
      gender: "Uomo",
      birthDate: new Date("1996-05-14"),
      cityResidence: "Villorba, Treviso (TV)",
      origin: "Italia",
      languages: ["Italiano", "Inglese"],
      profession: "Product Designer",
      bio: "Sempre in cerca di nuove esperienze autentiche.",
      avatarUrl: PORTRAIT("men", 32),
      interests: ["aperitivo", "calcio", "musei", "tennis"],
      activeMode: Mode.TOURIST,
      verified: true,
      documentStatus: "APPROVED",
      onboardingStep: 4,
      rating: 0,
      reviewsCount: 0,
      countriesVisited: 0,
      localsMet: 0,
      passportLevel: 1,
    },
  });

  // Locals
  const nicola = await prisma.user.create({
    data: {
      email: "nicola@localglobal.it",
      passwordHash: hash,
      firstName: "Nicola",
      lastName: "Bianchi",
      phone: "+39 340 555 1212",
      gender: "Uomo",
      birthDate: new Date("1989-03-02"),
      cityResidence: "Venezia (VE)",
      origin: "Italia",
      languages: ["Italiano", "Inglese", "Spagnolo"],
      profession: "Guida enogastronomica",
      bio: "Ti porto nei bacari più autentici di Venezia, lontano dalla folla.",
      avatarUrl: PORTRAIT("men", 45),
      interests: ["aperitivo", "calcio", "streetfood", "bacaro"],
      isLocalEnabled: true,
      activeMode: Mode.LOCAL,
      verified: true,
      rating: 4.6,
      reviewsCount: 4234,
    },
  });

  const marco = await prisma.user.create({
    data: {
      email: "marco@localglobal.it",
      passwordHash: hash,
      firstName: "Marco",
      lastName: "Ferrer",
      gender: "Uomo",
      birthDate: new Date("2000-07-19"),
      cityResidence: "Venezia (VE)",
      origin: "Malaga, Spagna",
      languages: ["Spagnolo", "Italiano", "Inglese"],
      profession: "Istruttore sportivo",
      bio: "Tennis, aperitivi e partite allo stadio. Vivi la città come un vero local!",
      avatarUrl: PORTRAIT("men", 12),
      interests: ["tennis", "outdoor", "aperitivo", "stadio", "calcio"],
      isLocalEnabled: true,
      activeMode: Mode.LOCAL,
      verified: true,
      rating: 4.4,
      reviewsCount: 4234,
    },
  });

  const cristian = await prisma.user.create({
    data: {
      email: "cristian@localglobal.it",
      passwordHash: hash,
      firstName: "Cristian",
      lastName: "Ghedin",
      phone: "+39 388 787 3648",
      gender: "Uomo",
      birthDate: new Date("1999-06-18"),
      cityResidence: "Villorba, TV",
      origin: "Malaga, ES",
      languages: ["Italiano", "Inglese"],
      profession: "Studente",
      bio: "Appassionato di sport e buona cucina.",
      avatarUrl: PORTRAIT("men", 65),
      interests: ["stadio", "parco", "tennis", "rugby"],
      isLocalEnabled: true,
      activeMode: Mode.LOCAL,
      verified: false,
      rating: 4.7,
      reviewsCount: 4234,
    },
  });

  const giulia = await prisma.user.create({
    data: {
      email: "giulia@localglobal.it",
      passwordHash: hash,
      firstName: "Giulia",
      lastName: "Rossi",
      gender: "Donna",
      birthDate: new Date("1994-11-08"),
      cityResidence: "Milano (MI)",
      origin: "Italia",
      languages: ["Italiano", "Inglese", "Francese"],
      profession: "Yoga teacher",
      bio: "Yoga all'aperto e benessere nei parchi della città.",
      avatarUrl: PORTRAIT("women", 44),
      interests: ["yoga", "meditazione", "outdoor", "spa"],
      isLocalEnabled: true,
      activeMode: Mode.LOCAL,
      verified: true,
      rating: 4.9,
      reviewsCount: 1820,
    },
  });

  // Experiences (Home feed)
  const bacaro = await prisma.experience.create({
    data: {
      hostId: nicola.id,
      title: "Bacaro Tour a Venezia",
      city: "Venezia",
      location: "Venezia Centro Storico",
      startAt: new Date("2025-04-12T17:00:00"),
      priceCents: 2500,
      imageUrl: IMG.bacaro,
      tags: ["aperitivo", "calcio", "streetfood", "bacaro"],
      description:
        "Un giro tra i bacari storici di Venezia con cicchetti, spritz e racconti sulla città che non trovi nelle guide.",
      capacity: 6,
    },
  });

  await prisma.experience.create({
    data: {
      hostId: giulia.id,
      title: "Yoga Class all'aperto",
      city: "Milano",
      location: "Parco Sempione",
      startAt: new Date("2025-04-20T08:30:00"),
      priceCents: 1500,
      imageUrl: IMG.yoga,
      tags: ["yoga", "meditazione", "outdoor"],
      description: "Sessione di yoga al parco al mattino presto, adatta a tutti i livelli.",
      capacity: 12,
    },
  });

  await prisma.experience.create({
    data: {
      hostId: marco.id,
      title: "Partita allo stadio + Aperitivo",
      city: "Venezia",
      location: "Stadio Penzo",
      startAt: new Date("2025-05-03T18:00:00"),
      priceCents: 4000,
      imageUrl: IMG.rooftop,
      tags: ["stadio", "calcio", "aperitivo"],
      description: "Viviamo insieme la partita e chiudiamo con un aperitivo tra tifosi.",
      capacity: 4,
    },
  });

  await prisma.experience.create({
    data: {
      hostId: nicola.id,
      title: "Street Food Tour autentico",
      city: "Venezia",
      location: "Rialto",
      startAt: new Date("2025-04-18T12:30:00"),
      priceCents: 3000,
      imageUrl: IMG.streetfood,
      tags: ["streetfood", "mercato", "cibo"],
      description: "Assaggi tipici al mercato di Rialto con un local che li conosce tutti.",
      capacity: 8,
    },
  });

  // Extra locals so the match deck feels alive (sample content, not user history).
  const extraLocals = [
    { fn: "Luca", ln: "Moretti", g: "men" as const, n: 22, origin: "Torino, Italia", city: "Torino (TO)", prof: "Fotografo", rating: 4.5, rev: 210, interests: ["urbano", "paesaggio", "tramonto", "musei"], exp: { title: "Photo Walk al tramonto", city: "Torino", loc: "Monte dei Cappuccini", tags: ["urbano", "tramonto", "paesaggio"], price: 3500, img: IMG.museum } },
    { fn: "Sofia", ln: "Esposito", g: "women" as const, n: 30, origin: "Napoli, Italia", city: "Napoli (NA)", prof: "Chef", rating: 4.9, rev: 980, interests: ["streetfood", "cucina", "mercato", "vino"], exp: { title: "Street Food Tour a Spaccanapoli", city: "Napoli", loc: "Spaccanapoli", tags: ["streetfood", "mercato"], price: 2800, img: IMG.streetfood } },
    { fn: "Youssef", ln: "Amrani", g: "men" as const, n: 27, origin: "Marrakech, Marocco", city: "Milano (MI)", prof: "DJ", rating: 4.3, rev: 134, interests: ["clubbing", "rooftop", "elettronica", "aperitivo"], exp: { title: "Milano by Night: rooftop & club", city: "Milano", loc: "Navigli", tags: ["rooftop", "clubbing", "aperitivo"], price: 4500, img: IMG.rooftop } },
    { fn: "Elena", ln: "Conti", g: "women" as const, n: 25, origin: "Firenze, Italia", city: "Firenze (FI)", prof: "Storica dell'arte", rating: 4.8, rev: 540, interests: ["musei", "monumenti", "unesco", "cultura"], exp: { title: "Firenze segreta: arte e storia", city: "Firenze", loc: "Oltrarno", tags: ["musei", "monumenti", "unesco"], price: 3200, img: IMG.gondola } },
  ];
  let pcount = 20;
  for (const L of extraLocals) {
    const u = await prisma.user.create({
      data: {
        email: `${L.fn.toLowerCase()}@localglobal.it`,
        passwordHash: hash,
        firstName: L.fn,
        lastName: L.ln,
        gender: L.g === "men" ? "Uomo" : "Donna",
        birthDate: new Date(Date.now() - L.n * 3.15576e10),
        cityResidence: L.city,
        origin: L.origin,
        languages: ["Italiano", "Inglese"],
        profession: L.prof,
        avatarUrl: PORTRAIT(L.g, pcount++),
        interests: L.interests,
        isLocalEnabled: true,
        activeMode: Mode.LOCAL,
        verified: Math.random() > 0.5,
        rating: L.rating,
        reviewsCount: L.rev,
      },
    });
    await prisma.experience.create({
      data: {
        hostId: u.id,
        title: L.exp.title,
        city: L.exp.city,
        location: L.exp.loc,
        startAt: new Date(Date.now() + (3 + pcount) * 86400000),
        priceCents: L.exp.price,
        imageUrl: L.exp.img,
        tags: L.exp.tags,
        description: `Un'esperienza autentica con ${L.fn}, ${L.prof.toLowerCase()} del posto.`,
        capacity: 8,
      },
    });
  }

  console.log("Seed completato.");
  console.log(`Demo login: alberto@localglobal.it / ${demoPassword}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
