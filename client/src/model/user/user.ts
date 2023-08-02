import { UserRole } from "../../types/user";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  //   spot_id: null;
  role: UserRole;
  refresh_token: string | null;
  created_at: string;
  spots: [];
  cars: [];
  role_localized: string;
  spot_address_name: string | null;
  car_number_plate: string | null;
  full_name: string;
}
