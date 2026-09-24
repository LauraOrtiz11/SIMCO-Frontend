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
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      {/* Selector Cliente Estilizado */}
      <div className="w-full sm:w-64">
        <label
          htmlFor="client-header-filter"
          className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
        >
          Cliente
        </label>
        <div className="relative">
          <select
            id="client-header-filter"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            disabled={isLoadingClients}
            className="w-full
            appearance-none
            pl-4
            pr-10
            py-2.5
            text-sm
            font-medium
            text-gray-800
            bg-white
            border
            border-lime-200
            rounded-xl
            shadow-sm
            outline-none
            transition-all
            duration-200
            cursor-pointer
            focus:ring-lime-100"
          >
            <option value="" className="text-gray-400">
              {isLoadingClients
                ? 'Cargando clientes...'
                : 'Selecciona un cliente...'}
            </option>
            {clients.map((c: any) => {
              const id = c.id_client || c.id;
              return (
                <option key={id} value={id} className="text-gray-800 py-1">
                  {c.name}
                </option>
              );
            })}
          </select>

          {/* Icono de flecha personalizado */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Selector Invernadero Estilizado */}
      <div className="w-full sm:w-64">
        <label
          htmlFor="greenhouse-header-filter"
          className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
        >
          Invernadero
        </label>
        <div className="relative">
          <select
            id="greenhouse-header-filter"
            value={selectedGreenhouseId}
            onChange={(e) => onSelectGreenhouse(e.target.value)}
            disabled={!selectedClientId || isLoadingGh}
            className="w-full
            appearance-none
            pl-4
            pr-10
            py-2.5
            text-sm
            font-medium
            text-gray-800
            bg-white
            border
            border-lime-200
            rounded-xl
            shadow-sm
            outline-none
            transition-all
            duration-200
            cursor-pointer
            focus:ring-lime-100"
          >
            <option value="" className="text-gray-400">
              {!selectedClientId
                ? 'Primero elige un cliente...'
                : isLoadingGh
                  ? 'Cargando invernaderos...'
                  : availableGreenhouses.length === 0
                    ? 'Sin invernaderos'
                    : 'Selecciona un invernadero...'}
            </option>
            {availableGreenhouses.map((gh) => (
              <option
                key={gh.id_greenhouse}
                value={gh.id_greenhouse}
                className="text-gray-800 py-1"
              >
                {gh.name}
              </option>
            ))}
          </select>

          {/* Icono de flecha / Spinner */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
            {isLoadingGh ? (
              <span className="w-3.5 h-3.5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-4 h-4 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
