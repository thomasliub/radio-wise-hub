import { useQuery } from '@tanstack/react-query';
import { agentApi, Agent } from '@/services/api';

export const useRecentAgents = () => {
  return useQuery({
    queryKey: ['agents', 'recent'],
    queryFn: agentApi.getRecentAgents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: agentApi.getAllAgents,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAgent = (id: string) => {
  return useQuery({
    queryKey: ['agents', id],
    queryFn: () => agentApi.getAgent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};