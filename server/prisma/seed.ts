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
      rating: 4.8,
      reviewsCount: 42,
      countriesVisited: 12,
      localsMet: 2,
      passportLevel: 13,
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

  // Alberto already met Marco & Cristian (localsMet = 2)
  await prisma.swipe.create({ data: { swiperId: alberto.id, localId: marco.id, direction: "LIKE" } });
  await prisma.swipe.create({ data: { swiperId: alberto.id, localId: cristian.id, direction: "LIKE" } });

  // Booking with Nicola -> unlocked conversation (the sample chat).
  await prisma.booking.create({
    data: {
      experienceId: bacaro.id,
      touristId: alberto.id,
      startAt: bacaro.startAt,
      people: 2,
      note: "La mia ragazza è vegana.",
      status: "CONFIRMED",
      paid: false,
    },
  });

  const convo = await prisma.conversation.create({
    data: { touristId: alberto.id, localId: nicola.id, unlocked: true },
  });
  const chat = [
    { sender: alberto.id, body: "Lieto di conoscerti Cristian!" },
    { sender: nicola.id, body: "Domani sera sarebbe ottimo!" },
    { sender: alberto.id, body: "Perfetto, affare fatto." },
    { sender: nicola.id, body: "Per quanto riguarda la cena volevo farti sapere che la mia ragazza è vegana..." },
  ];
  let t = Date.now() - chat.length * 60000;
  for (const m of chat) {
    await prisma.message.create({
      data: { conversationId: convo.id, senderId: m.sender, body: m.body, createdAt: new Date(t) },
    });
    t += 60000;
  }

  // Locked conversations from likes (paywall demo)
  await prisma.conversation.create({ data: { touristId: alberto.id, localId: marco.id, unlocked: false } });

  // Passport stamps (the "I miei Viaggi" grid)
  const stamps = [
    { country: "U.S.A", city: "New York", seed: "newyork" },
    { country: "Germania", city: "Berlino", seed: "berlin" },
    { country: "Olanda", city: "Amsterdam", seed: "amsterdam" },
    { country: "Francia", city: "Parigi", seed: "paris" },
    { country: "Russia", city: "Mosca", seed: "moscow" },
    { country: "Svizzera", city: "Zurigo", seed: "zurich" },
  ];
  for (const s of stamps) {
    await prisma.passportStamp.create({
      data: { userId: alberto.id, country: s.country, city: s.city, imageUrl: STAMP(s.seed) },
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
