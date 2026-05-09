// services/userService.ts
import { useApi } from '@/hook/useApi';
import { User } from '@/store/userStore';

export const useUserService = () => {
  const { execute: fetchUser, loading: userLoading } = useApi<User>('/v2/me', 'GET', {
    requiresAuth: true,
  });

  const { execute: updateUser, loading: updateLoading } = useApi<User>('/v2/me', 'PUT', {
    requiresAuth: true,
  });

  const { execute: changePassword, loading: passwordLoading } = useApi('/v2/users/change-password', 'POST', {
    requiresAuth: true,
  });

  return {
    fetchUser,
    updateUser,
    changePassword,
    userLoading,
    updateLoading,
    passwordLoading,
  };
};