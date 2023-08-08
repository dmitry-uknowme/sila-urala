import axios from "axios";
import { API_URL } from "../../../main";

const removeSpot = async (spotId: string) => {
  const { data } = await axios.delete(`${API_URL}/spots/${spotId}`);
  return data;
};

export default removeSpot;
