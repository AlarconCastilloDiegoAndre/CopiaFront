import React from 'react';
import { cn } from '@components/Sonner/lib/utils';
import { Skeleton } from '@components/Sonner/ui/skeleton.tsx';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showFilters?: boolean;
  className?: string;
}

/**
 * TableSkeleton
 *
 * Componente skeleton reutilizable para tablas.
 * Replica la estructura visual de las tablas del proyecto (EnrollmentsTable, StudentsTable).
 *
 * @param columns - Número de columnas (default: 4)
 * @param rows - Número de filas de datos (default: 5)
 * @param showFilters - Mostrar skeleton para filtros (default: true)
 * @param className - Clases adicionales para el contenedor
 */
const TableSkeleton: React.FC<TableSkeletonProps> = (
  {
    columns = 4,
    rows = 5,
    showFilters = true,
    className,
  }) => {
  return (
    <div
      className={cn('bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col', className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <Skeleton className="h-6 w-48" />
      </div>

      {/* Filtros (opcional) */}
      {showFilters && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          {/* Table Header */}
          <thead className="bg-main-color text-white border-b border-gray-200">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <Skeleton className="h-4 w-24 bg-white/20" />
              </th>
            ))}
          </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton className={cn(
                    'h-4',
                    colIndex === 0 ? 'w-32' : colIndex === columns - 1 ? 'w-16' : 'w-24',
                  )} />
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Footer con paginación */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
