import axios from "axios";
import { API_URL } from "../../../main";
import { IUser } from "../user";

const getUser = async (userId: string): Promise<IUser[]> => {
  const { data } = await axios.get(`${API_URL}/users/${userId}`);
  return data;
};

export default getUser;
