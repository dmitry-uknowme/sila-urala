import axios from "axios";
import { API_URL } from "../../../main";

export interface UpdateCarPayload {
  number_plate: string;
  capability: number;
}

const updateCar = async (carId: string, payload: UpdateCarPayload) => {
  const { data } = await axios.put(`${API_URL}/cars/${carId}`, payload);
  return data;
};

export default updateCar;
