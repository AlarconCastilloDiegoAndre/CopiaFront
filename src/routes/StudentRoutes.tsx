import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute.tsx';
import StudentLayout from '@components/Layout/StudentLayout/StudentLayout.tsx';
import { lazy } from 'react';

// Lazy de las paginas de estudiantes
const StudentHome = lazy(() => import('@pages/student/home/StudentHome'));
const StudentProfile = lazy(() => import('@pages/student/profile/StudentProfile'));

/**
 * Todas las rutas protegidas del panel de estudiantes
 */
export const StudentRoutes = () => {
  return (
    <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
      <Route element={<StudentLayout />}>
        <Route path="/student/home" element={<StudentHome />} />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Route>
    </Route>
  );
};