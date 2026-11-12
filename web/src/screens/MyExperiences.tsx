import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { dateLabel } from "../components";
import { Icon } from "../Icon";
import type { Experience } from "../types";

interface MyExp extends Experience {
  bookingsCount: number;
}

export function MyExperiences() {
  const nav = useNavigate();
  const [exps, setExps] = useState<MyExp[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api
      .get<{ experiences: MyExp[] }>("/my-experiences")
      .then(({ experiences }) => setExps(experiences))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function remove(id: string) {
    setExps((p) => p.filter((e) => e.id !== id));
    try {
      await api.del(`/experiences/${id}`);
    } catch {
      load();
    }
  }

  return (
    <div className="screen">
      <div style={{ height: 12 }} />
      <div className="topbar">
        <button className="icon-btn plain" onClick={() => nav(-1)}>
          <Icon name="back" />
        </button>
        <div className="title" style={{ margin: "0 auto" }}>Le mie esperienze</div>
        <button className="icon-btn" onClick={() => nav("/crea-esperienza")} aria-label="Crea">
          <Icon name="plus" size={22} />
        </button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 92 }} />
      ) : exps.length === 0 ? (
        <div className="empty">
          <div className="ei">
            <Icon name="sparkles" size={28} />
          </div>
          Non hai ancora pubblicato esperienze.
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-primary btn-sm" onClick={() => nav("/crea-esperienza")}>
              Crea la prima esperienza
            </button>
          </div>
        </div>
      ) : (
        exps.map((e) => (
          <div className="my-exp fade-up" key={e.id}>
            <img src={e.imageUrl} alt="" onClick={() => nav(`/esperienza/${e.id}`)} />
            <div style={{ flex: 1, minWidth: 0 }} onClick={() => nav(`/esperienza/${e.id}`)}>
              <div style={{ fontWeight: 700 }}>{e.title}</div>
              <div className="meta" style={{ margin: "2px 0" }}>
                <Icon name="calendar" size={13} /> {dateLabel(e.startAt)}
              </div>
              <div className="meta" style={{ margin: 0 }}>
                <Icon name="people" size={13} /> {e.bookingsCount} prenotazioni · €{(e.priceCents / 100).toFixed(0)}
              </div>
            </div>
            <button className="icon-btn plain" onClick={() => remove(e.id)} aria-label="Elimina" style={{ color: "var(--red)" }}>
              <Icon name="trash" size={20} color="var(--red)" />
            </button>
          </div>
        ))
      )}
      <div style={{ height: 20 }} />
    </div>
  );
}
