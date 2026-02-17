import { BookOpen, Calendar, GraduationCap, LayoutDashboard, Route } from 'lucide-react';

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
  description: string;
}

export const adminNavigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Panel principal',
  },
  {
    name: 'Estudiantes',
    path: '/admin/students',
    icon: GraduationCap,
    description: 'Directorio de estudiantes',
  },
  {
    name: 'Materias',
    path: '/admin/subjects',
    icon: BookOpen,
    description: 'Gestión de materias',
  },
  {
    name: 'Planes de Estudio',
    path: '/admin/careers',
    icon: Route,
    description: 'Gestión de planes',
  },
  {
    name: 'Periodos',
    path: '/admin/periods',
    icon: Calendar,
    description: 'Gestión de periodos',
  },
];

/**
 * Verifica si una ruta está activa
 * @param path Ruta del item de navegación
 * @param currentPath Pathname actual del location
 */
export const isAdminRouteActive = (path: string, currentPath: string): boolean => {
  if (path === '/admin/dashboard') {
    return currentPath === path
      || currentPath.startsWith('/admin/enrollments')
      || currentPath.startsWith('/admin/profile');
  }
  return currentPath.startsWith(path);
};
