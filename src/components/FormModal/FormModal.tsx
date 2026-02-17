import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { IconBox } from '@components/IconBox';
import { FormInput, type FormInputOption, type FormInputType } from '@components/Inputs/FormInput';

// --- TIPOS ---
export type FormField = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: FormInputType;
  disabled?: boolean;
  mask?: string;
  options?: FormInputOption[];
  helperText?: string;
};

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  title: string;
  icon?: React.ReactNode;
  fields: FormField[];
  initialData?: Record<string, any>;
  submitLabel?: string;
  description?: React.ReactNode;
  iconBgColor?: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function FormModal(
  {
    isOpen,
    onClose,
    onSubmit,
    title,
    icon,
    fields,
    initialData = {},
    submitLabel = 'Confirmar',
    iconBgColor = 'bg-main-color',
    description,
  }: FormModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- EFECTO: Resetear formulario al abrir ---
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  // --- COMPUTED: Dirty check ---
  const isFormDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  // --- HANDLER: Change ---
  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  // --- VALIDACIÓN ---
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name] || '';
        const cleanValue = field.mask
          ? value.replace(/[^a-zA-Z0-9]/g, '')
          : value;

        if (!cleanValue || cleanValue.toString().trim() === '') {
          newErrors[field.name] = `${field.label} es requerido`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasErrors = Object.keys(errors).length > 0;

  // --- HANDLER: Submit ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // --- HANDLER: Close ---
  const handleClose = () => {
    setFormData(initialData);
    setErrors({});
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl">
                  <Dialog.Title className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    <IconBox icon={icon} bgColor={iconBgColor} />
                    {title}
                  </Dialog.Title>

                  <button
                    className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={handleSubmit} className="p-6 pt-0">
                  {description && <div className="mb-5">{description}</div>}

                  <div className="space-y-4">
                    {fields.map((field) => (
                      <FormInput
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={(value) => handleChange(field.name, value)}
                        type={field.type}
                        disabled={field.disabled}
                        error={errors[field.name]}
                        required={field.required}
                        mask={field.mask}
                        options={field.options}
                        helperText={field.helperText}
                      />
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-ring-global disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={hasErrors || !isFormDirty}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-main-color rounded-lg hover:bg-[#004a99] disabled:bg-gray-400 transition-colors focus-ring-global disabled:cursor-not-allowed"
                      autoFocus={true}
                    >
                      {submitLabel}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}