import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Icon } from "../Icon";
import { api } from "../api";
import type { User } from "../types";

function Row({ icon, title, sub, onClick }: { icon: string; title: string; sub?: string; onClick: () => void }) {
  return (
    <div className="set-row" onClick={onClick}>
      <span className="si">
        <Icon name={icon} size={20} />
      </span>
      <span className="sl">
        <span className="st">{title}</span>
        {sub ? <span className="ss">{sub}</span> : null}
      </span>
      <Icon name="chevRight" size={18} color="var(--gray-3)" />
    </div>
  );
}

export function Settings() {
  const nav = useNavigate();
  const { user, setUser, logout } = useAuth();
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

      <div className="set-group">
        <div className="gl">Account</div>
        <div className="set-card">
          <Row icon="person" title="Informazioni personali" sub="Nome, contatti, città" onClick={() => nav("/profilo/dati")} />
          <Row icon="card" title="Metodo di pagamento" onClick={() => nav("/impostazioni/pagamenti")} />
          <Row icon="pie" title="Insights e Analytics" onClick={() => nav("/impostazioni/insights")} />
          <Row icon="tagPrice" title="Promozioni" onClick={() => nav("/impostazioni/promozioni")} />
        </div>
      </div>

      <div className="set-group">
        <div className="gl">Preferenze</div>
        <div className="set-card">
          <Row icon="bell" title="Notifiche" onClick={() => nav("/impostazioni/notifiche")} />
          <Row icon="shield" title="Privacy e Policy" onClick={() => nav("/impostazioni/privacy")} />
          <Row icon="accessibility" title="Accessibilità" onClick={() => nav("/impostazioni/accessibilita")} />
        </div>
      </div>

      <div className="set-group">
        <div className="gl">Supporto</div>
        <div className="set-card">
          <Row icon="mail" title="Contattaci" onClick={() => nav("/impostazioni/contatti")} />
          <Row icon={isLocal ? "person" : "globeLine"} title={`Passa a ${isLocal ? "Tourist" : "Local"}`} sub={isLocal ? "Torna a esplorare" : "Crea le tue esperienze"} onClick={switchMode} />
          <Row icon="login" title="Esci" onClick={() => logout().then(() => nav("/login", { replace: true }))} />
        </div>
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}
