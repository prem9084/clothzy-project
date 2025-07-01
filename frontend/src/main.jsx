import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./Conetxt/CartContext.jsx";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./Conetxt/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <AppProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  </AppProvider>
);
