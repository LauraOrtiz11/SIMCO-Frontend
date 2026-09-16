import { useState } from 'react';
import { usePiles } from '../hooks/usePiles';
import { PileTable } from '../components/PileTable';
import { PileFormModal } from '../components/PileFormModal';
import { AssignDeviceModal } from '../components/AssignDeviceModal';
import { PileHeaderFilters } from '../components/PileHeaderFilters';
import { TelemetryModal } from '../components/TelemetryModal'; // 👈 IMPORTADO
import type { PileListItem } from '../types/pile.types';

export const PilesPage = () => {
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<string>('');
  const { piles, loading, isSubmitting, createPile, assignDevice } =
    usePiles(selectedGreenhouseId);

  const [selectedPileForCharts, setSelectedPileForCharts] =
    useState<PileListItem | null>(null);
  const [selectedPileForDevice, setSelectedPileForDevice] =
    useState<PileListItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Pilas de Compostaje
          </h1>
          <p className="text-xs text-gray-500">
            Monitoreo y administración de camas de compostaje
          </p>
        </div>
        {selectedGreenhouseId && (
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-xs rounded-xl cursor-pointer transition shrink-0"
          >
            + Nueva Pila
          </button>
        )}
      </div>

      {/* Selectores */}
      <PileHeaderFilters
        selectedGreenhouseId={selectedGreenhouseId}
        onSelectGreenhouse={setSelectedGreenhouseId}
      />

      {/* Tabla */}
      {selectedGreenhouseId && (
        <PileTable
          piles={piles}
          loading={loading}
          onViewTelemetry={(pile) => setSelectedPileForCharts(pile)} // 👈 ACTIVA EL MODAL DE TELEMETRÍA
          onAssignDevice={(pile) => setSelectedPileForDevice(pile)}
        />
      )}

      {/* Modal de Telemetría / Gráficos */}
      <TelemetryModal
        isOpen={Boolean(selectedPileForCharts)}
        pile={selectedPileForCharts}
        onClose={() => setSelectedPileForCharts(null)}
      />

      {/* Modal de Formulario Pila */}
      {selectedGreenhouseId && (
        <PileFormModal
          isOpen={isFormModalOpen}
          selectedGreenhouseId={selectedGreenhouseId}
          isSubmitting={isSubmitting}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={createPile}
        />
      )}

      {/* Modal Asignar Dispositivo */}
      <AssignDeviceModal
        isOpen={Boolean(selectedPileForDevice)}
        pile={selectedPileForDevice}
        onClose={() => setSelectedPileForDevice(null)}
        onAssign={assignDevice}
      />
    </div>
  );
};

export default PilesPage;
