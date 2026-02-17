import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@hooks/use-auth.ts';

interface ProtectedRouteProps {
  allowedRoles: Array<'Admin' | 'Student'>;
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // No mostrar nada durante verificación de auth (es instantáneo desde caché)
  // Esto evita el parpadeo del LoadingScreen
  if (loading) {
    return null;
  }

  // Si NO hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario NO tiene el rol permitido, redirigir a "No Autorizado"
  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si tod está bien, mostrar la página
  return <Outlet />;
};