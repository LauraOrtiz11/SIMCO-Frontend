export interface UserListItem {
  id_user: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  status?: string;
}

export interface UserDetail {
  id_user: string;
  name: string;
  email: string;
  id_role: number;
  role: string;
  status: string;
  client_id?: string | null;
  greenhouse_ids: string[];
}

export interface Role {
  id_role: number;
  name: string;
}

export interface Client {
  id_client: string;
  name: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  id_role: number;
  greenhouse_ids: string[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  id_role?: number;
  greenhouse_ids?: string[];
}
