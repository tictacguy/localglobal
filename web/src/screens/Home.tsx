import { useEffect, useState } from "react";
import { api } from "../api";
import { BottomNav, ExperienceCard, StatusBar } from "../components";
import { Icon } from "../Icon";
import type { Experience } from "../types";

export function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");
  const [people, setPeople] = useState(1);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (where) params.set("where", where);
    if (when) params.set("when", when);
    const { experiences } = await api.get<{ experiences: Experience[] }>(`/experiences?${params}`);
    setExperiences(experiences);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function search() {
    setExpanded(false);
    load();
  }

  function toggleLike(id: string) {
    setLiked((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  return (
    <>
      <div className="screen has-nav no-pad">
        <div style={{ padding: "0 var(--pad)" }}>
          <StatusBar />
        </div>

        <div style={{ padding: "0 var(--pad)" }}>
          {!expanded ? (
            <div className="home-search">
              <button className="box" onClick={() => setExpanded(true)}>
                <Icon name="pin" size={18} /> {where || "Dove si va?"}
              </button>
              <button className="icon-btn" onClick={() => setExpanded(true)}>
                <Icon name="sliders" size={20} />
              </button>
            </div>
          ) : (
            <div className="search-card">
              <div className="search-row">
                <Icon name="pin" size={18} className="icon" />
                <input placeholder="Dove si va?" value={where} onChange={(e) => setWhere(e.target.value)} />
                <button className="icon-btn" style={{ width: 40, height: 40 }}>
                  <Icon name="sliders" size={18} />
                </button>
              </div>
              <div className="search-row">
                <Icon name="calendar" size={18} className="icon" />
                <input type="date" value={when} onChange={(e) => setWhen(e.target.value)} style={{ color: when ? "var(--black)" : "var(--gray-2)" }} />
                <Icon name="chevDown" size={18} className="icon" />
              </div>
              <div className="search-row">
                <Icon name="people" size={18} className="icon" />
                <span style={{ flex: 1, color: "var(--gray-2)" }}>Quanti siete?</span>
                <div className="stepper">
                  <button onClick={() => setPeople((p) => Math.max(1, p - 1))}>
                    <Icon name="minus" size={16} />
                  </button>
                  <b>{people}</b>
                  <button onClick={() => setPeople((p) => p + 1)}>
                    <Icon name="plus" size={16} />
                  </button>
                </div>
              </div>
              <div style={{ padding: "14px 0 6px" }}>
                <button className="btn btn-primary btn-sm" onClick={search}>
                  Cerca
                </button>
              </div>
              <div className="handle" onClick={() => setExpanded(false)} />
            </div>
          )}
        </div>

        <div style={{ padding: "4px var(--pad) 0" }}>
          {loading ? (
            <div className="loading">Caricamento esperienze…</div>
          ) : experiences.length === 0 ? (
            <div className="loading">Nessuna esperienza trovata</div>
          ) : (
            experiences.map((e) => (
              <ExperienceCard key={e.id} exp={e} liked={liked.has(e.id)} onLike={() => toggleLike(e.id)} />
            ))
          )}
        </div>
      </div>
      <BottomNav active="home" />
    </>
  );
}
