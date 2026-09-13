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
      <div className="flex justify-center items-center py-10 text-gray-500">
        Cargando usuarios...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-600">
        No hay usuarios registrados
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b border-green-800">
              <th className="px-6 py-2.5 text-left">Nombre</th>
              <th className="px-6 py-2.5 text-left">Correo</th>
              <th className="px-6 py-2.5 text-left">Rol</th>
              <th className="px-6 py-2.5 text-left">Estado</th>
              <th className="px-6 py-2.5 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isActive = Boolean(user.is_active);

              return (
                <tr
                  key={user.id_user}
                  className="border-b border-green-800 last:border-none hover:bg-gray-100/50 transition"
                >
                  <td className="px-6 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-2.5 text-gray-600">{user.email}</td>

                  <td className="px-3 py-2.5">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-2.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="px-6 py-2.5">
                    <div className="flex flex-col gap-2 items-center">
                      {/* Botón Editar corregido con manejo de carga */}
                      <button
                        onClick={async () => {
                          if (loadingEditId) return;
                          setLoadingEditId(user.id_user);
                          try {
                            await onEdit(user);
                          } catch (error) {
                            console.error(
                              'Error al cargar detalles de edición:',
                              error,
                            );
                          } finally {
                            setLoadingEditId(null);
                          }
                        }}
                        disabled={loadingEditId === user.id_user}
                        className="px-3 py-1 rounded-lg text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 transition flex items-center justify-center min-w-20 cursor-pointer disabled:opacity-50"
                      >
                        {loadingEditId === user.id_user ? (
                          <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block"></span>
                        ) : (
                          'Editar'
                        )}
                      </button>

                      {/* Botón Toggle */}
                      <button
                        onClick={async () => {
                          if (loadingToggleId) return;
                          setLoadingToggleId(user.id_user);
                          try {
                            await onToggle(user.id_user);
                          } catch (error) {
                            console.error(error);
                          } finally {
                            setLoadingToggleId(null);
                          }
                        }}
                        disabled={loadingToggleId === user.id_user}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          isActive
                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                            : 'text-green-600 bg-green-50 hover:bg-green-100'
                        } ${
                          loadingToggleId === user.id_user
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        {loadingToggleId === user.id_user ? (
                          <span className="w-4 h-3 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></span>
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
