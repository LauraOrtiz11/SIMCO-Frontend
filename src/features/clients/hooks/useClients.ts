import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, createClient, updateClient } from '../api/client.api';
import type {
  CreateClientPayload,
  UpdateClientPayload,
} from '../types/client.types';

export const useClients = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const clientsQuery = useQuery({
    queryKey: ['clients', search, page],
    queryFn: () => getClients(search, page, limit),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateClientPayload;
    }) => updateClient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    clients: clientsQuery.data?.items ?? [],
    total: clientsQuery.data?.total ?? 0,
    page,
    setPage,
    limit,
    search,
    setSearch,
    isLoading: clientsQuery.isLoading,
    isFetching: clientsQuery.isFetching,
    createClient: createMutation.mutateAsync,
    updateClient: updateMutation.mutateAsync,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};
