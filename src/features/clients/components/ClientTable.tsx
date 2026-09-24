import type { ClientListItem } from '../types/client.types';

interface ClientTableProps {
  clients: ClientListItem[];
  isLoading: boolean;
  onEdit: (client: ClientListItem) => void;
}

export const ClientTable = ({
  clients,
  isLoading,
  onEdit,
}: ClientTableProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-lime-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          Cargando clientes...
        </p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-700">
          No hay clientes registrados
        </h3>
        <p className="max-w-sm mt-1 text-sm text-gray-400">
          Intenta cambiar el criterio de búsqueda o crea uno nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Correo Electrónico
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Teléfono
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Fecha Registro
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {clients.map((client) => (
              <tr
                key={client.id_client}
                className="transition-colors hover:bg-gray-50/70"
              >
                {/* Nombre con Avatar Circular */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-lime-600 flex items-center justify-center text-white font-semibold shrink-0 shadow-xs">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">
                      {client.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-xs text-gray-600">
                  {client.email || 'N/A'}
                </td>

                <td className="px-6 py-4 text-xs text-gray-600">
                  {client.phone || 'N/A'}
                </td>

                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(client.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>

                {/* Acciones Estilizadas */}
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center">
                    <button
                      type="button"
                      onClick={() => onEdit(client)}
                      className="w-25 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-2xl cursor-pointer flex justify-center items-center border border-blue-200 transition-transform duration-300 hover:scale-105"
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
