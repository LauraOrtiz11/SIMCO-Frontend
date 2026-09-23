import { useState } from 'react';
import type { UserListItem } from '../types/user.types';

interface Props {
  users: UserListItem[];
  loading: boolean;
  onEdit: (user: UserListItem) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
}

export const UserTable = ({ users, loading, onEdit, onToggle }: Props) => {
  const [loadingToggleId, setLoadingToggleId] = useState<string | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-lime-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          Cargando usuarios...
        </p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-700">
          No hay usuarios registrados
        </h3>
        <p className="max-w-sm mt-1 text-sm text-gray-400">
          Intenta cambiar los filtros de búsqueda o crea uno nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Correo
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Rol
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold tracking-wide text-gray-500 uppercase text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((user) => {
              const isActive = Boolean(user.is_active);
              const isEditing = loadingEditId === user.id_user;
              const isToggling = loadingToggleId === user.id_user;

              return (
                <tr
                  key={user.id_user}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  {/* Avatar Circular y Nombre */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-lime-600 flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* Correo Electrónico */}
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {user.email}
                  </td>

                  {/* Badge de Rol */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                      {user.role}
                    </span>
                  </td>

                  {/* Estado Activo / Inactivo */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                        isActive
                          ? 'bg-lime-50 text-lime-700 border-lime-200/60'
                          : 'bg-red-50 text-red-700 border-red-200/60'
                      }`}
                    >
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  {/* Acciones Dispuestas Verticalmente */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-center justify-center">
                      {/* Botón Editar */}
                      <button
                        type="button"
                        disabled={isEditing || isToggling}
                        onClick={async () => {
                          if (isEditing) return;
                          setLoadingEditId(user.id_user);
                          try {
                            await onEdit(user);
                          } catch (error) {
                            console.error('Error al editar usuario:', error);
                          } finally {
                            setLoadingEditId(null);
                          }
                        }}
                        className="w-25 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border border-blue-200 transition-transform duration-300 hover:scale-105"
                      >
                        {isEditing ? (
                          <span className="w-3.5 h-3.5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin inline-block" />
                        ) : (
                          'Editar'
                        )}
                      </button>

                      {/* Botón Activar / Desactivar */}
                      <button
                        type="button"
                        disabled={isToggling || isEditing}
                        onClick={async () => {
                          if (isToggling) return;
                          setLoadingToggleId(user.id_user);
                          try {
                            await onToggle(user.id_user);
                          } catch (error) {
                            console.error('Error al cambiar estado:', error);
                          } finally {
                            setLoadingToggleId(null);
                          }
                        }}
                        className={`w-25 px-3 py-1.5 text-xs font-medium rounded-2xl cursor-pointer disabled:opacity-50 flex justify-center items-center border transition-transform duration-300 hover:scale-105 ${
                          isActive
                            ? 'text-red-700 bg-red-100 hover:bg-red-200 border-red-200'
                            : 'text-lime-800 bg-lime-200/60 hover:bg-lime-200 border-lime-300'
                        }`}
                      >
                        {isToggling ? (
                          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                        ) : isActive ? (
                          'Desactivar'
                        ) : (
                          'Activar'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
