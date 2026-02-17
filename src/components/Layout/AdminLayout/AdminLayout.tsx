import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import { AdminSidebar } from '@components/Layout/AdminLayout/components/AdminSidebar.tsx';
import { AdminHeader } from '@components/Layout/AdminLayout/components/AdminHeader.tsx';

/**
 * AdminLayout
 * Layout principal para todas las rutas de administración
 * Incluye sidebar persistente y área de contenido con <Outlet />
 */
const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Overlay para móvil cuando el sidebar está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header superior - Solo visible en móvil */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Área de contenido con scroll */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;