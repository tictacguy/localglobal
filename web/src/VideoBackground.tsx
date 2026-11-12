import { useEffect, useRef, useState } from "react";

// Emotional travel backdrop shown behind the phone frame on desktop only.
// Cross-fades between downloaded Pexels clips. Mobile hides it via CSS.
const CLIPS = [
  { src: "/videos/sky.mp4", caption: "Cieli infiniti" },
  { src: "/videos/mountains.mp4", caption: "Montagne" },
  { src: "/videos/ocean.mp4", caption: "Mari calmi" },
  { src: "/videos/city.mp4", caption: "Città che vivono" },
  { src: "/videos/nature.mp4", caption: "Natura" },
  { src: "/videos/travel.mp4", caption: "In viaggio" },
];

export function VideoBackground() {
  const [i, setI] = useState(0);
  const [available, setAvailable] = useState<boolean[]>(() => CLIPS.map(() => true));
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Only bother on wide viewports.
  const [show, setShow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 480px)");
    const upd = () => setShow(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    if (!show) return;
    const live = available.map((a, idx) => (a ? idx : -1)).filter((x) => x >= 0);
    if (live.length <= 1) return;
    const t = setInterval(() => {
      setI((cur) => {
        const pos = live.indexOf(cur);
        return live[(pos + 1) % live.length];
      });
    }, 11000);
    return () => clearInterval(t);
  }, [show, available]);

  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === i) v.play().catch(() => {});
      else v.pause();
    });
  }, [i]);

  if (!show) return null;

  return (
    <div className="video-bg" aria-hidden="true">
      {CLIPS.map((c, idx) =>
        available[idx] ? (
          <video
            key={c.src}
            ref={(el) => (videoRefs.current[idx] = el)}
            className={idx === i ? "on" : ""}
            src={c.src}
            muted
            loop
            playsInline
            preload={idx === i ? "auto" : "metadata"}
            onError={() => setAvailable((a) => a.map((v, k) => (k === idx ? false : v)))}
          />
        ) : null
      )}
      <div className="bg-caption">Local Global · vivi il mondo come un local</div>
    </div>
  );
}
