import { api } from '@/lib/axios';
import type {
  GreenhouseListItem,
  GreenhouseDetail,
  CreateGreenhousePayload,
  UpdateGreenhousePayload,
} from '../types/greenhouse.types';

export const getGreenhouses = async (
  clientId?: string,
  limit = 50,
  offset = 0,
): Promise<{ items: GreenhouseListItem[]; total: number }> => {
  const { data } = await api.get('/greenhouses/', {
    params: {
      ...(clientId ? { client_id: clientId } : {}),
      limit,
      offset,
    },
  });
  return data;
};

export const getGreenhousesByClient = async (clientId: string) => {
  const { data } = await api.get('/greenhouses/by-client/' + clientId);
  return Array.isArray(data) ? data : data.items || [];
};

export const getGreenhouseById = async (
  id: string,
): Promise<GreenhouseDetail> => {
  const { data } = await api.get<GreenhouseDetail>(`/greenhouses/${id}`);
  return data;
};

export const createGreenhouse = async (payload: CreateGreenhousePayload) => {
  const { data } = await api.post('/greenhouses/', payload);
  return data;
};

export const updateGreenhouse = async (
  id: string,
  payload: UpdateGreenhousePayload,
) => {
  const { data } = await api.put(`/greenhouses/${id}`, payload);
  return data;
};

export const toggleGreenhouseStatus = async (id: string) => {
  const { data } = await api.patch(`/greenhouses/${id}/toggle-status`);
  return data;
};

export const assignGreenhouseUsers = async (id: string, userIds: string[]) => {
  const { data } = await api.put(`/greenhouses/${id}/users`, {
    user_ids: userIds,
  });
  return data;
};
