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
    loadUsers();
  }, [clientFilter, page]);

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
        page,
        limit,
      );

      setUsers(items);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  };

  // TOGGLE

  const handleToggle = async (id: string) => {
    const updated = await toggleUserStatus(id);

    setUsers((prev) =>
      prev.map((u) =>
        u.id_user === id ? { ...u, is_active: updated.is_active } : u,
      ),
    );
  };

  // EDITAR CLICK

  const handleEdit = async (user: UserListItem) => {
    const detail = await getUserById(user.id_user);

    setSelectedUser(detail);

    setOpen(true);
  };

  // CERRAR

  const closeModal = () => {
    setOpen(false);

    setSelectedUser(null);
  };

  const handleSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    if (selectedUser) {
      const updated = await updateUser(selectedUser.id_user, data);

      setUsers((prev) =>
        prev.map((u) => (u.id_user === updated.id_user ? updated : u)),
      );
    } else {
      const newUser = await createUser(data as CreateUserPayload);

      setUsers((prev) => [newUser, ...prev]);
    }

    closeModal();
  };
  return (
    <div className="p-6 space-y-6">
      {/* TÍTULO */}
      <div className="pb-4 mt-2 border-b border-gray-300 ">
        <h1 className="mb-2 text-xl justify-center font-semibold text-gray-800 font-[Poppins]">
          Gestión de Usuarios
        </h1>
      </div>
      {/* FILTRO + BOTÓN */}
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filtro izquierda */}
        <select
          value={clientFilter}
          onChange={(e) => {
            setClientFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400/20 transition-all duration-200 cursor-pointer"
        >
          <option value="">Todos</option>
          {clients.map((c) => (
            <option key={c.id_client} value={c.id_client}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Botón derecha */}
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
      {/* PAGINACIÓN  */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4  rounded-xl ">
        {/* Vista móvil / Texto simple */}
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

        {/* Vista de escritorio / Completa */}
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
              {/* Botón Anterior */}
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Anterior</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Indicador de página actual centrado entre los botones */}
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-mono text-gray-600 ring-1 ring-inset ring-gray-200 bg-gray-50">
                {page}
              </span>

              {/* Botón Siguiente */}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
                className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Siguiente</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
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
