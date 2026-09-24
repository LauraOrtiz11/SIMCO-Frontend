import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DeviceListItem } from '../types/device.types';

interface DeviceTableProps {
  devices: DeviceListItem[];
  loading: boolean;
  onEdit: (device: DeviceListItem) => Promise<void> | void;
  onToggleStatus: (device: DeviceListItem) => Promise<void> | void;
}

export const DeviceTable = ({
  devices,
  loading,
  onEdit,
  onToggleStatus,
}: DeviceTableProps) => {
  const navigate = useNavigate();
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [loadingToggleId, setLoadingToggleId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-lime-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          Cargando dispositivos IoT...
        </p>
      </div>
    );
  }

  if (!devices.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-700">
          No hay dispositivos registrados
        </h3>
        <p className="max-w-sm mt-1 text-sm text-gray-400">
          No se encontraron nodos IoT asociados a este invernadero.
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
                Código Dispositivo
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Descripción
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
            {devices.map((device) => {
              const isEditing = loadingEditId === device.id_device;
              const isToggling = loadingToggleId === device.id_device;

              return (
                <tr
                  key={device.id_device}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium shrink-0 shadow-xs">
                        {device.code.charAt(0).toUpperCase()}
                      </div>
                      <span>{device.code}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-500">
                    {device.description || 'Sin descripción'}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                        device.is_active
                          ? 'bg-lime-50 text-lime-700 border-lime-200/60'
                          : 'bg-red-50 text-red-700 border-red-200/60'
                      }`}
                    >
                      {device.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-center">
                      {/* Botón Sensores */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/sensors?deviceId=${device.id_device}&deviceCode=${device.code}`,
                          )
                        }
                        className="w-25 px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-200/55 hover:bg-amber-200 rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border border-amber-200 transition-transform duration-300 hover:scale-105"
                      >
                        Sensores
                      </button>

                      {/* Botón Editar */}
                      <button
                        type="button"
                        disabled={isEditing || isToggling}
                        onClick={async () => {
                          try {
                            setLoadingEditId(device.id_device);
                            await onEdit(device);
                          } finally {
                            setLoadingEditId(null);
                          }
                        }}
                        className="w-25 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border border-blue-200 transition-transform duration-300 hover:scale-105"
                      >
                        {isEditing ? (
                          <span className="w-3.5 h-3.5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Editar'
                        )}
                      </button>

                      {/* Botón Activar / Desactivar */}
                      <button
                        type="button"
                        disabled={isToggling || isEditing}
                        onClick={async () => {
                          try {
                            setLoadingToggleId(device.id_device);
                            await onToggleStatus(device);
                          } finally {
                            setLoadingToggleId(null);
                          }
                        }}
                        className={`w-25 px-3 py-1.5 text-xs font-medium rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border transition-transform duration-300 hover:scale-105 ${
                          device.is_active
                            ? 'text-red-700 bg-red-100 hover:bg-red-200 border-red-200'
                            : 'text-lime-800 bg-lime-200/60 hover:bg-lime-200 border-lime-300'
                        }`}
                      >
                        {isToggling ? (
                          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : device.is_active ? (
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
