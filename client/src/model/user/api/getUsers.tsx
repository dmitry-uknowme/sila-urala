import axios from "axios";
import { IUser } from "../user";

const getUsers = async (): Promise<IUser[]> => {
  const { data } = await axios.get("http://localhost:3000/api/users");
  return data;
};

export default getUsers;
