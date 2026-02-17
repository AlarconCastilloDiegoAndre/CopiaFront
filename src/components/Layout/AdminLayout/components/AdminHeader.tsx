import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { adminNavigationItems, isAdminRouteActive } from '@components/Layout/AdminLayout/adminNavigation.ts';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const currentPage =
    adminNavigationItems.find((item) =>
      isAdminRouteActive(item.path, location.pathname),
    )?.name || 'Administración';

  return (
    <header
      className="lg:hidden relative h-16 bg-white border-b border-gray-200 flex items-center justify-center px-6 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 absolute left-4"
      >
        <FaBars className="w-6 h-6 text-gray-700" />
      </button>

      <h2 className="text-lg font-semibold text-gray-900 text-center">
        {currentPage}
      </h2>
    </header>
  );
};