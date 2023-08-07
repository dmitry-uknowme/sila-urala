import axios from "axios";

const getRoutes = async (filter: { car_id?: string }) => {
  const response = await axios.post(
    "http://localhost:3000/api/routes/search",
    filter
  );
  return response?.data;
};

export default getRoutes;
