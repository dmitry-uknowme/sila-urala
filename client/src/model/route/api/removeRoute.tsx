import axios from "axios";

const removeUser = async (userId: string) => {
  const { data } = await axios.delete(
    `http://localhost:3000/api/users/${userId}`
  );
  return data;
};

export default removeUser;
