import React from 'react';
import { Skeleton } from '@/components/Sonner/ui/skeleton';

/**
 * PageSkeleton
 *
 * Skeleton genérico para lazy loading de páginas completas.
 * Se usa como fallback en React Suspense para evitar mostrar LoadingSpinner
 * antes de los skeletons específicos de cada página.
 */
const PageSkeleton: React.FC = () => {
  return (
    <main className="max-w-[80rem] mx-auto p-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </main>
  );
};

export default PageSkeleton;
