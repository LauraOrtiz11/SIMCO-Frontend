import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, toggleUserStatus } from '@/features/users/api/user.api';
export const useUsers = (clientId?: string) => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['users', clientId ?? 'all'],
    queryFn: () => getUsers(clientId),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleUserStatus,

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['users', clientId ?? 'all'], (old: any) =>
        old?.map((u: any) =>
          u.id_user === updatedUser.id_user ? updatedUser : u,
        ),
      );
    },
  });

  return {
    ...usersQuery,
    toggleUser: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
};
