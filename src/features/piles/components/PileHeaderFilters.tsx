import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { getGreenhousesByClient } from '@/features/greenhouses/api/greenhouse.api';
import type { ClientBasic } from '@/features/greenhouses/types/greenhouse.types';

interface Props {
  selectedGreenhouseId: string;
  onSelectGreenhouse: (greenhouseId: string) => void;
}

export const PileHeaderFilters = ({
  selectedGreenhouseId,
  onSelectGreenhouse,
}: Props) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [availableGreenhouses, setAvailableGreenhouses] = useState<any[]>([]);
  const [isLoadingGh, setIsLoadingGh] = useState(false);

  // Cargar Clientes Básicos
  const { data: clients = [], isLoading: isLoadingClients } = useQuery<
    ClientBasic[]
  >({
    queryKey: ['clients-basic'],
    queryFn: async () => {
      const { data } = await api.get('/clients/selector');
      return Array.isArray(data) ? data : data.items || [];
    },
  });

  // Cargar Invernaderos cuando cambia el Cliente seleccionado
  useEffect(() => {
    if (selectedClientId) {
      setIsLoadingGh(true);
      onSelectGreenhouse('');
      getGreenhousesByClient(selectedClientId)
        .then((items) => setAvailableGreenhouses(items || []))
        .catch(() => setAvailableGreenhouses([]))
        .finally(() => setIsLoadingGh(false));
    } else {
      setAvailableGreenhouses([]);
      onSelectGreenhouse('');
    }
  }, [selectedClientId]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs w-full">
      {/* Selector Cliente */}
      <div className="w-full sm:w-64">
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
          Cliente
        </label>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          disabled={isLoadingClients}
          className="w-full px-3.5 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:outline-none cursor-pointer"
        >
          <option value="">Selecciona un cliente...</option>
          {clients.map((c: any) => {
            const id = c.id_client || c.id;
            return (
              <option key={id} value={id}>
                {c.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Selector Invernadero */}
      <div className="w-full sm:w-64">
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
          Invernadero
        </label>
        <select
          value={selectedGreenhouseId}
          onChange={(e) => onSelectGreenhouse(e.target.value)}
          disabled={!selectedClientId || isLoadingGh}
          className="w-full px-3.5 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:outline-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {!selectedClientId
              ? 'Primero elige un cliente...'
              : isLoadingGh
                ? 'Cargando invernaderos...'
                : availableGreenhouses.length === 0
                  ? 'Sin invernaderos'
                  : 'Selecciona un invernadero...'}
          </option>
          {availableGreenhouses.map((gh) => (
            <option key={gh.id_greenhouse} value={gh.id_greenhouse}>
              {gh.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
