import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

interface UseChangePasswordProps {
  changePasswordService: (params: ChangePasswordParams) => Promise<any>;
  minPasswordLength: number;
}

// Tipos de errores específicos
type FieldError = 'currentPassword' | 'newPassword' | 'confirmPassword' | null;

export const useChangePassword = ({ changePasswordService, minPasswordLength }: UseChangePasswordProps) => {
  // Estado para el formulario de contraseña
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Estado para errores específicos de campo
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Limpiar errores
  const clearErrors = () => {
    setFieldError(null);
    setErrorMessage('');
  };

  // Parsear errores del backend
  const parseBackendError = (error: any): { field: FieldError; message: string } => {
    const message = error?.response?.data?.message || error?.message || '';
    const messageLower = message.toLowerCase();

    // Detectar tipo de error basado en el mensaje
    if (
      messageLower.includes('misma contraseña') ||
      messageLower.includes('same password') ||
      messageLower.includes('debe ser diferente') ||
      messageLower.includes('must be different') ||
      messageLower.includes('nueva contraseña debe ser diferente')
    ) {
      return {
        field: 'newPassword',
        message: 'La nueva contraseña debe ser diferente a la actual',
      };
    }

    if (
      messageLower.includes('contraseña actual') ||
      messageLower.includes('current password') ||
      messageLower.includes('incorrecta') ||
      messageLower.includes('incorrect') ||
      messageLower.includes('invalid password') ||
      messageLower.includes('contraseña inválida')
    ) {
      return {
        field: 'currentPassword',
        message: 'La contraseña actual es incorrecta',
      };
    }

    if (
      messageLower.includes('muy corta') ||
      messageLower.includes('too short') ||
      messageLower.includes('mínimo') ||
      messageLower.includes('minimum') ||
      messageLower.includes('at least')
    ) {
      return {
        field: 'newPassword',
        message: `La contraseña debe tener al menos ${minPasswordLength} caracteres`,
      };
    }

    // Error genérico
    return {
      field: null,
      message: message || 'Error al cambiar la contraseña. Intenta de nuevo.',
    };
  };

  // Mutation para cambiar contraseña
  const changePasswordMutation = useMutation({
    mutationFn: changePasswordService,
    onSuccess: (data) => {
      toast.success(data.message || 'Contraseña actualizada exitosamente');
      resetForm();
      setShowPasswordForm(false);
    },
    onError: (error: any) => {
      const { field, message } = parseBackendError(error);
      setFieldError(field);
      setErrorMessage(message);

      // También mostrar toast para errores generales
      if (!field) {
        toast.error(message);
      }
    },
  });

  // Resetear formulario
  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    clearErrors();
  };

  // Verificar si hay cambios
  const hasChanges = currentPassword.trim() !== '' || newPassword.trim() !== '' || confirmPassword.trim() !== '';

  // Validación en tiempo real de nueva contraseña vs actual
  const isSameAsCurrentPassword = currentPassword.length > 0 && newPassword.length > 0 && currentPassword === newPassword;

  // Manejar submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    // Validación: contraseñas no coinciden
    if (newPassword !== confirmPassword) {
      setFieldError('confirmPassword');
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    // Validación: longitud mínima
    if (newPassword.length < minPasswordLength) {
      setFieldError('newPassword');
      setErrorMessage(`La contraseña debe tener al menos ${minPasswordLength} caracteres`);
      return;
    }

    // Validación: nueva contraseña igual a la actual
    if (currentPassword === newPassword) {
      setFieldError('newPassword');
      setErrorMessage('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  // Manejar cancelación
  const handleCancel = () => {
    setShowPasswordForm(false);
    resetForm();
  };

  // Limpiar error de campo específico al escribir
  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    if (fieldError === 'currentPassword') {
      clearErrors();
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (fieldError === 'newPassword') {
      clearErrors();
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (fieldError === 'confirmPassword') {
      clearErrors();
    }
  };

  return {
    // Estados del formulario
    showPasswordForm,
    setShowPasswordForm,
    currentPassword,
    setCurrentPassword: handleCurrentPasswordChange,
    newPassword,
    setNewPassword: handleNewPasswordChange,
    confirmPassword,
    setConfirmPassword: handleConfirmPasswordChange,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,

    // Errores
    fieldError,
    errorMessage,
    clearErrors,

    // Validaciones en tiempo real
    isSameAsCurrentPassword,

    // Helpers
    hasChanges,
    handleSubmit,
    handleCancel,

    // Mutation
    isLoading: changePasswordMutation.isPending,

    // Config
    minPasswordLength,
  };
};