import { renderErrorDescription } from '@utils/renderErrorDescription.tsx';
import { useModalStore } from '@stores/useModalStore.ts';
import type { Subject, SubjectDto } from '@types';
import { useState, useCallback } from 'react';
import { useSubjects } from './use-subjects.ts';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { searchSubjectService } from '@services';

export const useSubjectsActions = () => {
  const { onOpen, onClose } = useModalStore();

  // --- UI: estado del buscador (solo UI) ---
  const [searchTerm, setSearchTerm] = useState('');

  // --- Scroll control ---
  const [scrollToSubjectId, setScrollToSubjectId] = useState<number | null>(null);

  const clearScrollTarget = useCallback(() => {
    setScrollToSubjectId(null);
  }, []);

  // --- Hook de datos (ya maneja debounce y filtros internos) ---
  const {
    subjects,
    isLoading,
    hasNextPage,
    fetchNextPage,
    createSubject,
    updateSubject,
    deleteSubject,
    isError,
    error,
    refetch,
  } = useSubjects(searchTerm);

  // --- Helper: Buscar una materia específica usando el ID como filtro ---
  const fetchUntilSubjectFound = useCallback(async (subjectId: number) => {
    try {
      // Buscar usando el ID como término de búsqueda (mucho más eficiente)
      const response = await searchSubjectService(subjectId.toString(), 1);

      // Verificar si la materia está en los resultados
      const found = response.data.some((s: Subject) => s.subjectId === subjectId);

      return found;
    } catch (error) {
      console.error('Error buscando materia:', error);
      return false;
    }
  }, []);

  // --- SUBMIT: Crear materia ---
  const onSubmitCreate = useCallback(
    async (data: { subjectId: string | number; name: string }) => {
      return toast.promise(
        createSubject({
          subjectId: Number(data.subjectId),
          name: data.name,
        }).then(async (result) => {
          onClose();

          // Temporalmente filtrar por el ID de la nueva materia
          setSearchTerm(result.subjectId.toString());

          // Esperar un momento para que el query se actualice
          await new Promise(resolve => setTimeout(resolve, 500));

          // Verificar que la materia esté cargada
          await fetchUntilSubjectFound(result.subjectId);

          // Hacer scroll
          setTimeout(() => setScrollToSubjectId(result.subjectId), 100);

          return result;
        }),
        {
          loading: 'Creando materia...',
          success: 'Materia creada con éxito',
          error: (err) => (
            <div className="flex flex-col gap-1">
              <p className="font-bold text-base">Error</p>
              <div>{renderErrorDescription(err)}</div>
            </div>
          ),
        },
      );
    },
    [createSubject, onClose, fetchUntilSubjectFound],
  );

  // --- SUBMIT: Editar materia ---
  const onSubmitEdit = useCallback(
    async (data: SubjectDto) => {
      return toast.promise(
        updateSubject(data).then(async (result) => {
          onClose();

          // Temporalmente filtrar por el ID de la materia editada
          setSearchTerm(result.subjectId.toString());

          // Esperar un momento para que el query se actualice
          await new Promise(resolve => setTimeout(resolve, 500));

          // Verificar que la materia esté cargada
          await fetchUntilSubjectFound(result.subjectId);

          // Hacer scroll
          setTimeout(() => setScrollToSubjectId(result.subjectId), 100);

          return result;
        }),
        {
          loading: 'Actualizando materia...',
          success: 'Materia actualizada con éxito',
          error: (err) => (
            <div className="flex flex-col gap-1">
              <p className="font-bold text-base">Error al actualizar</p>
              <div className="text-sm opacity-90">{renderErrorDescription(err)}</div>
            </div>
          ),
        },
      );
    },
    [updateSubject, onClose, fetchUntilSubjectFound],
  );

  // --- SUBMIT: Eliminar materia ---
  const onSubmitDelete = useCallback(
    async (id: number, name: string) => {
      return toast.promise(deleteSubject(id), {
        loading: `Eliminando "${name}"...`,
        success: () => {
          onClose();
          return 'Materia eliminada con éxito';
        },
        error: (err) => (
          <div className="flex flex-col gap-1">
            <p className="font-bold text-base">Error al eliminar</p>
            <div className="text-sm opacity-90">{renderErrorDescription(err)}</div>
          </div>
        ),
      });
    },
    [deleteSubject, onClose],
  );

  // --- Abrir modal de creación ---
  const handleOpenCreateModal = useCallback(() => {
    onOpen({
      type: 'form',
      isOpen: true,
      data: {
        mode: 'create',
        title: 'Crear nueva materia',
        icon: <BookOpen size={30} />,
        fields: [
          {
            name: 'subjectId',
            label: 'Clave de Materia (ID)',
            required: true,
            placeholder: 'Ej: 2077',
            type: 'text',
          },
          {
            name: 'name',
            label: 'Nombre de la Materia',
            placeholder: 'Ej: Base de datos',
            required: true,
            type: 'text',
          },
        ],
        onSubmit: onSubmitCreate,
      },
    });
  }, [onOpen, onSubmitCreate]);

  // --- Abrir modal de edición ---
  const handleOpenEditModal = useCallback(
    (subject: Subject) => {
      onOpen({
        type: 'form',
        isOpen: true,
        data: {
          mode: 'edit',
          title: 'Editar materia',
          icon: <BookOpen size={30} />,
          submitLabel: 'Confirmar',
          fields: [
            {
              name: 'name',
              label: 'Nombre de la Materia',
              placeholder: 'Ej: Base de datos',
              required: true,
              type: 'text',
            },
          ],
          initialData: subject,
          onSubmit: onSubmitEdit,
        },
      });
    },
    [onOpen, onSubmitEdit],
  );

  // --- Abrir modal de eliminar ---
  const handleDeleteClick = useCallback(
    (id: number, name: string) => {
      onOpen({
        type: 'confirm',
        isOpen: true,
        data: {
          title: 'Eliminar Materia',
          variant: 'danger',
          message: (
            <>
              ¿Estás seguro de que deseas eliminar la materia{' '}
              <span className="font-semibold">"{name}"</span>?
              <div className="text-red-700 text-sm text-center mt-2">
                *Esta acción no se puede deshacer*
              </div>
            </>
          ),
          onConfirm: () => onSubmitDelete(id, name),
        },
      });
    },
    [onOpen, onSubmitDelete],
  );

  return {
    // Datos
    subjects,
    isLoading,
    hasNextPage,
    fetchNextPage,

    // Manejo de errores
    isError,
    error,
    refetch,

    // Search UI
    searchTerm,
    setSearchTerm,

    // Scroll
    scrollToSubjectId,
    clearScrollTarget,

    // Acciones
    handleOpenCreateModal,
    handleOpenEditModal,
    handleDeleteClick,
  };
};