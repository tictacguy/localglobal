import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Icon } from "../Icon";
import { GoogleLogo, AppleLogo, FacebookLogo } from "../brand";
import { ApiError } from "../api";

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const valid = firstName && lastName && email && password.length >= 8 && accepted;

  async function submit() {
    if (!accepted) {
      setErr("Devi accettare i Termini e l'Informativa sulla Privacy");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      await register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password });
      nav("/onboarding", { replace: true });
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Errore di registrazione");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div className="progress">
          <span className="seg on" />
          <span className="seg" />
          <span className="seg" />
          <span className="seg" />
          <span className="count">1 di 4</span>
        </div>
      </div>

      <h1 className="h1" style={{ margin: "10px 0 20px" }}>
        Crea il tuo account
      </h1>

      <div className="stack">
        <div className="field">
          <Icon name="person" size={20} className="icon" />
          <input placeholder="Nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="field">
          <Icon name="person" size={20} className="icon" />
          <input placeholder="Cognome" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="field">
          <Icon name="mail" size={20} className="icon" />
          <input type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <Icon name="lock" size={20} className="icon" />
          <input
            type={show ? "text" : "password"}
            placeholder="Password (min. 8 caratteri)"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="trailing" onClick={() => setShow((s) => !s)}>
            <Icon name={show ? "lockOpen" : "lock"} size={18} />
          </button>
        </div>
      </div>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", margin: "16px 2px", fontSize: 12.5, color: "var(--gray-1)" }}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          style={{ marginTop: 2, width: 18, height: 18, accentColor: "var(--blue)" }}
        />
        <span>
          Cliccando "Registrati" confermerai di aver preso visione dei nostri <b>Termini e Condizioni</b> e{" "}
          <b>Informativa sulla Privacy</b>
        </span>
      </label>

      <div className="err">{err}</div>

      <button className="btn btn-primary" disabled={!valid || busy} onClick={submit}>
        {busy ? "Creazione…" : "Registrati"}
      </button>

      <div className="divider" style={{ marginTop: 20 }}>
        Oppure
      </div>
      <div className="social-row">
        <button className="social-btn">
          <GoogleLogo />
        </button>
        <button className="social-btn">
          <AppleLogo />
        </button>
        <button className="social-btn">
          <FacebookLogo />
        </button>
      </div>

      <div className="center" style={{ margin: "20px 0", fontSize: 14 }}>
        Hai già un account?{" "}
        <span className="link-btn" onClick={() => nav("/login")}>
          Login
        </span>
      </div>
    </div>
  );
}
