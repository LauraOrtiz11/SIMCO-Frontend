import { api } from '@/lib/axios';

export const getRoles = async () => {
  const { data } = await api.get('/roles/');
  return data;
};
