import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../main";

const registerPushNotifications = async (userId: string) => {
  if (!navigator?.serviceWorker) {
    return;
  }
  // const serviceWorker = await navigator.serviceWorker.getRegistration()!;
  const serviceWorker = await navigator.serviceWorker.register("./worker.js");
  const pushManager = serviceWorker.pushManager;
  const prevSub = await pushManager.getSubscription();
  if (prevSub) {
    console.log("prev sub", prevSub);
    const { data } = await axios.post(
      `${API_URL}/push_notifications/subs/search`,
      {
        endpoint: prevSub.endpoint,
      }
    );

    if (data?.length) return;

    await prevSub.unsubscribe();
    console.log("ddddd", data);
  }

  const subData = (
    await pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        "BLAXPY1VOrG3t5Aaaw4m5YopEwKoEifizU18J36UxuF_udVbGcVA7N76_mk0R6YgF42Oy2FfGanznZzD4bfvHuU",
    })
  ).toJSON();

  const payload = {
    endpoint: subData.endpoint,
    exp_time: subData.expirationTime,
    public_key: subData?.keys?.p256dh,
    auth_token: subData?.keys?.auth,
  };

  try {
    const response = await axios.post(
      `${API_URL}/push_notifications/users/${userId}/subs`,
      payload
    );
    console.log("resss", response);
    toast.success("Пуш уведомления успешно подключены", {
      toastId: "PUSH_SUBS_SUCCESS",
    });
  } catch (error) {
    toast.error("Не удалось подключить пуш уведомления", {
      toastId: "PUSH_SUBS_SUCCESS",
    });
  }
};

export default registerPushNotifications;
