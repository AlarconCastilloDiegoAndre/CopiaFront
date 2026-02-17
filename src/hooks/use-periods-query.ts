import { useQuery } from '@tanstack/react-query';
import { getPeriodsService } from '@services';

export const usePeriodsQuery = () => {
    return useQuery({
        queryKey: ['periods'],
        queryFn: getPeriodsService,
        staleTime: 1000 * 60 * 5,
    });
};