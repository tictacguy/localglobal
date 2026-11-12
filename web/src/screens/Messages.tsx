import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { BottomNav, StatusBar, avatarSrc } from "../components";
import { Icon } from "../Icon";
import type { Conversation } from "../types";

export function Messages() {
  const nav = useNavigate();
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get<{ conversations: Conversation[] }>("/conversations").then(({ conversations }) => {
      setConvos(conversations);
      setLoading(false);
    });
  }, []);

  const filtered = convos.filter((c) =>
    `${c.other.firstName} ${c.other.lastName}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <div className="screen has-nav">
        <StatusBar />
        <div className="topbar">
          <h1 className="h1">Messaggi</h1>
          <div className="spacer" />
        </div>
        <div className="field" style={{ marginBottom: 6 }}>
          <Icon name="search" size={20} className="icon" />
          <input placeholder="Cerca" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {loading ? (
          <div className="loading">Caricamento…</div>
        ) : filtered.length === 0 ? (
          <div className="loading">Nessuna conversazione.<br />Fai swipe o prenota un'esperienza!</div>
        ) : (
          <div style={{ marginTop: 6 }}>
            {filtered.map((c) => (
              <div className="convo" key={c.id} onClick={() => nav(`/chat/${c.id}`)}>
                <img src={avatarSrc(c.other)} alt={c.other.firstName} />
                <div className="cmain">
                  <div className="cname">
                    {c.other.firstName} {c.other.lastName}
                    {!c.unlocked ? <Icon name="lock" size={14} className="lock-badge" /> : null}
                  </div>
                  <div className="cmsg">
                    {!c.unlocked
                      ? "Chat bloccata · Prenota per sbloccare"
                      : c.lastMessage
                        ? `${c.lastMessage.mine ? "Tu: " : ""}${c.lastMessage.body}`
                        : "Inizia a chattare"}
                  </div>
                </div>
                <Icon name="chevRight" size={18} color="var(--gray-3)" />
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav active="messaggi" />
    </>
  );
}
