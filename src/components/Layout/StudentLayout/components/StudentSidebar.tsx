import { FaTimes } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconBox } from '@components/IconBox';
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { studentNavigationItems, isStudentRouteActive } from '@components/Layout/StudentLayout/studentNavigation.ts';
import { StudentUserMenu } from './StudentUserMenu.tsx';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        flex flex-col h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Header del Sidebar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <IconBox icon={<GraduationCap className="w-7 h-7 text-white" />} />
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              Portal Estudiantil
            </h1>
            <p className="text-xs text-gray-500 mt-1">UAQ</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
        >
          <FaTimes className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
        {studentNavigationItems.map((item) => {
          const Icon = item.icon;
          const active = isStudentRouteActive(item.path, location.pathname);

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-start gap-3 px-4 py-3 rounded-lg
                text-sm font-medium transition-all
                ${active
                ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 border border-transparent'
              }
              `}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${active ? 'text-[#003366]' : 'text-gray-500'
                }`}
              />
              <div className="flex-1 text-left">
                <div
                  className={`font-semibold ${active ? 'text-[#003366]' : 'text-gray-900'
                  }`}
                >
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer con menú de usuario */}
      <StudentUserMenu />
    </aside>
  );
};
