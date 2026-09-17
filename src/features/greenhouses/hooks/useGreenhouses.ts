import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  CreateGreenhousePayload,
  GreenhouseListItem,
  UpdateGreenhousePayload,
} from '../types/greenhouse.types';
import {
  createGreenhouse as apiCreate,
  updateGreenhouse as apiUpdate,
  toggleGreenhouseStatus as apiToggle,
  assignGreenhouseUsers as apiAssign,
} from '../api/greenhouse.api';

interface PaginatedGreenhouseResponse {
  items: GreenhouseListItem[];
  total: number;
  limit: number;
  offset: number;
}

interface UpdateGreenhouseParams {
  id: string;
  payload: UpdateGreenhousePayload;
}

export const useGreenhouses = (clientId: string) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 4; // Cambia este valor por la cantidad de elementos por página deseada
  const offset = (page - 1) * limit;

  const { data, isLoading, isFetching } = useQuery<PaginatedGreenhouseResponse>(
    {
      queryKey: ['greenhouses', clientId, page, limit], // 🟢 React Query recargará datos al cambiar página
      queryFn: async () => {
        const response = await api.get<PaginatedGreenhouseResponse>(
          '/greenhouses/',
          {
            params: { client_id: clientId, limit, offset },
          },
        );
        return response.data;
      },
      enabled: Boolean(clientId),
    },
  );

  const greenhouses = data?.items ?? [];
  const total = data?.total ?? 0;

  const createMutation = useMutation({
    mutationFn: apiCreate,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['greenhouses'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: UpdateGreenhouseParams) =>
      apiUpdate(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['greenhouses'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: apiToggle,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['greenhouses'] }),
  });

  const assignUsersMutation = useMutation({
    mutationFn: ({ id, userIds }: { id: string; userIds: string[] }) =>
      apiAssign(id, userIds),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['greenhouses'] }),
  });

  return {
    greenhouses,
    total,
    page,
    limit,
    setPage,
    isLoading,
    isFetching,
    createGreenhouse: createMutation.mutateAsync,
    updateGreenhouse: updateMutation.mutateAsync,
    toggleGreenhouse: toggleMutation.mutateAsync,
    assignUsers: assignUsersMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleMutation.isPending,
    isAssigning: assignUsersMutation.isPending,
  };
};
