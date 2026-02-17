import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import type { Admin } from '@types';
import { useAuthUser } from '@hooks/use-auth-user.ts';
import { useAuth } from '@hooks/use-auth.ts';

export const AdminUserMenu = () => {
  const navigate = useNavigate();
  const { data: admin } = useAuthUser() as { data: Admin };
  const { logout } = useAuth();

  return (
    <div className="flex-shrink-0 p-4 border-t border-gray-200">
      <Popover className="relative">

        <PopoverButton
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
          bg-gray-50 hover:bg-gray-100 transition-colors focus-ring-global"
        >
          <div
            className="w-8 h-8 bg-main-color rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {admin.name[0]}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-gray-900 truncate">
              {admin.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{admin.department}</p>
          </div>
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{ to: 'top start', gap: '8px' }}
          className="z-[100] w-57 bg-white rounded-lg shadow-lg border
          border-gray-200 py-1 overflow-hidden transition duration-200
            ease-in-out data-[closed]:opacity-0 data-[closed]:translate-y-1"
        >
          <button
            onClick={() => navigate('/admin/profile')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User className="w-4 h-4 text-gray-500" />
            <span>Mi perfil</span>
          </button>

          <div className="border-t border-gray-100 my-1" />

          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-colors"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 text-red-700" />
            <span className="text-red-700">Cerrar sesión</span>
          </button>
        </PopoverPanel>

      </Popover>
    </div>
  );
};
