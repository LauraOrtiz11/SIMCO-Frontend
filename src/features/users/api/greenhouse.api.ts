import { api } from '@/lib/axios';

export const getGreenhousesByClient = async (clientId: string) => {
  const { data } = await api.get(`/greenhouses/by-client/${clientId}`);
  return Array.isArray(data) ? data : [];
};
