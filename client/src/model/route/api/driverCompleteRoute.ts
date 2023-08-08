import axios from "axios";
import { API_URL } from "../../../main";

const driverCompleteRoute = async (routeId: string) => {
  const { data } = await axios.post(`${API_URL}/routes/${routeId}/complete`);
  return data;
};

export default driverCompleteRoute;
