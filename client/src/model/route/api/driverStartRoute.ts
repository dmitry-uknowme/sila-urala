import axios from "axios";
import { API_URL } from "../../../main";

const driverStartRoute = async (routeId: string) => {
  const { data } = await axios.post(`${API_URL}/routes/${routeId}/start`);
  return data;
};

export default driverStartRoute;
