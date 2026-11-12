import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon, Stars, Verified } from "./Icon";
import type { Experience, User } from "./types";

export function StatusBar() {
  return (
    <div className="statusbar">
      <span className="time">9:41</span>
      <span className="glyphs">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="#1b1b1b">
          <rect x="0" y="7" width="3" height="5" rx="1" />
          <rect x="5" y="4.5" width="3" height="7.5" rx="1" />
          <rect x="10" y="2" width="3" height="10" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="#1b1b1b">
          <path d="M8.5 2C11.8 2 14.7 3.3 16.8 5.4l-1.4 1.4A10 10 0 0 0 8.5 4a10 10 0 0 0-6.9 2.8L.2 5.4A12 12 0 0 1 8.5 2Z" />
          <path d="M8.5 6.5c1.8 0 3.4.7 4.6 1.9l-1.5 1.5a4.4 4.4 0 0 0-6.2 0L3.9 8.4A6.4 6.4 0 0 1 8.5 6.5Z" />
          <circle cx="8.5" cy="11" r="1.1" />
        </svg>
        <svg width="26" height="13" viewBox="0 0 26 13">
          <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" fill="none" stroke="#1b1b1b" opacity="0.4" />
          <rect x="2" y="2" width="18" height="9" rx="2" fill="#1b1b1b" />
          <rect x="23" y="4" width="2" height="5" rx="1" fill="#1b1b1b" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

export function avatarSrc(u?: Partial<User> | null): string {
  if (u?.avatarUrl) return u.avatarUrl;
  const name = encodeURIComponent(`${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim() || "LG");
  return `https://ui-avatars.com/api/?name=${name}&background=F7F8F8&color=1B1B1B&bold=true`;
}

type Tab = "home" | "passaporto" | "esplora" | "messaggi" | "profilo";

export function BottomNav({ active }: { active: Tab }) {
  const nav = useNavigate();
  return (
    <nav className="bottomnav">
      <button className={`tab ${active === "home" ? "active" : ""}`} onClick={() => nav("/home")}>
        <Icon name="home" size={24} />
      </button>
      <button className={`tab ${active === "passaporto" ? "active" : ""}`} onClick={() => nav("/passaporto")}>
        <Icon name="book" size={24} />
      </button>
      <button className={`fab ${active === "esplora" ? "muted" : ""}`} onClick={() => nav("/esplora")}>
        <Icon name="globe" size={26} color="#fff" />
      </button>
      <button className={`tab ${active === "messaggi" ? "active" : ""}`} onClick={() => nav("/messaggi")}>
        <Icon name="chat" size={24} />
      </button>
      <button className={`tab ${active === "profilo" ? "active" : ""}`} onClick={() => nav("/profilo")}>
        <Icon name="person" size={24} />
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
