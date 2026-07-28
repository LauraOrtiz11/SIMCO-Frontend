import { useState } from 'react';
import type { UserListItem } from '../types/user.types';

interface Props {
  users: UserListItem[];
  loading: boolean;
  onEdit: (user: UserListItem) => void;
  onToggle: (id: string) => Promise<void>;
}

export const UserTable = ({ users, loading, onEdit, onToggle }: Props) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        Cargando usuarios...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
        No hay usuarios registrados
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 border-b">
              <th className="px-6 py-4 text-left">Usuario</th>
              <th className="px-6 py-4 text-left">Correo</th>
              <th className="px-6 py-4 text-left">Rol</th>
              <th className="px-6 py-4 text-left">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              // 🔥 SIEMPRE boolean seguro
              const isActive = Boolean(user.is_active);

              return (
                <tr
                  key={user.id_user}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  {/* Usuario */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">
                          ID: {user.id_user.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  {/* Rol */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
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

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {/* Editar */}
                      <button
                        onClick={() => onEdit(user)}
                        className="px-3 py-1.5 rounded-lg text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                      >
                        Editar
                      </button>

                      {/* Toggle */}
                      <button
                        onClick={async () => {
                          if (loadingId) return;

                          setLoadingId(user.id_user);
                          try {
                            await onToggle(user.id_user);
                          } catch (error) {
                            console.error(error);
                          } finally {
                            setLoadingId(null);
                          }
                        }}
                        disabled={loadingId === user.id_user}
                        className={`px-3 py-1.5 rounded-lg text-sm transition ${
                          isActive
                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                            : 'text-green-600 bg-green-50 hover:bg-green-100'
                        } ${
                          loadingId === user.id_user
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        {loadingId === user.id_user ? (
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></span>
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
