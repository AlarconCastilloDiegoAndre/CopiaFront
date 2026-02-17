import { Home } from 'lucide-react';

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
  description: string;
}

export const studentNavigationItems: NavigationItem[] = [
  {
    name: 'Inicio',
    path: '/student/home',
    icon: Home,
    description: 'Panel principal',
  },
];

/**
 * Verifica si una ruta está activa
 * @param path Ruta del item de navegación
 * @param currentPath Pathname actual del location
 */
export const isStudentRouteActive = (path: string, currentPath: string): boolean => {
  if (path === '/student/home') {
    return currentPath === path || currentPath.startsWith('/student/profile');
  }
  return currentPath.startsWith(path);
};
