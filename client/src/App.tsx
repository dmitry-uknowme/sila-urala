import { useEffect } from "react";
import Navbar from "./navbar/Navbar";
import CarModelTable from "./model/car/CarModelTable";
import SpotModelTable from "./model/spot/SpotModelTable";
import UserModelTable from "./model/user/UserModelTable";
import RouteModelTable from "./model/route/RouteModelTable";
import registerPushNotifications from "./worker/registerPushNotifications";
import "./App.css";

const App = () => {
  useEffect(() => {
    registerPushNotifications();
  }, []);
  return (
    <div className="app">
      <Navbar />
      <div className="my-3">
        <RouteModelTable />
      </div>
      <div className="my-3">
        <UserModelTable />
      </div>
      <div className="my-3">
        <SpotModelTable />
      </div>
      <div className="my-3">
        <CarModelTable />
      </div>
    </div>
  );
};

export default App;
