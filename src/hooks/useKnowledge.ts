import { useQuery } from '@tanstack/react-query';
import { knowledgeApi, Knowledge } from '@/services/api';

export const useRecentKnowledge = () => {
  return useQuery({
    queryKey: ['knowledge', 'recent'],
    queryFn: knowledgeApi.getRecentKnowledge,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllKnowledge = () => {
  return useQuery({
    queryKey: ['knowledge'],
    queryFn: knowledgeApi.getAllKnowledge,
    staleTime: 5 * 60 * 1000,
  });
};

export const useKnowledge = (id: string) => {
  return useQuery({
    queryKey: ['knowledge', id],
    queryFn: () => knowledgeApi.getKnowledge(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};