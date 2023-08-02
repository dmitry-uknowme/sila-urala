import axios from "axios";

const getRoutes = async () => {
  const { data } = await axios.get("http://localhost:3000/api/routes");
  return data;
};

export default getRoutes;
