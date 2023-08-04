import axios from "axios";

const registerPushNotifications = async () => {
  const serviceWorker = await navigator.serviceWorker.register("./worker.js");
  const pushManager = serviceWorker.pushManager;
  const prevSub = await pushManager.getSubscription();
  if (prevSub) {
    console.log("prev sub", prevSub);
    return;
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
    // user_id: "500f79b2-ce58-4546-bc1d-bf8fdeda1627",
  };

  console.log("resss11", subData, payload);

  const response = await axios.post(
    "http://localhost:3000/api/push_notifications/users/0d8b3325-d2bb-4226-b870-bf13fe9e8fe0/subs",
    payload
  );
  console.log("resss", response);
};

export default registerPushNotifications;
