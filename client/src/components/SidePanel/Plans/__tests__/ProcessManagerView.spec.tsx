import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ProcessManagerView from '../ProcessManagerView';

const mockSendStdin = jest.fn();
const mockKillProcess = jest.fn();
const mockClosePort = jest.fn();
const mockRefetch = jest.fn();

jest.mock('~/data-provider/Manus/queries', () => ({
  useProcessesQuery: () => ({
    data: {
      ok: true,
      processes: [
        {
          id: 'dev-server',
          command: 'npm run dev',
          pid: 43210,
          status: 'running',
          startedAt: Date.now() - 60000,
          outputBuffer: ['Vite dev server running on http://localhost:5173'],
          lastActivity: Date.now(),
        },
      ],
    },
    refetch: mockRefetch,
    isLoading: false,
  }),
  useProcessOutputQuery: (_id: string) => ({
    data: {
      ok: true,
      output: 'Vite dev server running on http://localhost:5173\nReady in 250ms.',
    },
  }),
  useExposedPortsQuery: () => ({
    data: {
      ok: true,
      ports: [
        {
          port: 5173,
          protocol: 'http',
          exposedUrl: 'http://localhost:5173',
          localUrl: 'http://localhost:5173',
          createdAt: Date.now(),
          status: 'active',
        },
      ],
    },
  }),
  useSendStdinMutation: () => ({
    mutate: mockSendStdin,
    isLoading: false,
  }),
  useKillProcessMutation: () => ({
    mutate: mockKillProcess,
    isLoading: false,
  }),
  useClosePortMutation: () => ({
    mutate: mockClosePort,
    isLoading: false,
  }),
}));

describe('ProcessManagerView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders process hub title, active process, and exposed ports', () => {
    render(<ProcessManagerView />);

    expect(screen.getByText('Manus Process & Network Hub')).toBeInTheDocument();
    expect(screen.getByText('dev-server')).toBeInTheDocument();
    expect(screen.getByText('npm run dev')).toBeInTheDocument();
    expect(screen.getByText('5173')).toBeInTheDocument();
    expect(screen.getByTestId('terminal-output')).toHaveTextContent(
      'Vite dev server running on http://localhost:5173',
    );
  });

  it('sends interactive stdin to a running process', async () => {
    const user = userEvent.setup();
    render(<ProcessManagerView />);

    const input = screen.getByPlaceholderText(/Send input to stdin/i);
    await user.type(input, 'rs{enter}');

    expect(mockSendStdin).toHaveBeenCalledWith({
      id: 'dev-server',
      input: 'rs',
    });
  });

  it('triggers kill process on button click', async () => {
    const user = userEvent.setup();
    render(<ProcessManagerView />);

    const killBtn = screen.getByRole('button', { name: /kill process/i });
    await user.click(killBtn);

    expect(mockKillProcess).toHaveBeenCalledWith({
      id: 'dev-server',
      signal: 'SIGTERM',
    });
  });
});
