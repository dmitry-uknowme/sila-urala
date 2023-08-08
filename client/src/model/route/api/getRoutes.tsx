import axios from "axios";
import { API_URL } from "../../../main";
import { IRoute } from "../IRoute";

const getRoutes = async (filter?: { car_id?: string }) => {
  const response = await axios.post<IRoute[]>(
    `${API_URL}/routes/search`,
    filter
  );
  return response?.data;
};

export default getRoutes;
