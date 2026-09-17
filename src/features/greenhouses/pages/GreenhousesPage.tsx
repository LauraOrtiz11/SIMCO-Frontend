import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useGreenhouses } from '../hooks/useGreenhouses';
import { getGreenhouseById } from '../api/greenhouse.api';
import { ClientSelector } from '../components/ClientSelector';
import { GreenhouseModal } from '../components/GreenhouseModal';
import { GreenhouseTable } from '../components/GreenhouseTable';
import { AssignUsersModal } from '../components/AssignUsersModal';
import type {
  ClientBasic,
  CreateGreenhousePayload,
  GreenhouseDetail,
  GreenhouseListItem,
} from '../types/greenhouse.types';

export const GreenhousesPage = () => {
  const [clientId, setClientId] = useState<string>('');
  const [openModal, setOpenModal] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedGreenhouse, setSelectedGreenhouse] =
    useState<GreenhouseDetail | null>(null);

  const {
    greenhouses,
    total,
    page,
    limit,
    setPage,
    isLoading,
    toggleGreenhouse,
    createGreenhouse,
    updateGreenhouse,
    assignUsers,
    isCreating,
    isUpdating,
    isAssigning,
  } = useGreenhouses(clientId);

  const totalPages = Math.ceil(total / limit);

  const { data: clients = [], isLoading: isLoadingClients } = useQuery<
    ClientBasic[]
  >({
    queryKey: ['clients-basic'],
    queryFn: async () => {
      const { data } = await api.get('/clients/basic');
      return data.items ?? data;
    },
  });

  const [form, setForm] = useState<CreateGreenhousePayload>({
    id_client: '',
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });

  const handleClientChange = (newClientId: string) => {
    setClientId(newClientId);
    setPage(1); // Reinicia a la página 1 al cambiar de cliente
  };

  const handleOpenCreate = () => {
    setForm({
      id_client: clientId,
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
    });
    setSelectedGreenhouse(null);
    setOpenModal(true);
  };

  const handleOpenEdit = async (greenhouse: GreenhouseListItem) => {
    try {
      const detail = await getGreenhouseById(greenhouse.id_greenhouse);
      setSelectedGreenhouse(detail);
      setForm({
        id_client: detail.id_client,
        name: detail.name,
        address: detail.address,
        latitude: detail.latitude,
        longitude: detail.longitude,
      });
      setOpenModal(true);
    } catch (error) {
      console.error('Error al obtener invernadero:', error);
    }
  };

  const handleOpenAssign = async (greenhouse: GreenhouseListItem) => {
    try {
      const detail = await getGreenhouseById(greenhouse.id_greenhouse);
      setSelectedGreenhouse(detail);
      setAssignModalOpen(true);
    } catch (error) {
      console.error('Error al obtener datos de asignación:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateGreenhousePayload = { ...form, id_client: clientId };

    try {
      if (selectedGreenhouse) {
        await updateGreenhouse({
          id: selectedGreenhouse.id_greenhouse,
          payload,
        });
      } else {
        await createGreenhouse(payload);
      }
      setOpenModal(false);
      setSelectedGreenhouse(null);
    } catch (error) {
      console.error('Error guardando invernadero:', error);
    }
  };

  const handleToggleGreenhouse = async (id: string) => {
    try {
      await toggleGreenhouse(id);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleSaveAssignments = async (
    greenhouseId: string,
    userIds: string[],
  ) => {
    try {
      await assignUsers({ id: greenhouseId, userIds });
      setAssignModalOpen(false);
      setSelectedGreenhouse(null);
    } catch (error) {
      console.error('Error asignando usuarios:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="pb-4 mt-2 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 font-[Poppins] text-center">
          GESTIÓN DE INVERNADEROS
        </h1>
        <p className="mt-1 text-sm text-lime-900 text-center">
          Administra los invernaderos asociados a cada cliente y gestiona sus
          responsables.
        </p>
      </div>

      <div className=" flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <ClientSelector
          clients={clients}
          value={clientId}
          onChange={handleClientChange}
        />
        {clientId && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-lime-600 rounded-2xl shadow-xs hover:bg-lime-700 cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <span className="text-lg leading-none">+</span> Crear invernadero
          </button>
        )}
      </div>

      <div className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-xs">
        {!clientId ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-lime-50">
              <svg
                className="w-7 h-7 text-lime-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-5h6v5M9 10h.01M12 10h.01M15 10h.01"
                />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-700">
              Selecciona un cliente
            </h2>
            <p className="max-w-md mt-1 text-sm text-gray-400">
              Selecciona un cliente para consultar y administrar sus
              invernaderos.
            </p>
          </div>
        ) : (
          <>
            <GreenhouseTable
              greenhouses={greenhouses}
              isLoading={isLoading || isLoadingClients}
              onEdit={handleOpenEdit}
              onToggle={handleToggleGreenhouse}
              onAssign={handleOpenAssign}
            />

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Página{' '}
                <span className="font-semibold text-gray-700">{page}</span> de{' '}
                <span className="font-semibold text-gray-700">
                  {totalPages || 1}
                </span>{' '}
              </p>

              <div className="isolate inline-flex -space-x-px rounded-xl shadow-2xs">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-l-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Anterior
                </button>
                <span className="px-3 py-1.5 text-xs font-mono text-gray-600 border-y border-gray-200 bg-gray-100">
                  {page}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-r-xl hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <GreenhouseModal
        open={openModal}
        greenhouse={selectedGreenhouse}
        form={form}
        onChange={setForm}
        onClose={() => {
          if (!isCreating && !isUpdating) {
            setOpenModal(false);
            setSelectedGreenhouse(null);
          }
        }}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <AssignUsersModal
        open={assignModalOpen}
        clientId={clientId}
        greenhouse={selectedGreenhouse}
        onClose={() => setAssignModalOpen(false)}
        onSave={handleSaveAssignments}
        isSubmitting={isAssigning}
      />
    </div>
  );
};

export default GreenhousesPage;
