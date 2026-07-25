import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "../GameSelect.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
