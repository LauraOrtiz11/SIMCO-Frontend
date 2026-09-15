import { useState } from 'react';
import type { GreenhouseBasic } from '../types/greenhouse.types';

interface GreenhouseTableProps {
  greenhouses: GreenhouseBasic[];
  isLoading: boolean;
  onEdit: (greenhouse: GreenhouseBasic) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
  onAssign: (greenhouse: GreenhouseBasic) => Promise<void>;
}

export const GreenhouseTable = ({
  greenhouses,
  isLoading,
  onEdit,
  onToggle,
  onAssign,
}: GreenhouseTableProps) => {
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [loadingToggleId, setLoadingToggleId] = useState<string | null>(null);
  const [loadingAssignId, setLoadingAssignId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        Cargando invernaderos...
      </div>
    );
  }

  if (greenhouses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-600">
        Este cliente todavía no tiene invernaderos registrados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b border-green-800">
              <th className="px-6 py-2.5 text-left font-semibold">Nombre</th>
              <th className="px-6 py-2.5 text-left font-semibold">Ubicación</th>
              <th className="px-6 py-2.5 text-left font-semibold">
                Responsables
              </th>
              <th className="px-6 py-2.5 text-left font-semibold">Estado</th>
              <th className="px-6 py-2.5 text-center font-semibold">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {greenhouses.map((greenhouse) => {
              const isActive = Boolean(greenhouse.is_active);
              const isEditingThis = loadingEditId === greenhouse.id_greenhouse;
              const isTogglingThis =
                loadingToggleId === greenhouse.id_greenhouse;
              const isAssigningThis =
                loadingAssignId === greenhouse.id_greenhouse;

              return (
                <tr
                  key={greenhouse.id_greenhouse}
                  className="border-b border-green-800 last:border-none hover:bg-gray-100/50 transition"
                >
                  {/* Nombre */}
                  <td className="px-6 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold shrink-0">
                        {greenhouse.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {greenhouse.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Ubicación */}
                  <td className="px-6 py-2.5 text-gray-600">
                    {greenhouse.address}
                  </td>

                  {/* Responsables */}
                  <td className="px-6 py-2.5">
                    {greenhouse.responsables &&
                    greenhouse.responsables.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {greenhouse.responsables.map((responsable, index) => (
                          <span
                            key={`${responsable}-${index}`}
                            className="inline-flex px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-lg"
                          >
                            {responsable}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs italic text-gray-400">
                        Sin asignar
                      </span>
                    )}
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-2.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {greenhouse.status || (isActive ? 'Activo' : 'Inactivo')}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-2.5">
                    <div className="flex flex-col gap-2 items-center">
                      {/* Botón Responsables (Naranja) */}
                      <button
                        type="button"
                        onClick={async () => {
                          if (isAssigningThis) return;
                          setLoadingAssignId(greenhouse.id_greenhouse);
                          try {
                            await onAssign(greenhouse);
                          } finally {
                            setLoadingAssignId(null);
                          }
                        }}
                        disabled={isAssigningThis}
                        className="px-3 py-1 rounded-lg text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 transition flex items-center justify-center min-w-24 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAssigningThis ? (
                          <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin inline-block"></span>
                        ) : (
                          'Responsables'
                        )}
                      </button>

                      {/* Botón Editar */}
                      <button
                        type="button"
                        onClick={async () => {
                          if (isEditingThis) return;
                          setLoadingEditId(greenhouse.id_greenhouse);
                          try {
                            await onEdit(greenhouse);
                          } finally {
                            setLoadingEditId(null);
                          }
                        }}
                        disabled={isEditingThis}
                        className="px-3 py-1 rounded-lg text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 transition flex items-center justify-center min-w-24 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEditingThis ? (
                          <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block"></span>
                        ) : (
                          'Editar'
                        )}
                      </button>

                      {/* Botón Toggle */}
                      <button
                        type="button"
                        onClick={async () => {
                          if (isTogglingThis) return;
                          setLoadingToggleId(greenhouse.id_greenhouse);
                          try {
                            await onToggle(greenhouse.id_greenhouse);
                          } finally {
                            setLoadingToggleId(null);
                          }
                        }}
                        disabled={isTogglingThis}
                        className={`px-3 py-1 rounded-lg text-sm transition flex items-center justify-center min-w-24 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          isActive
                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                            : 'text-green-600 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {isTogglingThis ? (
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></span>
                        ) : isActive ? (
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
