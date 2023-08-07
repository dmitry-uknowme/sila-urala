import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import registerPushNotifications from "../../worker/registerPushNotifications";

const MainTemplate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRegisteredWorker, setIsRegisteredWorker] = useState(false);
  const { auth } = useContext(AuthContext);

  //   useEffect(() => {
  //     if (localStorage.getItem("authToken") && location.pathname === "/login") {
  //       //   navigate("/");
  //     } else if (!localStorage.getItem("authToken")) {
  //       navigate("/login");
  //     }
  //   }, [location.pathname]);

  const checkSession = async () => {
    const result = await auth.checkSession();
    if (result) {
      // const userId = result?.user?.id
    } else {
      navigate("/login");
    }
  };

  const initServiceWorker = async () => {
    if (!isRegisteredWorker) {
      await navigator.serviceWorker.register("./worker.js");
    }
    setIsRegisteredWorker(true);
  };

  useEffect(() => {
    initServiceWorker();
  }, [isRegisteredWorker]);

  useEffect(() => {
    checkSession();
  }, []);

  // useEffect(() => {
  //   const userId = auth?.session?.user?.id;
  //   if (!userId || isRegisteredWorker) return;
  //   console.log("driver user id", auth.session.user);
  //   registerPushNotifications(userId);
  // }, [auth?.session?.user, isRegisteredWorker]);

  return <div>{children}</div>;
};

export default observer(MainTemplate);
