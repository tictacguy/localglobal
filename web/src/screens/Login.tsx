import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Icon } from "../Icon";
import { GoogleLogo, AppleLogo, FacebookLogo } from "../brand";
import { ApiError } from "../api";

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr("");
    setBusy(true);
    try {
      const user = await login(email.trim(), password);
      nav((user.onboardingStep ?? 0) < 4 ? "/onboarding" : "/welcome", { replace: true });
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Errore di accesso");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <div style={{ height: 56 }} />
      <h1 className="title-center" style={{ marginBottom: 36 }}>
        Bentornato
      </h1>

      <div className="stack">
        <div className="field">
          <Icon name="mail" size={20} className="icon" />
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <Icon name="lock" size={20} className="icon" />
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button className="trailing" onClick={() => setShow((s) => !s)} aria-label="Mostra password">
            <Icon name={show ? "lockOpen" : "lock"} size={18} />
          </button>
        </div>
      </div>

      <div className="center" style={{ margin: "18px 0" }}>
        <a className="muted" style={{ fontSize: 13, textDecoration: "underline" }} href="#">
          Hai dimenticato la tua password?
        </a>
      </div>

      <div className="err">{err}</div>

      <div className="grow" />

      <button className="btn btn-primary" disabled={busy || !email || !password} onClick={submit}>
        <Icon name="login" size={20} color="#fff" /> {busy ? "Accesso…" : "Login"}
      </button>

      <div className="divider" style={{ marginTop: 22 }}>
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

      <div className="center" style={{ margin: "22px 0 20px", fontSize: 14 }}>
        Non hai un account?{" "}
        <span className="link-btn" onClick={() => nav("/registrati")}>
          Registrati
        </span>
      </div>
    </div>
  );
}
