import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AuthContext } from "../../App";
import { UserRole } from "../../types/user";
import Admin from "../admin/Admin";
import Driver from "../driver/Driver";
import Seller from "../Seller/Seller";

import MainTemplate from "../template/MainTemplate";

const getRoleHomePage = (role: UserRole) => {
  switch (role) {
    case UserRole.ROLE_ADMIN:
      return <Admin />;
    case UserRole.ROLE_EMPLOYEE_DRIVER:
      return <Driver />;
    case UserRole.ROLE_EMPLOYEE_SELLER:
      return <Seller />;
  }
};

const Home = () => {
  const { auth } = useContext(AuthContext);
  const userRole = auth.session?.user?.role;
  return <MainTemplate>{getRoleHomePage(userRole!)}</MainTemplate>;
};

export default observer(Home);
