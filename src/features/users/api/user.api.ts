import { api } from '@/lib/axios';

import type {
  UserListItem,
  UserDetail,
  CreateUserPayload,
  UpdateUserPayload,
} from '../types/user.types';

// LISTAR USUARIOS
export const getUsers = async (
  clientId?: string,
  search?: string,
  page: number = 1,
  limit: number = 5,
): Promise<{
  items: UserListItem[];
  total: number;
}> => {
  const offset = (page - 1) * limit;

  const { data } = await api.get('/users/', {
    params: {
      ...(clientId ? { client_id: clientId } : {}),

      ...(search ? { search } : {}),

      limit,
      offset,
    },
  });

  return {
    items: data.items.map((user: any) => ({
      ...user,
      is_active: user.status === 'Activo',
    })),

    total: data.total,
  };
};

// OBTENER USUARIO POR ID
export const getUserById = async (id: string): Promise<UserDetail> => {
  const { data } = await api.get<UserDetail>(`/users/${id}`);

  return data;
};

// CREAR USUARIO
export const createUser = async (payload: CreateUserPayload) => {
  const { data } = await api.post('/users/', payload);

  return data;
};

// ACTUALIZAR USUARIO
export const updateUser = async (id: string, payload: UpdateUserPayload) => {
  const { data } = await api.put(`/users/${id}`, payload);

  return data;
};

// ACTIVAR / DESACTIVAR
export const toggleUserStatus = async (id: string) => {
  const { data } = await api.patch(`/users/${id}/toggle-status`);

  return data;
};
