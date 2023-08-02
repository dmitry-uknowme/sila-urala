import axios from "axios";

export interface UpdateCarPayload {
  number_plate: string;
  capability: number;
}

const updateCar = async (carId: string, payload: UpdateCarPayload) => {
  const { data } = await axios.put(
    `http://localhost:3000/api/cars/${carId}`,
    payload
  );
  return data;
};

export default updateCar;
