import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlansPanel from '../PlansPanel';

const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
}));

let mockMessages: Array<{ sender: string; text: string }> = [];
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
});
