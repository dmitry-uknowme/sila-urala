import axios from "axios";
import { User } from "../user";

const getUsers = async (): Promise<User[]> => {
  const { data } = await axios.get("http://localhost:3000/api/users");
  return data;
};

export default getUsers;
