import { request } from 'librechat-data-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ManagedProcessInfo, ExposedPortInfo } from 'librechat-data-provider';
import type { UseQueryOptions, QueryObserverResult } from '@tanstack/react-query';

export interface ProcessesResponse {
  ok: boolean;
  processes: ManagedProcessInfo[];
}

export interface ProcessOutputResponse {
  ok: boolean;
  process: ManagedProcessInfo;
  output: string;
}

export interface ExposedPortsResponse {
  ok: boolean;
  ports: ExposedPortInfo[];
}

/**
 * Hook to query active managed processes
 */
export const useProcessesQuery = (
  config?: UseQueryOptions<ProcessesResponse>,
): QueryObserverResult<ProcessesResponse> => {
  return useQuery<ProcessesResponse>(
    ['manusProcesses'],
    () => request.get<ProcessesResponse>('/api/cowork/processes'),
    {
      refetchInterval: 3_000,
      refetchOnWindowFocus: true,
      ...config,
    },
  );
};

/**
 * Hook to view a specific process output
 */
export const useProcessOutputQuery = (
  id: string,
  tail = 50,
  config?: UseQueryOptions<ProcessOutputResponse>,
): QueryObserverResult<ProcessOutputResponse> => {
  return useQuery<ProcessOutputResponse>(
    ['manusProcessOutput', id, tail],
    () => request.get<ProcessOutputResponse>(`/api/cowork/processes/${id}?tail=${tail}`),
    {
      enabled: !!id,
      refetchInterval: 2_000,
      ...config,
    },
  );
};

/**
 * Mutation to send interactive stdin input to a running process
 */
export const useSendStdinMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, input }: { id: string; input: string }) =>
      request.post(`/api/cowork/processes/${id}/stdin`, { input }),
    {
      onSuccess: (_data, { id }) => {
        queryClient.invalidateQueries(['manusProcessOutput', id]);
        queryClient.invalidateQueries(['manusProcesses']);
      },
    },
  );
};

/**
 * Mutation to terminate a process
 */
export const useKillProcessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, signal }: { id: string; signal?: string }) =>
      request.post(`/api/cowork/processes/${id}/kill`, { signal }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['manusProcesses']);
      },
    },
  );
};

/**
 * Hook to query exposed ports
 */
export const useExposedPortsQuery = (
  config?: UseQueryOptions<ExposedPortsResponse>,
): QueryObserverResult<ExposedPortsResponse> => {
  return useQuery<ExposedPortsResponse>(
    ['manusExposedPorts'],
    () => request.get<ExposedPortsResponse>('/api/cowork/ports'),
    {
      refetchInterval: 5_000,
      ...config,
    },
  );
};

/**
 * Mutation to expose a port
 */
export const useExposePortMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { port: number; protocol?: string; ttlMinutes?: number; targetService?: string }) =>
      request.post('/api/cowork/ports/expose', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['manusExposedPorts']);
      },
    },
  );
};

/**
 * Mutation to close an exposed port
 */
export const useClosePortMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (port: number) => request.delete(`/api/cowork/ports/${port}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['manusExposedPorts']);
      },
    },
  );
};
