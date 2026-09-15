export interface ClientBasic {
  id: string;
  name: string;
}

export interface GreenhouseListItem {
  id_greenhouse: string;
  id_client?: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  status: string;
  responsables?: string[];
}

export interface GreenhouseBasic extends GreenhouseListItem {
  id_client: string;
  latitude: number;
  longitude: number;
}

export interface GreenhouseDetail {
  id_greenhouse: string;
  id_client: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  status: string;
  responsables?: string[];
  responsables_ids?: string[];
}

export interface CreateGreenhousePayload {
  id_client: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface UpdateGreenhousePayload {
  id_client: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface AssignUsersPayload {
  user_ids: string[];
}
