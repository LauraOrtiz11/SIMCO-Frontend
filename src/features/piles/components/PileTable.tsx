import type { PileListItem } from '../types/pile.types';

interface Props {
  piles: PileListItem[];
  loading: boolean;
  onViewTelemetry: (pile: PileListItem) => void;
  onAssignDevice: (pile: PileListItem) => void;
}

export const PileTable = ({
  piles,
  loading,
  onViewTelemetry,
  onAssignDevice,
}: Props) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          Cargando pilas de compostaje...
        </p>
      </div>
    );
  }

  if (!piles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
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
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a1 1 0 00-1.2 1.04l.322 3.22A2 2 0 006.71 21.2h10.58a2 2 0 001.988-1.82l.322-3.22a1 1 0 00-.172-.732z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 3v9m0 0l-3-3m3 3l3-3"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          No hay pilas registradas
        </h3>
        <p className="max-w-sm mt-1 text-sm text-gray-500">
          Este invernadero aún no tiene camas o pilas de compostaje
          configuradas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Pila / Código
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Fecha de Inicio
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Dispositivo IoT
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {piles.map((pile) => {
              const isActive = pile.status === 'Activa';
              return (
                <tr
                  key={pile.id_pile}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold shrink-0">
                        {pile.code.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {pile.code}
                        </p>
                        <p className="text-xs text-gray-500">
                          {pile.name || 'Sin alias configurado'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(pile.process_start_date).toLocaleDateString(
                      'es-CO',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      },
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {pile.assigned_device_code ? (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/60 rounded-lg">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-500 animate-pulse" />
                        {pile.assigned_device_code}
                      </span>
                    ) : (
                      <span className="text-xs italic text-gray-400">
                        Sin dispositivo asignado
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                          isActive ? 'bg-green-600' : 'bg-gray-400'
                        }`}
                      />
                      {pile.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onAssignDevice(pile)}
                        className="px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                      >
                        Nodo IoT
                      </button>
                      <button
                        type="button"
                        onClick={() => onViewTelemetry(pile)}
                        className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition cursor-pointer"
                      >
                        Gráficos en Vivo
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
