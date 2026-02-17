import { getCareerSubjectService } from '@services';
import { useQuery } from '@tanstack/react-query';

export const useCareerSubjectsQuery = (careerId: string | undefined) => {
  return useQuery({
    queryKey: ['career-subjects', careerId],
    queryFn: () => getCareerSubjectService(careerId!),
    enabled: !!careerId,
    staleTime: 1000 * 60 * 5,
  });
};