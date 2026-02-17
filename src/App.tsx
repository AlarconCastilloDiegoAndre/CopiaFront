import MainLayout from '@components/Layout/MainLayout.tsx';
import { Routes, Route } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@components/Sonner/ui/sonner.tsx';
import { ModalRenderer } from '@components/ModalRenderer';
import { PublicRoutes } from '@/routes/PublicRoutes.tsx';
import { AdminRoutes } from '@/routes/AdminRoutes.tsx';
import { StudentRoutes } from '@/routes/StudentRoutes.tsx';
import { ProtectedRoute } from '@/routes/ProtectedRoute.tsx';
import { lazy, Suspense } from 'react';

const DbaResetPage = lazy(() => import('@pages/dba/DbaResetPage'));

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        expand
        closeButton
      />
      <ModalRenderer />
      <Routes>
        {/* Ruta DBA — Protegida por Admin*/}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route
            path="/dba/reset"
            element={
              <Suspense fallback={null}>
                <DbaResetPage />
              </Suspense>
            }
          />
        </Route>

        {/* Resto de rutas con layout */}
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                {PublicRoutes()}
                {AdminRoutes()}
                {StudentRoutes()}
                <Route
                  path="*"
                  element={
                    <div style={{ padding: 20 }}>
                      <h2>Página no encontrada (404)</h2>
                    </div>
                  }
                />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;