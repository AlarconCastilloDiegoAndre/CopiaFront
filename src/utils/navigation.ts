import type { User } from '@types';

/**
 * Obtiene la ruta por defecto según el rol del usuario
 * @param user - Usuario autenticado o null
 * @returns Ruta por defecto
 */
export const getDefaultRoute = (user: User | null): string => {
    if (!user) return '/';

    const roleRoutes: Record<string, string> = {
        Admin: '/admin/dashboard',
        Student: '/student/home',
    };

    return roleRoutes[user.rol] || '/';
};
