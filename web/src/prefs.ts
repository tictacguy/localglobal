export interface Prefs {
  textLarge: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
}

const KEY = "lg_prefs";

export function loadPrefs(): Prefs {
  const def: Prefs = { textLarge: false, reduceMotion: false, highContrast: false };
  try {
    return { ...def, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return def;
  }
}

export function applyPrefs(p: Prefs) {
  document.body.classList.toggle("reduce-motion", p.reduceMotion);
  document.body.classList.toggle("high-contrast", p.highContrast);
  document.body.classList.toggle("text-lg", p.textLarge);
}

export function savePrefs(p: Prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
  applyPrefs(p);
}
