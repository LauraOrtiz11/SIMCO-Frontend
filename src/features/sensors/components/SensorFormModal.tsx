import { useState, useEffect } from 'react';
import type {
  SensorListItem,
  CreateSensorPayload,
  UpdateSensorPayload,
} from '../types/sensor.types';

interface SensorFormModalProps {
  isOpen: boolean;
  selectedDeviceId: string;
  sensor?: SensorListItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void> | void;
}

// Tipos de sensores biológicos estándar
const SENSOR_TYPES = [
  { id: 1, name: 'Temperatura Interna (°C)' },
  { id: 2, name: 'Temperatura Ambiente (°C)' },
  { id: 3, name: 'Humedad Relativa (%)' },
  { id: 4, name: 'pH (Potencial Hidrógeno)' },
];

export const SensorFormModal = ({
  isOpen,
  selectedDeviceId,
  sensor,
  isSubmitting,
  onClose,
  onSubmit,
}: SensorFormModalProps) => {
  const isEditing = Boolean(sensor);

  const [code, setCode] = useState('');
  const [sensorTypeId, setSensorTypeId] = useState<number>(1);
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (sensor) {
        setCode(sensor.code || '');
        setSensorTypeId(sensor.id_sensor_type || 1);
        setLocation(sensor.location || '');
      } else {
        setCode('');
        setSensorTypeId(1);
        setLocation('');
      }
    }
  }, [isOpen, sensor]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing && !code.trim()) {
      setError('El código del sensor es obligatorio');
      return;
    }

    try {
      setError(null);

      if (isEditing) {
        const payload: UpdateSensorPayload = {
          location: location.trim() || undefined,
        };
        await onSubmit(payload);
      } else {
        const payload: CreateSensorPayload = {
          id_device: selectedDeviceId,
          id_sensor_type: Number(sensorTypeId),
          code: code.trim().toUpperCase(),
          location: location.trim() || undefined,
        };
        await onSubmit(payload);
      }
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Error al guardar la configuración del sensor',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Encabezado */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditing ? 'Editar Sensor' : 'Nuevo Sensor IoT'}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              {isEditing
                ? 'Modifica la ubicación o parámetros del sensor'
                : 'Asocia un nuevo sensor físico al dispositivo seleccionado'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50 cursor-pointer leading-none"
          >
            &times;
          </button>
        </div>

        {/* Formulario */}
        <div className="overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <form id="sensor-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Código del Sensor */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                Código / Identificador *
              </label>
              <input
                type="text"
                required={!isEditing}
                disabled={isSubmitting || isEditing}
                placeholder="Ej. SENS-TEMP-01"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 text-sm uppercase text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>

            {/* Tipo de Sensor */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                Tipo de Lectura / Métrica *
              </label>
              <select
                disabled={isSubmitting || isEditing}
                value={sensorTypeId}
                onChange={(e) => setSensorTypeId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {SENSOR_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ubicación Física */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                Ubicación Física en Nodo / Pila
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                placeholder="Ej. Profundidad 30cm - Centro"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100 disabled:bg-gray-50"
              />
            </div>
          </form>
        </div>

        {/* Pie del Modal */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="sensor-form"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center min-w-28 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 mr-2 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                Guardando...
              </>
            ) : isEditing ? (
              'Guardar cambios'
            ) : (
              'Crear Sensor'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
