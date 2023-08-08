import axios from "axios";

const getSpots = async (filter?: { car_id?: string }) => {
  const { data } = await axios.post(
    "http://localhost:3000/api/spots/search",
    filter
  );
  return data;
};

export default getSpots;
