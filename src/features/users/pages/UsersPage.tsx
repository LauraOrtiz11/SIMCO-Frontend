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
  const [page, setPage] = useState(1);
  const limit = 10;
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
      const data = await getUsers(clientFilter || undefined, page, limit);
      setUsers(data);
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
      <h1 className="text-2xl font-bold font-[Poppins]">Gestion de Usuarios</h1>

      {/* FILTRO + BOTÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filtro izquierda */}
        <select
          value={clientFilter}
          onChange={(e) => {
            setClientFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400/20  transition-all duration-200 cursor-pointer"
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
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 w-full sm:w-auto "
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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-sm text-gray-600">Página {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={users.length < limit}
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50"
        >
          Siguiente
        </button>
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
