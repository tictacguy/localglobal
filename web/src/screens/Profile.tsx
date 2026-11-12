import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { BottomNav, StatusBar, avatarSrc } from "../components";
import { Icon } from "../Icon";
import type { User } from "../types";

function Row({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <div className="row-item" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <Icon name={icon} size={20} className="ri-icon" />
      <span className="ri-label">{label}</span>
      <Icon name="chevRight" size={18} className="chev" color="var(--gray-3)" />
    </div>
  );
}

export function Profile() {
  const { user, setUser, logout } = useAuth();
  const nav = useNavigate();
  const [notif, setNotif] = useState(true);

  if (!user) return null;
  const isLocal = user.activeMode === "LOCAL";

  async function switchMode() {
    const { user: u } = await api.post<{ user: User }>("/mode");
    setUser(u);
  }

  return (
    <>
      <div className="screen has-nav">
        <StatusBar />
        <div className="topbar">
          <h1 className="h1">Profilo</h1>
          <div className="spacer" />
          <button className="icon-btn">
            <Icon name="dots" size={20} />
          </button>
        </div>

        <div className="profile-head">
          <img src={avatarSrc(user)} alt={user.firstName} />
          <div style={{ flex: 1 }}>
            <div className="pname">
              {user.firstName} {user.lastName}
            </div>
            <div className="psub">{user.cityResidence ?? user.origin ?? ""}</div>
          </div>
          <span className="link-btn">{isLocal ? "Local" : "Tourist"}</span>
        </div>

        <div className="panel">
          <h4>Account</h4>
          <Row icon="person" label="Dati Personali" onClick={() => nav("/profilo/dati")} />
          <Row icon="pie" label="Insights e Analytics" />
          <Row icon="tagPrice" label="Promozioni" />
          <Row icon="card" label="Metodo di pagamento" />
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
          <Row icon="mail" label="Contattaci" />
          <Row icon="shield" label="Privacy e Policy" />
          <Row icon="settings" label="Impostazioni Account" />
          <Row icon="login" label="Esci" onClick={() => logout().then(() => nav("/login", { replace: true }))} />
        </div>

        <div className="mode-pill">
          <button onClick={switchMode}>
            Passa a {isLocal ? "Tourist" : "Local"} <Icon name="swap" size={18} color="#fff" />
          </button>
        </div>
      </div>
      <BottomNav active="profilo" />
    </>
  );
}
