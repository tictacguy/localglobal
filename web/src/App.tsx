import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import { Login } from "./screens/Login";
import { Register } from "./screens/Register";
import { Onboarding } from "./screens/Onboarding";
import { Welcome } from "./screens/Welcome";
import { Home } from "./screens/Home";
import { Explore } from "./screens/Explore";
import { ExperienceDetail } from "./screens/ExperienceDetail";
import { Booking } from "./screens/Booking";
import { Messages } from "./screens/Messages";
import { Chat } from "./screens/Chat";
import { Profile } from "./screens/Profile";
import { PersonalData } from "./screens/PersonalData";
import { LocalProfile } from "./screens/LocalProfile";
import { Passport } from "./screens/Passport";
import type { ReactNode } from "react";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="screen" style={{ justifyContent: "center" }}><div className="loading">Caricamento…</div></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  // Force onboarding completion before entering the app.
  if ((user.onboardingStep ?? 0) < 4 && !loc.pathname.startsWith("/onboarding")) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

export function App() {
  const { user, loading } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user && !loading ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/registrati" element={user && !loading ? <Navigate to="/onboarding" replace /> : <Register />} />
      <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
      <Route path="/welcome" element={<Protected><Welcome /></Protected>} />
      <Route path="/home" element={<Protected><Home /></Protected>} />
      <Route path="/esplora" element={<Protected><Explore /></Protected>} />
      <Route path="/esperienza/:id" element={<Protected><ExperienceDetail /></Protected>} />
      <Route path="/esperienza/:id/prenota" element={<Protected><Booking /></Protected>} />
      <Route path="/messaggi" element={<Protected><Messages /></Protected>} />
      <Route path="/chat/:id" element={<Protected><Chat /></Protected>} />
      <Route path="/profilo" element={<Protected><Profile /></Protected>} />
      <Route path="/profilo/dati" element={<Protected><PersonalData /></Protected>} />
      <Route path="/local/:id" element={<Protected><LocalProfile /></Protected>} />
      <Route path="/passaporto" element={<Protected><Passport /></Protected>} />
      <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} />
    </Routes>
  );
}
