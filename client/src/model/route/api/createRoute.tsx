import axios from "axios";
import { UserRole } from "../../../types/user";

export interface CreateRoutePayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  role: UserRole;
}

const createRoute = async (carId: string, payload: CreateRoutePayload) => {
  const { data } = await axios.post(
    `http://localhost:3000/api/cars/${carId}/routes`,
    payload
  );
  return data;
};

export default createRoute;
