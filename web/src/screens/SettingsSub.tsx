import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../Icon";
import { api } from "../api";
import { useAuth } from "../auth";
import { loadPrefs, savePrefs, type Prefs } from "../prefs";
import type { Booking } from "../types";

function Sub({ title, children }: { title: string; children: ReactNode }) {
  const nav = useNavigate();
  return (
    <div className="screen">
      <div style={{ height: 12 }} />
      <div className="topbar">
        <button className="icon-btn plain" onClick={() => nav(-1)}>
          <Icon name="back" />
        </button>
        <div className="title" style={{ margin: "0 auto" }}>{title}</div>
        <div style={{ width: 44 }} />
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <span className={`toggle ${on ? "on" : ""}`} onClick={onClick}>
      <span className="knob" />
    </span>
  );
}

function ToggleRow({ icon, label, on, onToggle }: { icon: string; label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="row-item">
      <Icon name={icon} size={20} className="ri-icon" />
      <span className="ri-label">{label}</span>
      <Toggle on={on} onClick={onToggle} />
    </div>
  );
}

/* ---------------- Notifiche ---------------- */
export function Notifiche() {
  const [p, setP] = useState(() => {
    try {
      return { push: true, email: true, match: true, booking: true, promo: false, ...JSON.parse(localStorage.getItem("lg_notif") || "{}") };
    } catch {
      return { push: true, email: true, match: true, booking: true, promo: false };
    }
  });
  const set = (k: string) => {
    const n = { ...p, [k]: !p[k as keyof typeof p] };
    setP(n);
    try {
      localStorage.setItem("lg_notif", JSON.stringify(n));
    } catch {}
  };
  return (
    <Sub title="Notifiche">
      <div className="panel tight">
        <ToggleRow icon="bell" label="Notifiche push" on={p.push} onToggle={() => set("push")} />
        <ToggleRow icon="mail" label="Email" on={p.email} onToggle={() => set("email")} />
        <ToggleRow icon="heart" label="Nuovi match" on={p.match} onToggle={() => set("match")} />
        <ToggleRow icon="calendar" label="Prenotazioni e promemoria" on={p.booking} onToggle={() => set("booking")} />
        <ToggleRow icon="tagPrice" label="Offerte e promozioni" on={p.promo} onToggle={() => set("promo")} />
      </div>
    </Sub>
  );
}

/* ---------------- Privacy ---------------- */
export function Privacy() {
  const [p, setP] = useState(() => {
    try {
      return { publicProfile: true, showLocation: true, showActivity: false, ...JSON.parse(localStorage.getItem("lg_privacy") || "{}") };
    } catch {
      return { publicProfile: true, showLocation: true, showActivity: false };
    }
  });
  const set = (k: string) => {
    const n = { ...p, [k]: !p[k as keyof typeof p] };
    setP(n);
    try {
      localStorage.setItem("lg_privacy", JSON.stringify(n));
    } catch {}
  };
  return (
    <Sub title="Privacy e Policy">
      <div className="panel tight">
        <ToggleRow icon="person" label="Profilo pubblico" on={p.publicProfile} onToggle={() => set("publicProfile")} />
        <ToggleRow icon="pin" label="Mostra la mia città" on={p.showLocation} onToggle={() => set("showLocation")} />
        <ToggleRow icon="pie" label="Condividi attività" on={p.showActivity} onToggle={() => set("showActivity")} />
      </div>
      <p className="sub" style={{ padding: "0 4px" }}>
        I tuoi dati sono trattati secondo l'Informativa sulla Privacy. Puoi richiedere l'esportazione o la cancellazione
        dell'account contattando il supporto.
      </p>
    </Sub>
  );
}

/* ---------------- Accessibilità ---------------- */
export function Accessibilita() {
  const [p, setP] = useState<Prefs>(() => loadPrefs());
  const set = (k: keyof Prefs) => {
    const n = { ...p, [k]: !p[k] };
    setP(n);
    savePrefs(n);
  };
  return (
    <Sub title="Accessibilità">
      <div className="panel tight">
        <ToggleRow icon="accessibility" label="Testo più grande" on={p.textLarge} onToggle={() => set("textLarge")} />
        <ToggleRow icon="sparkles" label="Riduci movimento" on={p.reduceMotion} onToggle={() => set("reduceMotion")} />
        <ToggleRow icon="image" label="Alto contrasto" on={p.highContrast} onToggle={() => set("highContrast")} />
      </div>
      <p className="sub" style={{ padding: "0 4px" }}>Le preferenze vengono salvate su questo dispositivo.</p>
    </Sub>
  );
}

/* ---------------- Metodo di pagamento ---------------- */
export function Payments() {
  return (
    <Sub title="Metodo di pagamento">
      <div className="empty">
        <div className="ei">
          <Icon name="card" size={28} />
        </div>
        Nessun metodo di pagamento salvato.
      </div>
      <button className="btn btn-primary" disabled>
        Aggiungi carta
      </button>
      <p className="sub center" style={{ marginTop: 14 }}>
        I pagamenti saranno gestiti in modo sicuro tramite Stripe. L'integrazione sarà attivata a breve.
      </p>
    </Sub>
  );
}

/* ---------------- Contattaci ---------------- */
export function Contatti() {
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Sub title="Contattaci">
      {sent ? (
        <div className="empty fade-up">
          <div className="ei" style={{ color: "var(--green)" }}>
            <Icon name="check" size={30} color="var(--green)" />
          </div>
          Grazie! Ti risponderemo via email a {user?.email}.
        </div>
      ) : (
        <>
          <p className="sub" style={{ padding: "0 4px 8px" }}>Hai bisogno di aiuto? Scrivici, ti rispondiamo entro 24 ore.</p>
          <div className="field" style={{ height: "auto", padding: 14, alignItems: "flex-start" }}>
            <Icon name="edit" size={20} className="icon" style={{ marginTop: 2 }} />
            <textarea
              placeholder="Come possiamo aiutarti?"
              rows={6}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              style={{ flex: 1, border: "none", background: "transparent", outline: "none", resize: "none", fontFamily: "inherit" }}
            />
          </div>
          <div className="grow" />
          <button className="btn btn-primary" disabled={!msg.trim()} onClick={() => setSent(true)} style={{ marginBottom: 20 }}>
            Invia messaggio
          </button>
        </>
      )}
    </Sub>
  );
}

/* ---------------- Insights e Analytics ---------------- */
export function Insights() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    api.get<{ bookings: Booking[] }>("/bookings").then(({ bookings }) => setBookings(bookings));
  }, []);
  const spent = bookings.reduce((s, b) => s + b.experience.priceCents * b.people, 0) / 100;
  const stat = (v: string | number, l: string) => (
    <div className="panel tight" style={{ flex: 1, textAlign: "center", margin: 0 }}>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{v}</div>
      <div className="sub" style={{ marginTop: 2 }}>{l}</div>
    </div>
  );
  return (
    <Sub title="Insights e Analytics">
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {stat(bookings.length, "Prenotazioni")}
        {stat(`€${spent.toFixed(0)}`, "Speso")}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {stat(user?.localsMet ?? 0, "Local incontrati")}
        {stat(user?.countriesVisited ?? 0, "Paesi")}
      </div>
      <p className="sub center" style={{ marginTop: 18 }}>Statistiche aggiornate in tempo reale dalla tua attività.</p>
    </Sub>
  );
}

/* ---------------- Promozioni ---------------- */
export function Promozioni() {
  const { user } = useAuth();
  const code = `LOCAL-${(user?.id ?? "GLOBAL").slice(-5).toUpperCase()}`;
  const [copied, setCopied] = useState(false);
  return (
    <Sub title="Promozioni">
      <div className="pp-banner" style={{ background: "linear-gradient(135deg,#0080ff,#0060d6)" }}>
        Invita un amico, ricevete entrambi <b>10€</b> sulla prima esperienza!
      </div>
      <div className="panel tight">
        <div className="sub">Il tuo codice invito</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1 }}>{code}</div>
          <button
            className="btn btn-soft btn-sm"
            style={{ width: "auto", padding: "0 18px" }}
            onClick={() => {
              navigator.clipboard?.writeText(code).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "Copiato ✓" : "Copia"}
          </button>
        </div>
      </div>
    </Sub>
  );
}
