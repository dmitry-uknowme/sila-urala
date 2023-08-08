import axios from "axios";
import { API_URL } from "../../../main";

const removeRoute = async (routeId: string) => {
  const { data } = await axios.delete(`${API_URL}/routes/${routeId}`);
  return data;
};

export default removeRoute;
