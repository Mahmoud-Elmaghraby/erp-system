import { useMutation } from '@tanstack/react-query';
import { authApi } from '../auth/auth.api';
import { authStore } from '../auth/auth.store';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      authStore.setToken(data.accessToken);
      navigate('/dashboard');
    },
  });
};