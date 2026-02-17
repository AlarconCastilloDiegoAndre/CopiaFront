import { useQuery } from '@tanstack/react-query';
import { getCareersService } from '@services';

export const useCareersQuery = () => {
    return useQuery({
        queryKey: ['careers'],
        queryFn: getCareersService,
        staleTime: 1000 * 60 * 10, // 10 minutos
    });
};