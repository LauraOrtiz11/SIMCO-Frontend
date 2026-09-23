import type { SensorListItem } from '../types/sensor.types';

interface SensorTableProps {
  sensors: SensorListItem[];
  loading: boolean;
  onEdit: (sensor: SensorListItem) => void;
  onToggleStatus: (sensor: SensorListItem) => void;
}

export const SensorTable = ({
  sensors,
  loading,
  onEdit,
  onToggleStatus,
}: SensorTableProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-amber-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          Cargando sensores del nodo...
        </p>
      </div>
    );
  }

  if (!sensors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-700">
          Sin sensores asociados
        </h3>
        <p className="max-w-sm mt-1 text-sm text-gray-400">
          Este nodo IoT no tiene sensores registrados actualmente.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Sensor / Código
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Ubicación Física
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
            {sensors.map((sensor) => (
              <tr
                key={sensor.id_sensor}
                className="transition-colors hover:bg-gray-50/70"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shrink-0 shadow-xs">
                      {sensor.code.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 font-mono">
                        {sensor.code}
                      </p>
                      <p className="text-xs text-gray-500">
                        Nodo: {sensor.device_code}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-xs font-medium text-gray-700">
                  {sensor.sensor_type_name}
                </td>

                <td className="px-6 py-4 text-xs text-gray-500">
                  {sensor.location || 'Sin ubicación'}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                      sensor.is_active
                        ? 'bg-green-50 text-green-700 border-green-200/60'
                        : 'bg-red-50 text-red-700 border-red-200/60'
                    }`}
                  >
                    {sensor.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                {/* ACCIONES DISPUESTAS VERTICALMENTE */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => onEdit(sensor)}
                      className="w-28 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleStatus(sensor)}
                      className={`w-28 px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                        sensor.is_active
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : 'text-green-600 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {sensor.is_active ? 'Desactivar' : 'Activar'}
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
