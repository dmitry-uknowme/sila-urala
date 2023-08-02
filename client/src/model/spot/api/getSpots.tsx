import axios from "axios";

const getSpots = async () => {
  const { data } = await axios.get("http://localhost:3000/api/spots");
  return data;
};

export default getSpots;
