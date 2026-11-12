import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { api } from "../api";
import { Icon } from "../Icon";
import { MapIllustration, DocIllustration } from "../illustrations";
import { INTEREST_CATEGORIES } from "../interests";
import type { User } from "../types";

export function Onboarding() {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  // form state
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [gender, setGender] = useState(user?.gender ?? "");
  const [birthDate, setBirthDate] = useState(user?.birthDate ? user.birthDate.slice(0, 10) : "");
  const [origin, setOrigin] = useState(user?.origin ?? "");
  const [cityResidence, setCityResidence] = useState(user?.cityResidence ?? "");
  const [languages, setLanguages] = useState((user?.languages ?? []).join(", "));
  const [profession, setProfession] = useState(user?.profession ?? "");
  const [isLocal, setIsLocal] = useState(user?.isLocalEnabled ?? false);
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [docUploaded, setDocUploaded] = useState(false);

  async function save(data: Record<string, unknown>) {
    setBusy(true);
    try {
      const { user: u } = await api.patch<{ user: User }>("/auth/onboarding", data);
      setUser(u);
      return u;
    } finally {
      setBusy(false);
    }
  }

  function toggleInterest(key: string) {
    setInterests((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function next() {
    if (step === 0) {
      await save({
        phone,
        gender,
        birthDate: birthDate ? new Date(birthDate).toISOString() : "",
        origin,
        step: 1,
      });
      setStep(1);
    } else if (step === 1) {
      await save({
        cityResidence,
        languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
        profession,
        isLocalEnabled: isLocal,
        step: 2,
      });
      setStep(2);
    } else if (step === 2) {
      await save({ interests, step: 3 });
      setStep(3);
    } else {
      await save({ documentUploaded: docUploaded, step: 4 });
      nav("/welcome", { replace: true });
    }
  }

  async function skipDoc() {
    await save({ step: 4 });
    nav("/welcome", { replace: true });
  }

  return (
    <div className="screen">
      <div className="topbar">
        {step > 0 ? (
          <button className="icon-btn plain" onClick={() => setStep((s) => s - 1)}>
            <Icon name="back" />
          </button>
        ) : (
          <div style={{ width: 44 }} />
        )}
        <div className="progress">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`seg ${i <= step ? "on" : ""}`} />
          ))}
          <span className="count">{step + 1} di 4</span>
        </div>
      </div>

      {step === 0 && (
        <>
          <MapIllustration />
          <h1 className="title-center" style={{ marginTop: 10 }}>
            Completa il tuo profilo
          </h1>
          <p className="sub center">Ci aiuterai a sapere qualcosa in più su di te!</p>
          <div className="stack" style={{ marginTop: 20 }}>
            <div className="field">
              <Icon name="phone" size={20} className="icon" />
              <input placeholder="Cellulare" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="field select">
              <Icon name="people" size={20} className="icon" />
              <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ color: gender ? "var(--black)" : "var(--gray-2)" }}>
                <option value="">Sesso</option>
                <option>Uomo</option>
                <option>Donna</option>
                <option>Altro</option>
                <option>Preferisco non dirlo</option>
              </select>
              <Icon name="chevDown" size={18} className="trailing" />
            </div>
            <div className="field">
              <Icon name="calendar" size={20} className="icon" />
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={{ color: birthDate ? "var(--black)" : "var(--gray-2)" }} />
            </div>
            <div className="field">
              <Icon name="pin" size={20} className="icon" />
              <input placeholder="Provenienza" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </div>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <MapIllustration />
          <h1 className="title-center" style={{ marginTop: 10 }}>
            Dove vivi e cosa fai
          </h1>
          <p className="sub center">Queste info aiutano a trovare i match giusti.</p>
          <div className="stack" style={{ marginTop: 20 }}>
            <div className="field">
              <Icon name="pin" size={20} className="icon" />
              <input placeholder="Città di residenza" value={cityResidence} onChange={(e) => setCityResidence(e.target.value)} />
            </div>
            <div className="field">
              <Icon name="globe" size={20} className="icon" />
              <input placeholder="Lingue parlate (es. Italiano, Inglese)" value={languages} onChange={(e) => setLanguages(e.target.value)} />
            </div>
            <div className="field">
              <Icon name="briefcase" size={20} className="icon" />
              <input placeholder="Professione" value={profession} onChange={(e) => setProfession(e.target.value)} />
            </div>
            <label className="row-item" style={{ padding: "6px 2px" }}>
              <Icon name="globe" size={20} className="ri-icon" />
              <span className="ri-label" style={{ color: "var(--black)" }}>Voglio essere anche un Local</span>
              <span className={`toggle ${isLocal ? "on" : ""}`} onClick={() => setIsLocal((v) => !v)}>
                <span className="knob" />
              </span>
            </label>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="title-center" style={{ marginTop: 14 }}>
            I tuoi interessi
          </h1>
          <p className="sub center">Scegli ciò che ami: useremo questo per i tuoi match.</p>
          <div style={{ marginTop: 16 }}>
            {INTEREST_CATEGORIES.map((cat) => (
              <div key={cat.key} style={{ marginBottom: 18 }}>
                <div className="section-title">{cat.label}</div>
                <div className="chips">
                  {cat.items.map((it) => (
                    <button
                      key={it.key}
                      className={`chip-select ${interests.includes(it.key) ? "on" : ""}`}
                      onClick={() => toggleInterest(it.key)}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="grow" style={{ minHeight: 30 }} />
          <DocIllustration />
          <h1 className="title-center" style={{ marginTop: 10 }}>
            Carica un documento
          </h1>
          <p className="sub center">Aiutaci a rendere l'app più sicura provvedendo un documento leggibile!</p>
          <div style={{ marginTop: 22 }}>
            <label className="btn btn-soft" style={{ cursor: "pointer" }}>
              <Icon name="upload" size={20} color="var(--blue)" /> {docUploaded ? "File aggiunto ✓" : "Aggiungi file"}
              <input type="file" accept="image/*,.pdf" hidden onChange={(e) => setDocUploaded(!!e.target.files?.length)} />
            </label>
          </div>
          <div className="grow" />
          <button className="btn-ghost" onClick={skipDoc} style={{ marginBottom: 6 }}>
            Più tardi
          </button>
        </>
      )}

      <div className="grow" />
      <button className="btn btn-primary" disabled={busy} onClick={next} style={{ marginBottom: 20, marginTop: 14 }}>
        {step === 3 ? "Invia per la revisione" : (
          <>
            Continua <Icon name="chevRight" size={18} color="#fff" />
          </>
        )}
      </button>
    </div>
  );
}
