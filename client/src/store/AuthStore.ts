import axios, { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { IUser } from "../model/user/user";
import { UserRole } from "../types/user";
import { v4 as uuidv4 } from "uuid";
import registerPushNotifications from "../worker/registerPushNotifications";
import { BASE_URL } from "../main";

export interface ISession {
  user: IUser;
  access_token: string;
}

class AuthStore {
  constructor(
    public session: ISession | null = {} as ISession,
    public isAuth: boolean = false,
    public isLoading: boolean = false
  ) {
    makeAutoObservable(this);
  }

  setIsAuth(isAuth: boolean) {
    this.isAuth = isAuth;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setSession(session: ISession | null) {
    this.session = session;
  }

  getSession() {
    return this.session;
  }

  async signIn(username: string, password: string) {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });
      localStorage.setItem("authToken", data.access_token);
      toast.info("Пользователь успешно авторизован", {
        toastId: "USER_AUTH_SUCCESS",
      });
      this.setSession(data);
      this.setIsAuth(true);
      return true;
    } catch (error) {
      toast.error("Пользователь не найден", {
        toastId: uuidv4(),
      });
      return false;
    }
  }

  async signUp(username: string, password: string, role: UserRole) {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/signup`, {
        username,
        password,
        role,
      });
      localStorage.setItem("authToken", data.access_token);
      toast.success("Пользователь успешно зарегистрирован", {
        toastId: "USER_AUTH_SUCCESS",
      });
      this.setSession(data);
      this.setIsAuth(true);
      return true;
    } catch (error) {
      toast.error("Ошибка при регистрации пользователя", {
        toastId: uuidv4(),
      });
      return false;
    }
  }

  async checkSession() {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get<ISession>(
        `${BASE_URL}/auth/session/${token}`
      );
      toast.info(`Пользователь успешно авторизован`, {
        toastId: "USER_AUTH_SUCCESS",
      });
      this.setSession(data);
      this.setIsAuth(true);
      console.log("register times");
      await registerPushNotifications(data.user.id);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        localStorage.removeItem("authToken");
        toast.info(`Сессия пользователя истекла`, {
          toastId: uuidv4(),
        });
        this.setSession(null);
        this.setIsAuth(false);
      }

      return false;
    }
  }
}

export default AuthStore;
