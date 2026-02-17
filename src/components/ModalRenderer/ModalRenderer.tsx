import { useModalStore } from '@stores/useModalStore.ts';
import FormModal from '@components/FormModal';
import ConfirmDialog from '@components/ConfirmDialog';

// Definir fuera del componente para que sea una constante estable
const STABLE_EMPTY_OBJECT = {};

// Configuración de estilos para FormModal según su propósito
const FORM_MODAL_CONFIG = {
  create: {
    submitLabel: 'Confirmar',
  },
  edit: {
    submitLabel: 'Guardar Cambios',
  },
};

/**
 * ModalRenderer
 *
 * Renderiza modales basándose en el estado global de useModalStore.
 * No provee contexto, solo es responsable de mostrar el modal correcto.
 */
export const ModalRenderer = () => {
  const modal = useModalStore();

  if (!modal.isOpen) return null;

  // Si es CUALQUIER tipo de formulario
  if (modal.type === 'form') {
    // Determinamos el modo (default: 'create')
    const mode = modal.data.mode || 'create';
    const config = FORM_MODAL_CONFIG[mode] || FORM_MODAL_CONFIG.create; // Fallback seguro

    return (
      <FormModal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        title={modal.data.title}
        icon={modal.data.icon}
        submitLabel={modal.data.submitLabel || config.submitLabel}
        fields={modal.data.fields}
        onSubmit={modal.data.onSubmit}
        initialData={modal.data.initialData || STABLE_EMPTY_OBJECT}
        iconBgColor={modal.data.iconBgColor}
        description={modal.data.description}
      />
    );
  }

  // Si es CUALQUIER tipo de confirmación
  if (modal.type === 'confirm') {
    return (
      <ConfirmDialog
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        title={modal.data.title}
        message={modal.data.message}
        onConfirm={modal.data.onConfirm}
        variant={modal.data.variant || 'info'}
      />
    );
  }

  return null;
};
