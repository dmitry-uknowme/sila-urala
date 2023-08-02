import axios from "axios";

export interface CreateSpotPayload {
  address_name: string;
  capability: number;
}

const createSpot = async (payload: CreateSpotPayload) => {
  const { data } = await axios.post("http://localhost:3000/api/spots", payload);
  return data;
};

export default createSpot;
