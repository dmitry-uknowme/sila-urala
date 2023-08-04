import CarModelTable from "../../model/car/CarModelTable";
import RouteModelTable from "../../model/route/RouteModelTable";
import SpotModelTable from "../../model/spot/SpotModelTable";
import UserModelTable from "../../model/user/UserModelTable";
import Navbar from "../../navbar/Navbar";
import AuthLogin from "../auth/AuthLogin";

const Home = () => {
  return (
    <div>
      <Navbar />
      <AuthLogin />
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

export default Home;
