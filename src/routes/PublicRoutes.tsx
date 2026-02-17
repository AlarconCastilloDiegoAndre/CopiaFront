import { Route } from 'react-router-dom';
import { PublicOnlyRoute } from '@/routes/PublicOnlyRoute.tsx';
import { LoginPage } from '@pages/public/login/LoginPage.tsx';

/**
 * Rutas públicas - solo accesibles si NO estás autenticado
 */
export const PublicRoutes = () => {
  return (
    <Route element={<PublicOnlyRoute />}>
      <Route path="/" element={<LoginPage />} />
    </Route>
  );
};