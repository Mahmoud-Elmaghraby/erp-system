import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import api from '../api/axios.config';
import { useAuth } from '../../app/context/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    },
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      login(accessToken, {
        id: user.id,
        name: user.name ?? '',
        email: user.email,
        companyId: user.companyId,
        branchId: user.branchId ?? null,
        roles: user.roles ?? [],
        permissions: user.permissions ?? [],
      });
      navigate('/dashboard');
    },
    onError: () => {
      message.error('البريد الإلكتروني أو كلمة المرور غلط');
    },
  });
};