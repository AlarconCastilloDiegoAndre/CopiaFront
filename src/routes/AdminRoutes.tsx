import { Route } from 'react-router-dom';
import { lazy } from 'react';
import { ProtectedRoute } from '@/routes/ProtectedRoute.tsx';
import AdminLayout from '@components/Layout/AdminLayout/AdminLayout.tsx';
import AdminDashboard from '@pages/admin/dashboard/AdminDashboard.tsx';
import { LazyRoute } from '@/routes/LazyRoute.tsx';


// Lazy loading de páginas de admin
const CareersPage = lazy(() => import('@pages/admin/careers/CareersPage.tsx'));
const CareerDetailPage = lazy(() => import('@pages/admin/career-detail/CareerDetailPage.tsx'));
const AssignSubjectPage = lazy(() => import('@pages/admin/assign-subject/AssignSubjectsPage.tsx'));
const SubjectsPage = lazy(() => import('@pages/admin/subjects/SubjectsPage.tsx'));
const PeriodsPage = lazy(() => import('@pages/admin/periods/PeriodsPage.tsx'));
const StudentsPage = lazy(() => import('@pages/admin/students/StudentsPage.tsx'));
const EnrollmentDetailsPage = lazy(() => import('@pages/admin/enrollments/EnrollmentDetailsPage.tsx'));
const AdminProfile = lazy(() => import('@pages/admin/profile/AdminProfile.tsx'));

/**
 * Todas las rutas protegidas del panel de administración
 */
export const AdminRoutes = () => {
  return (
    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
      <Route element={<AdminLayout />}>
        {/* Dashboard principal */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Perfil del admin */}
        <Route
          path="/admin/profile"
          element={
            <LazyRoute loadingMessage="Cargando perfil...">
              <AdminProfile />
            </LazyRoute>
          }
        />

        {/* Materias */}
        <Route
          path="/admin/subjects"
          element={
            <LazyRoute loadingMessage="Cargando materias...">
              <SubjectsPage />
            </LazyRoute>
          }
        />

        {/* Estudiantes */}
        <Route
          path="/admin/students"
          element={
            <LazyRoute loadingMessage="Cargando estudiantes...">
              <StudentsPage />
            </LazyRoute>
          }
        />

        {/* Planes de Estudio (Carreras) */}
        <Route
          path="/admin/careers"
          element={
            <LazyRoute loadingMessage="Cargando planes de estudio...">
              <CareersPage />
            </LazyRoute>
          }
        />

        <Route
          path="/admin/careers/:careerId"
          element={
            <LazyRoute loadingMessage="Cargando materias del plan...">
              <CareerDetailPage />
            </LazyRoute>
          }
        />

        <Route
          path="/admin/careers/:careerId/assign-subject"
          element={
            <LazyRoute loadingMessage="Preparando asignador de materias...">
              <AssignSubjectPage />
            </LazyRoute>
          }
        />

        {/* Detalles de Inscripción */}
        <Route
          path="/admin/enrollments/details"
          element={
            <LazyRoute loadingMessage="Cargando detalles de inscripción...">
              <EnrollmentDetailsPage />
            </LazyRoute>
          }
        />

        {/* Periodos */}
        <Route
          path="/admin/periods"
          element={
            <LazyRoute loadingMessage="Cargando periodos...">
              <PeriodsPage />
            </LazyRoute>
          }
        />

      </Route>
    </Route>
  );
};