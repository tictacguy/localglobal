import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { avatarSrc, dateLabel } from "../components";
import { Icon, Stars, Verified } from "../Icon";
import type { Experience, User } from "../types";

interface LocalDetail extends User {
  age: number | null;
  experiences: Experience[];
}

export function LocalProfile() {
  const { id } = useParams();
  const nav = useNavigate();
  const [local, setLocal] = useState<LocalDetail | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<{ local: LocalDetail }>(`/locals/${id}`).then(({ local }) => setLocal(local));
  }, [id]);

  async function contatta() {
    if (!local) return;
    setBusy(true);
    try {
      const { conversationId } = await api.post<{ conversationId: string | null }>("/swipe", {
        localId: local.id,
        direction: "LIKE",
      });
      if (conversationId) nav(`/chat/${conversationId}`);
      else nav("/messaggi");
    } finally {
      setBusy(false);
    }
  }

  if (!local) return <div className="screen"><div className="loading">Caricamento…</div></div>;

  const dob = local.birthDate ? new Date(local.birthDate) : null;
  const dobStr = dob ? `${String(dob.getDate()).padStart(2, "0")}/${String(dob.getMonth() + 1).padStart(2, "0")}/${dob.getFullYear()}` : null;

  return (
    <div className="screen has-nav">
      <div style={{ height: 12 }} />
      <div className="topbar">
        <button className="icon-btn plain" onClick={() => nav(-1)}>
          <Icon name="back" />
        </button>
        <div className="title" style={{ margin: "0 auto" }}>Profilo</div>
        <div style={{ width: 44 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 10 }}>
        <img src={avatarSrc(local)} alt={local.firstName} style={{ width: 120, height: 120, borderRadius: 24, objectFit: "cover" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
          <h1 className="h2">{local.firstName} {local.lastName}</h1>
          {local.verified ? <Verified size={18} /> : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <Stars value={local.rating} />
          <span className="psub">{local.reviewsCount.toLocaleString("it-IT")} recensioni</span>
        </div>
      </div>

      <div className="panel tight">
        <h4>Generalità</h4>
        <div className="row-item" style={{ paddingBottom: 6 }}>
          <Icon name="person" size={20} className="ri-icon" />
          <span className="ri-label" style={{ color: "var(--black)" }}>{local.email?.split("@")[0] ?? local.firstName.toLowerCase()}</span>
        </div>
        {dobStr ? <div className="row-item"><Icon name="calendar" size={20} className="ri-icon" /><span className="ri-label">{dobStr}</span></div> : null}
        {local.cityResidence ? <div className="row-item"><Icon name="pin" size={20} className="ri-icon" /><span className="ri-label">{local.cityResidence}</span></div> : null}
        {local.phone ? <div className="row-item"><Icon name="phone" size={20} className="ri-icon" /><span className="ri-label">{local.phone}</span></div> : null}
      </div>

      {local.profession ? (
        <div className="panel tight">
          <h4>Professione</h4>
          <div className="row-item">
            <Icon name="briefcase" size={20} className="ri-icon" />
            <span className="ri-label" style={{ color: "var(--black)" }}>{local.profession}</span>
          </div>
        </div>
      ) : null}

      <div className="panel tight">
        <h4>Interessi</h4>
        <div className="tags" style={{ marginTop: 4 }}>
          {local.interestLabels.map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
      </div>

      {local.experiences.length > 0 ? (
        <>
          <div className="section-title">Esperienze offerte</div>
          {local.experiences.map((e) => (
            <div key={e.id} className="exp-card" onClick={() => nav(`/esperienza/${e.id}`)}>
              <div style={{ display: "flex", gap: 12, padding: 12 }}>
                <img src={e.imageUrl} alt={e.title} style={{ width: 84, height: 84, borderRadius: 14, objectFit: "cover" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700 }}>{e.title}</div>
                  <div className="meta"><Icon name="pin" size={14} /> {e.location}</div>
                  <div className="meta"><Icon name="calendar" size={14} /> {dateLabel(e.startAt)}</div>
                  <div className="tags" style={{ marginTop: 6 }}>
                    {e.tagLabels.slice(0, 2).map((t) => <span className="tag" key={t}>{t}</span>)}
                    {e.tagLabels.length > 2 ? <span className="tag more">+{e.tagLabels.length - 2}</span> : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : null}

      <div style={{ height: 8 }} />
      <button className="btn btn-primary" disabled={busy} onClick={contatta} style={{ marginBottom: 20 }}>
        {busy ? "…" : "Contatta"}
      </button>
    </div>
  );
}
