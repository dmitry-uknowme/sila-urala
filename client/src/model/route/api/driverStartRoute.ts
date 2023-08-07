import axios from "axios";

const driverStartRoute = async (routeId: string) => {
  const { data } = await axios.post(
    `http://localhost:3000/api/routes/${routeId}/start`
  );
  return data;
};

export default driverStartRoute;
