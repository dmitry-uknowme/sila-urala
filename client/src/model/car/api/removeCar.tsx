import axios from "axios";

const removeCar = async (carId: string) => {
  const { data } = await axios.delete(
    `http://localhost:3000/api/cars/${carId}`
  );
  return data;
};

export default removeCar;
