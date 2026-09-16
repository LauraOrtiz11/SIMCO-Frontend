import { useState, useEffect } from 'react';
import type { CreatePilePayload } from '../types/pile.types';

interface PileFormModalProps {
  isOpen: boolean;
  selectedGreenhouseId: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePilePayload) => Promise<void>;
}

export const PileFormModal = ({
  isOpen,
  selectedGreenhouseId,
  isSubmitting,
  onClose,
  onSubmit,
}: PileFormModalProps) => {
  const [form, setForm] = useState<CreatePilePayload>({
    id_greenhouse: selectedGreenhouseId,
    code: '',
    name: '',
    process_start_date: new Date().toISOString().slice(0, 16),
    base_material: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);

  // Inicializar estado cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setForm({
        id_greenhouse: selectedGreenhouseId,
        code: '',
        name: '',
        process_start_date: new Date().toISOString().slice(0, 16),
        base_material: '',
        notes: '',
      });
      setError(null);
    }
  }, [isOpen, selectedGreenhouseId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code.trim()) {
      setError('El código de la pila es obligatorio');
      return;
    }

    try {
      setError(null);
      await onSubmit({
        id_greenhouse: selectedGreenhouseId,
        code: form.code.trim().toUpperCase(),
        name: form.name?.trim() || undefined,
        process_start_date: new Date(form.process_start_date).toISOString(),
        base_material: form.base_material?.trim() || undefined,
        notes: form.notes?.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(
        err?.message || err?.detail || 'Error al guardar la pila de compostaje',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Encabezado */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Nueva Pila de Compostaje
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Registra una nueva pila asociada al invernadero seleccionado
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50 cursor-pointer leading-none"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        {/* Contenido Desplazable */}
        <div className="overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <form id="pile-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Código */}
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                  Código Pila *
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="Ej. PILA-001"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-3.5 py-2.5 text-sm uppercase text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
                />
              </div>

              {/* Nombre / Alias */}
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                  Nombre / Alias
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  placeholder="Ej. Pila Norte Lote 1"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Fecha de Inicio */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                Fecha de Inicio del Proceso *
              </label>
              <input
                type="datetime-local"
                required
                disabled={isSubmitting}
                value={form.process_start_date}
                onChange={(e) =>
                  setForm({ ...form, process_start_date: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
              />
            </div>

            {/* Material de Base (MongoDB) */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                Material de Base
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                placeholder="Ej. Residuos orgánicos, hojarasca, estiércol"
                value={form.base_material || ''}
                onChange={(e) =>
                  setForm({ ...form, base_material: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-600 uppercase">
                Observaciones / Notas Iniciales
              </label>
              <textarea
                rows={3}
                disabled={isSubmitting}
                placeholder="Ej. Pila inicial de prueba con aireación manual"
                value={form.notes || ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
              />
            </div>
          </form>
        </div>

        {/* Pie de Modal */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="pile-form"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center min-w-28 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 mr-2 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                Guardando...
              </>
            ) : (
              'Crear Pila'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
