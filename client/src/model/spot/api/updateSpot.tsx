import axios from "axios";
import { API_URL } from "../../../main";

export interface UpdateSpotPayload {
  number_plate: string;
  capability: number;
}

const updateSpot = async (spotId: string, payload: UpdateSpotPayload) => {
  const { data } = await axios.put(`${API_URL}/spots/${spotId}`, payload);
  return data;
};

export default updateSpot;
