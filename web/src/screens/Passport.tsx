import { useEffect, useState } from "react";
import { api } from "../api";
import { BottomNav, StatusBar } from "../components";
import { Icon } from "../Icon";
import type { Passport as PassportData } from "../types";

export function Passport() {
  const [pp, setPp] = useState<PassportData | null>(null);

  useEffect(() => {
    api.get<{ passport: PassportData }>("/passport").then(({ passport }) => setPp(passport));
  }, []);

  return (
    <>
      <div className="screen has-nav">
        <StatusBar />
        <div className="pp-head">
          <h1 className="h1">Passaporto</h1>
          <div className="pp-level">
            {pp ? `${pp.levelTitle} · ${pp.localsMet} Locals incontrati` : ""}
          </div>
        </div>

        {pp ? (
          <>
            <div className="pp-banner">
              Finora hai visitato {pp.countriesVisited} Paesi, complimenti!
            </div>

            <div className="panel tight">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h4 style={{ margin: 0 }}>Missioni</h4>
                <span className="tag" style={{ background: "var(--field-bg)" }}>Liv. {pp.level}</span>
              </div>
              {pp.missions.map((m) => (
                <div className="mission" key={m.key}>
                  <div className="mi">
                    <Icon name="shield" size={20} color="var(--blue)" />
                  </div>
                  <div className="mtext">
                    <div style={{ fontSize: 14 }}>
                      {m.label} ({m.progress}/{m.target})
                    </div>
                    <div className="mbar">
                      <span style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-title" style={{ marginTop: 6 }}>I miei Viaggi</div>
            <div className="stamps">
              {pp.stamps.map((s) => (
                <div className="stamp" key={s.city}>
                  <img src={s.imageUrl} alt={s.city} loading="lazy" />
                  <div className="sc">{s.city}</div>
                  <div className="sn">{s.country}</div>
                </div>
              ))}
            </div>
            {pp.stamps.length === 0 ? (
              <div className="loading">Prenota la tua prima esperienza per iniziare a collezionare timbri!</div>
            ) : null}
          </>
        ) : (
          <div className="loading">Caricamento…</div>
        )}
      </div>
      <BottomNav active="passaporto" />
    </>
  );
}
