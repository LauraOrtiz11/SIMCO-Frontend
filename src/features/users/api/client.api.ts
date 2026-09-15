import { api } from '@/lib/axios';

export const getClients = async () => {
  const { data } = await api.get('/clients/basic'); //
  const items = Array.isArray(data) ? data : data.items || []; //[cite: 1]

  return items.map((c: any) => ({
    // ⚠️ Mantiene 'c.id_client' si existe, o 'c.id' como respaldo. No asignes solo 'c.id'
    id_client: c.id_client || c.id,
    name: c.name,
  }));
};
