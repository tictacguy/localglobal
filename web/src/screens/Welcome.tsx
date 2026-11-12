import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { TravelIllustration } from "../illustrations";

export function Welcome() {
  const { user } = useAuth();
  const nav = useNavigate();
  return (
    <div className="screen">
      <div className="grow" />
      <TravelIllustration />
      <h1 className="title-center" style={{ marginTop: 24 }}>
        Bentornato, {user?.firstName}
      </h1>
      <p className="sub center" style={{ maxWidth: 260, margin: "8px auto 0" }}>
        Ci fa piacere rivederti! Torna ad esplorare LocalGlobal!
      </p>
      <div className="grow" />
      <button className="btn btn-primary" onClick={() => nav("/home", { replace: true })} style={{ marginBottom: 24 }}>
        Evvai!
      </button>
    </div>
  );
}
