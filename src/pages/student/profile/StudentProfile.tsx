import { useAuthUser } from '@hooks/use-auth-user';
import { changePasswordService } from '@services/auth.service';
import {
  Mail,
  GraduationCap,
  BookOpen,
  Users,
  Hash,
  Loader2,
} from 'lucide-react';
import type { Student } from '@types';
import { ChangePasswordForm } from '@components/profile/ChangePasswordForm';

export default function StudentProfile() {
  const { data: user } = useAuthUser();
  const student = user as Student;

  if (!student) {
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
                <div
                  className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {student.name?.charAt(0)?.toUpperCase() || 'E'}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-gray-500 text-sm">Estudiante</p>

                {/* Estado */}
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${student.status === 'ACTIVO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {student.status}
                  </span>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-gray-100 my-6"></div>

              {/* Info Básica */}
              <div className="space-y-4 flex-1">
                {/* Expediente */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Hash size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expediente</p>
                    <p className="font-semibold text-gray-900">{student.studentId}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Mail size={16} className="text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Correo</p>
                    <p className="font-semibold text-gray-900 truncate">{student.email || 'No registrado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD DERECHA - Info Académica + Seguridad */}
          <div className="lg:col-span-2 flex">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full flex flex-col">
              {/* Información Académica */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap size={20} className="text-blue-600" />
                  Información Académica
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Carrera */}
                  <div className="sm:col-span-2 flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BookOpen size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Carrera</p>
                      <p className="font-semibold text-gray-900">{student.career?.name || 'No asignada'}</p>
                      <p className="text-xs text-gray-500">{student.career?.careerId}</p>
                    </div>
                  </div>

                  {/* Semestre */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <GraduationCap size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Semestre</p>
                      <p className="text-2xl font-bold text-gray-900">{student.semester}°</p>
                    </div>
                  </div>

                  {/* Grupo */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-3 bg-cyan-100 rounded-lg">
                      <Users size={20} className="text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Grupo</p>
                      <p className="text-2xl font-bold text-gray-900">{student.groupNo}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-gray-100 my-6"></div>

              {/* Seguridad - Cambiar Contraseña */}
              <ChangePasswordForm
                changePasswordService={changePasswordService}
                minPasswordLength={8}
                buttonColor="blue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
