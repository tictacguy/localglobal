import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Icon } from "../Icon";
import { api } from "../api";
import type { User } from "../types";

// Matches the Figma "Profilo" mock exactly: white rounded panels with a bold
// header and light-gray icon · label · chevron rows (no dividers).
function Row({ icon, label, onClick, danger }: { icon: string; label: string; onClick?: () => void; danger?: boolean }) {
  return (
    <div className="row-item" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <Icon name={icon} size={20} className="ri-icon" color={danger ? "var(--red)" : undefined} />
      <span className="ri-label" style={danger ? { color: "var(--red)" } : undefined}>{label}</span>
      <Icon name="chevRight" size={18} className="chev" color="var(--gray-3)" />
    </div>
  );
}

export function Settings() {
  const nav = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [notif, setNotif] = useState(true);
  if (!user) return null;
  const isLocal = user.activeMode === "LOCAL";

  async function switchMode() {
    const { user: u } = await api.post<{ user: User }>("/mode");
    setUser(u);
  }

  return (
    <div className="screen">
      <div style={{ height: 12 }} />
      <div className="topbar">
        <button className="icon-btn plain" onClick={() => nav(-1)}>
          <Icon name="back" />
        </button>
        <div className="title" style={{ margin: "0 auto" }}>Impostazioni</div>
        <div style={{ width: 44 }} />
      </div>

      <div className="panel">
        <h4>Account</h4>
        <Row icon="person" label="Informazioni personali" onClick={() => nav("/profilo/dati")} />
        <Row icon="pie" label="Insights e Analytics" onClick={() => nav("/impostazioni/insights")} />
        <Row icon="tagPrice" label="Promozioni" onClick={() => nav("/impostazioni/promozioni")} />
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
        <h4>Preferenze</h4>
        <Row icon="bell" label="Gestisci notifiche" onClick={() => nav("/impostazioni/notifiche")} />
        <Row icon="shield" label="Privacy e Policy" onClick={() => nav("/impostazioni/privacy")} />
        <Row icon="accessibility" label="Accessibilità" onClick={() => nav("/impostazioni/accessibilita")} />
      </div>

      <div className="panel">
        <h4>Altro</h4>
        <Row icon="mail" label="Contattaci" onClick={() => nav("/impostazioni/contatti")} />
        <Row icon={isLocal ? "person" : "globeLine"} label={`Passa a ${isLocal ? "Tourist" : "Local"}`} onClick={switchMode} />
        <Row icon="login" label="Esci" danger onClick={() => logout().then(() => nav("/login", { replace: true }))} />
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}
