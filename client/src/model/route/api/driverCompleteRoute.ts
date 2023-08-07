import axios from "axios";

const driverCompleteRoute = async (routeId: string) => {
  const { data } = await axios.post(
    `http://localhost:3000/api/routes/${routeId}/complete`
  );
  return data;
};

export default driverCompleteRoute;
