import { useState, useEffect } from 'react';
import { getSensorTypes } from '../api/device.api';
import type { DeviceDetail, SensorType } from '../types/device.types';

interface Props {
  isOpen: boolean;
  selectedGreenhouseId: string;
  device?: DeviceDetail | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
}

export const DeviceFormModal = ({
  isOpen,
  selectedGreenhouseId,
  device,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [sensorTypesCatalog, setSensorTypesCatalog] = useState<SensorType[]>(
    [],
  );
  const [sensors, setSensors] = useState<
    { id_sensor_type: number; code: string; location: string }[]
  >([]);

  // Precargar el catálogo y los datos del dispositivo si se está editando
  useEffect(() => {
    if (isOpen) {
      getSensorTypes().then((types) => setSensorTypesCatalog(types));

      if (device) {
        setCode(device.code);
        setDescription(device.description || '');
        setSensors(
          device.sensors.map((s) => ({
            id_sensor_type: s.id_sensor_type,
            code: s.code,
            location: s.location || '',
          })),
        );
      } else {
        setCode('');
        setDescription('');
        setSensors([]);
      }
    }
  }, [isOpen, device]);

  if (!isOpen) return null;

  const handleAddSensor = () => {
    const defaultTypeId = sensorTypesCatalog[0]?.id_sensor_type || 1;
    setSensors([
      ...sensors,
      {
        id_sensor_type: defaultTypeId,
        code: `SENS-${sensors.length + 1}`,
        location: '',
      },
    ]);
  };

  const handleRemoveSensor = (index: number) => {
    setSensors(sensors.filter((_, i) => i !== index));
  };

  const handleSensorChange = (index: number, field: string, value: any) => {
    const updated = [...sensors];
    updated[index] = { ...updated[index], [field]: value };
    setSensors(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      id_greenhouse: selectedGreenhouseId,
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      sensors: sensors.filter((s) => s.code.trim() && s.id_sensor_type),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">
            {device
              ? `Editar Nodo: ${device.code}`
              : 'Registrar Nuevo Nodo IoT'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Código Único de Dispositivo *
            </label>
            <input
              type="text"
              required
              disabled={Boolean(device)}
              placeholder="Ej. ESP32-NODE-01"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl font-mono uppercase disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Descripción / Notas
            </label>
            <input
              type="text"
              placeholder="Ej. Nodo de monitoreo para cama 1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          {/* Sensores */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Sensores Asociados
              </label>
              <button
                type="button"
                onClick={handleAddSensor}
                className="text-xs font-semibold text-green-600 hover:text-green-700 cursor-pointer"
              >
                + Asociar Sensor
              </button>
            </div>

            {sensors.map((s, idx) => (
              <div
                key={idx}
                className="flex gap-2 items-center mb-2 bg-gray-50 p-2 rounded-xl"
              >
                <select
                  value={s.id_sensor_type}
                  onChange={(e) =>
                    handleSensorChange(
                      idx,
                      'id_sensor_type',
                      Number(e.target.value),
                    )
                  }
                  className="w-1/2 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                >
                  {sensorTypesCatalog.map((st) => (
                    <option key={st.id_sensor_type} value={st.id_sensor_type}>
                      {st.name} ({st.unit})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  required
                  placeholder="Código (SENS-01)"
                  value={s.code}
                  onChange={(e) =>
                    handleSensorChange(
                      idx,
                      'code',
                      e.target.value.toUpperCase(),
                    )
                  }
                  className="w-1/3 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg font-mono uppercase"
                />

                <input
                  type="text"
                  placeholder="Ubicación"
                  value={s.location}
                  onChange={(e) =>
                    handleSensorChange(idx, 'location', e.target.value)
                  }
                  className="w-1/3 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveSensor(idx)}
                  className="text-red-500 text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-lime-600 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 hover:bg-green-700"
            >
              {isSubmitting
                ? 'Guardando...'
                : device
                  ? 'Guardar Cambios'
                  : 'Guardar Dispositivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
