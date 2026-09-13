import { useEffect, useState } from 'react';

import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  getUserById,
} from '@/features/users/api/user.api';

import { getClients } from '@/features/users/api/client.api';
import { getRoles } from '@/features/users/api/role.api';
import { UserTable } from '../components/UserTable';
import { UserFormModal } from '../components/UserFormModal';

import type {
  UserListItem,
  UserDetail,
  Client,
  Role,
  CreateUserPayload,
  UpdateUserPayload,
} from '../types/user.types';

export const UsersPage = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const [clientFilter, setClientFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 5;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [clientFilter, searchQuery, page]);

  const loadInitialData = async () => {
    const [clientsData, rolesData] = await Promise.all([
      getClients(),
      getRoles(),
    ]);
    setClients(clientsData);
    setRoles(rolesData);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { items, total } = await getUsers(
        clientFilter || undefined,
        searchQuery || undefined,
        page,
        limit,
      );
      setUsers(items);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    const updated = await toggleUserStatus(id);
    setUsers((prev) =>
      prev.map((u) =>
        u.id_user === id ? { ...u, is_active: updated.is_active } : u,
      ),
    );
  };

  const handleEdit = async (user: UserListItem) => {
    try {
      const detail = await getUserById(user.id_user);
      setSelectedUser(detail);
      setOpen(true); // Abre el modal únicamente cuando el detalle ya está listo
    } catch (error) {
      console.error('No se pudo obtener el detalle del usuario', error);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    if (selectedUser) {
      await updateUser(selectedUser.id_user, data);
      loadUsers();
    } else {
      await createUser(data as CreateUserPayload);
      loadUsers();
    }
    closeModal();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="pb-4 mt-2 border-b border-gray-300 ">
        <h1 className="mb-2 text-xl justify-center font-semibold text-gray-800 font-[Poppins]">
          Gestión de Usuarios
        </h1>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400/20"
          />

          <select
            value={clientFilter}
            onChange={(e) => {
              setClientFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400/20"
          >
            <option value="">Todos los clientes</option>
            {clients.map((c) => (
              <option key={c.id_client} value={c.id_client}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow-sm transition-all duration-200 rounded-xl cursor-pointer flex items-center justify-center"
        >
          + Crear Usuario
        </button>
      </div>

      {/* TABLA */}
      <UserTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onToggle={handleToggle}
      />

      {/* PAGINACIÓN RESTAURADA */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4 rounded-xl">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Página {page} de {totalPages || 1}
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-xl shadow-xs"
              aria-label="Pagination"
            >
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                Anterior
              </button>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-mono text-gray-600 ring-1 ring-inset ring-gray-200 bg-gray-50">
                {page}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
                className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <UserFormModal
          user={selectedUser}
          clients={clients}
          roles={roles}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default UsersPage;
