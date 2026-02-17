import { useState } from 'react';
import { useAuth } from '@hooks/use-auth.ts';
import type { StudentLoginDto, StudentRegisterDto } from '@types';
import { registerStudentService } from '@services/students.service.ts';

export type ViewType = 'login' | 'register' | 'forgot-password';

export const useStudentAuth = () => {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const { studentLogin } = useAuth();

  // --- Login Handler ---
  const handleLogin = async (data: StudentLoginDto) => {
    await studentLogin({
      studentId: Number(data.studentId),
      password: data.password,
    });
  };
  
  // --- Register Handler ---
  const handleRegister = async (data: StudentRegisterDto) => {
    // Validar que los campos enmascarados estén completos
    if (!data.studentId) {
      throw new Error('El expediente es requerido');
    }
    if (!data.groupNo) {
      throw new Error('El grupo es requerido');
    }

    const response = await registerStudentService({
      ...data,
      studentId: Number(data.studentId),
      groupNo: Number(data.groupNo),
      semester: data.semester,
    });

    // Solo retornar si el registro fue exitoso
    // El login se manejará desde el componente después de mostrar la pantalla de éxito
    if (response.message !== 'Registro exitoso') {
      throw new Error('Error en el registro');
    }

    return data; // Retornar los datos para hacer login después
  };

  // --- Forgot Password Handler ---
  const handleForgotPassword = async () => {
    // TODO: Implementar servicio de recuperación de contraseña
    alert('Funcionalidad de recuperación de contraseña - Placeholder');
  };

  // --- View Navigation ---
  const goToLogin = () => setCurrentView('login');
  const goToRegister = () => setCurrentView('register');
  const goToForgotPassword = () => setCurrentView('forgot-password');

  return {
    // Estado
    currentView,

    // Handlers
    handleLogin,
    handleRegister,
    handleForgotPassword,

    // Navegación
    goToLogin,
    goToRegister,
    goToForgotPassword,

    // Login function for post-registration
    studentLogin,
  };
};
