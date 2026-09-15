import { api } from '@/lib/axios';
import type {
  ClientListItem,
  ClientBasic,
  CreateClientPayload,
  UpdateClientPayload,
  PaginatedClientResponse,
} from '../types/client.types';

// Traer clientes para dropdowns/selectores simples de otros módulos
export const getClientsSelector = async (): Promise<ClientBasic[]> => {
  const { data } = await api.get<ClientBasic[]>('/clients/selector');
  return data;
};

// Listar clientes con búsqueda y paginación
export const getClients = async (
  search?: string,
  page = 1,
  limit = 10,
): Promise<PaginatedClientResponse> => {
  const offset = (page - 1) * limit;
  const { data } = await api.get<PaginatedClientResponse>('/clients/', {
    params: {
      ...(search ? { search } : {}),
      limit,
      offset,
    },
  });
  return data;
};

export const getClientById = async (id: string): Promise<ClientListItem> => {
  const { data } = await api.get<ClientListItem>(`/clients/${id}`);
  return data;
};

export const createClient = async (
  payload: CreateClientPayload,
): Promise<ClientListItem> => {
  const { data } = await api.post<ClientListItem>('/clients/', payload);
  return data;
};

export const updateClient = async (
  id: string,
  payload: UpdateClientPayload,
): Promise<ClientListItem> => {
  const { data } = await api.put<ClientListItem>(`/clients/${id}`, payload);
  return data;
};
