import { useState } from 'react';
import type { GreenhouseListItem } from '../types/greenhouse.types';

interface Props {
  greenhouses: GreenhouseListItem[];
  isLoading: boolean;
  onEdit: (greenhouse: GreenhouseListItem) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
  onAssign: (greenhouse: GreenhouseListItem) => Promise<void>;
}

export const GreenhouseTable = ({
  greenhouses,
  isLoading,
  onEdit,
  onToggle,
  onAssign,
}: Props) => {
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [loadingToggleId, setLoadingToggleId] = useState<string | null>(null);
  const [loadingAssignId, setLoadingAssignId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <span className="w-8 h-8 border-3 border-lime-600 border-t-transparent rounded-full animate-spin"></span>
        <p className="mt-3 text-xs text-gray-500 font-medium">
          Cargando invernaderos...
        </p>
      </div>
    );
  }

  if (!greenhouses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
        <p className="text-sm font-semibold text-gray-800">
          No hay invernaderos registrados
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Este cliente no posee invernaderos en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Nombre</th>
              <th className="py-3.5 px-6">Ubicación</th>
              <th className="py-3.5 px-6">Responsables</th>
              <th className="py-3.5 px-6">Estado</th>
              <th className="py-3.5 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {greenhouses.map((gh) => {
              const isBusy =
                loadingEditId === gh.id_greenhouse ||
                loadingToggleId === gh.id_greenhouse ||
                loadingAssignId === gh.id_greenhouse;

              return (
                <tr
                  key={gh.id_greenhouse}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* Nombre con avatar circular */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-lime-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                        {gh.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">
                        {gh.name}
                      </span>
                    </div>
                  </td>

                  {/* Ubicación */}
                  <td className="py-4 px-6 text-gray-500 text-xs">
                    {gh.address || 'Sin dirección'}
                  </td>

                  {/* Responsables */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {gh.responsables && gh.responsables.length > 0 ? (
                        gh.responsables.map((resp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-lime-50 text-lime-700 text-xs font-medium rounded-full"
                          >
                            {resp}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Sin responsables
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        gh.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {gh.status}
                    </span>
                  </td>

                  {/* Acciones Dispuestas en Columna (Uno encima del otro) */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1.5 items-center justify-center">
                      {/* Botón Responsables (NARANJA) */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={async () => {
                          setLoadingAssignId(gh.id_greenhouse);
                          try {
                            await onAssign(gh);
                          } finally {
                            setLoadingAssignId(null);
                          }
                        }}
                        className="w-25 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-200/55 hover:bg-amber-200 rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border border-amber-200 transition-transform duration-300 hover:scale-105"
                      >
                        {loadingAssignId === gh.id_greenhouse ? (
                          <span className="w-3.5 h-3.5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          'Responsables'
                        )}
                      </button>

                      {/* Botón Editar */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={async () => {
                          setLoadingEditId(gh.id_greenhouse);
                          try {
                            await onEdit(gh);
                          } finally {
                            setLoadingEditId(null);
                          }
                        }}
                        className="w-25 px-3 py-1.5 text-xs font-medium text-blue-800 bg-blue-200/55 hover:bg-blue-200/80 rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border border-blue-200 transition-transform duration-300 hover:scale-105"
                      >
                        {loadingEditId === gh.id_greenhouse ? (
                          <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          'Editar'
                        )}
                      </button>

                      {/* Botón Activar / Desactivar */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={async () => {
                          setLoadingToggleId(gh.id_greenhouse);
                          try {
                            await onToggle(gh.id_greenhouse);
                          } finally {
                            setLoadingToggleId(null);
                          }
                        }}
                        className={`w-25 px-3 py-1.5 text-xs font-medium text-red-800 bg-red-200/55 hover:bg-red-200 rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border border-red-200 transition-transform duration-300 hover:scale-105 ${
                          gh.is_active
                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                            : 'text-green-600 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {loadingToggleId === gh.id_greenhouse ? (
                          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        ) : gh.is_active ? (
                          'Desactivar'
                        ) : (
                          'Activar'
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
