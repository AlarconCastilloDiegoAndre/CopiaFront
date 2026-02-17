import { renderErrorDescription } from '@utils/renderErrorDescription.tsx';
import { useAssignSubject } from './use-assign-subject.ts';
import { useModalStore } from '@stores/useModalStore.ts';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { Subject } from '@types';
import { useDebounce } from 'use-debounce';
import type { CreateCareerSubjectDTO } from '../types';

const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9];

type Selected = {
  subject: Subject;
  semester: number;
};

// Hook ORQUESTADOR: Maneja el estado de la UI y la lógica de acciones
export const useAssignSubjectActions = () => {
  const { onOpen, onClose } = useModalStore();
  const navigate = useNavigate();

  // --- ESTADO DE LA UI ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<Selected[]>([]);
  const [useSameSemester, setUseSameSemester] = useState(false);
  const [unifiedSemester, setUnifiedSemester] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  // --- DATOS (del hook de datos) ---
  const {
    careerId,
    searchResults,
    isSearching,
    hasNextPage,
    fetchNextPage,
    isSaving,
    saveError,
    saveAssignments,
  } = useAssignSubject(debouncedSearchTerm);

  // --- SUBMIT: Guardar asignaciones ---
  const onSubmitSave = useCallback(
    async () => {
      if (!careerId) {
        toast.error('Falta el ID de la carrera');
        return;
      }

      // Mapear al DTO que espera la API
      const dtos: CreateCareerSubjectDTO[] = selectedSubjects.map((sel) => ({
        careerId: careerId,
        subjectId: sel.subject.subjectId,
        semester: sel.semester,
      }));

      return toast.promise(saveAssignments(dtos), {
        loading: 'Guardando asignaciones...',
        success: () => {
          onClose();
          navigate(`/admin/careers/${careerId}`);
          return 'Materias asignadas correctamente.';
        },
        error: (err) => {
          onClose();
          return (
            <div className="flex flex-col gap-1">
              <p className="font-bold text-base">Error</p>
              <div className="text-sm opacity-90">{renderErrorDescription(err)}</div>
            </div>
          );
        },
      });
    },
    [careerId, selectedSubjects, saveAssignments, onClose, navigate],
  );

  // --- HANDLERS DE MATERIAS SELECCIONADAS ---
  const handleAddSubject = useCallback(
    (subject: Subject) => {
      const exists = selectedSubjects.some(
        (p) => p.subject.subjectId === subject.subjectId,
      );
      if (exists) {
        toast.info('Esa materia ya está en la lista', { id: 'duplicated-subject' });
        return;
      }
      // Usa unifiedSemester si useSameSemester esta habilitado, si no default 1
      const semesterToAssign = useSameSemester ? unifiedSemester : 1;
      setSelectedSubjects((prev) => [...prev, { subject, semester: semesterToAssign }]);
      setSearchTerm('');
    },
    [selectedSubjects, useSameSemester, unifiedSemester],
  );

  const removeSelectedSubject = useCallback((subjectId: number | string) => {
    setSelectedSubjects((prev) => prev.filter((p) => p.subject.subjectId !== subjectId));
  }, []);

  const clearSelectedSubjects = useCallback(() => {
    setSelectedSubjects([]);
    setSearchTerm('');
  }, []);

  const setSubjectSemester = useCallback((subjectId: number | string, semester: number) => {
    setSelectedSubjects((prev) =>
      prev.map((p) =>
        p.subject.subjectId === subjectId ? { ...p, semester } : p,
      ),
    );
  }, []);

  const handleUnifiedSemesterChange = useCallback((newSemester: number) => {
    setUnifiedSemester(newSemester);
    setSelectedSubjects((prev) =>
      prev.map((sel) => ({ ...sel, semester: newSemester })),
    );
  }, []);

  // --- Abrir modal de limpiar lista ---
  const handleClearConfirm = useCallback(() => {
    if (selectedSubjects.length === 0) return;

    onOpen({
      type: 'confirm',
      isOpen: true,
      data: {
        title: 'Limpiar lista',
        message: '¿Estás seguro?',
        variant: 'danger',
        onConfirm: () => {
          onClose();
          clearSelectedSubjects();
        },
      },
    });
  }, [selectedSubjects.length, onOpen, onClose, clearSelectedSubjects]);

  // --- Abrir modal de confirmar asignaciones ---
  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e?.preventDefault) e.preventDefault();

      if (!careerId) {
        toast.error('Falta el ID de la carrera');
        return;
      }
      if (selectedSubjects.length === 0) {
        toast.error('Agrega materias antes de guardar.');
        return;
      }

      onOpen({
        type: 'confirm',
        isOpen: true,
        data: {
          title: 'Confirmar asignaciones',
          variant: 'info',
          message: (
            <span>
              Se {selectedSubjects.length === 1 ? 'asignará' : 'asignarán'}{' '}
              <span className="font-bold">{selectedSubjects.length}</span>{' '}
              {selectedSubjects.length === 1 ? 'materia' : 'materias'}.
              ¿Deseas continuar?
            </span>
          ),
          onConfirm: onSubmitSave,
        },
      });
    },
    [careerId, selectedSubjects.length, onOpen, onSubmitSave],
  );

  return {
    // Datos
    careerId,
    searchTerm,
    setSearchTerm,
    selectedSubjects,
    searchResults,
    // Estados de carga
    isSearching,
    isSaving,
    saveError,
    // Paginación
    hasNextPage,
    fetchNextPage,
    // Estado de UI local
    useSameSemester,
    setUseSameSemester,
    unifiedSemester,
    semesters,
    // Funciones
    handleAddSubject,
    removeSelectedSubject,
    setSubjectSemester,
    handleUnifiedSemesterChange,
    handleClearConfirm,
    handleSubmit,
  };
};