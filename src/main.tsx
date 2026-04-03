import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

// Register Service Worker for PWA
registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("App ready for offline use");
  },
});

createRoot(document.getElementById("root")!).render(<App />);
