import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./index.jsx";
import "./tailwind.css"; // Import Tailwind styles globally
import "./index.css"; // Import custom global styles

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);