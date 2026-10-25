import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import ManusWorkspaceView from '../ManusWorkspaceView';

const mockMutateStdin = jest.fn();
const mockMutateKill = jest.fn();
const mockMutateExpose = jest.fn();
const mockMutateClose = jest.fn();

jest.mock('~/data-provider/Manus/queries', () => ({
  useProcessesQuery: () => ({
    data: {
      ok: true,
      processes: [
        {
          id: 'proc-dev-server',
          command: 'npm run dev',
          status: 'running',
          pid: 12345,
          lastActivity: Date.now(),
        },
        {
          id: 'proc-tests',
          command: 'npm test',
          status: 'exited',
          pid: 12346,
          lastActivity: Date.now() - 10000,
        },
      ],
    },
    refetch: jest.fn(),
  }),
  useProcessOutputQuery: (id: string) => ({
    data: {
      ok: true,
      output: id === 'proc-dev-server' ? 'Vite dev server v6.0.0 ready on http://localhost:5173' : 'Tests passed: 42',
    },
    refetch: jest.fn(),
  }),
  useSendStdinMutation: () => ({
    mutate: mockMutateStdin,
    isLoading: false,
  }),
  useKillProcessMutation: () => ({
    mutate: mockMutateKill,
    isLoading: false,
  }),
  useExposedPortsQuery: () => ({
    data: {
      ok: true,
      ports: [
        {
          port: 5173,
          protocol: 'http',
          url: 'http://localhost:5173',
          openedAt: Date.now(),
        },
      ],
    },
    refetch: jest.fn(),
  }),
  useExposePortMutation: () => ({
    mutate: mockMutateExpose,
    isLoading: false,
  }),
  useClosePortMutation: () => ({
    mutate: mockMutateClose,
    isLoading: false,
  }),
}));

// Mock scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('ManusWorkspaceView (Fas 37)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Manus Workspace view with header, badge, and tabs', () => {
    render(<ManusWorkspaceView />);

    expect(screen.getByTestId('manus-workspace-view')).toBeInTheDocument();
    expect(screen.getByText('Manus Workspace')).toBeInTheDocument();
    expect(screen.getByText('31 Tools')).toBeInTheDocument();
    expect(screen.getByTestId('manus-tab-terminal')).toBeInTheDocument();
    expect(screen.getByTestId('manus-tab-browser')).toBeInTheDocument();
  });

  it('displays running processes and terminal output', () => {
    render(<ManusWorkspaceView />);

    expect(screen.getByText(/proc-dev-server/)).toBeInTheDocument();
    expect(screen.getByText(/Vite dev server v6.0.0 ready on http:\/\/localhost:5173/)).toBeInTheDocument();
  });

  it('submits interactive stdin input when typing and submitting form', () => {
    render(<ManusWorkspaceView />);

    const stdinInput = screen.getByTestId('manus-stdin-input');
    fireEvent.change(stdinInput, { target: { value: 'y\n' } });
    expect(stdinInput).toHaveValue('y\n');

    const submitBtn = screen.getByTestId('manus-stdin-submit');
    fireEvent.click(submitBtn);

    expect(mockMutateStdin).toHaveBeenCalledWith({
      id: 'proc-dev-server',
      input: 'y\n',
    });
    expect(stdinInput).toHaveValue('');
  });

  it('allows killing running processes', () => {
    render(<ManusWorkspaceView />);

    const killBtn = screen.getByTitle('Terminate Process');
    fireEvent.click(killBtn);

    expect(mockMutateKill).toHaveBeenCalledWith({
      id: 'proc-dev-server',
      signal: 'SIGTERM',
    });
  });

  it('switches to Browser Preview tab and displays iframe with exposed port', () => {
    render(<ManusWorkspaceView />);

    const browserTab = screen.getByTestId('manus-tab-browser');
    fireEvent.click(browserTab);

    expect(screen.getByText(':5173')).toBeInTheDocument();
    const iframe = screen.getByTitle('Manus Live Browser Preview');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'http://localhost:5173');
  });

  it('toggles collapse and expand states cleanly', () => {
    render(<ManusWorkspaceView defaultCollapsed={false} />);

    const collapseBtn = screen.getByTestId('manus-workspace-collapse-btn');
    fireEvent.click(collapseBtn);

    expect(screen.queryByTestId('manus-workspace-view')).toBeNull();
    const expandBtn = screen.getByTestId('manus-workspace-expand-btn');
    expect(expandBtn).toBeInTheDocument();

    fireEvent.click(expandBtn);
    expect(screen.getByTestId('manus-workspace-view')).toBeInTheDocument();
  });
});
