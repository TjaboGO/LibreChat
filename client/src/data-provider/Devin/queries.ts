import { request } from 'librechat-data-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, QueryObserverResult } from '@tanstack/react-query';

export interface ArchitectureModule {
  id: string;
  title: string;
  path: string;
  description: string;
  tech: string[];
  keyFiles: string[];
  dependencies: string[];
  status: 'active' | 'stable' | 'deprecated';
}

export interface WikiCitation {
  repo: string;
  path: string;
  start: number;
  end: number;
  description: string;
}

export interface DeepWikiResponse {
  ok: boolean;
  repository: {
    name: string;
    description: string;
    root: string;
    version: string;
  };
  diagram: string;
  modules: ArchitectureModule[];
  citations: WikiCitation[];
  guidelines: {
    citationFormat: string;
    mermaidRules: string;
    discipline: string;
  };
}

export interface InspectCodePayload {
  path: string;
  startLine?: number;
  endLine?: number;
}

export interface InspectCodeResponse {
  ok: boolean;
  path: string;
  isDirectory: boolean;
  entries?: string[];
  totalLines?: number;
  startLine?: number;
  endLine?: number;
  content?: string;
  snippet?: string;
  sizeBytes?: number;
  error?: string;
}

export interface GenerateWikiPayload {
  topic?: string;
  targetPath?: string;
}

export interface GenerateWikiResponse {
  ok: boolean;
  topic: string;
  generatedAt: string;
  module: ArchitectureModule;
  message: string;
}

/**
 * Hook to query repository architecture wiki and module map
 */
export const useDeepWikiQuery = (
  config?: UseQueryOptions<DeepWikiResponse>,
): QueryObserverResult<DeepWikiResponse> => {
  return useQuery<DeepWikiResponse>(
    ['devinDeepWiki'],
    () => request.get<DeepWikiResponse>('/api/cowork/devin/wiki'),
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      ...config,
    },
  );
};

/**
 * Mutation to inspect a specific file or line range in the repository
 */
export const useInspectCodeMutation = () => {
  return useMutation<InspectCodeResponse, Error, InspectCodePayload>((payload) =>
    request.post<InspectCodeResponse>('/api/cowork/devin/inspect', payload),
  );
};

/**
 * Mutation to generate targeted DeepWiki analysis for a module
 */
export const useGenerateWikiMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<GenerateWikiResponse, Error, GenerateWikiPayload>(
    (payload) => request.post<GenerateWikiResponse>('/api/cowork/devin/wiki/generate', payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['devinDeepWiki']);
      },
    },
  );
};
