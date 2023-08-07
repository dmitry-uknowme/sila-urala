import axios from "axios";

const getCars = async (filter?: { user_id?: string }) => {
  const response = await axios.post(
    "http://localhost:3000/api/cars/search",
    filter
  );
  return response?.data;
};

// const getCars = async () => {
//     const { data } = await axios.get('http://localhost:3000/api/cars')
//     return data
// }

export default getCars;
