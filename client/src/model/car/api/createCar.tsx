import axios from "axios";
import { API_URL } from "../../../main";

export interface CreateCarPayload {
  number_plate: string;
  capability: number;
}

const createCar = async (payload: CreateCarPayload) => {
  const { data } = await axios.post(`${API_URL}/cars`, payload);
  return data;
};

export default createCar;
