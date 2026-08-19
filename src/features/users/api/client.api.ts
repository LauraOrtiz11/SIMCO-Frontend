import { api } from '@/lib/axios';

export const getClients = async () => {
  const { data } = await api.get('/clients/basic');
  return data.map((c: any) => ({
    id_client: c.id,
    name: c.name,
  }));
};
