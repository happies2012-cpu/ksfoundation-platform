import React from "react";
console.log("🚀 KSF KERNEL BOOTING...");
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Re-enable service worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('SW registered: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("CRITICAL RENDER ERROR:", error);
  document.body.innerHTML = `< div style = "color: red; padding: 20px; font-family: monospace;" >
    <h1>Application Failed to Start</h1>
    <pre>${error instanceof Error ? error.stack : String(error)}</pre>
  </div > `;
}