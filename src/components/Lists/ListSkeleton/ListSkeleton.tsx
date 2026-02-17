import React from 'react';
import { Skeleton } from '@/components/Sonner/ui/skeleton';
import { cn } from '@components/Sonner/lib/utils';

type ListSkeletonVariant = 'card' | 'row';

interface ListSkeletonProps {
    items?: number;
    variant?: ListSkeletonVariant;
    className?: string;
}

/**
 * ListSkeleton
 * 
 * Componente skeleton reutilizable para listas verticales.
 * Replica la estructura visual de listas como SubjectList.
 * 
 * @param items - Número de elementos en la lista (default: 3)
 * @param variant - Tipo de item: 'card' (tipo SubjectCard) o 'row' (items simples)
 * @param className - Clases adicionales para el contenedor
 */
const ListSkeleton: React.FC<ListSkeletonProps> = ({
    items = 3,
    variant = 'card',
    className,
}) => {
    const renderCardItem = () => (
        <div
            className="
        bg-white rounded-lg shadow-md overflow-hidden
        flex items-stretch w-full h-25 min-h-[80px]
      "
        >
            {/* Square lateral skeleton */}
            <Skeleton className="w-[72px] sm:w-[120px] min-w-[72px] sm:min-w-[96px] flex-shrink-0 rounded-l-lg rounded-r-none" />

            {/* Contenido principal */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 flex flex-col justify-center gap-2 w-full min-w-0">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3 hidden sm:block" />
            </div>
        </div>
    );

    const renderRowItem = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    );

    const renderItem = () => {
        return variant === 'card' ? renderCardItem() : renderRowItem();
    };

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {Array.from({ length: items }).map((_, index) => (
                <React.Fragment key={index}>
                    {renderItem()}
                </React.Fragment>
            ))}
        </div>
    );
};

export default ListSkeleton;
