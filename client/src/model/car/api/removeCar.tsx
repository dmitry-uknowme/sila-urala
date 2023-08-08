import axios from "axios";
import { API_URL } from "../../../main";

const removeCar = async (carId: string) => {
  const { data } = await axios.delete(`${API_URL}/cars/${carId}`);
  return data;
};

export default removeCar;
