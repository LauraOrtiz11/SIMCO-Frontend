import { useState, useEffect } from 'react';
import type {
  PileListItem,
  PileDetail,
  CreatePilePayload,
  UpdatePilePayload,
} from '../types/pile.types';

interface PileFormModalProps {
  isOpen: boolean;
  selectedGreenhouseId: string;
  pile?: PileDetail | PileListItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    formData: CreatePilePayload | UpdatePilePayload,
  ) => Promise<void> | void;
}

export const PileFormModal = ({
  isOpen,
  selectedGreenhouseId,
  pile,
  isSubmitting,
  onClose,
  onSubmit,
}: PileFormModalProps) => {
  const isEditing = Boolean(pile);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [processStartDate, setProcessStartDate] = useState('');
  const [estimatedEndDate, setEstimatedEndDate] = useState('');
  const [status, setStatus] = useState('Activa');
  const [baseMaterial, setBaseMaterial] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (pile) {
        setCode(pile.code || '');
        setName(pile.name || '');
        setProcessStartDate(
          pile.process_start_date
            ? new Date(pile.process_start_date).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        );
        setEstimatedEndDate(
          pile.estimated_end_date
            ? new Date(pile.estimated_end_date).toISOString().slice(0, 16)
            : '',
        );
        setStatus(pile.status || 'Activa');
        setBaseMaterial(('base_material' in pile && pile.base_material) || '');
        setNotes(('notes' in pile && pile.notes) || '');
      } else {
        setCode('');
        setName('');
        setProcessStartDate(new Date().toISOString().slice(0, 16));
        setEstimatedEndDate('');
        setStatus('Activa');
        setBaseMaterial('');
        setNotes('');
      }
    }
  }, [isOpen, pile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing && !code.trim()) {
      setError('El código de la pila es obligatorio.');
      return;
    }

    try {
      setError(null);

      if (isEditing) {
        const payload: UpdatePilePayload = {
          name: name.trim() || undefined,
          process_start_date: new Date(processStartDate).toISOString(),
          estimated_end_date: estimatedEndDate
            ? new Date(estimatedEndDate).toISOString()
            : undefined,
          status,
          base_material: baseMaterial.trim() || undefined,
          notes: notes.trim() || undefined,
        };
        await onSubmit(payload);
      } else {
        const payload: CreatePilePayload = {
          id_greenhouse: selectedGreenhouseId,
          code: code.trim().toUpperCase(),
          name: name.trim() || undefined,
          process_start_date: new Date(processStartDate).toISOString(),
          estimated_end_date: estimatedEndDate
            ? new Date(estimatedEndDate).toISOString()
            : undefined,
          base_material: baseMaterial.trim() || undefined,
          notes: notes.trim() || undefined,
        };
        await onSubmit(payload);
      }
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Error al guardar los datos de la pila.',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditing
                ? 'Editar Pila de Compostaje'
                : 'Nueva Pila de Compostaje'}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              {isEditing
                ? 'Actualice la información general y el estado operativo.'
                : 'Registre una nueva pila asociada al invernadero.'}
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

        <div className="overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <form id="pile-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                  Código Pila *
                </label>
                <input
                  type="text"
                  required={!isEditing}
                  disabled={isSubmitting || isEditing}
                  placeholder="Ej. PILA-001"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 text-sm uppercase text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-lime-600 focus:ring-2 focus:ring-lime-100 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                  Nombre / Alias
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  placeholder="Ej. Pila Lote 1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-lime-600 focus:ring-2 focus:ring-lime-100 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                  Fecha de Inicio *
                </label>
                <input
                  type="datetime-local"
                  required
                  disabled={isSubmitting}
                  value={processStartDate}
                  onChange={(e) => setProcessStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-lime-600 focus:ring-2 focus:ring-lime-100 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                  Fecha Est. Finalización
                </label>
                <input
                  type="datetime-local"
                  disabled={isSubmitting}
                  value={estimatedEndDate}
                  onChange={(e) => setEstimatedEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-lime-600 focus:ring-2 focus:ring-lime-100 disabled:bg-gray-50"
                />
              </div>
            </div>

            {isEditing && (
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                  Estado del Proceso
                </label>
                <select
                  disabled={isSubmitting}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-lime-600 focus:ring-2 focus:ring-lime-100 disabled:bg-gray-50 cursor-pointer"
                >
                  <option value="Activa">Activa</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Archivada">Archivada</option>
                </select>
              </div>
            )}

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                Material de Base
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                placeholder="Ej. Residuos orgánicos, hojarasca"
                value={baseMaterial}
                onChange={(e) => setBaseMaterial(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-lime-600 focus:ring-2 focus:ring-lime-100 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                Observaciones
              </label>
              <textarea
                rows={3}
                disabled={isSubmitting}
                placeholder="Notas de seguimiento técnico..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-lime-600 focus:ring-2 focus:ring-lime-100 disabled:bg-gray-50"
              />
            </div>
          </form>
        </div>

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
            form="pile-form"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center min-w-28 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-lime-600 hover:bg-lime-700 shadow-md shadow-lime-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 mr-2 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                Guardando...
              </>
            ) : isEditing ? (
              'Guardar cambios'
            ) : (
              'Crear Pila'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
