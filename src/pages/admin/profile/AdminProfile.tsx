import { useAuthUser } from '@hooks/use-auth-user';
import { changeAdminPasswordService } from '@services/auth.service';
import {
  User,
  Building2,
  Loader2,
  Shield
} from 'lucide-react';
import type { Admin } from '@types';
import { ChangePasswordForm } from '@components/profile/ChangePasswordForm';

export default function AdminProfile() {
  const { data: user } = useAuthUser();
  const admin = user as Admin;

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Grid de dos columnas con altura igual */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* CARD IZQUIERDA - Avatar + Info Básica */}
          <div className="lg:col-span-1 flex">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full flex flex-col">
              {/* Avatar y nombre */}
              <div className="text-center mb-6">
                <div className="w-28 h-28 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {admin.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{admin.name}</h1>
                <p className="text-gray-500 text-sm">Administrador</p>

                {/* Badge de admin */}
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    <Shield size={12} />
                    Admin
                  </span>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-gray-100 my-6"></div>

              {/* Info Básica */}
              <div className="space-y-4 flex-1">
                {/* Username */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Usuario</p>
                    <p className="font-semibold text-gray-900">{admin.username}</p>
                  </div>
                </div>

                {/* Departamento */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building2 size={16} className="text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Departamento</p>
                    <p className="font-semibold text-gray-900">{admin.department || 'No asignado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD DERECHA - Seguridad */}
          <div className="lg:col-span-2 flex">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full flex flex-col">
              {/* Seguridad - Cambiar Contraseña */}
              <div className="flex-1">
                <ChangePasswordForm
                  changePasswordService={changeAdminPasswordService}
                  minPasswordLength={6}
                  buttonColor="slate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
