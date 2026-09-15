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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Cargando clientes...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-xl border border-gray-100">
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
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Correo Electrónico</th>
            <th className="px-6 py-3">Teléfono</th>
            <th className="px-6 py-3">Fecha Registro</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {clients.map((client) => (
            <tr
              key={client.id_client}
              className="transition-colors hover:bg-gray-50/70"
            >
              <td className="px-6 py-4 font-medium text-gray-900">
                {client.name}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {client.email || 'N/A'}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {client.phone || 'N/A'}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(client.created_at).toLocaleDateString('es-ES')}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(client)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100 cursor-pointer"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
