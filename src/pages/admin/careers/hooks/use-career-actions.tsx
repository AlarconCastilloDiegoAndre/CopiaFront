import { renderErrorDescription } from '@utils/renderErrorDescription.tsx';
import { useModalStore } from '@stores/useModalStore.ts';
import { useNavigate } from 'react-router-dom';
import { useCareer } from './use-career.ts';
import { useCallback } from 'react';
import type { CareerDto } from '../types';
import { toast } from 'sonner';
import { Route } from 'lucide-react';

// Este hook se encarga de las interacciones de la página, uniendo datos y UI
export const useCareerActions = () => {
  const { createCareer, updateCareer, deleteCarrer, ...dataProps } = useCareer();
  const { onOpen, onClose } = useModalStore();
  const navigate = useNavigate();

  // --- HANDLER DE CREACIÓN: Lógica de Submit ---
  const onSubmitCreate = useCallback(async (data: CareerDto) => {
    // Lógica de pre-procesamiento del formulario (limpiar ID y Uppercase)
    data.careerId = data.careerId.replace('-', '').toUpperCase();

    toast.promise(createCareer(data), {
      loading: 'Creando plan de estudios...',
      success: () => {
        navigate(`/admin/careers/${data.careerId}`);
        onClose();
        return `¡Plan de estudios ${data.name} creado correctamente!`;
      },
      error: (err) => (
        <div className="flex flex-col gap-1">
          <p className="font-bold text-base">Error</p>
          <div>{renderErrorDescription(err)}</div>
        </div>
      ),
      duration: 3000,
    });

    onClose();
  }, [createCareer, onClose, navigate]);

  // --- HANDLER DE EDICIÓN: Lógica de Submit ---
  const onSubmitEdit = useCallback(async (
    data: { subjectId: string, newName: string },
  ) => {
    return toast.promise(updateCareer({
        careerId: data.subjectId,
        name: data.newName,
      }), {
        loading: 'Actualizando plan de estudios...',
        success: () => {
          onClose();
          return 'Plan de estudios actualizado con éxito';
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
  }, [updateCareer, onClose]);

  const onSubmitDelete = useCallback(async (careerId: string) => {
    return toast.promise(deleteCarrer(careerId), {
      loading: 'Eliminando plan de estudios...',
      success: () => {
        navigate('/admin/careers', { replace: true });
        onClose();
        return 'Plan de estudios eliminado con éxito';
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
  }, [deleteCarrer, navigate, onClose]);

  // --- HANDLER DE EDICIÓN ---
  const handleEditCareerClick = useCallback(
    (careerId: string, currentName: string) => {
      onOpen({
        type: 'form',
        isOpen: true,
        data: {
          title: `Editar plan ${currentName}`,
          mode: 'edit',
          icon: <Route size={40} />,
          submitLabel: 'Confirmar',
          fields: [{
            name: 'newName',
            label: 'Nombre del plan',
            required: true,
            type: 'text',
          }],
          initialData: {
            newName: currentName,
            subjectId: careerId,
          },
          onSubmit: onSubmitEdit,
        },
      });
    }, [onOpen, onSubmitEdit]);

  // --- HANDLER DE ELIMINACIÓN ---
  const handleDeleteCareerClick = useCallback(
    (careerId: string, name: string) => {
      onOpen({
        type: 'confirm',
        isOpen: true,
        data: {
          title: 'Eliminar plan de estudios',
          variant: 'danger',
          message: (
            <>
              ¿Estás seguro de que deseas eliminar el plan de estudios{' '}
              <span className="font-semibold">"{name}"</span>
              <div className="text-red-700 text-sm text-center mt-2">
                *Esta acción no se puede deshacer*
              </div>
            </>
          ),
          onConfirm: () => onSubmitDelete(careerId),
        },
      });
    }, [onOpen, onSubmitDelete]);

  // Handler para abrir el modal
  const handleCreateClick = useCallback(() => {
    onOpen({
      type: 'form',
      isOpen: true,
      data: {
        mode: 'create',
        title: 'Crear un plan de estudios',
        icon: <Route size={40} />,
        submitLabel: 'Confirmar',
        fields: [
          {
            name: 'careerId',
            label: 'Clave de carrera',
            required: true,
            type: 'text',
            placeholder: 'Ej: SOF-18',
            mask: 'aaa-00',
            helperText: 'Formato: AAA-00 (3 letras y 2 números)',
          },
          {
            name: 'name',
            label: 'Nombre de la Carrera',
            placeholder: 'Ej: Ingeniería en Software',
            required: true,
            type: 'text',
          },
        ],
        onSubmit: onSubmitCreate,
      },
    });
  }, [onOpen, onSubmitCreate]);

  return {
    ...dataProps,
    handleCreateClick,
    handleEditCareerClick,
    handleDeleteCareerClick,
  };
};