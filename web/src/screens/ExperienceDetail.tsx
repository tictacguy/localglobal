import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { avatarSrc, dateLabel } from "../components";
import { Icon, Stars, Verified } from "../Icon";
import type { Experience } from "../types";

export function ExperienceDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [exp, setExp] = useState<Experience | null>(null);

  useEffect(() => {
    api.get<{ experience: Experience }>(`/experiences/${id}`).then(({ experience }) => setExp(experience));
  }, [id]);

  if (!exp) return <div className="screen"><div className="loading">Caricamento…</div></div>;

  return (
    <div className="screen no-pad">
      <div style={{ position: "relative" }}>
        <img src={exp.imageUrl} alt={exp.title} style={{ width: "100%", height: 300, objectFit: "cover" }} />
        <button
          className="icon-btn"
          onClick={() => nav(-1)}
          style={{ position: "absolute", top: 50, left: 18, background: "rgba(255,255,255,.9)" }}
        >
          <Icon name="back" />
        </button>
        {exp.lovedByTourists ? (
          <span className="chip" style={{ top: 54, left: "auto", right: 18 }}>
            Amato dai tourists
          </span>
        ) : null}
      </div>

      <div style={{ padding: "20px var(--pad) 28px" }}>
        <h1 className="h1">{exp.title}</h1>
        <div className="meta" style={{ marginTop: 10 }}>
          <Icon name="pin" size={16} /> {exp.location}
        </div>
        <div className="meta">
          <Icon name="calendar" size={16} /> {dateLabel(exp.startAt)}
        </div>
        <div className="meta">
          <Icon name="people" size={16} /> Fino a {exp.capacity} persone
        </div>

        <div className="tags" style={{ margin: "16px 0" }}>
          {exp.tagLabels.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>

        {exp.host ? (
          <div
            className="profile-head"
            style={{ cursor: "pointer" }}
            onClick={() => nav(`/local/${exp.host!.id}`)}
          >
            <img src={avatarSrc(exp.host)} alt={exp.host.firstName} />
            <div style={{ flex: 1 }}>
              <div className="pname" style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {exp.host.firstName} {exp.host.lastName} {exp.host.verified ? <Verified size={16} /> : null}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Stars value={exp.host.rating} />
                <span className="psub">{exp.host.reviewsCount.toLocaleString("it-IT")} recensioni</span>
              </div>
            </div>
            <Icon name="chevRight" className="chev" color="var(--gray-3)" />
          </div>
        ) : null}

        <p style={{ color: "var(--gray-1)", lineHeight: 1.5, marginTop: 4 }}>{exp.description}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 16px" }}>
          <div>
            <div className="muted" style={{ fontSize: 12 }}>Prezzo a persona</div>
            <div className="price" style={{ fontSize: 24 }}>€{(exp.priceCents / 100).toFixed(2)}</div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => nav(`/esperienza/${exp.id}/prenota`)}>
          Prenota
        </button>
      </div>
    </div>
  );
}
