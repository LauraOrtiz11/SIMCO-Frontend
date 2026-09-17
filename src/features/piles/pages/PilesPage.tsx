import { useState } from 'react';
import { usePiles } from '../hooks/usePiles';
import { PileTable } from '../components/PileTable';
import { PileFormModal } from '../components/PileFormModal';
import { AssignDeviceModal } from '../components/AssignDeviceModal';
import { PileHeaderFilters } from '../components/PileHeaderFilters';
import { TelemetryModal } from '../components/TelemetryModal';
import type { PileListItem, PileDetail } from '../types/pile.types';
import { getPileById } from '../api/pile.api';

export const PilesPage = () => {
  const [selectedGreenhouseId, setSelectedGreenhouseId] = useState<string>('');

  const {
    piles,
    total,
    page,
    setPage,
    limit,
    loading,
    isSubmitting,
    createPile,
    updatePile,
    assignDevice,
  } = usePiles(selectedGreenhouseId);

  const [selectedPileForCharts, setSelectedPileForCharts] =
    useState<PileListItem | null>(null);
  const [selectedPileForDevice, setSelectedPileForDevice] =
    useState<PileListItem | null>(null);
  const [selectedPileForEdit, setSelectedPileForEdit] =
    useState<PileDetail | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const totalPages = Math.ceil(total / limit);

  const handleOpenCreate = () => {
    setSelectedPileForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = async (pile: PileListItem) => {
    try {
      const detail = await getPileById(pile.id_pile);
      setSelectedPileForEdit(detail);
      setIsFormModalOpen(true);
    } catch (error) {
      console.error('Error al obtener detalle de la pila:', error);
    }
  };

  const handleSubmitForm = async (formData: any) => {
    if (selectedPileForEdit) {
      await updatePile(selectedPileForEdit.id_pile, formData);
    } else {
      await createPile(formData);
    }
    setIsFormModalOpen(false);
    setSelectedPileForEdit(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Pilas de Compostaje
          </h1>
        </div>
        {selectedGreenhouseId && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-xs rounded-xl cursor-pointer transition shrink-0"
          >
            + Nueva Pila
          </button>
        )}
      </div>

      <PileHeaderFilters
        selectedGreenhouseId={selectedGreenhouseId}
        onSelectGreenhouse={(ghId) => {
          setSelectedGreenhouseId(ghId);
          setPage(1);
        }}
      />

      {!selectedGreenhouseId ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
          <h3 className="text-sm font-semibold text-gray-700">
            Selecciona un invernadero
          </h3>
          <p className="max-w-md mt-1 text-sm text-gray-400">
            Elige un cliente e invernadero para consultar sus pilas de
            compostaje.
          </p>
        </div>
      ) : (
        <>
          <PileTable
            piles={piles}
            loading={loading}
            onViewTelemetry={(pile) => setSelectedPileForCharts(pile)}
            onAssignDevice={(pile) => setSelectedPileForDevice(pile)}
            onEdit={handleOpenEdit}
          />

          <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4 rounded-xl bg-white border border-gray-100 shadow-xs">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg disabled:opacity-40 cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg disabled:opacity-40 cursor-pointer"
              >
                Siguiente
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                Página <span className="font-semibold">{page}</span> de{' '}
                <span className="font-semibold">{totalPages || 1}</span> (
                {total} pilas registradas)
              </p>

              <nav className="isolate inline-flex -space-x-px rounded-xl shadow-xs">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 rounded-l-xl hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-xs font-mono text-gray-600 ring-1 ring-inset ring-gray-200 bg-gray-50">
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 rounded-r-xl hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      <TelemetryModal
        isOpen={Boolean(selectedPileForCharts)}
        pile={selectedPileForCharts}
        onClose={() => setSelectedPileForCharts(null)}
      />

      {selectedGreenhouseId && (
        <PileFormModal
          isOpen={isFormModalOpen}
          selectedGreenhouseId={selectedGreenhouseId}
          pile={selectedPileForEdit}
          isSubmitting={isSubmitting}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedPileForEdit(null);
          }}
          onSubmit={handleSubmitForm}
        />
      )}

      <AssignDeviceModal
        isOpen={Boolean(selectedPileForDevice)}
        pile={selectedPileForDevice}
        onClose={() => setSelectedPileForDevice(null)}
        onAssign={async (pileId, deviceCode) => {
          await assignDevice(pileId, deviceCode);
          setSelectedPileForDevice(null);
        }}
      />
    </div>
  );
};

export default PilesPage;
