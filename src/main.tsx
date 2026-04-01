import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Check for a browser reload and reset to home for a fresh boutique start
const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
if (nav && nav.type === 'reload' && window.location.pathname !== '/') {
  window.location.replace('/');
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
