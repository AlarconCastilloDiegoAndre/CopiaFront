import { renderErrorDescription } from '@utils/renderErrorDescription.tsx';
import { useCareerDetail } from './use-career-detail.ts';
import { useModalStore } from '@stores/useModalStore.ts';
import { useCallback, useMemo } from 'react';
import { LuBookOpen } from 'react-icons/lu';
import { toast } from 'sonner';

export const useCareerDetailActions = (
  careerId: string | undefined,
  searchTerm: string,
) => {
  const {
    removeSubjectFromCareer,
    updateSubjectSemester,
    ...dataProps
  } = useCareerDetail(careerId, searchTerm);

  const { onOpen, onClose } = useModalStore();

  // Opciones estáticas para selector de semestre
  const SEMESTER_OPTIONS = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => i + 1).map((s) => ({
        value: s,
        label: `Semestre ${s}`,
      })),
    [],
  );

  // --- SUBMIT: Actualizar semestre ---
  const onSubmitEdit = useCallback(
    async (data: { newSemester: string | number; careerSubjectId: number }) => {
      return toast.promise(
        updateSubjectSemester({
          careerSubjectId: Number(data.careerSubjectId),
          newSemester: Number(data.newSemester),
        }),
        {
          loading: 'Actualizando asignación...',
          success: () => {
            onClose();
            return 'Asignación actualizada con éxito';
          },
          error: (err) => {
            onClose();
            return (
              <div className="flex flex-col gap-1">
                <p className="font-bold text-base">Error al actualizar</p>
                <div className="text-sm opacity-90">
                  {renderErrorDescription(err)}
                </div>
              </div>
            );
          },
        },
      );
    },
    [updateSubjectSemester, onClose],
  );

  // --- SUBMIT: Eliminar asignación materia-carrera ---
  const onSubmitRemove = useCallback(
    async (subjectId: number, name: string) => {
      if (!careerId) {
        console.error('careerId no está definido');
        return;
      }

      return toast.promise(removeSubjectFromCareer(subjectId), {
        loading: `Removiendo "${name}"...`,
        success: () => {
          onClose();
          return 'Asignación eliminada con éxito';
        },
        error: (err) => {
          onClose();
          return (
            <div className="flex flex-col gap-1">
              <p className="font-bold text-base">Error al eliminar</p>
              <div className="text-sm opacity-90">
                {renderErrorDescription(err)}
              </div>
            </div>
          );
        },
      });
    },
    [careerId, removeSubjectFromCareer, onClose],
  );

  // --- Abrir modal para remover materia ---
  const handleRemoveClick = useCallback(
    (subjectId: number, name: string) => {
      onOpen({
        type: 'confirm',
        data:
          {
            title: 'Remover materia...',
            message: (
              <>
                ¿Estás seguro de que deseas remover{' '}
                <span className="font-semibold">"{name}"</span> del plan de estudios?
                <div className="text-red-700 text-sm text-center mt-2">
                  *Esta acción no se puede deshacer*
                </div>
              </>
            ),
            variant: 'danger',
            onConfirm: () => onSubmitRemove(subjectId, name),
          },
        isOpen: true,
      });
    },
    [onOpen, onSubmitRemove],
  );

  // --- Abrir modal de edición ---
  const handleEditClick = useCallback(
    (careerSubjectId: number, currentSemester: number) => {
      onOpen({
        type: 'form',
        data:
          {
            mode: 'edit',
            title: 'Editar semestre',
            fields: [
              {
                name: 'newSemester',
                label: 'Nuevo Semestre',
                required: true,
                type: 'select',
                options: SEMESTER_OPTIONS,
              },
            ],
            icon: <LuBookOpen size={30} />,
            submitLabel: 'Guardar Cambios',
            initialData: {
              newSemester: currentSemester,
              careerSubjectId,
            },
            onSubmit: onSubmitEdit,
          },
        isOpen: true,
      });
    },
    [onOpen, onSubmitEdit, SEMESTER_OPTIONS],
  );

  return {
    ...dataProps,
    handleRemoveClick,
    handleEditClick,
  };
};
