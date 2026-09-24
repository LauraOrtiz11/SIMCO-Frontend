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
      setOpen(true);
    } catch (error) {
      console.error('No se pudo obtener el detalle del usuario', error);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id_user, data);
      } else {
        await createUser(data as CreateUserPayload);
      }

      await loadUsers();
      closeModal();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado Centrado */}
      <div className="flex flex-col items-center text-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 font-[Poppins]">
          GESTIÓN DE USUARIOS
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Administración de cuentas, asignación de roles
        </p>
      </div>

      {/* Filtros, Búsqueda y Botón Nuevo */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1 max-w-2xl">
          {/* Campo de Búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl shadow-xs outline-none transition-all duration-200 focus:border-lime-600 focus:ring-2 focus:ring-lime-100"
          />

          {/* Desplegable de Clientes */}
          <select
            value={clientFilter}
            onChange={(e) => {
              setClientFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64 px-4 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-2xl shadow-sm cursor-pointer outline-none transition-all duration-200 focus:border-lime-600 focus:ring-2 focus:ring-lime-100"
          >
            <option value="" className="text-gray-800 bg-white">
              Todos los clientes
            </option>
            {clients.map((c: any) => {
              const clientId = c.id_client || c.id;
              return (
                <option
                  key={clientId}
                  value={clientId}
                  className="text-gray-800 bg-white"
                >
                  {c.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Botón Crear Usuario */}
        <button
          type="button"
          onClick={() => {
            setSelectedUser(null);
            setOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-lime-600 rounded-2xl shadow-xs hover:bg-lime-700 cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          + Crear usuario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <UserTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onToggle={handleToggle}
      />

      {/* BARRA DE PAGINACIÓN */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4 rounded-xl bg-white border border-gray-100 shadow-xs">
        {/* Vista Móvil */}
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          >
            Siguiente
          </button>
        </div>

        {/* Vista Escritorio */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Página <span className="font-semibold">{page}</span> de{' '}
              <span className="font-semibold">{totalPages || 1}</span>
            </p>
          </div>

          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-xl shadow-xs"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                Anterior
              </button>

              <span className="relative inline-flex items-center px-4 py-2 text-xs font-mono text-gray-600 ring-1 ring-inset ring-gray-200 bg-gray-50">
                {page}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
                className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-xs text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal Formulario */}
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
