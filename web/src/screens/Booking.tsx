import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, ApiError } from "../api";
import { useAuth } from "../auth";
import { Icon } from "../Icon";
import type { Experience } from "../types";

export function Booking() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [exp, setExp] = useState<Experience | null>(null);
  const [username, setUsername] = useState(user ? `${user.firstName} ${user.lastName}` : "");
  const [origin, setOrigin] = useState(user?.origin ?? "");
  const [people, setPeople] = useState(1);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get<{ experience: Experience }>(`/experiences/${id}`).then(({ experience }) => {
      setExp(experience);
    });
  }, [id]);

  async function confirm() {
    if (!exp) return;
    setBusy(true);
    setErr("");
    try {
      await api.post("/bookings", {
        experienceId: exp.id,
        startAt: exp.startAt,
        people,
        note,
      });
      // Booking unlocks the chat with the host (paywall released).
      const { conversations } = await api.get<{ conversations: { id: string; other: { id: string } }[] }>("/conversations");
      const convo = conversations.find((c) => c.other.id === exp.host?.id);
      nav(convo ? `/chat/${convo.id}` : "/messaggi", { replace: true });
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Errore nella prenotazione");
    } finally {
      setBusy(false);
    }
  }

  if (!exp) return <div className="screen"><div className="loading">Caricamento…</div></div>;

  const d = new Date(exp.startAt);
  const days = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  return (
    <div className="screen">
      <StatusLite />
      <div className="topbar">
        <button className="icon-btn plain" onClick={() => nav(-1)}>
          <Icon name="back" />
        </button>
        <div className="title" style={{ margin: "0 auto" }}>Aggiungi appuntamento</div>
        <div style={{ width: 44 }} />
      </div>

      <div className="meta" style={{ marginBottom: 18 }}>
        <Icon name="calendar" size={18} /> {days[d.getDay()]}, {d.getDate()} {months[d.getMonth()]} {d.getFullYear()}
      </div>

      <div className="section-title">Orario</div>
      <div
        style={{
          textAlign: "center",
          padding: "14px 0 18px",
          fontWeight: 700,
          fontSize: 20,
          color: "var(--black)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          marginBottom: 20,
        }}
      >
        <div className="muted" style={{ fontSize: 15, fontWeight: 500, opacity: 0.5 }}>
          {hh === "00" ? "23" : String(+hh - 1).padStart(2, "0")} &nbsp;&nbsp; {String(+mm === 0 ? 59 : +mm - 1).padStart(2, "0")}
        </div>
        <div style={{ margin: "4px 0" }}>{hh} &nbsp;&nbsp; {mm}</div>
        <div className="muted" style={{ fontSize: 15, fontWeight: 500, opacity: 0.5 }}>
          {String((+hh + 1) % 24).padStart(2, "0")} &nbsp;&nbsp; {String((+mm + 1) % 60).padStart(2, "0")}
        </div>
      </div>

      <div className="section-title">Dettagli</div>
      <div className="stack">
        <div className="field">
          <Icon name="person" size={20} className="icon" />
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="field select">
          <Icon name="pin" size={20} className="icon" />
          <input placeholder="Provenienza" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          <Icon name="chevDown" size={18} className="trailing" />
        </div>
        <div className="field" style={{ justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--gray-2)" }}>
            <Icon name="people" size={20} /> Quante persone?
          </span>
          <div className="stepper">
            <button onClick={() => setPeople((p) => Math.max(1, p - 1))}>
              <Icon name="minus" size={16} />
            </button>
            <b>{people}</b>
            <button onClick={() => setPeople((p) => Math.min(exp.capacity, p + 1))}>
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>
        <div className="field">
          <Icon name="edit" size={20} className="icon" />
          <input placeholder="Note o dettagli dell'esperienza…" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>

      <div className="err" style={{ marginTop: 12 }}>{err}</div>
      <div className="grow" />
      <button className="btn btn-primary" disabled={busy} onClick={confirm} style={{ marginBottom: 22 }}>
        {busy ? "Prenotazione…" : "Aggiungi"}
      </button>
    </div>
  );
}

function StatusLite() {
  return <div style={{ height: 12 }} />;
}
