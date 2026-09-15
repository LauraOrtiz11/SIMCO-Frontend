export interface ClientListItem {
  id_client: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export interface ClientBasic {
  id_client: string;
  name: string;
}

export interface CreateClientPayload {
  name: string;
  email?: string;
  phone?: string;
}

export interface UpdateClientPayload {
  name?: string;
  email?: string;
  phone?: string;
}

export interface PaginatedClientResponse {
  items: ClientListItem[];
  total: number;
}
