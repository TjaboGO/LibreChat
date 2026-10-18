import { request } from 'librechat-data-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, QueryObserverResult } from '@tanstack/react-query';

export interface CoworkTask {
  id: string;
  conversationId?: string;
  title: string;
  type: 'scheduled' | 'task';
  status: 'running' | 'queued' | 'completed';
  timeAgo: string;
}

export interface CoworkTasksResponse {
  tasks: CoworkTask[];
}

export const useCoworkTasksQuery = (
  config?: UseQueryOptions<CoworkTasksResponse>,
): QueryObserverResult<CoworkTasksResponse> => {
  return useQuery<CoworkTasksResponse>(
    ['coworkTasks'],
    () => request.get<CoworkTasksResponse>('/api/cowork/tasks'),
    {
      refetchInterval: 10_000,
      refetchOnWindowFocus: true,
      ...config,
    },
  );
};

export const useClearCoworkTasksMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((taskIds?: string[]) => request.post('/api/cowork/tasks/clear', { taskIds }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['coworkTasks']);
    },
  });
};

export const useDeleteCoworkTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => request.delete(`/api/cowork/tasks/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['coworkTasks']);
    },
  });
};

export const useCreateCoworkTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { title: string; type?: 'scheduled' | 'task'; conversationId?: string }) =>
      request.post('/api/cowork/tasks', data) as Promise<CoworkTask>,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['coworkTasks']);
      },
    },
  );
};
