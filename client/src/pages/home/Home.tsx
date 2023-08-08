/* eslint-disable @typescript-eslint/no-explicit-any */
import { observer } from "mobx-react-lite";
import { useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { UserRole } from "../../types/user";
import Admin from "../admin/Admin";
import Driver from "../driver/Driver";
import Seller from "../Seller/Seller";

import MainTemplate from "../template/MainTemplate";

const Home = () => {
  const { auth } = useContext(AuthContext);
  const userRole = auth.session?.user?.role;
  const navigate = useNavigate();

  const getRoleHomePage = useCallback((role: UserRole) => {
    console.log("navvv", role);
    if (!role) {
      return navigate("/login");
    }

    switch (role) {
      case UserRole.ROLE_ADMIN:
        return <Admin />;
      case UserRole.ROLE_EMPLOYEE_DRIVER:
        return <Driver />;
      case UserRole.ROLE_EMPLOYEE_SELLER:
        return <Seller />;
    }
  }, []);

  return <MainTemplate>{getRoleHomePage(userRole!)}</MainTemplate>;
};

export default observer(Home);
