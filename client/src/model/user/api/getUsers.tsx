import axios from "axios";
import { API_URL } from "../../../main";
import { IUser } from "../user";

const getUsers = async (): Promise<IUser[]> => {
  const { data } = await axios.get(`${API_URL}/users`);
  return data;
};

export default getUsers;
