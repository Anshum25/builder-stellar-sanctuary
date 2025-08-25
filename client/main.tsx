import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

// Create root only once
let root = (window as any).__APP_ROOT__;
if (!root) {
  root = createRoot(container);
  (window as any).__APP_ROOT__ = root;
}

root.render(<App />);
