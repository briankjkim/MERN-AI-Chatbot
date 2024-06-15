import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { inject } from "@vercel/analytics";
inject();

const getURL = () => {
  let SERVER_URL;
  const mode = import.meta.env.VITE_APP_RUNTIME_MODE;
  mode === "dev"
    ? (SERVER_URL = import.meta.env.VITE_DEV_URL)
    : (SERVER_URL = import.meta.env.VITE_PROD_URL);
  // console.log("mode, url", mode, import.meta.env.VITE_PROD_URL);
  return SERVER_URL;
};

// console.log("SERVER URL", getURL());
axios.defaults.baseURL = getURL();
axios.defaults.withCredentials = true;

const theme = createTheme({
  typography: {
    fontFamily: "Roboto Slab, serif",
    allVariants: { color: "white" },
  },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Toaster position="top-center" />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
