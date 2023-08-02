import axios from "axios";
import { UserRole } from "../../../types/user";

export interface UpdateUserPayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  role: UserRole;
}

const updateUser = async (userId: string, payload: UpdateUserPayload) => {
  const { data } = await axios.put(
    `http://localhost:3000/api/users/${userId}`,
    payload
  );
  return data;
};

export default updateUser;
