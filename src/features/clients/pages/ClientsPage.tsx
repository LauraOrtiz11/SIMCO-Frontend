import { useState } from 'react';
import { useClients } from '../hooks/useClients';
import { ClientTable } from '../components/ClientTable';
import { ClientFormModal } from '../components/ClientFormModal';
import type {
  ClientListItem,
  CreateClientPayload,
  UpdateClientPayload,
} from '../types/client.types';

export const ClientsPage = () => {
  const {
    clients,
    total,
    page,
    setPage,
    limit,
    search,
    setSearch,
    isLoading,
    createClient,
    updateClient,
    isSubmitting,
  } = useClients();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientListItem | null>(
    null,
  );

  const totalPages = Math.ceil(total / limit);

  const handleOpenCreate = () => {
    setSelectedClient(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (client: ClientListItem) => {
    setSelectedClient(client);
    setIsOpen(true);
  };

  const handleSubmit = async (
    data: CreateClientPayload | UpdateClientPayload,
  ) => {
    if (selectedClient) {
      await updateClient({ id: selectedClient.id_client, payload: data });
    } else {
      await createClient(data as CreateClientPayload);
    }
    setIsOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="pb-4 mt-2 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 font-[Poppins]">
          Gestión de Clientes
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o teléfono..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-80 px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow-sm transition rounded-xl cursor-pointer"
        >
          + Nuevo Cliente
        </button>
      </div>

      <ClientTable
        clients={clients}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
      />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2 text-sm text-gray-600">
          <span>
            Mostrando página {page} de {totalPages} ({total} clientes en total)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              Anterior
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      <ClientFormModal
        isOpen={isOpen}
        client={selectedClient}
        isSubmitting={isSubmitting}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ClientsPage;
