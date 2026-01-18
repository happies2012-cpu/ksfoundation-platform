import React from "react";
console.log("🚀 KSF KERNEL BOOTING...");
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: 'red', color: 'white' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error: any) {
  console.error("CRITICAL RENDER ERROR:", error);
  document.body.innerHTML = `<div style="color:white; background:red; padding:20px; font-family:monospace;">
    <h1>Application Failed to Start</h1>
    <pre>${error?.stack || error.message || String(error)}</pre>
  </div>`;
}