import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { avatarSrc } from "../components";
import { Icon } from "../Icon";
import type { User } from "../types";

const CITY_OPTIONS = [
  { label: "Villorba, TV (Italia)", flag: "🇮🇹" },
  { label: "Dallas, U.S.A", flag: "🇺🇸" },
  { label: "Tokio, Giappone", flag: "🇯🇵" },
  { label: "Londra, Inghilterra", flag: "🇬🇧" },
  { label: "Milano, MI (Italia)", flag: "🇮🇹" },
  { label: "Venezia, VE (Italia)", flag: "🇮🇹" },
  { label: "Parigi, Francia", flag: "🇫🇷" },
  { label: "Berlino, Germania", flag: "🇩🇪" },
];

export function PersonalData() {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [profession, setProfession] = useState(user?.profession ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [city, setCity] = useState(user?.cityResidence ?? "");
  const [sheet, setSheet] = useState(false);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  async function save() {
    setBusy(true);
    try {
      const { user: u } = await api.patch<{ user: User }>("/profile", {
        firstName,
        lastName,
        phone,
        profession,
        bio,
        cityResidence: city,
      });
      setUser(u);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setBusy(false);
    }
  }

  const filtered = CITY_OPTIONS.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="screen">
      <div style={{ height: 12 }} />
      <div className="topbar">
        <button className="icon-btn plain" onClick={() => nav(-1)}>
          <Icon name="back" />
        </button>
        <div className="title" style={{ margin: "0 auto" }}>Dati Personali</div>
        <div style={{ width: 44 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", margin: "6px 0 24px" }}>
        <div style={{ position: "relative" }}>
          <img src={avatarSrc(user)} alt="" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }} />
          <button
            className="icon-btn"
            style={{ position: "absolute", bottom: -2, right: -2, width: 34, height: 34, borderRadius: "50%", background: "var(--black)", color: "#fff" }}
          >
            <Icon name="edit" size={16} color="#fff" />
          </button>
        </div>
      </div>

      <div className="stack">
        <div className="field">
          <Icon name="person" size={20} className="icon" />
          <input placeholder="Nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="field">
          <Icon name="person" size={20} className="icon" />
          <input placeholder="Cognome" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="field">
          <Icon name="phone" size={20} className="icon" />
          <input placeholder="Cellulare" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button className="field select" onClick={() => setSheet(true)} style={{ textAlign: "left" }}>
          <span style={{ display: "flex", gap: 12, alignItems: "center", color: city ? "var(--black)" : "var(--gray-2)" }}>
            <Icon name="pin" size={20} color="var(--gray-2)" /> {city || "Dove abiti?"}
          </span>
          <Icon name="chevDown" size={18} className="trailing" />
        </button>
        <div className="field">
          <Icon name="briefcase" size={20} className="icon" />
          <input placeholder="Professione" value={profession} onChange={(e) => setProfession(e.target.value)} />
        </div>
        <div className="field" style={{ height: "auto", padding: "14px 16px", alignItems: "flex-start" }}>
          <Icon name="edit" size={20} className="icon" style={{ marginTop: 2 }} />
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", resize: "none", fontFamily: "inherit" }}
          />
        </div>
      </div>

      <div className="grow" />
      <button className="btn btn-primary" disabled={busy} onClick={save} style={{ margin: "18px 0 22px" }}>
        {saved ? "Salvato ✓" : busy ? "Salvataggio…" : "Salva"}
      </button>

      {sheet && (
        <div className="overlay" onClick={() => setSheet(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="sheet-x" onClick={() => setSheet(false)}>
              <Icon name="x" size={22} />
            </button>
            <h1 className="h1" style={{ marginBottom: 8 }}>Dove abiti?</h1>
            <p className="sub" style={{ marginBottom: 16 }}>Inserisci la città in cui abiti e poi premi "Conferma"</p>
            <div className="field" style={{ marginBottom: 12 }}>
              <Icon name="search" size={20} className="icon" />
              <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
            </div>
            <div style={{ maxHeight: 280, overflowY: "auto" }}>
              {filtered.map((c) => (
                <div
                  key={c.label}
                  className="option"
                  onClick={() => {
                    setCity(c.label);
                    setSearch("");
                  }}
                  style={{ background: city === c.label ? "var(--field-bg)" : undefined }}
                >
                  <span style={{ fontSize: 22 }}>{c.flag}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setSheet(false)}>
              Conferma
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
