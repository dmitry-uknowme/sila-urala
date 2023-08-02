import axios from "axios";
import { UserRole } from "../../../types/user";

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  role: UserRole;
}

const createUser = async (payload: CreateUserPayload) => {
  const { data } = await axios.post("http://localhost:3000/api/users", payload);
  return data;
};

export default createUser;
