// Interest catalog derived from the Brainstorming board (10 macro categories).
// Keys are stable identifiers stored on users/experiences; labels carry the emoji.
export const INTEREST_CATEGORIES = [
  {
    key: "sport",
    label: "Sport",
    items: [
      { key: "stadio", label: "🏟️ Partite allo stadio" },
      { key: "parco", label: "🏃 Partita al parco" },
      { key: "tennis", label: "🎾 Tennis" },
      { key: "padel", label: "🎾 Padel" },
      { key: "running", label: "🏃‍♀️ Running outdoor" },
      { key: "yoga", label: "🧘‍♀️ Yoga" },
      { key: "calcio", label: "⚽ Calcio" },
      { key: "rugby", label: "🏉 Rugby" },
      { key: "basket", label: "🏀 Basket" },
      { key: "surf", label: "🏄 Surf" },
    ],
  },
  {
    key: "cibo",
    label: "Cibo e Cucina",
    items: [
      { key: "aperitivo", label: "🍸 Aperitivo" },
      { key: "streetfood", label: "🍢 Street food tour" },
      { key: "stellato", label: "🍽️ Ristorante stellato" },
      { key: "cucina", label: "🍳 Lezione di cucina" },
      { key: "vino", label: "🍷 Degustazione di vino" },
      { key: "mercato", label: "🍅 Mercato alimentare" },
    ],
  },
  {
    key: "cultura",
    label: "Cultura e Storia",
    items: [
      { key: "musei", label: "🖼️ Tour nei musei" },
      { key: "monumenti", label: "🏛️ Monumenti storici" },
      { key: "borgo", label: "🏘️ Borgo antico" },
      { key: "unesco", label: "🏆 Sito UNESCO" },
      { key: "castello", label: "🏰 Castello" },
    ],
  },
  {
    key: "musica",
    label: "Musica e Spettacolo",
    items: [
      { key: "concerto", label: "🎶 Concerto" },
      { key: "jazz", label: "🎷 Jazz club" },
      { key: "opera", label: "🎭 Opera" },
      { key: "elettronica", label: "🎧 Musica elettronica" },
      { key: "karaoke", label: "🎤 Karaoke" },
    ],
  },
  {
    key: "moda",
    label: "Moda e Shopping",
    items: [
      { key: "luxury", label: "💎 Luxury shopping" },
      { key: "vintage", label: "👗 Mercatini vintage" },
      { key: "botteghe", label: "🧵 Botteghe artigianali" },
      { key: "design", label: "🪑 Negozi di design" },
    ],
  },
  {
    key: "divertimento",
    label: "Divertimento",
    items: [
      { key: "discoteca", label: "🪩 Discoteca" },
      { key: "clubbing", label: "🎉 Clubbing" },
      { key: "bacaro", label: "🍷 Bacaro tour" },
      { key: "rooftop", label: "🌆 Rooftop" },
      { key: "cinema", label: "🎬 Cinema" },
    ],
  },
  {
    key: "benessere",
    label: "Benessere e Relax",
    items: [
      { key: "spa", label: "💆 Spa day" },
      { key: "sauna", label: "🧖 Sauna" },
      { key: "meditazione", label: "🧘 Meditazione" },
      { key: "terme", label: "♨️ Terme naturali" },
    ],
  },
  {
    key: "foto",
    label: "Fotografia e Video",
    items: [
      { key: "urbano", label: "📸 Tour fotografico urbano" },
      { key: "paesaggio", label: "🏞️ Fotografia paesaggistica" },
      { key: "drone", label: "🚁 Riprese con drone" },
      { key: "tramonto", label: "🌅 Scatti al tramonto" },
    ],
  },
  {
    key: "natura",
    label: "Natura e Outdoor",
    items: [
      { key: "escursione", label: "🥾 Escursione" },
      { key: "outdoor", label: "🌳 Outdoor" },
      { key: "barca", label: "🛥️ Giro in barca" },
      { key: "kayak", label: "🛶 Kayak" },
      { key: "spiaggia", label: "🏖️ Spiaggia" },
    ],
  },
  {
    key: "tech",
    label: "Tecnologia e Innovazione",
    items: [
      { key: "startup", label: "🚀 Hub di startup" },
      { key: "ai", label: "🤖 Intelligenza artificiale" },
      { key: "gaming", label: "🎮 Gaming" },
      { key: "vr", label: "🕶️ Realtà virtuale" },
    ],
  },
] as const;

const LABELS = new Map<string, string>();
for (const cat of INTEREST_CATEGORIES) {
  for (const item of cat.items) LABELS.set(item.key, item.label);
}

export const ALL_INTEREST_KEYS = Array.from(LABELS.keys());

export function interestLabel(key: string): string {
  return LABELS.get(key) ?? key;
}
