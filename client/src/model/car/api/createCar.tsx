import axios from "axios";

export interface CreateCarPayload {
  number_plate: string;
  capability: number;
}

const createCar = async (payload: CreateCarPayload) => {
  const { data } = await axios.post("http://localhost:3000/api/cars", payload);
  return data;
};

export default createCar;
