import axios from "axios";
import { UserRole } from "../../../types/user";

export interface UpdateUserPayload {
  first_name: string;
  last_name: string;
  middle_name: string;
  role: UserRole;
}

const updateUser = async (userId: string, payload: UpdateUserPayload) => {
  payload = Object.keys(payload)
    ?.map((key) => ({
      key,
      value:
        payload[key]?.trim() === "" || payload[key] === null
          ? undefined
          : payload[key].trim(),
    }))
    ?.reduce((acc, curr) => ((acc[curr.key] = curr.value), acc), {});
  const { data } = await axios.put(
    `http://localhost:3000/api/users/${userId}`,
    payload
  );
  return data;
};

export default updateUser;
