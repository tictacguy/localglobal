import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../api";
import { Icon } from "../Icon";
import { INTEREST_CATEGORIES } from "../interests";

const IMAGE_OPTIONS = [
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=70",
];

export function CreateExperience() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [price, setPrice] = useState("25");
  const [capacity, setCapacity] = useState(6);
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(IMAGE_OPTIONS[0]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const toggleTag = (k: string) => setTags((p) => (p.includes(k) ? p.filter((x) => x !== k) : p.length < 8 ? [...p, k] : p));

  const valid = title.trim().length >= 2 && city.trim() && location.trim() && date && tags.length > 0;

  async function submit() {
    if (!valid) {
      setErr("Compila titolo, città, luogo, data e almeno un interesse.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const startAt = new Date(`${date}T${time}:00`).toISOString();
      await api.post("/experiences", {
        title: title.trim(),
        city: city.trim(),
        location: location.trim(),
        startAt,
        priceCents: Math.round(parseFloat(price || "0") * 100),
        imageUrl: image,
        tags,
        description: description.trim(),
        capacity,
      });
      nav("/profilo/esperienze", { replace: true });
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Errore nella creazione");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <div style={{ height: 12 }} />
      <div className="topbar">
        <button className="icon-btn plain" onClick={() => nav(-1)}>
          <Icon name="back" />
        </button>
        <div className="title" style={{ margin: "0 auto" }}>Crea esperienza</div>
        <div style={{ width: 44 }} />
      </div>

      <div className="section-title">Copertina</div>
      <div className="img-picker">
        {IMAGE_OPTIONS.map((src) => (
          <button key={src} className={`opt ${image === src ? "on" : ""}`} onClick={() => setImage(src)}>
            <img src={src} alt="" loading="lazy" />
            {image === src ? (
              <span className="chk">
                <Icon name="check" size={13} color="#fff" strokeWidth={2.6} />
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="stack" style={{ marginTop: 18 }}>
        <div className="field">
          <Icon name="sparkles" size={20} className="icon" />
          <input placeholder="Titolo (es. Bacaro Tour a Venezia)" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <Icon name="globeLine" size={20} className="icon" />
          <input placeholder="Città" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="field">
          <Icon name="pin" size={20} className="icon" />
          <input placeholder="Luogo d'incontro" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <Icon name="calendar" size={20} className="icon" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ color: date ? "var(--black)" : "var(--gray-2)" }} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <Icon name="clock" size={20} className="icon" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <span style={{ color: "var(--gray-2)" }}>€</span>
            <input type="number" min="0" placeholder="Prezzo p.p." value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="field" style={{ flex: 1, justifyContent: "space-between" }}>
            <span style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--gray-2)" }}>
              <Icon name="people" size={18} /> Max
            </span>
            <div className="stepper">
              <button onClick={() => setCapacity((c) => Math.max(1, c - 1))}>
                <Icon name="minus" size={14} />
              </button>
              <b>{capacity}</b>
              <button onClick={() => setCapacity((c) => Math.min(50, c + 1))}>
                <Icon name="plus" size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="field" style={{ height: "auto", padding: 14, alignItems: "flex-start" }}>
          <Icon name="edit" size={20} className="icon" style={{ marginTop: 2 }} />
          <textarea
            placeholder="Descrizione dell'esperienza"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", resize: "none", fontFamily: "inherit" }}
          />
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 18 }}>Interessi / categorie</div>
      <div className="chips">
        {INTEREST_CATEGORIES.flatMap((c) => c.items)
          .slice(0, 28)
          .map((it) => (
            <button key={it.key} className={`chip-select ${tags.includes(it.key) ? "on" : ""}`} onClick={() => toggleTag(it.key)}>
              {it.label}
            </button>
          ))}
      </div>

      <div className="err" style={{ marginTop: 14 }}>{err}</div>
      <button className="btn btn-primary" disabled={busy || !valid} onClick={submit} style={{ margin: "6px 0 24px" }}>
        {busy ? "Pubblicazione…" : "Pubblica esperienza"}
      </button>
    </div>
  );
}
