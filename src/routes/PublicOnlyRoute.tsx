import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@hooks/use-auth.ts';
import type { User } from '@types';

// Helper para obtener la ruta de redirección según el rol del usuario
const getRedirectForUser = (user: User): string => {
  if (user.rol === 'Admin') return '/admin/dashboard';
  if (user.rol === 'Student') return '/student/home';
  return '/';
};

export const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();

  // No mostrar nada durante verificación de auth (es instantáneo desde caché)
  // Esto evita el parpadeo del LoadingScreen
  if (loading) {
    return null;
  }

  // Si HAY usuario autenticado, redirigir según su rol
  if (user) {
    return <Navigate to={getRedirectForUser(user)} replace />;
  }

  // Si NO hay usuario, mostrar la ruta pública
  return <Outlet />;
};