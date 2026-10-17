import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./lib/firebase"; // Initializes Firebase and App Check before anything else runs.
import { App } from "./App";
import { AuthProvider } from "./features/auth/AuthProvider";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root element");

createRoot(rootEl).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
