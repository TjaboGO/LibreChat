import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlansPanel from '../PlansPanel';

const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
}));

let mockMessages: Array<{ sender: string; text: string; content?: unknown[] }> = [];
jest.mock('~/data-provider', () => ({
  useGetMessagesByConvoId: () => ({ data: mockMessages }),
  useCoworkTasksQuery: () => ({
    data: {
      tasks: [
        {
          id: 'task-1',
          conversationId: 'convo-with-plan',
          title: 'Browser Automation Run',
          status: 'running',
        },
      ],
    },
  }),
  useCreateCoworkTaskMutation: () => ({
    mutate: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock('~/data-provider/Manus/queries', () => ({
  useProcessesQuery: () => ({
    data: { ok: true, processes: [] },
    refetch: jest.fn(),
    isLoading: false,
  }),
  useProcessOutputQuery: () => ({ data: { ok: true, output: '' } }),
  useExposedPortsQuery: () => ({ data: { ok: true, ports: [] } }),
  useSendStdinMutation: () => ({ mutate: jest.fn(), isLoading: false }),
  useKillProcessMutation: () => ({ mutate: jest.fn(), isLoading: false }),
  useClosePortMutation: () => ({ mutate: jest.fn(), isLoading: false }),
}));

describe('PlansPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when conversation has no plan', () => {
    mockUseParams.mockReturnValue({ conversationId: 'empty-convo' });
    mockMessages = [
      { sender: 'User', text: 'Hello' },
      { sender: 'Claude', text: 'Hello! How can I help you today?' },
    ];

    render(<PlansPanel />);
    expect(screen.getByText('No active plan in this conversation')).toBeInTheDocument();
  });

  it('renders structured plan steps matching screenshot 17.07.04 format', () => {
    mockUseParams.mockReturnValue({ conversationId: 'convo-with-plan' });
    mockMessages = [
      {
        sender: 'Claude',
        text: `Användningsgränsen är nådd, så jag stannar här.

Gjort och testat lokalt:
* **BestSecret-flik**: Jag hämtade dina 128 artiklar
* **På/av-knapp**: Testad och verifierad

Kvar att göra:
1. **Granska storlekarna**. Kräver uppskattning
2. **Commit och push till GitHub**. Inget är committat än`,
      },
    ];

    render(<PlansPanel />);
    expect(screen.getByText('Plans & Execution')).toBeInTheDocument();
    expect(screen.getByText('Gjort och testat lokalt')).toBeInTheDocument();
    expect(screen.getByText('Kvar att göra')).toBeInTheDocument();

    // Verify completed steps
    expect(screen.getByText('BestSecret-flik')).toBeInTheDocument();
    expect(screen.getByText('På/av-knapp')).toBeInTheDocument();

    // Verify pending steps
    expect(screen.getByText('Granska storlekarna')).toBeInTheDocument();
    expect(screen.getByText('Commit och push till GitHub')).toBeInTheDocument();

    // Verify active task badge
    expect(screen.getByText('Active run')).toBeInTheDocument();
    expect(screen.getByText(/Browser Automation Run/)).toBeInTheDocument();
  });

  it('allows user to interactively toggle steps', () => {
    mockUseParams.mockReturnValue({ conversationId: 'convo-with-plan' });
    mockMessages = [
      {
        sender: 'Claude',
        text: `Gjort och testat lokalt:
* **Step 1**: Done

Kvar att göra:
1. **Step 2**: Todo`,
      },
    ];

    render(<PlansPanel />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();

    // Click step 2 to mark it done
    const step2El = screen.getByText('Step 2');
    fireEvent.click(step2El);

    // Progress updates to 100%
    expect(screen.getByText(/2 of 2 completed \(100%\)/)).toBeInTheDocument();
  });

  it('renders Make.com style visual node workflow tab', () => {
    mockUseParams.mockReturnValue({ conversationId: 'convo-with-plan' });
    mockMessages = [
      {
        sender: 'User',
        text: 'Automate weekly report and search web',
      },
      {
        sender: 'Claude',
        text: 'Executing automation...',
        content: [
          {
            type: 'tool_call',
            tool_call: {
              name: 'web_search',
              args: { query: 'latest tech news' },
              output: 'Found 5 articles',
              runStepStatus: 'completed',
              runStepDurationMs: 320,
            },
          },
        ],
      },
    ];

    render(<PlansPanel />);
    const workflowTab = screen.getByRole('button', { name: /Workflow/i });
    fireEvent.click(workflowTab);

    expect(screen.getByText('Deterministic Node Pipeline')).toBeInTheDocument();
    expect(screen.getByText(/Trigger: User Prompt/)).toBeInTheDocument();
    expect(screen.getByText(/Decision Engine: Tool Routing & Strategy/)).toBeInTheDocument();
    expect(screen.getByText(/Action: web_search/)).toBeInTheDocument();
    expect(screen.getByText(/Output: Stream & Artifact Delivery/)).toBeInTheDocument();
  });

  it('renders detailed execution logs tab with stats and copyable payloads', () => {
    mockUseParams.mockReturnValue({ conversationId: 'convo-with-plan' });
    mockMessages = [
      {
        sender: 'User',
        text: 'Run database query',
      },
      {
        sender: 'Claude',
        text: 'Done',
        content: [
          {
            type: 'tool_call',
            tool_call: {
              name: 'database_query',
              args: { table: 'users', limit: 10 },
              output: '{"count": 10}',
              runStepStatus: 'completed',
              runStepDurationMs: 150,
            },
          },
        ],
      },
    ];

    render(<PlansPanel />);
    const logsTab = screen.getByRole('button', { name: /Logs/i });
    fireEvent.click(logsTab);

    expect(screen.getByText('Total Latency')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
    expect(screen.getByText(/Action: database_query/)).toBeInTheDocument();
  });

  it('renders interactive processes tab when selected', () => {
    mockUseParams.mockReturnValue({ conversationId: 'convo-with-plan' });
    render(<PlansPanel />);
    const processesTab = screen.getByRole('button', { name: /Processes/i });
    fireEvent.click(processesTab);

    expect(screen.getByText('Manus Process & Network Hub')).toBeInTheDocument();
  });
});
