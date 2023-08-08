import axios from "axios";
import { API_URL } from "../../../main";

const getSpots = async (filter?: { car_id?: string }) => {
  const { data } = await axios.post(`${API_URL}/spots/search`, filter);
  return data;
};

export default getSpots;
