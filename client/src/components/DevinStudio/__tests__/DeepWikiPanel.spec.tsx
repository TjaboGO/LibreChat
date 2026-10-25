import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import DeepWikiPanel from '../DeepWikiPanel';

const mockModules = [
  {
    id: 'client',
    title: 'Frontend Client (React 19 & Vite)',
    path: 'client/src',
    description: 'Responsive React 19 app shell with scoped routing.',
    tech: ['React 19', 'Vite', 'Tailwind CSS'],
    keyFiles: ['client/src/routes/AppRoute.tsx'],
    dependencies: ['packages/data-provider'],
    status: 'active' as const,
  },
  {
    id: 'api-server',
    title: 'Express API Server',
    path: 'api/server',
    description: 'Secure Node.js & Express API gateway.',
    tech: ['Node.js', 'Express', 'MongoDB'],
    keyFiles: ['api/server/index.js'],
    dependencies: [],
    status: 'active' as const,
  },
];

const mockCitations = [
  {
    repo: 'Claude Copycat',
    path: 'client/src/routes/AppRoute.tsx',
    start: 25,
    end: 45,
    description: 'Scoped application shell routing and studio view mounting.',
  },
];

const mockInspectMutate = jest.fn();
const mockGenerateMutate = jest.fn();

jest.mock('~/data-provider/Devin/queries', () => ({
  __esModule: true,
  useDeepWikiQuery: () => ({
    data: {
      ok: true,
      repository: { name: 'Claude Copycat', version: 'v0.8.8-rc3' },
      modules: mockModules,
      citations: mockCitations,
    },
    isLoading: false,
    refetch: jest.fn(),
  }),
  useInspectCodeMutation: () => ({
    mutate: mockInspectMutate,
    isLoading: false,
    data: {
      ok: true,
      path: 'client/src/routes/AppRoute.tsx',
      totalLines: 47,
      snippet: '0025 | function AppRoute()',
    },
  }),
  useGenerateWikiMutation: () => ({
    mutate: mockGenerateMutate,
    isLoading: false,
  }),
}));

describe('Cognition Devin DeepWikiPanel (Fas 38)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders DeepWiki header and tabs', () => {
    render(<DeepWikiPanel />);

    expect(screen.getByText('Cognition Devin')).toBeInTheDocument();
    expect(screen.getByText('DeepWiki')).toBeInTheDocument();
    expect(screen.getByTestId('deepwiki-tab-map')).toBeInTheDocument();
    expect(screen.getByTestId('deepwiki-tab-wiki')).toBeInTheDocument();
    expect(screen.getByTestId('deepwiki-tab-inspect')).toBeInTheDocument();
  });

  it('renders architecture modules in Map tab by default', () => {
    render(<DeepWikiPanel />);

    expect(screen.getByTestId('architecture-map-content')).toBeInTheDocument();
    expect(screen.getByText('Frontend Client (React 19 & Vite)')).toBeInTheDocument();
    expect(screen.getByText('Express API Server')).toBeInTheDocument();
  });

  it('switches to DeepWiki Docs tab and renders citations', () => {
    render(<DeepWikiPanel />);

    fireEvent.click(screen.getByTestId('deepwiki-tab-wiki'));

    expect(screen.getByTestId('deepwiki-docs-content')).toBeInTheDocument();
    expect(screen.getByText('DeepWiki Architectural Invariants')).toBeInTheDocument();
    expect(screen.getByText('client/src/routes/AppRoute.tsx')).toBeInTheDocument();
    expect(screen.getByText('L25–L45')).toBeInTheDocument();
  });

  it('switches to Code Inspector tab and displays file snippet', () => {
    render(<DeepWikiPanel />);

    fireEvent.click(screen.getByTestId('deepwiki-tab-inspect'));

    expect(screen.getByTestId('code-inspector-content')).toBeInTheDocument();
    expect(screen.getByText('0025 | function AppRoute()')).toBeInTheDocument();
  });

  it('filters modules using search query', () => {
    render(<DeepWikiPanel />);

    const searchInput = screen.getByPlaceholderText('Search modules, files, technology...');
    fireEvent.change(searchInput, { target: { value: 'Express' } });

    expect(screen.getByText('Express API Server')).toBeInTheDocument();
    expect(screen.queryByText('Frontend Client (React 19 & Vite)')).toBeNull();
  });
});
