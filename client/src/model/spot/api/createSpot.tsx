import axios from "axios";
import { API_URL } from "../../../main";

export interface CreateSpotPayload {
  address_name: string;
  capability: number;
}

const createSpot = async (payload: CreateSpotPayload) => {
  const { data } = await axios.post(`${API_URL}/spots`, payload);
  return data;
};

export default createSpot;
