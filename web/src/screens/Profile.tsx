import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { useAuth } from "../auth";
import { BottomNav, StatusBar, avatarSrc } from "../components";
import { Icon, Verified } from "../Icon";
import type { User } from "../types";

function Row({ icon, label, onClick, danger }: { icon: string; label: string; onClick?: () => void; danger?: boolean }) {
  return (
    <div className="row-item" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default", color: danger ? "var(--red)" : undefined }}>
      <Icon name={icon} size={20} className="ri-icon" color={danger ? "var(--red)" : undefined} />
      <span className="ri-label" style={danger ? { color: "var(--red)" } : undefined}>{label}</span>
      <Icon name="chevRight" size={18} className="chev" color="var(--gray-3)" />
    </div>
  );
}

export function Profile() {
  const { user, setUser, logout } = useAuth();
  const nav = useNavigate();
  const [notif, setNotif] = useState(true);
  const [switching, setSwitching] = useState(false);

  if (!user) return null;
  const isLocal = user.activeMode === "LOCAL";

  async function switchMode() {
    setSwitching(true);
    try {
      const { user: u } = await api.post<{ user: User }>("/mode");
      setUser(u);
    } finally {
      setSwitching(false);
    }
  }

  return (
    <>
      <div className="screen has-nav">
        <StatusBar />
        <div className="topbar">
          <h1 className="h1">Profilo</h1>
          <div className="spacer" />
          <button className="icon-btn" onClick={() => nav("/impostazioni")} aria-label="Impostazioni">
            <Icon name="settings" size={20} />
          </button>
        </div>

        <div className="profile-head">
          <img src={avatarSrc(user)} alt={user.firstName} />
          <div style={{ flex: 1 }}>
            <div className="pname" style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {user.firstName} {user.lastName} {user.verified ? <Verified size={15} /> : null}
            </div>
            <div className="psub">{user.cityResidence ?? user.origin ?? ""}</div>
          </div>
          <span className="tag" style={{ background: isLocal ? "var(--black)" : "var(--field-bg)", color: isLocal ? "#fff" : "var(--gray-1)", border: "none" }}>
            {isLocal ? "Local" : "Tourist"}
          </span>
        </div>

        {isLocal ? (
          <motion.div className="panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h4>Modalità Local</h4>
            <Row icon="sparkles" label="Le mie esperienze" onClick={() => nav("/profilo/esperienze")} />
            <Row icon="plusCircle" label="Crea una nuova esperienza" onClick={() => nav("/crea-esperienza")} />
            <Row icon="pie" label="Insights e Analytics" onClick={() => nav("/impostazioni/insights")} />
          </motion.div>
        ) : null}

        <div className="panel">
          <h4>Account</h4>
          <Row icon="person" label="Dati Personali" onClick={() => nav("/profilo/dati")} />
          <Row icon="trophy" label="Passaporto" onClick={() => nav("/passaporto")} />
          <Row icon="calendar" label="Schedule" onClick={() => nav("/schedule")} />
          <Row icon="card" label="Metodo di pagamento" onClick={() => nav("/impostazioni/pagamenti")} />
        </div>

        <div className="panel tight">
          <h4>Notifiche</h4>
          <div className="row-item">
            <Icon name="bell" size={20} className="ri-icon" />
            <span className="ri-label">Attivate</span>
            <span className={`toggle ${notif ? "on" : ""}`} onClick={() => setNotif((v) => !v)}>
              <span className="knob" />
            </span>
          </div>
        </div>

        <div className="panel">
          <h4>Altro</h4>
          <Row icon="settings" label="Impostazioni Account" onClick={() => nav("/impostazioni")} />
          <Row icon="shield" label="Privacy e Policy" onClick={() => nav("/impostazioni/privacy")} />
          <Row icon="mail" label="Contattaci" onClick={() => nav("/impostazioni/contatti")} />
          <Row icon="login" label="Esci" danger onClick={() => logout().then(() => nav("/login", { replace: true }))} />
        </div>

        <div className="mode-pill">
          <button onClick={switchMode} disabled={switching}>
            Passa a {isLocal ? "Tourist" : "Local"} <Icon name="swap" size={18} color="#fff" />
          </button>
        </div>
      </div>
      <BottomNav active="profilo" />
    </>
  );
}
