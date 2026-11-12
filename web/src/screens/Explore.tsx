import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { BottomNav, StatusBar, avatarSrc } from "../components";
import { Icon, Stars, Verified } from "../Icon";
import type { LocalCard } from "../types";

export function Explore() {
  const nav = useNavigate();
  const [locals, setLocals] = useState<LocalCard[]>([]);
  const [i, setI] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ locals: LocalCard[] }>("/locals").then(({ locals }) => {
      setLocals(locals);
      setLoading(false);
    });
  }, []);

  const current = locals[i];

  async function swipe(direction: "LIKE" | "PASS") {
    if (!current) return;
    const localId = current.id;
    setI((n) => n + 1);
    try {
      await api.post("/swipe", { localId, direction });
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <div className="screen has-nav">
        <StatusBar />
        <div className="topbar" style={{ paddingBottom: 6 }}>
          <div>
            <h1 className="h1">Esplora i Local attivi</h1>
            <div className="muted" style={{ fontSize: 13 }}>
              {current?.cityResidence ?? "Venezia (VE)"} - Adesso
            </div>
          </div>
          <div className="spacer" />
          <button className="icon-btn">
            <Icon name="sliders" size={20} />
          </button>
        </div>

        {loading ? (
          <div className="loading">Caricamento…</div>
        ) : !current ? (
          <div className="locked" style={{ marginTop: 40 }}>
            <div className="lk">
              <Icon name="globe" size={30} />
            </div>
            Hai visto tutti i Local attivi per ora.
            <br />
            Torna più tardi!
          </div>
        ) : (
          <div className="swipe-card" onClick={() => nav(`/local/${current.id}`)}>
            <img className="bg" src={avatarSrc(current)} alt={current.firstName} />
            <div className="scrim" />
            <div className="story-bars">
              {[0, 1, 2, 3].map((b) => (
                <span key={b} className={`b ${b === 0 ? "on" : ""}`} />
              ))}
            </div>
            <div className="swipe-info">
              <div className="name">
                {current.firstName} <span className="age">{current.age ?? ""}</span>{" "}
                {current.verified ? <Verified size={22} /> : null}
              </div>
              <div className="loc">{current.origin ?? current.cityResidence}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Stars value={current.rating} size={14} />
                <span style={{ fontSize: 12, opacity: 0.9 }}>
                  {current.reviewsCount.toLocaleString("it-IT")} recensioni
                </span>
              </div>
              <div className="swipe-tags">
                {current.interestLabels.slice(0, 5).map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
                {current.interestLabels.length > 5 ? (
                  <span className="tag">+{current.interestLabels.length - 5}</span>
                ) : null}
              </div>
            </div>
            <div className="swipe-actions" onClick={(e) => e.stopPropagation()}>
              <button className="no" onClick={() => swipe("PASS")}>
                <Icon name="x" size={24} color="#ff4d4f" strokeWidth={2.4} />
              </button>
              <button className="yes" onClick={() => swipe("LIKE")}>
                <Icon name="check" size={24} color="#28c66b" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav active="esplora" />
    </>
  );
}
