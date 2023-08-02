import axios from "axios";

export interface UpdateSpotPayload {
  number_plate: string;
  capability: number;
}

const updateSpot = async (spotId: string, payload: UpdateSpotPayload) => {
  const { data } = await axios.put(
    `http://localhost:3000/api/spots/${spotId}`,
    payload
  );
  return data;
};

export default updateSpot;
