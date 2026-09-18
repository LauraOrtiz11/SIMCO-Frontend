import { useState, useEffect } from 'react';
import { getDevices } from '@/features/devices/api/device.api';
import type { PileListItem } from '../types/pile.types';
import type { DeviceListItem } from '@/features/devices/types/device.types';

interface Props {
  isOpen: boolean;
  pile: PileListItem | null;
  onClose: () => void;
  onAssign: (pileId: string, deviceCode: string | null) => Promise<void>;
}

export const AssignDeviceModal = ({
  isOpen,
  pile,
  onClose,
  onAssign,
}: Props) => {
  const [availableDevices, setAvailableDevices] = useState<DeviceListItem[]>(
    [],
  );
  const [selectedDeviceCode, setSelectedDeviceCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && pile) {
      setLoading(true);
      // Cargar los dispositivos del mismo invernadero para poder reasignar
      getDevices(pile.id_greenhouse, 100, 0)
        .then((res) => {
          setAvailableDevices(res.items || []);
          setSelectedDeviceCode(pile.assigned_device_code || '');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, pile]);

  if (!isOpen || !pile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onAssign(
        pile.id_pile,
        selectedDeviceCode.trim() ? selectedDeviceCode : null,
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">
            Nodo IoT Asignado a:{' '}
            <span className="text-lime-600">{pile.code}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-gray-500">
            Cargando dispositivos disponibles...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Selecciona un dispositivo ESP32
              </label>
              <select
                value={selectedDeviceCode}
                onChange={(e) => setSelectedDeviceCode(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-lime-500/20 font-mono"
              >
                <option value=""> Sin dispositivo (Desvincular) </option>
                {availableDevices.map((dev) => (
                  <option key={dev.id_device} value={dev.code}>
                    {dev.code} {dev.description ? `(${dev.description})` : ''}{' '}
                    {dev.assigned_pile_code &&
                    dev.assigned_pile_code !== pile.code
                      ? `[Asignado a ${dev.assigned_pile_code}]`
                      : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[12px] text-gray-400">
                Seleccionar un dispositivo asignado a otra pila lo moverá
                automáticamente a esta cama de compostaje.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-lime-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-lime-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Actualizar Asignación'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
