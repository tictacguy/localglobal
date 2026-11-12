import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, ApiError } from "../api";
import { avatarSrc } from "../components";
import { Icon } from "../Icon";
import type { Message, User } from "../types";

interface ConvoDetail {
  id: string;
  unlocked: boolean;
  other: User;
  messages: Message[];
}

export function Chat() {
  const { id } = useParams();
  const nav = useNavigate();
  const [convo, setConvo] = useState<ConvoDetail | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const { conversation } = await api.get<{ conversation: ConvoDetail }>(`/conversations/${id}`);
      setConvo(conversation);
    } catch {
      nav("/messaggi", { replace: true });
    }
  }

  useEffect(() => {
    load();
    // Light polling for new messages (simple + robust for an MVP).
    const t = setInterval(() => {
      api
        .get<{ conversation: ConvoDetail }>(`/conversations/${id}`)
        .then(({ conversation }) => setConvo(conversation))
        .catch(() => {});
    }, 4000);
    return () => clearInterval(t);
  }, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo?.messages.length]);

  async function send() {
    const body = text.trim();
    if (!body || !convo) return;
    setSending(true);
    setText("");
    try {
      const { message } = await api.post<{ message: Message }>(`/conversations/${convo.id}/messages`, { body });
      setConvo((c) => (c ? { ...c, messages: [...c.messages, message] } : c));
    } catch (e) {
      if (e instanceof ApiError) setText(body);
    } finally {
      setSending(false);
    }
  }

  if (!convo) return <div className="screen"><div className="loading">Caricamento…</div></div>;

  return (
    <div className="screen">
      <div style={{ height: 12 }} />
      <div className="chat-head">
        <button className="icon-btn plain" onClick={() => nav("/messaggi")}>
          <Icon name="back" />
        </button>
        <img src={avatarSrc(convo.other)} alt={convo.other.firstName} />
        <div>
          <div className="cn">{convo.other.firstName}</div>
          <div className="cl">{convo.other.origin ?? convo.other.cityResidence ?? ""}</div>
        </div>
        <div className="spacer" />
      </div>

      {!convo.unlocked ? (
        <div className="locked">
          <div className="lk">
            <Icon name="lock" size={30} />
          </div>
          <div style={{ fontWeight: 600, color: "var(--black)", marginBottom: 6 }}>Chat bloccata</div>
          Prenota un'esperienza con {convo.other.firstName} per sbloccare la chat.
          <div style={{ marginTop: 22 }}>
            <button className="btn btn-primary btn-sm" onClick={() => nav("/home")}>
              Scopri le esperienze
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="messages">
            {convo.messages.map((m) => (
              <div key={m.id} className={`bubble ${m.mine ? "mine" : "theirs"}`}>
                {m.body}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="chat-input">
            <div className="box">
              <input
                placeholder="Scrivi un messaggio…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
            </div>
            <button className="send" disabled={sending || !text.trim()} onClick={send}>
              <Icon name="send" size={20} color="#fff" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
