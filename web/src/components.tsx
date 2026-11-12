import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon, Stars, Verified } from "./Icon";
import type { Experience, User } from "./types";

// The iPhone-style status bar was removed. This is just a small safe-area spacer
// so content doesn't hug the top edge (respects the notch on real devices).
export function StatusBar() {
  return <div className="safe-top" />;
}

export function avatarSrc(u?: Partial<User> | null): string {
  if (u?.avatarUrl) return u.avatarUrl;
  const name = encodeURIComponent(`${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() || "LG");
  return `https://ui-avatars.com/api/?name=${name}&background=F7F8F8&color=1B1B1B&bold=true`;
}

type Tab = "home" | "schedule" | "esplora" | "messaggi" | "profilo" | "passaporto";

export function BottomNav({ active }: { active: Tab }) {
  const nav = useNavigate();
  return (
    <nav className="bottomnav">
      <button className={`tab ${active === "home" ? "active" : ""}`} onClick={() => nav("/home")} aria-label="Home">
        <Icon name="home" size={23} fill={active === "home" ? "currentColor" : "none"} />
        <span className="tab-dot" />
      </button>
      <button className={`tab ${active === "schedule" ? "active" : ""}`} onClick={() => nav("/schedule")} aria-label="Schedule">
        <Icon name="calendar" size={23} />
        <span className="tab-dot" />
      </button>
      <button className={`fab ${active === "esplora" ? "active" : ""}`} onClick={() => nav("/esplora")} aria-label="Match">
        <Icon name="compass" size={27} color="#fff" />
      </button>
      <button className={`tab ${active === "messaggi" ? "active" : ""}`} onClick={() => nav("/messaggi")} aria-label="Messaggi">
        <Icon name="chat" size={23} />
        <span className="tab-dot" />
      </button>
      <button className={`tab ${active === "profilo" ? "active" : ""}`} onClick={() => nav("/profilo")} aria-label="Profilo">
        <Icon name="person" size={23} />
        <span className="tab-dot" />
      </button>
    </nav>
  );
}

export function TopBar({ title, right, onBack }: { title?: string; right?: ReactNode; onBack?: () => void }) {
  const nav = useNavigate();
  return (
    <div className="topbar">
      {onBack !== undefined ? (
        <button className="icon-btn plain" onClick={onBack ?? (() => nav(-1))}>
          <Icon name="back" />
        </button>
      ) : null}
      {title ? <div className="title">{title}</div> : null}
      <div className="spacer" />
      {right}
    </div>
  );
}

export function dateLabel(iso: string): string {
  const d = new Date(iso);
  const days = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${days[d.getDay()]} ${dd}/${mm}/${d.getFullYear()} - ${hh}.${mi}`;
}

export function ExperienceCard({
  exp,
  liked,
  onLike,
}: {
  exp: Experience;
  liked?: boolean;
  onLike?: () => void;
}) {
  const nav = useNavigate();
  const shownTags = exp.tagLabels.slice(0, 2);
  const extra = exp.tagLabels.length - shownTags.length;
  return (
    <div className="exp-card" onClick={() => nav(`/esperienza/${exp.id}`)}>
      <div className="photo">
        <img src={exp.imageUrl} alt={exp.title} loading="lazy" />
        {exp.lovedByTourists ? <span className="chip">Amato dai tourists</span> : null}
        <button
          className={`heart ${liked ? "on" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
        >
          <Icon name="heart" size={20} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="body">
        <h3>{exp.title}</h3>
        <div className="meta">
          <Icon name="pin" size={15} /> {exp.location}
        </div>
        <div className="meta">
          <Icon name="calendar" size={15} /> {dateLabel(exp.startAt)}
        </div>
        <div className="exp-row">
          <div className="tags">
            {shownTags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
            {extra > 0 ? <span className="tag more">+{extra}</span> : null}
          </div>
          {exp.host ? (
            <div className="host">
              <img className="avatar" src={avatarSrc(exp.host)} alt={exp.host.firstName} />
              <span className="name">
                {exp.host.firstName} {exp.host.verified ? <Verified size={15} /> : null}
              </span>
              <Stars value={exp.host.rating} />
              <span className="reviews">{exp.host.reviewsCount.toLocaleString("it-IT")} recensioni</span>
            </div>
          ) : null}
        </div>
        <div className="prenota-wrap">
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              nav(`/esperienza/${exp.id}/prenota`);
            }}
          >
            Prenota
          </button>
        </div>
      </div>
    </div>
  );
}
