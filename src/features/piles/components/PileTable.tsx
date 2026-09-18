import { useState } from 'react';
import type { PileListItem } from '../types/pile.types';

interface PileTableProps {
  piles: PileListItem[];
  loading: boolean;
  onViewTelemetry: (pile: PileListItem) => void;
  onAssignDevice: (pile: PileListItem) => void;
  onEdit: (pile: PileListItem) => Promise<void> | void;
}

export const PileTable = ({
  piles,
  loading,
  onViewTelemetry,
  onAssignDevice,
  onEdit,
}: PileTableProps) => {
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-lime-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          Cargando pilas de compostaje...
        </p>
      </div>
    );
  }

  if (!piles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-700">
          No hay pilas registradas
        </h3>
        <p className="max-w-sm mt-1 text-sm text-gray-400">
          No se encontraron pilas de compostaje para el invernadero
          seleccionado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-150">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Código / Alias
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Dispositivo ESP32
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Fecha Inicio
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {piles.map((pile) => {
              const isEditingThis = loadingEditId === pile.id_pile;

              return (
                <tr
                  key={pile.id_pile}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  {/* CÓDIGO CON CÍRCULO VERDE DE PILA */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-lime-600 flex items-center justify-center text-white font-semibold shrink-0 shadow-xs">
                        {pile.code.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 font-mono">
                          {pile.code}
                        </p>
                        <p className="text-xs text-gray-500">
                          {pile.name || 'Sin alias'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-green-50 text-green-700 border border-green-200/60">
                      {pile.status || 'Activa'}
                    </span>
                  </td>

                  {/* NODO IOT */}
                  <td className="px-6 py-4">
                    {pile.assigned_device_code ? (
                      <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200">
                        {pile.assigned_device_code}
                      </span>
                    ) : (
                      <span className="text-xs italic text-gray-400">
                        Sin asignación
                      </span>
                    )}
                  </td>

                  {/* FECHA INICIO */}
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(pile.process_start_date).toLocaleDateString(
                      'es-CO',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      },
                    )}
                  </td>

                  {/* ACCIONES HOMOLOGADAS EN COLUMNA VERTICAL */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-center">
                      {/* Telemetría */}
                      <button
                        type="button"
                        onClick={() => onViewTelemetry(pile)}
                        className="w-25 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-200/55 hover:bg-amber-200 rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border border-amber-200 transition-transform duration-300 hover:scale-105"
                      >
                        Telemetría
                      </button>

                      {/* Nodo IoT  */}
                      <button
                        type="button"
                        onClick={() => onAssignDevice(pile)}
                        className="w-25 px-3 py-1.5 text-xs font-medium text-blue-800 bg-blue-200/55 hover:bg-blue-200 rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border border-blue-200 transition-transform duration-300 hover:scale-105"
                      >
                        Asignar Dispositivo
                      </button>

                      {/* Editar  */}
                      <button
                        type="button"
                        disabled={isEditingThis}
                        onClick={async () => {
                          try {
                            setLoadingEditId(pile.id_pile);
                            await onEdit(pile);
                          } finally {
                            setLoadingEditId(null);
                          }
                        }}
                        className="w-25 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border border-green-200 transition-transform duration-300 hover:scale-105"
                      >
                        {isEditingThis ? (
                          <span className="w-3.5 h-3.5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin inline-block" />
                        ) : (
                          'Editar'
                        )}
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
