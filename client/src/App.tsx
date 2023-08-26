import Router from "./Router";
import "./App.css";
import axios, { AxiosError } from "axios";
import AuthStore from "./store/AuthStore";
import { createContext, useEffect } from "react";
import registerPushNotifications from "./worker/registerPushNotifications";
import { toast } from "react-toastify";

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
      localStorage.removeItem("authToken");
    }

    if (error?.response?.status === 400) {
      const errors = error?.response.data?.message as string[];
      if (errors?.length) {
        const errorsMessage = errors.length > 1 ? errors.join(".") : errors[0];
        toast.error(`Ошибка. ${errorsMessage}`);
      }
    }
    if (error?.response?.status === 500) {
      toast.error(`Возникла непредвиденная ошибка на сервере`);
    }

    throw new AxiosError({ ...error, _isHandled: true });
    // return { ...error, _isHandled: true };
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
