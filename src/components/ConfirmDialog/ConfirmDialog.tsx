import React, { Fragment } from 'react';
import { Description, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { CheckCircle, Info, OctagonAlert, X } from 'lucide-react';

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
  footer?: React.ReactNode;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = (
  {
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    isLoading = false,
    footer,
  }) => {
  // Determina qué botón debe tener el foco inicial
  const shouldFocusConfirm = variant === 'success' || variant === 'info';
  const shouldFocusCancel = variant === 'danger' || variant === 'warning';

  // Configuración de variantes con colores simplificados para header
  const variantConfig = {
    danger: {
      icon: OctagonAlert,
      iconBgColor: '#fee2e2',
      iconColor: '#C91F1F',
      buttonBgColor: 'bg-[#C91F1F]',
      buttonHoverColor: 'hover:bg-[#C20324]',
    },
    warning: {
      icon: OctagonAlert,
      iconBgColor: '#fef3c7',
      iconColor: '#d97706',
      buttonBgColor: 'bg-yellow-600',
      buttonHoverColor: 'hover:bg-yellow-700',
    },
    info: {
      icon: Info,
      iconBgColor: '#dbeafe',
      iconColor: '#013e79',
      buttonBgColor: 'bg-main-color',
      buttonHoverColor: 'hover:bg-[#004a99]',
    },
    success: {
      icon: CheckCircle,
      iconBgColor: '#dcfce7',
      iconColor: '#16a34a',
      buttonBgColor: 'bg-green-600',
      buttonHoverColor: 'hover:bg-green-700',
    },
  } as const;

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={onClose}>
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        {/* Contenedor */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">

                {/* Header */}
                <div
                  className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
                >
                  {/* Título con ícono */}
                  <DialogTitle
                    className="flex items-center gap-3 text-xl font-semibold"
                  >
                    <div
                      className="flex items-center justify-center rounded-lg p-2"
                      style={{ backgroundColor: config.iconBgColor }}
                    >
                      <Icon className="w-5 h-5" style={{ color: config.iconColor }} />
                    </div>
                    {title}
                  </DialogTitle>

                  {/* Botón cerrar (X) */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-2xl transition-colors hover:bg-gray-100 rounded-full p-2"
                    style={{ color: '#6b7280' }}
                    disabled={isLoading}
                    aria-label="Cerrar diálogo"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Contenido del diálogo */}
                <div className="pt-0 px-6 pb-3">
                  <Description as="div" className="text-sm text-gray-600 text-justify">
                    {message}
                  </Description>

                  {footer && (
                    <div className="mt-3 text-sm text-center">
                      {footer}
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      autoFocus={shouldFocusCancel}
                      className="flex-1 justify-center rounded-md border border-gray-300
                      bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100
                      focus-ring-global disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {cancelText}
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={isLoading}
                      autoFocus={shouldFocusConfirm}
                      className={`
                        flex-1 justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white
                        ${config.buttonBgColor} ${config.buttonHoverColor}
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] focus-visible:ring-offset-1
                        disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"
                                    fill="none" />
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Procesando...
                        </>
                      ) : (
                        confirmText
                      )}
                    </button>
                  </div>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmDialog;