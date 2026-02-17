import { createContext, type ReactNode, useMemo } from 'react';
import { api } from '../lib/axios.ts';
import type { AdminLoginDto, StudentLoginDto, User } from '@types';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '@hooks/use-auth-user.ts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// --- Define lo que el contexto va a proveer ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  adminLogin: (credentials: AdminLoginDto) => Promise<User>;
  studentLogin: (credentials: StudentLoginDto) => Promise<User>;
  logout: () => Promise<void>;
  clearUser: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

// --- Componente Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Obtenemos el usuario y el estado de carga DESDE LA CACHÉ de React Query
  const { data: user, isLoading } = useAuthUser();

  // --- Funciones de Autenticación ---

  const adminLogin = async (credentials: AdminLoginDto) => {
    const response = await api.post('/auth/admins/login', credentials);
    const loggedInUser = response.data as User;

    // Guardar el tipo de usuario en localStorage
    localStorage.setItem('lastLoginType', 'admin');

    // Actualizamos la caché manualmente con los datos del login
    queryClient.setQueryData(['auth-user'], loggedInUser);
    return loggedInUser;
  };

  const studentLogin = async (credentials: StudentLoginDto) => {
    const response = await api.post('/auth/students/login', credentials);
    const loggedInUser = response.data as User;

    // Guardar el tipo de usuario en localStorage
    localStorage.setItem('lastLoginType', 'student');

    queryClient.setQueryData(['auth-user'], loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      queryClient.clear();
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    } finally {
      // Limpiamos la caché del usuario y global
      queryClient.removeQueries({ queryKey: ['auth-user'] });
      queryClient.clear();
      toast.info('Cerrando sesión');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    }
  };

  const clearUser = () => {
    queryClient.removeQueries({ queryKey: ['auth-user'] });
  };

  // El valor del contexto ahora se basa en la caché de React Query
  const value = useMemo(
    () => ({
      user: user || null,
      loading: isLoading,
      adminLogin,
      studentLogin,
      logout,
      clearUser,
    }),
    [user, isLoading, adminLogin, studentLogin, logout, clearUser],
  );

  // No mostrar nada durante verificación de auth (es instantáneo desde caché)
  // Esto evita el parpadeo del LoadingScreen
  if (isLoading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};