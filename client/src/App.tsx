import { useEffect } from "react";
import registerPushNotifications from "./worker/registerPushNotifications";
import "./App.css";
import Router from "./Router";

const App = () => {
  useEffect(() => {
    registerPushNotifications();
  }, []);
  return (
    <div className="app">
      <Router />
    </div>
  );
};

export default App;
