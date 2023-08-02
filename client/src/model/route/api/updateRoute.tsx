import axios from "axios";
import { UserRole } from "../../../types/user";

export interface UpdateRoutePayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  role: UserRole;
}

const updateRoute = async (routeId: string, payload: UpdateRoutePayload) => {
  const { data } = await axios.put(
    `http://localhost:3000/api/routes/${routeId}`,
    payload
  );
  return data;
};

export default updateRoute;
