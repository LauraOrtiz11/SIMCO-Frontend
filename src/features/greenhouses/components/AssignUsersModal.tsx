import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { GreenhouseDetail } from '../types/greenhouse.types';

interface UserBasic {
  id_user: string;
  name: string;
  email: string;
  role: string;
}

interface AssignUsersModalProps {
  open: boolean;
  clientId: string;
  greenhouse: GreenhouseDetail | null;
  onClose: () => void;
  onSave: (greenhouseId: string, userIds: string[]) => Promise<void>;
  isSubmitting: boolean;
}

export const AssignUsersModal = ({
  open,
  greenhouse,
  onClose,
  onSave,
  isSubmitting,
}: AssignUsersModalProps) => {
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const { data: users = [], isLoading } = useQuery<UserBasic[]>({
    queryKey: ['users', 'all-available'],
    queryFn: async () => {
      const { data } = await api.get('/users/', {
        params: { limit: 1000 },
      });
      const allUsers: UserBasic[] = data.items || [];
      return allUsers.filter((u) => u.role?.toUpperCase() !== 'ADMIN');
    },
    enabled: open,
  });

  useEffect(() => {
    if (open && greenhouse) {
      setSelectedUsers(new Set(greenhouse.responsables_ids || []));
      setSearch('');
    }
  }, [open, greenhouse]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query),
    );
  }, [users, search]);

  const handleToggle = (userId: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUsers(newSet);
  };

  if (!open || !greenhouse) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col w-full max-w-md max-h-[85vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Asignar Responsables
              </h2>
              <p className="mt-1 text-sm text-gray-500">{greenhouse.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-50"
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

        <div className="p-4 bg-gray-50/50 border-b border-gray-100">
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <p className="p-6 text-sm text-center text-gray-500">
              Cargando usuarios disponibles...
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="p-6 text-sm text-center text-gray-500">
              No se encontraron usuarios disponibles.
            </p>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <label
                  key={user.id_user}
                  className="flex items-center justify-between p-3 cursor-pointer rounded-xl transition hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id_user)}
                      onChange={() => handleToggle(user.id_user)}
                      className="w-4 h-4 text-lime-600 bg-gray-100 border-gray-300 rounded focus:ring-lime-500 cursor-pointer"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-semibold text-blue-700 bg-blue-50 rounded-md">
                    {user.role}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() =>
              onSave(greenhouse.id_greenhouse, Array.from(selectedUsers))
            }
            disabled={isSubmitting}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-lime-600 rounded-xl hover:bg-lime-700 disabled:opacity-60 cursor-pointer flex items-center justify-center min-w-28"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
            ) : (
              `Guardar (${selectedUsers.size})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
