import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Table from "./table";
import Navbar from "./navbar/Navbar";
import { UserRoleLocalized } from "./types/user";
import { RouteStatusLocalized } from "./types/route";
import CarModelTable from "./model/car/CarModelTable";
import SpotModelTable from "./model/spot/SpotModelTable";
import UserModelTable from "./model/user/UserModelTable";
import RouteModelTable from "./model/route/RouteModelTable";

const App = () => {
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
