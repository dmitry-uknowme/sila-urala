import axios from "axios";
import { API_URL } from "../../../main";

const removeUser = async (userId: string) => {
  const { data } = await axios.delete(`${API_URL}/users/${userId}`);
  return data;
};

export default removeUser;
