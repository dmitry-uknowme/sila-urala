import axios from "axios";

const removeRoute = async (routeId: string) => {
  const { data } = await axios.delete(
    `http://localhost:3000/api/routes/${routeId}`
  );
  return data;
};

export default removeRoute;
