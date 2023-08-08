export interface IRoute {
  coordinates?: string;
  address_name: string;
  capability: number;
  max_capability: number;
  tanks5_capability?: number;
  tanks13_capability?: number;
  tanks19_capability?: number;
  end_spot: any;
  start_date: string;
  created_at: string;
}
