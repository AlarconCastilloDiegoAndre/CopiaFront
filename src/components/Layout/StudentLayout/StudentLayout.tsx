import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import { StudentSidebar } from './components/StudentSidebar.tsx';
import { StudentHeader } from './components/StudentHeader.tsx';

/**
 * StudentLayout
 * Layout principal para todas las rutas de estudiante
 * Incluye sidebar persistente y área de contenido con <Outlet />
 */
const StudentLayout: React.FC = () => {
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
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header superior - Solo visible en móvil */}
        <StudentHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Área de contenido con scroll */}
        <div className="flex-1 h-screen overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
