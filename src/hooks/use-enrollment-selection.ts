import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCareerSubjectsBySemesterService } from '@services/career-subject.service';
import { createEnrollmentBatchService, getMyEnrollmentStatusService } from '@services/enrollments.service';
import { useAuthUser } from '@hooks/use-auth-user';
import { usePeriodsQuery } from '@hooks/use-periods-query';
import type { Student, CareerSubject, EnrollmentType, EnrollmentItem } from '@types';
import { toast } from 'sonner';

const MAX_SUBJECTS = 8;

export const useEnrollmentSelection = () => {
  const queryClient = useQueryClient();

  // --- DATOS DEL USUARIO Y PERIODO ---
  const { data: userData } = useAuthUser();
  const student = userData as Student;
  const { data: periods = [] } = usePeriodsQuery();
  const activePeriod = periods.find((p) => p.active);

  // --- VERIFICAR SI YA TIENE INSCRIPCIÓN CONFIRMADA ---
  const {
    data: enrollmentStatus,
    isLoading: isLoadingStatus,
  } = useQuery({
    queryKey: ['enrollment-status', student?.studentId],
    queryFn: () => getMyEnrollmentStatusService(student.studentId),
    enabled: !!student?.studentId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const hasConfirmedEnrollment = enrollmentStatus?.hasConfirmedEnrollment ?? false;

  // --- ESTADO DE SELECCIÓN POR TIPO ---
  const [normalIds, setNormalIds] = useState<Set<number>>(new Set());
  const [adelantoIds, setAdelantoIds] = useState<Set<number>>(new Set());
  const [recursamientoIds, setRecursamientoIds] = useState<Set<number>>(new Set());

  // --- ESTADO DE MODALES ---
  const [isAdelantoModalOpen, setAdelantoModalOpen] = useState(false);
  const [isRecursamientoModalOpen, setRecursamientoModalOpen] = useState(false);

  // --- QUERIES: Materias por semestre ---

  // Materias del semestre actual (NORMAL)
  const {
    data: currentSemesterSubjects = [],
    isLoading: isLoadingCurrent,
    error: errorCurrent,
  } = useQuery({
    queryKey: ['career-subjects', student?.career?.careerId, student?.semester],
    queryFn: () => getCareerSubjectsBySemesterService(student.career.careerId, student.semester),
    enabled: !!student?.career?.careerId && !!student?.semester && !hasConfirmedEnrollment,
  });

  // Materias para ADELANTO (semestre + 1)
  const { data: adelantoSubjects1 = [] } = useQuery({
    queryKey: ['career-subjects', student?.career?.careerId, student?.semester + 1],
    queryFn: () => getCareerSubjectsBySemesterService(student.career.careerId, student.semester + 1),
    enabled: !!student?.career?.careerId && !!student?.semester && !hasConfirmedEnrollment,
  });

  // Materias para ADELANTO (semestre + 2)
  const { data: adelantoSubjects2 = [] } = useQuery({
    queryKey: ['career-subjects', student?.career?.careerId, student?.semester + 2],
    queryFn: () => getCareerSubjectsBySemesterService(student.career.careerId, student.semester + 2),
    enabled: !!student?.career?.careerId && !!student?.semester && !hasConfirmedEnrollment,
  });

  // Semestres anteriores para RECURSAMIENTO
  const recursamientoQueries = useMemo(() => {
    if (!student?.semester) return [];
    const semesters = [];
    for (let i = 1; i < student.semester; i++) {
      semesters.push(i);
    }
    return semesters;
  }, [student?.semester]);

  // Query para todos los semestres anteriores
  const recursamientoResults = useQuery({
    queryKey: ['career-subjects-recursamiento', student?.career?.careerId, recursamientoQueries],
    queryFn: async () => {
      if (!student?.career?.careerId || recursamientoQueries.length === 0) return [];

      const results = await Promise.all(
        recursamientoQueries.map((sem) =>
          getCareerSubjectsBySemesterService(student.career.careerId, sem)
        )
      );
      return results.flat();
    },
    enabled: !!student?.career?.careerId && recursamientoQueries.length > 0 && !hasConfirmedEnrollment,
  });

  const recursamientoSubjects = recursamientoResults.data || [];

  // Combinar materias de adelanto
  const adelantoSubjects = useMemo(() => {
    return [...adelantoSubjects1, ...adelantoSubjects2];
  }, [adelantoSubjects1, adelantoSubjects2]);

  // --- COMPUTED VALUES ---

  const totalSelected = normalIds.size + adelantoIds.size + recursamientoIds.size;
  const remaining = MAX_SUBJECTS - totalSelected;
  const isMaxReached = totalSelected >= MAX_SUBJECTS;

  const isAllNormalSelected =
    currentSemesterSubjects.length > 0 &&
    normalIds.size === currentSemesterSubjects.length;

  // --- FUNCIONES DE TOGGLE CON LÍMITE ---

  const toggleNormal = useCallback((id: number) => {
    setNormalIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        // Calcular total actual sin contar el set que se está modificando
        const otherCount = adelantoIds.size + recursamientoIds.size;
        if (newSet.size + otherCount >= MAX_SUBJECTS) {
          toast.error(`Máximo ${MAX_SUBJECTS} materias en total`);
          return prev;
        }
        newSet.add(id);
      }
      return newSet;
    });
  }, [adelantoIds.size, recursamientoIds.size]);

  const toggleAdelanto = useCallback((id: number) => {
    setAdelantoIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        const otherCount = normalIds.size + recursamientoIds.size;
        if (newSet.size + otherCount >= MAX_SUBJECTS) {
          toast.error(`Máximo ${MAX_SUBJECTS} materias en total`);
          return prev;
        }
        newSet.add(id);
      }
      return newSet;
    });
  }, [normalIds.size, recursamientoIds.size]);

  const toggleRecursamiento = useCallback((id: number) => {
    setRecursamientoIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        const otherCount = normalIds.size + adelantoIds.size;
        if (newSet.size + otherCount >= MAX_SUBJECTS) {
          toast.error(`Máximo ${MAX_SUBJECTS} materias en total`);
          return prev;
        }
        newSet.add(id);
      }
      return newSet;
    });
  }, [normalIds.size, adelantoIds.size]);

  // Toggle all para normales (respetando el límite)
  const toggleSelectAllNormal = useCallback(() => {
    setNormalIds((prev) => {
      // Si ya están todas seleccionadas, deseleccionar
      if (prev.size === currentSemesterSubjects.length && currentSemesterSubjects.length > 0) {
        return new Set();
      }

      // Calcular cuántas más podemos agregar
      const otherCount = adelantoIds.size + recursamientoIds.size;
      const availableSlots = MAX_SUBJECTS - otherCount;

      if (availableSlots <= 0) {
        toast.error(`Máximo ${MAX_SUBJECTS} materias en total`);
        return prev;
      }

      // Tomar solo las que caben
      const allIds = currentSemesterSubjects.map((cs: CareerSubject) => cs.career_subject_id);

      if (allIds.length > availableSlots) {
        toast.warning(`Solo se seleccionaron ${availableSlots} de ${allIds.length} materias por el límite de ${MAX_SUBJECTS}`);
        return new Set(allIds.slice(0, availableSlots));
      }

      return new Set(allIds);
    });
  }, [currentSemesterSubjects, adelantoIds.size, recursamientoIds.size]);

  // --- MUTATION: Enviar inscripción ---

  const submitMutation = useMutation({
    mutationFn: createEnrollmentBatchService,
    onSuccess: (data) => {
      toast.success(data.message);
      // Limpiar selecciones
      setNormalIds(new Set());
      setAdelantoIds(new Set());
      setRecursamientoIds(new Set());
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-status'] });
    },
    onError: (error: any) => {
      const errors = error?.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        errors.forEach((err: string) => toast.error(err));
      } else {
        toast.error(error?.response?.data?.message || 'Error al enviar la inscripción');
      }
    },
  });

  // --- HANDLER: Submit ---

  const handleSubmit = useCallback(() => {
    if (!student || !activePeriod) {
      toast.error('No se pudo obtener la información necesaria');
      return;
    }

    if (totalSelected === 0) {
      toast.error('Debes seleccionar al menos una materia');
      return;
    }

    if (totalSelected > MAX_SUBJECTS) {
      toast.error(`No puedes inscribir más de ${MAX_SUBJECTS} materias`);
      return;
    }

    // Construir items
    const items: EnrollmentItem[] = [
      ...Array.from(normalIds).map((id) => ({
        careerSubjectId: id,
        type: 'NORMAL' as EnrollmentType,
      })),
      ...Array.from(adelantoIds).map((id) => ({
        careerSubjectId: id,
        type: 'ADELANTO' as EnrollmentType,
      })),
      ...Array.from(recursamientoIds).map((id) => ({
        careerSubjectId: id,
        type: 'RECURSAMIENTO' as EnrollmentType,
      })),
    ];

    submitMutation.mutate({
      periodId: activePeriod.periodId,
      items,
    });
  }, [student, activePeriod, normalIds, adelantoIds, recursamientoIds, totalSelected, submitMutation]);

  // --- RETURN ---

  return {
    // Datos
    student,
    activePeriod,

    // Estado de inscripción
    hasConfirmedEnrollment,
    enrollmentStatus,
    isLoadingStatus,

    // Materias
    currentSemesterSubjects,
    adelantoSubjects,
    recursamientoSubjects,

    // Loading/Error
    isLoading: isLoadingCurrent || isLoadingStatus,
    error: errorCurrent,
    isSubmitting: submitMutation.isPending,

    // Selecciones
    normalIds,
    adelantoIds,
    recursamientoIds,
    totalSelected,
    totalNormal: normalIds.size,
    totalAdelanto: adelantoIds.size,
    totalRecursamiento: recursamientoIds.size,
    isAllNormalSelected,

    // Límite
    maxSubjects: MAX_SUBJECTS,
    remaining,
    isMaxReached,

    // Toggles
    toggleNormal,
    toggleAdelanto,
    toggleRecursamiento,
    toggleSelectAllNormal,

    // Modales
    isAdelantoModalOpen,
    isRecursamientoModalOpen,
    openAdelantoModal: () => setAdelantoModalOpen(true),
    closeAdelantoModal: () => setAdelantoModalOpen(false),
    openRecursamientoModal: () => setRecursamientoModalOpen(true),
    closeRecursamientoModal: () => setRecursamientoModalOpen(false),

    // Submit
    handleSubmit,
  };
};