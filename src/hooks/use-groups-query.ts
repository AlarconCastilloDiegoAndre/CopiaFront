import { getGroupsService } from '@services/admin.service.ts';
import { useQuery } from '@tanstack/react-query';

export const useGroupsQuery = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: getGroupsService
  });
};