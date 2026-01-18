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

// CRITICAL: Global Error Handler for Production Debugging
window.onerror = function (msg, url, line, col, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="color:red; padding:20px; font-family:monospace; font-size:16px; background:#fff; white-space:pre-wrap;">
      <h1>CRITICAL ERROR (Global)</h1>
      <p style="font-weight:bold">${msg}</p>
      <p>Location: ${url} : ${line}:${col}</p>
      <p>Stack: ${error?.stack || 'No stack trace'}</p>
    </div>`;
  }
};

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(<App />);
} catch (error: any) {
  console.error("CRITICAL RENDER ERROR:", error);
  document.body.innerHTML = `<div style="color:white; background:red; padding:20px; font-family:monospace;">
    <h1>Application Failed to Start</h1>
    <pre>${error?.stack || error.message || String(error)}</pre>
  </div>`;
}