import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import { Schedule } from "./screens/Schedule";
import { Settings } from "./screens/Settings";
import { Notifiche, Privacy, Accessibilita, Payments, Contatti, Insights, Promozioni } from "./screens/SettingsSub";
import { CreateExperience } from "./screens/CreateExperience";
import { MyExperiences } from "./screens/MyExperiences";
import type { ReactNode } from "react";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading)
    return (
      <div className="screen" style={{ justifyContent: "center" }}>
        <div className="loading">Caricamento…</div>
      </div>
    );
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if ((user.onboardingStep ?? 0) < 4 && !loc.pathname.startsWith("/onboarding")) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

function Fade({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function App() {
  const { user, loading } = useAuth();
  const loc = useLocation();
  const P = (node: ReactNode) => (
    <Protected>
      <Fade>{node}</Fade>
    </Protected>
  );
  return (
    <AnimatePresence mode="wait">
      <Routes location={loc} key={loc.pathname}>
        <Route path="/login" element={user && !loading ? <Navigate to="/home" replace /> : <Fade><Login /></Fade>} />
        <Route path="/registrati" element={user && !loading ? <Navigate to="/onboarding" replace /> : <Fade><Register /></Fade>} />
        <Route path="/onboarding" element={P(<Onboarding />)} />
        <Route path="/welcome" element={P(<Welcome />)} />
        <Route path="/home" element={P(<Home />)} />
        <Route path="/esplora" element={P(<Explore />)} />
        <Route path="/schedule" element={P(<Schedule />)} />
        <Route path="/esperienza/:id" element={P(<ExperienceDetail />)} />
        <Route path="/esperienza/:id/prenota" element={P(<Booking />)} />
        <Route path="/messaggi" element={P(<Messages />)} />
        <Route path="/chat/:id" element={P(<Chat />)} />
        <Route path="/profilo" element={P(<Profile />)} />
        <Route path="/profilo/dati" element={P(<PersonalData />)} />
        <Route path="/profilo/esperienze" element={P(<MyExperiences />)} />
        <Route path="/crea-esperienza" element={P(<CreateExperience />)} />
        <Route path="/local/:id" element={P(<LocalProfile />)} />
        <Route path="/passaporto" element={P(<Passport />)} />
        <Route path="/impostazioni" element={P(<Settings />)} />
        <Route path="/impostazioni/notifiche" element={P(<Notifiche />)} />
        <Route path="/impostazioni/privacy" element={P(<Privacy />)} />
        <Route path="/impostazioni/accessibilita" element={P(<Accessibilita />)} />
        <Route path="/impostazioni/pagamenti" element={P(<Payments />)} />
        <Route path="/impostazioni/contatti" element={P(<Contatti />)} />
        <Route path="/impostazioni/insights" element={P(<Insights />)} />
        <Route path="/impostazioni/promozioni" element={P(<Promozioni />)} />
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} />
      </Routes>
    </AnimatePresence>
  );
}
