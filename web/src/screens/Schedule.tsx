import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { BottomNav, StatusBar } from "../components";
import { Icon } from "../Icon";
import type { Booking } from "../types";

const MONTHS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const DOW = ["L", "M", "M", "G", "V", "S", "D"];

function ymd(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function Schedule() {
  const nav = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());

  useEffect(() => {
    api
      .get<{ bookings: Booking[] }>("/bookings")
      .then(({ bookings }) => {
        setBookings(bookings);
        const upcoming = bookings.find((b) => new Date(b.startAt) >= new Date());
        if (upcoming) {
          const d = new Date(upcoming.startAt);
          setCursor(d);
          setSelected(d);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const byDay = useMemo(() => {
    const m = new Map<string, Booking[]>();
    for (const b of bookings) {
      const k = ymd(new Date(b.startAt));
      (m.get(k) ?? m.set(k, []).get(k)!).push(b);
    }
    return m;
  }, [bookings]);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startDow = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr: { date: Date; other: boolean }[] = [];
    for (let i = 0; i < startDow; i++) arr.push({ date: new Date(year, month, i - startDow + 1), other: true });
    for (let d = 1; d <= daysInMonth; d++) arr.push({ date: new Date(year, month, d), other: false });
    while (arr.length % 7 !== 0) arr.push({ date: new Date(year, month, daysInMonth + (arr.length % 7)), other: true });
    return arr;
  }, [cursor]);

  const today = ymd(new Date());
  const selKey = ymd(selected);
  const dayAppts = (byDay.get(selKey) ?? []).sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

  return (
    <>
      <div className="screen has-nav">
        <StatusBar />
        <div className="topbar">
          <h1 className="h1">Schedule</h1>
          <div className="spacer" />
          <button className="icon-btn" onClick={() => nav("/home")} aria-label="Nuova prenotazione">
            <Icon name="plus" size={22} />
          </button>
        </div>

        <div className="cal fade-up">
          <div className="cal-head">
            <button className="icon-btn plain" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
              <Icon name="back" size={20} />
            </button>
            <span className="m">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </span>
            <button className="icon-btn plain" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
              <Icon name="chevRight" size={20} />
            </button>
          </div>
          <div className="cal-grid">
            {DOW.map((d, idx) => (
              <div className="dow" key={idx}>
                {d}
              </div>
            ))}
            {cells.map(({ date, other }, idx) => {
              const k = ymd(date);
              const cls = ["cal-cell"];
              if (other) cls.push("other");
              if (k === today) cls.push("today");
              if (k === selKey) cls.push("selected");
              return (
                <button key={idx} className={cls.join(" ")} onClick={() => setSelected(date)}>
                  {date.getDate()}
                  {byDay.has(k) ? <span className="ev" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="section-title">
          {selected.getDate()} {MONTHS[selected.getMonth()]}
        </div>
        {loading ? (
          <div className="skeleton" style={{ height: 76 }} />
        ) : dayAppts.length === 0 ? (
          <div className="empty">
            <div className="ei">
              <Icon name="calendar" size={28} />
            </div>
            Nessun appuntamento questo giorno.
          </div>
        ) : (
          dayAppts.map((b) => {
            const d = new Date(b.startAt);
            return (
              <div className="appt fade-up" key={b.id} onClick={() => nav(`/esperienza/${b.experience.id}`)}>
                <div className="time-chip">
                  <div className="hh">
                    {String(d.getHours()).padStart(2, "0")}:{String(d.getMinutes()).padStart(2, "0")}
                  </div>
                  <div className="d">{b.people} pers.</div>
                </div>
                <img src={b.experience.imageUrl} alt="" />
                <div className="ai">
                  <div className="t">{b.experience.title}</div>
                  <div className="meta" style={{ margin: 0 }}>
                    <Icon name="pin" size={13} /> {b.experience.location}
                  </div>
                </div>
                <span className={`status ${b.status === "PENDING" ? "pending" : "confirmed"}`}>
                  {b.status === "PENDING" ? "In attesa" : "Confermato"}
                </span>
              </div>
            );
          })
        )}
      </div>
      <BottomNav active="schedule" />
    </>
  );
}
