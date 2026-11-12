import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { api } from "../api";
import { BottomNav, StatusBar, avatarSrc } from "../components";
import { Icon, Stars, Verified } from "../Icon";
import type { LocalCard } from "../types";

export function Explore() {
  const nav = useNavigate();
  const [locals, setLocals] = useState<LocalCard[]>([]);
  const [i, setI] = useState(0);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<{ local: LocalCard; conversationId: string | null } | null>(null);

  useEffect(() => {
    api
      .get<{ locals: LocalCard[] }>("/locals")
      .then(({ locals }) => setLocals(locals))
      .finally(() => setLoading(false));
  }, []);

  const current = locals[i];
  const next = locals[i + 1];

  async function commit(local: LocalCard, direction: "LIKE" | "PASS") {
    setI((n) => n + 1);
    try {
      const res = await api.post<{ matched: boolean; conversationId: string | null }>("/swipe", {
        localId: local.id,
        direction,
      });
      if (direction === "LIKE") setMatch({ local, conversationId: res.conversationId });
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
            <h1 className="h1">Esplora i Local</h1>
            <div className="muted" style={{ fontSize: 13 }}>
              {current?.cityResidence ?? "Vicino a te"} · Adesso
            </div>
          </div>
          <div className="spacer" />
          <button className="icon-btn">
            <Icon name="sliders" size={20} />
          </button>
        </div>

        {loading ? (
          <div className="deck">
            <div className="card-slot">
              <div className="skeleton" style={{ position: "absolute", inset: "0 0 8px 0", borderRadius: 24 }} />
            </div>
          </div>
        ) : !current ? (
          <div className="empty" style={{ marginTop: 30 }}>
            <div className="ei">
              <Icon name="compass" size={30} />
            </div>
            Hai visto tutti i Local attivi per ora.
            <br />
            Torna più tardi o allarga i filtri!
          </div>
        ) : (
          <div className="deck">
            {next ? <StaticCard key={next.id} local={next} behind /> : null}
            <SwipeCard key={current.id} local={current} onCommit={(d) => commit(current, d)} onOpen={() => nav(`/local/${current.id}`)} />
          </div>
        )}
      </div>

      {match ? (
        <motion.div className="match-pop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
            <Icon name="heartFill" size={56} color="#fff" />
          </motion.div>
          <h2>È un match!</h2>
          <p style={{ opacity: 0.9, maxWidth: 260 }}>
            Ti piace {match.local.firstName}. Prenota un'esperienza per sbloccare la chat.
          </p>
          <div className="avs">
            <img src={avatarSrc(match.local)} alt="" />
          </div>
          <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 300 }}>
            <button
              className="btn"
              style={{ background: "#fff", color: "var(--blue)" }}
              onClick={() => (match.conversationId ? nav(`/chat/${match.conversationId}`) : nav("/messaggi"))}
            >
              Messaggio
            </button>
            <button className="btn" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }} onClick={() => setMatch(null)}>
              Continua
            </button>
          </div>
        </motion.div>
      ) : null}

      <BottomNav active="esplora" />
    </>
  );
}

function StaticCard({ local, behind }: { local: LocalCard; behind?: boolean }) {
  return (
    <div className="card-slot" style={behind ? { transform: "scale(0.94) translateY(14px)", filter: "brightness(0.92)" } : undefined}>
      <div className="tcard">
        <img className="bg" src={avatarSrc(local)} alt="" />
        <div className="scrim" />
      </div>
    </div>
  );
}

function SwipeCard({
  local,
  onCommit,
  onOpen,
}: {
  local: LocalCard;
  onCommit: (d: "LIKE" | "PASS") => void;
  onOpen: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-18, 18]);
  const likeOp = useTransform(x, [20, 140], [0, 1]);
  const nopeOp = useTransform(x, [-20, -140], [0, 1]);
  const ref = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  function fling(dir: "LIKE" | "PASS") {
    const to = dir === "LIKE" ? 600 : -600;
    animate(x, to, { duration: 0.32, ease: "easeIn" });
    setTimeout(() => onCommit(dir), 180);
  }

  return (
    <motion.div
      ref={ref}
      className="card-slot"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={() => (moved.current = true)}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120 || info.velocity.x > 700) fling("LIKE");
        else if (info.offset.x < -120 || info.velocity.x < -700) fling("PASS");
        else {
          animate(x, 0, { type: "spring", stiffness: 300, damping: 26 });
          setTimeout(() => (moved.current = false), 60);
        }
      }}
    >
      <div className="tcard" onClick={() => !moved.current && onOpen()}>
        <img className="bg" src={avatarSrc(local)} alt={local.firstName} draggable={false} />
        <div className="scrim" />
        <div className="story-bars">
          {[0, 1, 2, 3].map((b) => (
            <span key={b} className={`b ${b === 0 ? "on" : ""}`} />
          ))}
        </div>
        <motion.div className="stamp-badge like" style={{ opacity: likeOp }}>
          LIKE
        </motion.div>
        <motion.div className="stamp-badge nope" style={{ opacity: nopeOp }}>
          NOPE
        </motion.div>
        <div className="swipe-info">
          <div className="name">
            {local.firstName} <span className="age">{local.age ?? ""}</span> {local.verified ? <Verified size={22} /> : null}
          </div>
          <div className="loc">{local.origin ?? local.cityResidence}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Stars value={local.rating} size={14} />
            <span style={{ fontSize: 12, opacity: 0.9 }}>{local.reviewsCount.toLocaleString("it-IT")} recensioni</span>
          </div>
          <div className="swipe-tags">
            {local.interestLabels.slice(0, 5).map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
            {local.interestLabels.length > 5 ? <span className="tag">+{local.interestLabels.length - 5}</span> : null}
          </div>
        </div>
        <div className="swipe-actions" onClick={(e) => e.stopPropagation()}>
          <button className="no" onClick={() => fling("PASS")}>
            <Icon name="x" size={24} color="#ff4d4f" strokeWidth={2.4} />
          </button>
          <button className="yes" onClick={() => fling("LIKE")}>
            <Icon name="check" size={24} color="#28c66b" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
