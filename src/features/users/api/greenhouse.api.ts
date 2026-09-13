import { api } from '@/lib/axios';

export const getGreenhousesByClient = async (clientId: string) => {
  const { data } = await api.get('/greenhouses/', {
    params: { client_id: clientId },
  });

  return Array.isArray(data) ? data : data.items || [];
};
