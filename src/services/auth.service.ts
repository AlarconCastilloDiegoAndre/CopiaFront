import { api } from '@lib/axios';

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

/**
 * Cambia la contraseña del estudiante autenticado
 */
export const changePasswordService = async (data: ChangePasswordDTO) => {
  const response = await api.patch('/auth/students/change-password', data);
  return response.data;
};

export interface ChangeAdminPasswordDTO {
  currentPassword: string;
  newPassword: string;
}

/**
 * Cambia la contraseña del administrador autenticado
 */
export const changeAdminPasswordService = async (data: ChangeAdminPasswordDTO) => {
  const response = await api.patch('/auth/admins/change-password', data);
  return response.data;
};