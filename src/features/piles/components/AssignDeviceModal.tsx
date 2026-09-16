import { useState } from 'react';
import type { PileListItem } from '../types/pile.types';

interface Props {
  isOpen: boolean;
  pile: PileListItem | null;
  onClose: () => void;
  onAssign: (pileId: string, deviceCode: string) => Promise<void>;
}

export const AssignDeviceModal = ({
  isOpen,
  pile,
  onClose,
  onAssign,
}: Props) => {
  const [deviceCode, setDeviceCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !pile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceCode.trim()) return;

    try {
      setError(null);
      setIsSubmitting(true);
      await onAssign(pile.id_pile, deviceCode.trim().toUpperCase());
      setDeviceCode('');
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail || 'Error al vincular el dispositivo',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">
            Asignar Nodo IoT a Pila:{' '}
            <span className="text-green-600">{pile.code}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Código del Dispositivo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. ESP32-NODE-01"
              value={deviceCode}
              onChange={(e) => setDeviceCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:outline-none uppercase font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Vinculando...' : 'Vincular Dispositivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
