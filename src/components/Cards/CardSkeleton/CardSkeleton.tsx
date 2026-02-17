import React from 'react';
import { Skeleton } from '@/components/Sonner/ui/skeleton';
import { cn } from '@components/Sonner/lib/utils';

type CardSkeletonVariant = 'career' | 'stat' | 'subject' | 'period';

interface CardSkeletonProps {
    variant?: CardSkeletonVariant;
    count?: number;
    className?: string;
}

/**
 * CardSkeleton
 * 
 * Componente skeleton reutilizable para diferentes tipos de cards.
 * Proporciona un indicador visual de carga que se asemeja a la estructura de las cards reales.
 * 
 * @param variant - Tipo de card a representar: 'career', 'stat', 'subject', 'period'
 * @param count - Número de skeletons a renderizar (default: 1)
 * @param className - Clases adicionales para el contenedor
 */
const CardSkeleton: React.FC<CardSkeletonProps> = ({
    variant = 'career',
    count = 1,
    className,
}) => {
    const renderCareerSkeleton = () => (
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
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 hidden sm:block" />
            </div>
        </div>
    );

    const renderStatSkeleton = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-9 w-16" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
        </div>
    );

    const renderSubjectSkeleton = () => (
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

    const renderPeriodSkeleton = () => (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );

    const renderSkeleton = () => {
        switch (variant) {
            case 'career':
                return renderCareerSkeleton();
            case 'stat':
                return renderStatSkeleton();
            case 'subject':
                return renderSubjectSkeleton();
            case 'period':
                return renderPeriodSkeleton();
            default:
                return renderCareerSkeleton();
        }
    };

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {Array.from({ length: count }).map((_, index) => (
                <React.Fragment key={index}>
                    {renderSkeleton()}
                </React.Fragment>
            ))}
        </div>
    );
};

export default CardSkeleton;
