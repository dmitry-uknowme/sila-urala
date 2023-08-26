import React from "react";
import ReactDOM from "react-dom/client";
import { CustomProvider } from "rsuite";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import ruRU from "rsuite/locales/ru_RU";
import App from "./App";
import "./assets/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "rsuite/dist/rsuite.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { toast, ToastContainer } from "react-toastify";

const ENV = import.meta.env;
export const BASE_URL = ENV.VITE_BASE_URL;
export const API_URL = `${BASE_URL}/api`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchInterval: 10000, refetchOnWindowFocus: true },
  },
});

window.queryClient = queryClient;
window.toast = toast;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CustomProvider locale={ruRU}>
    <ToastContainer position="bottom-center" theme="colored" />
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </CustomProvider>
);
