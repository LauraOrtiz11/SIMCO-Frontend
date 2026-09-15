import { useEffect, useState } from 'react';

import { getGreenhousesByClient } from '../api/greenhouse.api';

import type {
  UserDetail,
  Role,
  Client,
  CreateUserPayload,
  UpdateUserPayload,
} from '../types/user.types';

interface GreenhouseBasic {
  id_greenhouse: string;
  name: string;
}

interface Props {
  user: UserDetail | null;
  clients: Client[];
  roles: Role[];
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
  onClose: () => void;
}

export const UserFormModal = ({
  user,
  clients,
  roles,
  onSubmit,
  onClose,
}: Props) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    id_role: 0,
  });

  const [selectedClient, setSelectedClient] = useState('');
  const [availableGreenhouses, setAvailableGreenhouses] = useState<
    GreenhouseBasic[]
  >([]);
  const [greenhouseIds, setGreenhouseIds] = useState<string[]>([]);

  const [isLoadingGreenhouses, setIsLoadingGreenhouses] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      id_role: user?.id_role ?? 0,
    });

    setGreenhouseIds(user?.greenhouse_ids ?? []);

    if (user && 'client_id' in user && user.client_id) {
      setSelectedClient(user.client_id as string);
    } else {
      setSelectedClient('');
      setAvailableGreenhouses([]);
    }

    setErrors({});
    setServerError('');
  }, [user]);

  useEffect(() => {
    if (!selectedClient) {
      setAvailableGreenhouses([]);
      setIsLoadingGreenhouses(false);
      return;
    }

    const loadGreenhouses = async () => {
      setIsLoadingGreenhouses(true);
      setAvailableGreenhouses([]);

      try {
        const data = await getGreenhousesByClient(selectedClient);

        setAvailableGreenhouses(data);
      } catch (error) {
        console.error('Error cargando invernaderos:', error);

        setAvailableGreenhouses([]);
      } finally {
        setIsLoadingGreenhouses(false);
      }
    };

    loadGreenhouses();
  }, [selectedClient]);

  /*
   * Cambia la selección de un invernadero.
   */
  const toggleGreenhouse = (id: string) => {
    setGreenhouseIds((prev) =>
      prev.includes(id)
        ? prev.filter((greenhouseId) => greenhouseId !== id)
        : [...prev, id],
    );
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;

    setSelectedClient(clientId);
    setGreenhouseIds([]);
  };

  /*
   * Valida los campos del formulario.
   */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (form.name.trim().length < 5) {
      newErrors.name = 'Debe tener al menos 5 caracteres';
    }

    if (!form.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Correo inválido (ej: usuario@email.com)';
    }

    if (!user) {
      if (!form.password) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (form.password.length < 8) {
        newErrors.password = 'Mínimo 8 caracteres';
      } else if (!/[A-Z]/.test(form.password)) {
        newErrors.password = 'Debe tener al menos 1 mayúscula';
      } else if (!/[0-9]/.test(form.password)) {
        newErrors.password = 'Debe tener al menos 1 número';
      }
    }

    if (!form.id_role || form.id_role === 0) {
      newErrors.id_role = 'Selecciona un rol válido';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const finalGreenhouseIds = form.id_role === 1 ? [] : greenhouseIds;

    try {
      if (user) {
        const payload: UpdateUserPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          id_role: form.id_role,
          greenhouse_ids: finalGreenhouseIds,
        };

        await onSubmit(payload);
      } else {
        const payload: CreateUserPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          id_role: form.id_role,
          greenhouse_ids: finalGreenhouseIds,
        };

        await onSubmit(payload);
      }
    } catch (error: any) {
      const errorData = error?.response?.data || error;

      if (errorData?.detail?.field) {
        const { field, message } = errorData.detail;

        setErrors((prev) => ({
          ...prev,
          [field]: message,
        }));

        setServerError('');
      } else {
        setServerError(
          errorData?.message ||
            errorData?.detail ||
            'Error al guardar el usuario',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {user ? 'Editar usuario' : 'Crear usuario'}
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              {user
                ? 'Actualiza la información del usuario'
                : 'Registra un nuevo usuario'}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
                {serverError}
              </div>
            )}

            {/* Nombre */}
            <div>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Nombre completo"
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm disabled:bg-gray-50 ${
                  errors.name ? 'border-red-400' : 'border-gray-200'
                }`}
              />

              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="Correo electrónico"
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm disabled:bg-gray-50 ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
              />

              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password - solo creación */}
            {!user && (
              <div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Contraseña"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm disabled:bg-gray-50 ${
                    errors.password ? 'border-red-400' : 'border-gray-200'
                  }`}
                />

                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            )}

            {/* Rol */}
            <div>
              <select
                value={form.id_role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    id_role: Number(e.target.value),
                  })
                }
                disabled={isSubmitting}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm disabled:bg-gray-50 bg-white ${
                  errors.id_role ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <option value={0}>Seleccionar rol</option>

                {roles.map((role) => (
                  <option key={role.id_role} value={role.id_role}>
                    {role.name}
                  </option>
                ))}
              </select>

              {errors.id_role && (
                <p className="text-xs text-red-500 mt-1">{errors.id_role}</p>
              )}
            </div>

            {/* Asignación de invernaderos */}
            {form.id_role !== 0 && form.id_role !== 1 && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700">
                  Asignación de Invernaderos
                </p>

                {/* Cliente */}
                <select
                  value={selectedClient}
                  onChange={handleClientChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="">
                    Selecciona un cliente para ver sus invernaderos...
                  </option>

                  {clients.map((client) => (
                    <option key={client.id_client} value={client.id_client}>
                      {client.name}
                    </option>
                  ))}
                </select>

                {/* Loading */}
                {isLoadingGreenhouses && (
                  <div className="flex items-center justify-center gap-2 py-4 text-gray-500 text-xs italic">
                    <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin inline-block" />
                    Cargando invernaderos...
                  </div>
                )}

                {/* Sin invernaderos */}
                {!isLoadingGreenhouses &&
                  selectedClient &&
                  availableGreenhouses.length === 0 && (
                    <p className="text-xs text-gray-500 italic py-2">
                      No se encontraron invernaderos para este cliente.
                    </p>
                  )}

                {/* Invernaderos */}
                {!isLoadingGreenhouses && availableGreenhouses.length > 0 && (
                  <div className="max-h-36 overflow-y-auto p-3 border border-gray-200 rounded-xl space-y-2 bg-gray-50">
                    {availableGreenhouses.map((greenhouse) => (
                      <label
                        key={greenhouse.id_greenhouse}
                        className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-100 p-1.5 rounded-md transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={greenhouseIds.includes(
                            greenhouse.id_greenhouse,
                          )}
                          onChange={() =>
                            toggleGreenhouse(greenhouse.id_greenhouse)
                          }
                          className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                        />

                        <span className="text-gray-700">{greenhouse.name}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Cantidad seleccionada */}
                {!isLoadingGreenhouses && greenhouseIds.length > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    {greenhouseIds.length} invernadero(s) seleccionado(s).
                  </p>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
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
            form="user-form"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all flex items-center justify-center min-w-32 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            ) : user ? (
              'Guardar cambios'
            ) : (
              'Crear usuario'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
