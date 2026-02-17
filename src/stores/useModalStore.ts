import { create } from 'zustand';
import type { ReactNode } from 'react';

type FormField = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'password' | 'number' | 'select' | 'date';
  disabled?: boolean;
  mask?: string;
  options?: { value: any; label: string }[];
  helperText?: string;
};

// --- TIPOS PARA CADA MODAL ---
interface FormModalData {
  mode: 'create' | 'edit';
  title: string;
  icon?: ReactNode;
  submitLabel?: string;
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => any;
  initialData?: Record<string, any>;
  iconBgColor?: string;
  description?: ReactNode;
}

interface ConfirmModalData {
  title: string;
  message: string | ReactNode;
  onConfirm: () => any;
  variant?: 'info' | 'danger' | 'warning';
}

// --- DISCRIMINATED UNION ---
// Esto garantiza que type y data estén siempre sincronizados
type ModalState =
  | { type: 'form'; data: FormModalData; isOpen: true }
  | { type: 'confirm'; data: ConfirmModalData; isOpen: true }
  | { type: null; data: null; isOpen: false };

// --- STORE ---
interface ModalActions {
  onOpen: (modal: Exclude<ModalState, { type: null }>) => void;
  onClose: () => void;
}

type ModalStore = ModalState & ModalActions;

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,

  onOpen: (modal) => set(modal),
  onClose: () => set({ type: null, data: null, isOpen: false }),
}));

// --- TIPOS DE EXPORTACIÓN PARA USO EXTERNO ---
export type { FormModalData, ConfirmModalData };