import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";
import { AuthProvider } from "./auth";
import { App } from "./App";
import { VideoBackground } from "./VideoBackground";
import { applyPrefs, loadPrefs } from "./prefs";

applyPrefs(loadPrefs());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VideoBackground />
        <div className="app">
          <App />
        </div>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
