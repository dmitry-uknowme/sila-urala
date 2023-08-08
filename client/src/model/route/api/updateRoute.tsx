import axios from "axios";
import { API_URL } from "../../../main";
import { UserRole } from "../../../types/user";

export interface UpdateRoutePayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  role: UserRole;
}

const updateRoute = async (routeId: string, payload: UpdateRoutePayload) => {
  const { data } = await axios.put(`${API_URL}/routes/${routeId}`, payload);
  return data;
};

export default updateRoute;
