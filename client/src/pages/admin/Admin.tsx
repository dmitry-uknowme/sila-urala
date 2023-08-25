import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AuthContext } from "../../App";
import useQueryParams from "../../hooks/useQueryParams";
import CarModelTable from "../../model/car/CarModelTable";
import RouteModelTable from "../../model/route/RouteModelTable";
import SpotModelTable from "../../model/spot/SpotModelTable";
import UserModelTable from "../../model/user/UserModelTable";
import Navbar from "../../navbar/Navbar";
import AuthLogin from "../auth/AuthSignIn";
import MainTemplate from "../template/MainTemplate";

const Admin = () => {
  const { auth } = useContext(AuthContext);
  const queryParams = useQueryParams();
  const activeNav = queryParams.get("nav") ?? null;
  console.log("paramss", activeNav);
  return (
    <MainTemplate>
      <Navbar activeNav={activeNav} />
      {activeNav === null ? (
        <>
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
        </>
      ) : activeNav === "routes" ? (
        <div className="my-3">
          <RouteModelTable />
        </div>
      ) : activeNav === "users" ? (
        <div className="my-3">
          <UserModelTable />
        </div>
      ) : activeNav === "spots" ? (
        <div className="my-3">
          <SpotModelTable />
        </div>
      ) : activeNav === "cars" ? (
        <div className="my-3">
          <CarModelTable />
        </div>
      ) : null}
    </MainTemplate>
  );
};

export default observer(Admin);
