import type { CSSProperties } from "react";

type P = { size?: number; color?: string; strokeWidth?: number; style?: CSSProperties; fill?: string; className?: string };

const base = (size: number): CSSProperties => ({ width: size, height: size, display: "block", flex: "none" });

export function Icon({
  name,
  size = 22,
  color = "currentColor",
  strokeWidth = 1.9,
  style,
  fill = "none",
  className,
}: P & { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    className,
    style: { ...base(size), ...style },
    fill,
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, JSX.Element> = {
    pin: (
      <>
        <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.6" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2.2" />
        <circle cx="8" cy="17" r="2.2" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
    person: (
      <>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
        <path d="M16 6.2A3 3 0 0 1 18 12M18.5 14c2 .6 3.5 2 3.5 4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.2-3.2" />
      </>
    ),
    heart: <path d="M12 20s-7-4.6-7-9.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 7 3.4c0 5-7 9.6-7 9.6Z" />,
    star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L4.2 9.7l5.9-.9L12 3.5Z" />,
    home: (
      <>
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6 10v9h12v-9" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
        <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5A2.5 2.5 0 0 1 4 20.5Z" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17" />
      </>
    ),
    chat: <path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3.5V7a2 2 0 0 1 2-2Z" />,
    messages: (
      <>
        <path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-8l-4 3v-3H5A1.5 1.5 0 0 1 3.5 14V7A1.5 1.5 0 0 1 5 5.5Z" />
        <circle cx="8.5" cy="10.5" r="1.05" fill="currentColor" stroke="none" />
        <circle cx="12" cy="10.5" r="1.05" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="10.5" r="1.05" fill="currentColor" stroke="none" />
      </>
    ),
    mail: (
      <>
        <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
        <path d="m4 8 8 5 8-5" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      </>
    ),
    lockOpen: (
      <>
        <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
        <path d="M8 10.5V8a4 4 0 0 1 7.5-2" />
      </>
    ),
    bell: (
      <>
        <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15Z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M20 7.5l-2.1 1.2M6.3 15.3 4.2 16.5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6Z" />
        <path d="m9.5 12 1.8 1.8 3.4-3.6" />
      </>
    ),
    pie: (
      <>
        <path d="M12 3v9h9a9 9 0 1 1-9-9Z" />
        <path d="M14 3.3A9 9 0 0 1 20.7 10H14Z" />
      </>
    ),
    tagPrice: (
      <>
        <path d="M4 12.5 11 5.5 20 5.5 20 14.5 13 21.5Z" />
        <circle cx="16" cy="9.5" r="1.3" fill="currentColor" stroke="none" />
      </>
    ),
    card: (
      <>
        <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
        <path d="M3.5 10h17" />
      </>
    ),
    chevRight: <path d="m9 5 7 7-7 7" />,
    chevDown: <path d="m5 9 7 7 7-7" />,
    chevUp: <path d="m5 15 7-7 7 7" />,
    back: <path d="m15 5-7 7 7 7" />,
    x: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12.5 4.5 4.5L19 7" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    phone: <path d="M5 4h3l2 5-2 1.5a12 12 0 0 0 5.5 5.5L17 19l5 2v3" transform="translate(-1 -1) scale(0.95)" />,
    upload: (
      <>
        <path d="M12 16V5" />
        <path d="m8 9 4-4 4 4" />
        <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
      </>
    ),
    edit: (
      <>
        <path d="M4 20h4L19 9l-4-4L4 16Z" />
        <path d="m14 6 4 4" />
      </>
    ),
    swap: (
      <>
        <path d="M4 8h13l-3-3M20 16H7l3 3" />
      </>
    ),
    send: <path d="M4 12 20 4l-6 16-3-7Z" />,
    paperclip: <path d="M20 11.5 12 19a4 4 0 0 1-6-5.5l7-7a2.7 2.7 0 0 1 4 3.7l-7 7a1.4 1.4 0 0 1-2-2l6.5-6.5" />,
    dots: (
      <>
        <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
    camera: (
      <>
        <path d="M4 8h3l1.5-2h7L17 8h3a0 0 0 0 1 0 0v10H4Z" />
        <circle cx="12" cy="12.5" r="3.2" />
      </>
    ),
    login: (
      <>
        <path d="M10 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
        <path d="M4 12h9m0 0-3-3m3 3-3 3" />
      </>
    ),
    briefcase: (
      <>
        <rect x="4" y="8" width="16" height="11" rx="2.5" />
        <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8M4 13h16" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" fill="currentColor" stroke="none" />
      </>
    ),
    sparkles: (
      <>
        <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z" />
        <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z" />
      </>
    ),
    trophy: (
      <>
        <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M12 13v4" />
      </>
    ),
    plusCircle: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
    trash: (
      <>
        <path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" />
      </>
    ),
    image: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="3" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M5 17l4.5-4.5 4 4 2.5-2.5L20 17" />
      </>
    ),
    globeLine: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17" />
      </>
    ),
    accessibility: (
      <>
        <circle cx="12" cy="4.5" r="1.6" fill="currentColor" stroke="none" />
        <path d="M4.5 8h15M12 8v6M12 14l-3 5.5M12 14l3 5.5" />
      </>
    ),
    heartFill: <path d="M12 20s-7-4.6-7-9.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 7 3.4c0 5-7 9.6-7 9.6Z" fill="currentColor" stroke="none" />,
  };
  return (
    <svg {...common} xmlns="http://www.w3.org/2000/svg">
      {paths[name] ?? null}
    </svg>
  );
}

export function Verified({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={base(size)} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.3l2.3 1.7 2.8-.3 1.1 2.6 2.4 1.5-.6 2.8.9 2.7-2.1 1.9.1 2.9-2.8.6-1.5 2.4-2.8-.6L12 22l-2.3-1.2-2.8.6-1.5-2.4-2.8-.6.1-2.9L.6 13.2l.9-2.7-.6-2.8L3.3 6.3l1.1-2.6 2.8.3L9.5 2.3H12Z"
        fill="#2f8fff"
      />
      <path d="m8.5 12 2.3 2.3 4.5-4.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={size} color={i <= full ? "#f5c84c" : "#e3e3e3"} fill={i <= full ? "#f5c84c" : "#e3e3e3"} strokeWidth={0} />
      ))}
    </span>
  );
}
