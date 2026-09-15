import type {
  GreenhouseDetail,
  CreateGreenhousePayload,
} from '../types/greenhouse.types';

interface GreenhouseModalProps {
  open: boolean;
  greenhouse: GreenhouseDetail | null;
  form: CreateGreenhousePayload;
  onChange: (form: CreateGreenhousePayload) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
}

export const GreenhouseModal = ({
  open,
  greenhouse,
  form,
  onChange,
  onClose,
  onSubmit,
  isSubmitting = false,
}: GreenhouseModalProps) => {
  if (!open) {
    return null;
  }

  const isEditing = Boolean(greenhouse);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Editar invernadero' : 'Nuevo invernadero'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? 'Actualiza la información del invernadero.'
                  : 'Registra un nuevo invernadero para el cliente seleccionado.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex items-center justify-center w-8 h-8 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-gray-600 cursor-pointer disabled:opacity-50"
              aria-label="Cerrar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">
          {/* Nombre */}
          <div>
            <label
              htmlFor="greenhouse-name"
              className="block mb-1.5 text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              id="greenhouse-name"
              type="text"
              required
              maxLength={100}
              value={form.name}
              onChange={(event) =>
                onChange({
                  ...form,
                  name: event.target.value,
                })
              }
              placeholder="Ej. Invernadero 1"
              className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Dirección */}
          <div>
            <label
              htmlFor="greenhouse-address"
              className="block mb-1.5 text-sm font-medium text-gray-700"
            >
              Dirección / Ubicación
            </label>
            <input
              id="greenhouse-address"
              type="text"
              required
              maxLength={255}
              value={form.address}
              onChange={(event) =>
                onChange({
                  ...form,
                  address: event.target.value,
                })
              }
              placeholder="Ej. Finca Mancilla"
              className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Coordenadas */}
          {/* Coordenadas */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Coordenadas
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Latitud */}
              <div>
                <label
                  htmlFor="greenhouse-latitude"
                  className="block mb-1.5 text-xs font-medium text-gray-500"
                >
                  Latitud
                </label>
                <input
                  id="greenhouse-latitude"
                  type="text"
                  inputMode="decimal"
                  required
                  value={form.latitude === 0 ? '' : form.latitude}
                  onChange={(event) => {
                    const val = event.target.value;
                    // Permite números, decimales y el signo menos
                    if (/^-?\d*\.?\d*$/.test(val)) {
                      onChange({
                        ...form,
                        latitude: val as unknown as number,
                      });
                    }
                  }}
                  placeholder="4.8097"
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Longitud */}
              <div>
                <label
                  htmlFor="greenhouse-longitude"
                  className="block mb-1.5 text-xs font-medium text-gray-500"
                >
                  Longitud
                </label>
                <input
                  id="greenhouse-longitude"
                  type="text"
                  inputMode="decimal"
                  required
                  value={form.longitude === 0 ? '' : form.longitude}
                  onChange={(event) => {
                    const val = event.target.value;
                    // Permite números, decimales y el signo menos
                    if (/^-?\d*\.?\d*$/.test(val)) {
                      onChange({
                        ...form,
                        longitude: val as unknown as number,
                      });
                    }
                  }}
                  placeholder="-74.3542"
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl transition hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center min-w-24 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl transition hover:bg-green-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 mr-2 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
