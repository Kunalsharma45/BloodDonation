import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DashboardProvider } from "./context/DashboardContext.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <Toaster richColors position="top-right" />
        <App />
      </DashboardProvider>
    </AuthProvider>
  </StrictMode>
);
