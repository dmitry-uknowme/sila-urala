import axios from "axios";

const removeSpot = async (spotId: string) => {
  const { data } = await axios.delete(
    `http://localhost:3000/api/spots/${spotId}`
  );
  return data;
};

export default removeSpot;
