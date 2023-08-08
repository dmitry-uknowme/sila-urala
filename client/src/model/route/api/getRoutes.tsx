import axios from "axios";
import { IRoute } from "../IRoute";

const getRoutes = async (filter?: { car_id?: string }) => {
  const response = await axios.post<IRoute[]>(
    "http://localhost:3000/api/routes/search",
    filter
  );
  return response?.data;
};

export default getRoutes;
