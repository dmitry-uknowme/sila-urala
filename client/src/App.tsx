import Router from "./Router";
import "./App.css";
import axios, { AxiosError } from "axios";
import AuthStore from "./store/AuthStore";
import { createContext, useEffect } from "react";
import registerPushNotifications from "./worker/registerPushNotifications";

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) return config;
  config.headers.Authorization = `Bearer ${authToken}`;
  // console.log("config inter", config.headers.Authorization);
  return config;
});

axios.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      localStorage.removeItem("authToken");
    }
    return response;
  },
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      // console.log("errr auth", error?.response?.status);
      localStorage.removeItem("authToken");
    }
  }
);

const authStore = new AuthStore();

export const AuthContext = createContext({ auth: authStore });

const App = () => {
  return (
    <AuthContext.Provider value={{ auth: authStore }}>
      <div className="app">
        <Router />
      </div>
    </AuthContext.Provider>
  );
};

export default App;
