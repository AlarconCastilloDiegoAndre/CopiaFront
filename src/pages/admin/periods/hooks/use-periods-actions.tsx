import { renderErrorDescription } from '@utils/renderErrorDescription.tsx';
import { usePeriods } from './use-periods.ts';
import { useModalStore } from '@stores/useModalStore.ts';
import { useCallback } from 'react';
import { AlertTriangle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { CreatePeriodDto, UpdatePeriodDto } from '@types';

export const usePeriodsActions = () => {
  const {
    deletePeriod,
    updatePeriod,
    createPeriod,
    advanceSemester,
    upcomingPeriods,
    ...dataProps
  } = usePeriods();

  const { onOpen, onClose } = useModalStore();

  // --- SUBMIT: Crear período ---
  const onSubmitCreate = useCallback(
    async (data: CreatePeriodDto) => {
      return toast.promise(
        createPeriod(data),
        {
          loading: 'Creando período...',
          success: () => {
            onClose();
            return 'Período creado con éxito';
          },
          error: (err) => {
            onClose();
            return (
              <div className="flex flex-col gap-1">
                <p className="font-bold text-base">Error al crear</p>
                <div className="text-sm opacity-90">
                  {renderErrorDescription(err)}
                </div>
              </div>
            );
          },
        },
      );
    },
    [createPeriod, onClose],
  );

  // --- SUBMIT: Actualizar período ---
  const onSubmitEdit = useCallback(
    async (data: UpdatePeriodDto) => {
      return toast.promise(
        updatePeriod(data),
        {
          loading: 'Actualizando período...',
          success: () => {
            onClose();
            return 'Período actualizado con éxito';
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
    [updatePeriod, onClose],
  );

  // --- SUBMIT: Eliminar período ---
  const onSubmitDelete = useCallback(
    async (periodId: string) => {
      return toast.promise(deletePeriod(periodId), {
        loading: `Eliminando período "${periodId}"...`,
        success: () => {
          onClose();
          return 'Período eliminado con éxito';
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
    [deletePeriod, onClose],
  );

  // --- SUBMIT: Avanzar Semestre ---
  const onSubmitAdvance = useCallback(
    async (data: { nextPeriodId: string }) => {
      return toast.promise(advanceSemester(data.nextPeriodId), {
        loading: 'Avanzando de semestre...',
        success: () => {
          onClose();
          return 'Semestre avanzado con éxito';
        },
        error: (err) => {
          onClose();
          return (
            <div className="flex flex-col gap-1">
              <p className="font-bold text-base">Error al avanzar</p>
              <div className="text-sm opacity-90">
                {renderErrorDescription(err)}
              </div>
            </div>
          );
        },
      });
    },
    [advanceSemester, onClose],
  );

  // --- Abrir modal para eliminar período ---
  const handleDeleteClick = useCallback(
    (periodId: string) => {
      onOpen({
        type: 'confirm',
        isOpen: true,
        data: {
          title: 'Eliminar período',
          variant: 'danger',
          message: (
            <>
              ¿Estás seguro de que deseas eliminar el período{' '}
              <span className="font-semibold">"{periodId}"</span>?
              <div className="text-red-700 text-sm text-center mt-2">
                *Esta acción no se puede deshacer*
              </div>
            </>
          ),
          onConfirm: () => onSubmitDelete(periodId),
        },
      });
    },
    [onOpen, onSubmitDelete],
  );

  // --- Abrir modal de edición ---
  const handleEditClick = useCallback(
    (periodId: string, startDate: string, endDate: string) => {
      onOpen({
        type: 'form',
        isOpen: true,
        data: {
          mode: 'edit',
          title: 'Editar período',
          icon: <Calendar size={30} />,
          submitLabel: 'Guardar Cambios',
          fields: [
            {
              name: 'startDate',
              label: 'Fecha de apertura',
              required: true,
              type: 'date',
            },
            {
              name: 'endDate',
              label: 'Fecha de cierre',
              required: true,
              type: 'date',
            },
          ],
          initialData: {
            periodId,
            startDate,
            endDate,
          },
          onSubmit: onSubmitEdit,
        },
      });
    },
    [onOpen, onSubmitEdit],
  );

  // --- Abrir modal de creación ---
  const handleCreateClick = useCallback(
    () => {
      onOpen({
        type: 'form',
        isOpen: true,
        data: {
          mode: 'create',
          title: 'Crear nuevo período',
          icon: <Calendar size={30} />,
          submitLabel: 'Crear Período',
          fields: [
            {
              name: 'periodId',
              label: 'ID del Período',
              required: true,
              type: 'text',
              placeholder: 'Ej: 2025-AGO-DIC',
              helperText: 'Formato: AAAA-MMM-MMM',
              mask: '0000-aaa-aaa',
            },
            {
              name: 'startDate',
              label: 'Fecha de apertura',
              required: true,
              type: 'date',
            },
            {
              name: 'endDate',
              label: 'Fecha de cierre',
              required: true,
              type: 'date',
            },
          ],
          onSubmit: onSubmitCreate,
        },
      });
    },
    [onOpen, onSubmitCreate],
  );

  // --- Handler para Avanzar Semestre con Advertencia ---
  const handleAdvanceSemesterClick = useCallback(() => {
    if (!upcomingPeriods || upcomingPeriods.length === 0) {
      toast.warning('No hay períodos futuros disponibles para avanzar.');
      return;
    }

    const periodOptions = upcomingPeriods.map((p) => ({
      label: p.periodId,
      value: p.periodId,
    }));

    onOpen({
      type: 'form',
      isOpen: true,
      data: {
        mode: 'create',
        title: 'Avanzar Semestre',
        icon: <AlertTriangle size={30} className="text-yellow-600" />,
        iconBgColor: 'bg-[#fef3c7]',
        submitLabel: 'Entiendo, Avanzar Semestre',
        description: (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-r text-amber-900 text-sm text-left">
            <p className="font-bold flex items-center gap-2 mb-2">
              <AlertTriangle size={18} />
              Acción Irreversible
            </p>
            <p className="mb-2">
              Al realizar esta acción ocurrirá lo siguiente:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-1 opacity-90">
              <li>Los estudiantes de <b>último semestre</b> serán graduados.</li>
              <li>El resto de los estudiantes <b>avanzarán</b> al siguiente semestre.</li>
              <li>Se actualizarán los historiales académicos.</li>
            </ul>
          </div>
        ),
        fields: [
          {
            name: 'nextPeriodId',
            label: 'Selecciona el período destino',
            required: true,
            type: 'select',
            options: periodOptions,
            placeholder: 'Seleccione el próximo período...',
          },
        ],
        onSubmit: onSubmitAdvance,
      },
    });
  }, [onOpen, upcomingPeriods, onSubmitAdvance]);

  return {
    ...dataProps,
    upcomingPeriods,
    handleDeleteClick,
    handleEditClick,
    handleCreateClick,
    handleAdvanceSemesterClick,
  };
};