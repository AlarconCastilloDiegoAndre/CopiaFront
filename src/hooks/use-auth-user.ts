import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios'; // Importa tu instancia de axios
import type { User } from '@types';

// Esta función es la que realmente va a la API
const fetchAuthUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: fetchAuthUser,
    staleTime: 1000 * 60 * 15, // 15 minutos
    retry: false,
    // Hereda refetchOnWindowFocus: false de configuración global
  });
};