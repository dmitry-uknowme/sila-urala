import RouteModelTable from "../../../model/route/RouteModelTable";
import Navbar from "../../../navbar/Navbar";
import MainTemplate from "../../template/MainTemplate";

const Routes = () => {
  return (
    <MainTemplate>
      <Navbar />
      <div className="my-3">
        <RouteModelTable />
      </div>
    </MainTemplate>
  );
};

export default Routes;
