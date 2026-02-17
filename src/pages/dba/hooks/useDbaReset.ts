import { useCallback, useEffect, useState } from 'react';
import type { DbaStudentResult } from '@services/dba.service';
import {
  resetStudentPasswordDbaService,
  searchStudentsDbaService,
  validateDbaTokenService,
} from '@services/dba.service';
import { toast } from 'sonner';

type Tab = 'passwords' | 'logs';

export const useDbaReset = (token: string) => {
  // Estado de validación
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Tab activa
  const [activeTab, setActiveTab] = useState<Tab>('passwords');

  // Estado de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DbaStudentResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Estado de estudiante seleccionado
  const [selectedStudent, setSelectedStudent] = useState<DbaStudentResult | null>(null);

  // Estado del formulario
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Validar token al montar
  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setIsValidating(false);
        return;
      }
      try {
        const result = await validateDbaTokenService(token);
        setIsAuthorized(result.valid);
      } catch {
        setIsAuthorized(false);
      } finally {
        setIsValidating(false);
      }
    };
    validate();
  }, [token]);

  // Buscar estudiantes con debounce
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchStudentsDbaService(token, searchTerm);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm, token]);

  // Seleccionar estudiante
  const handleSelectStudent = useCallback((student: DbaStudentResult) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchTerm('');
    setNewPassword('');
    setConfirmPassword('');
  }, []);

  // Resetear contraseña
  const handleReset = async () => {
    if (!selectedStudent) return;

    if (newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsResetting(true);
    try {
      const result = await resetStudentPasswordDbaService(
        token,
        selectedStudent.studentId,
        newPassword,
      );
      toast.success(result.message);
      setSelectedStudent(null);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Error al resetear contraseña');
    } finally {
      setIsResetting(false);
    }
  };

  return {
    // Estado de validación
    isValidating,
    isAuthorized,

    // Tabs
    activeTab,
    setActiveTab,

    // Búsqueda
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,

    // Estudiante seleccionado
    selectedStudent,
    setSelectedStudent,
    handleSelectStudent,

    // Formulario
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    isResetting,
    handleReset,
  };
};
