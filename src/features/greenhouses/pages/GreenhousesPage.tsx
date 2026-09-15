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
  GreenhouseBasic,
} from '../types/greenhouse.types';

export const GreenhousesPage = () => {
  const [clientId, setClientId] = useState<string>('');
  const [openModal, setOpenModal] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedGreenhouse, setSelectedGreenhouse] =
    useState<GreenhouseDetail | null>(null);

  const handleToggleGreenhouse = async (id: string) => {
    try {
      await toggleGreenhouse(id);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };
  const {
    greenhouses,
    isLoading,
    toggleGreenhouse,
    createGreenhouse,
    updateGreenhouse,
    assignUsers,
    isCreating,
    isUpdating,
    isAssigning,
  } = useGreenhouses(clientId);

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

  const handleOpenEdit = async (greenhouse: GreenhouseBasic) => {
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
      console.error('Error obteniendo el invernadero:', error);
    }
  };

  const handleOpenAssign = async (greenhouse: GreenhouseBasic) => {
    try {
      const detail = await getGreenhouseById(greenhouse.id_greenhouse);
      setSelectedGreenhouse(detail);
      setAssignModalOpen(true);
    } catch (error) {
      console.error('Error obteniendo detalles para asignación:', error);
    }
  };

  const handleCloseModal = () => {
    if (isCreating || isUpdating) return;
    setOpenModal(false);
    setSelectedGreenhouse(null);
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
      console.error('Error guardando el invernadero:', error);
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
        <h1 className="text-xl font-semibold text-gray-800 font-[Poppins]">
          Gestión de Invernaderos
        </h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <ClientSelector
          clients={clients}
          value={clientId}
          onChange={setClientId}
        />
        {clientId && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl shadow-sm transition hover:bg-green-700 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span> Crear invernadero
          </button>
        )}
      </div>

      <div className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm">
        {!clientId ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-green-50">
              <svg
                className="w-7 h-7 text-green-600"
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
          <GreenhouseTable
            greenhouses={greenhouses}
            isLoading={isLoading || isLoadingClients}
            onEdit={handleOpenEdit}
            onToggle={handleToggleGreenhouse}
            onAssign={handleOpenAssign}
          />
        )}
      </div>

      <GreenhouseModal
        open={openModal}
        greenhouse={selectedGreenhouse}
        form={form}
        onChange={setForm}
        onClose={handleCloseModal}
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
