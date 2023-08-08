import axios from "axios";
import { API_URL } from "../../../main";
import { UserRole } from "../../../types/user";

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  role: UserRole;
}

const createUser = async (payload: CreateUserPayload) => {
  payload = Object.keys(payload)
    .map((key) => ({
      key,
      value:
        payload[key].trim() === "" || payload[key] === null
          ? undefined
          : payload[key].trim(),
    }))
    .reduce((acc, curr) => ((acc[curr.key] = curr.value), acc), {});
  const { data } = await axios.post(`${API_URL}/users`, payload);
  return data;
};

export default createUser;
