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
      {/* Encabezado Centrado */}
      <div className="flex flex-col items-center text-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 font-[Poppins]">
          GESTIÓN DE CLIENTES
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Administración de organizaciones y clientes registrados en el sistema
        </p>
      </div>

      {/* Buscador y Botón Nuevo Cliente */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl shadow-xs outline-none transition-all duration-200 focus:border-lime-600 focus:ring-2 focus:ring-lime-100"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-lime-600 rounded-2xl shadow-xs hover:bg-lime-700 cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          + Crear cliente
        </button>
      </div>

      {/* Tabla de Clientes */}
      <ClientTable
        clients={clients}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
      />

      {/* BARRA DE PAGINACIÓN ESTANDARIZADA */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4 rounded-xl bg-white border border-gray-100 shadow-xs">
        {/* Vista Móvil */}
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          >
            Siguiente
          </button>
        </div>

        {/* Vista Escritorio */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Página <span className="font-semibold">{page}</span> de{' '}
              <span className="font-semibold">{totalPages || 1}</span>
            </p>
          </div>

          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-xl shadow-xs"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                Anterior
              </button>

              <span className="relative inline-flex items-center px-4 py-2 text-xs font-mono text-gray-600 ring-1 ring-inset ring-gray-200 bg-gray-50">
                {page}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
                className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal de Formulario */}
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
