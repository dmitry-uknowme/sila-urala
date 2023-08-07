import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AuthContext } from "../../App";
import CarModelTable from "../../model/car/CarModelTable";
import RouteModelTable from "../../model/route/RouteModelTable";
import SpotModelTable from "../../model/spot/SpotModelTable";
import UserModelTable from "../../model/user/UserModelTable";
import Navbar from "../../navbar/Navbar";
import AuthLogin from "../auth/AuthLogin";
import MainTemplate from "../template/MainTemplate";

const Admin = () => {
  const { auth } = useContext(AuthContext);
  console.log("usss", JSON.stringify(auth.user));
  return (
    <MainTemplate>
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
    </MainTemplate>
  );
};

export default observer(Admin);
