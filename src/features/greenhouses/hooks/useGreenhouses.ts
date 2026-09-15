import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type {
  CreateGreenhousePayload,
  GreenhouseBasic,
  GreenhouseDetail,
  UpdateGreenhousePayload,
} from '../types/greenhouse.types';
import {
  createGreenhouse as apiCreate,
  updateGreenhouse as apiUpdate,
  toggleGreenhouseStatus as apiToggle,
  assignGreenhouseUsers as apiAssign,
} from '../api/greenhouse.api';

interface PaginatedGreenhouseResponse {
  items: GreenhouseBasic[];
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

  const { data, isLoading, isFetching } = useQuery<PaginatedGreenhouseResponse>(
    {
      queryKey: ['greenhouses', clientId],
      queryFn: async () => {
        const response = await api.get<PaginatedGreenhouseResponse>(
          '/greenhouses/',
          {
            params: { client_id: clientId, limit: 50, offset: 0 },
          },
        );
        return response.data;
      },
      enabled: Boolean(clientId),
    },
  );

  const greenhouses = data?.items ?? [];

  const createMutation = useMutation({
    mutationFn: apiCreate,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['greenhouses', clientId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: UpdateGreenhouseParams) =>
      apiUpdate(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['greenhouses', clientId] }),
  });

  const toggleMutation = useMutation({
    mutationFn: apiToggle,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['greenhouses', clientId] }),
  });

  const assignUsersMutation = useMutation({
    mutationFn: ({ id, userIds }: { id: string; userIds: string[] }) =>
      apiAssign(id, userIds),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['greenhouses', clientId] }),
  });

  return {
    greenhouses,
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
