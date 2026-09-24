import { useState, useEffect } from 'react';
import { getPileTelemetrySeries } from '../api/pile.api';
import type { PileListItem, TelemetryReading } from '../types/pile.types';

interface TelemetryModalProps {
  isOpen: boolean;
  pile: PileListItem | null;
  onClose: () => void;
}

export const TelemetryModal = ({
  isOpen,
  pile,
  onClose,
}: TelemetryModalProps) => {
  const [readings, setReadings] = useState<TelemetryReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pile) {
      setLoading(true);
      setError(null);
      getPileTelemetrySeries(pile.code, 50)
        .then((data) => {
          // Revertir el arreglo para mostrar en orden cronológico (izquierda -> derecha)
          setReadings([...data].reverse());
        })
        .catch((err) => {
          console.error('Error cargando telemetría:', err);
          setError('No se pudieron obtener las lecturas de telemetría');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, pile]);

  if (!isOpen || !pile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Telemetría en Vivo:{' '}
              <span className="text-green-600">{pile.code}</span>
            </h2>
            <p className="text-xs text-gray-400">
              {pile.name ? `Alias: ${pile.name} | ` : ''}Nodo IoT:{' '}
              {pile.assigned_device_code || 'Sin asignar'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin inline-block" />
              <p className="mt-3 text-xs text-gray-500">
                Cargando serie de tiempo desde MongoDB Atlas...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
              {error}
            </div>
          ) : readings.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No hay lecturas registradas para esta pila en MongoDB Atlas.
            </div>
          ) : (
            <>
              {/* Tarjetas de Útimas Lecturas (KPIs) */}
              {readings.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl">
                    <p className="text-xs text-green-700 font-semibold uppercase">
                      Temp. Interna
                    </p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {readings[readings.length - 1].readings
                        .internal_temperature ?? '--'}{' '}
                      °C
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <p className="text-xs text-blue-700 font-semibold uppercase">
                      Temp. Ambiente
                    </p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {readings[readings.length - 1].readings
                        .ambient_temperature ?? '--'}{' '}
                      °C
                    </p>
                  </div>
                  <div className="p-4 bg-cyan-50/50 border border-cyan-100 rounded-xl">
                    <p className="text-xs text-cyan-700 font-semibold uppercase">
                      Humedad Interna
                    </p>
                    <p className="text-2xl font-bold text-cyan-900 mt-1">
                      {readings[readings.length - 1].readings
                        .internal_humidity ?? '--'}{' '}
                      %
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl">
                    <p className="text-xs text-purple-700 font-semibold uppercase">
                      pH Pila
                    </p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      {readings[readings.length - 1].readings.ph ?? '--'}
                    </p>
                  </div>
                </div>
              )}

              {/* Historial de Lecturas Simples */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Timestamp (ISO)</th>
                      <th className="px-4 py-3">Temp. Interna</th>
                      <th className="px-4 py-3">Temp. Ambiente</th>
                      <th className="px-4 py-3">Humedad Int.</th>
                      <th className="px-4 py-3">pH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {readings.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="px-4 py-2.5 font-mono text-gray-700">
                          {new Date(r.timestamp).toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-green-700">
                          {r.readings.internal_temperature} °C
                        </td>
                        <td className="px-4 py-2.5 text-blue-700">
                          {r.readings.ambient_temperature} °C
                        </td>
                        <td className="px-4 py-2.5 text-cyan-700">
                          {r.readings.internal_humidity} %
                        </td>
                        <td className="px-4 py-2.5 text-purple-700 font-semibold">
                          {r.readings.ph}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Pie */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
