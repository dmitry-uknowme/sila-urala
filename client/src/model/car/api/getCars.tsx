import axios from "axios";
import { API_URL } from "../../../main";

const getCars = async (filter?: { user_id?: string }) => {
  const response = await axios.post(`${API_URL}/cars/search`, filter);
  return response?.data;
};

export default getCars;
