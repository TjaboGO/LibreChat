import React from 'react';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { composerModeFamily } from '~/store/families';
import CoworkTaskList from '../CoworkTaskList';

const mockMutate = jest.fn();
jest.mock('~/data-provider', () => ({
  useCoworkTasksQuery: jest.fn(() => ({
    data: {
      tasks: [
        {
          id: 'task-1',
          title: 'Monitor test flakiness across client test suites',
          type: 'task',
          status: 'running',
          timeAgo: 'Just now',
        },
        {
          id: 'task-2',
          title: 'Rebase local worktree with origin/main changes',
          type: 'task',
          status: 'queued',
          timeAgo: '5m ago',
        },
      ],
    },
  })),
  useClearCoworkTasksMutation: jest.fn(() => ({
    mutate: mockMutate,
  })),
}));

describe('CoworkTaskList', () => {
  it('does not render when composer mode is chat', () => {
    const { container } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(composerModeFamily(null), 'chat');
        }}
      >
        <CoworkTaskList index={null} />
      </RecoilRoot>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders active tasks when composer mode is cowork', () => {
    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(composerModeFamily(null), 'cowork');
        }}
      >
        <CoworkTaskList index={null} />
      </RecoilRoot>,
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Clear active')).toBeInTheDocument();
    expect(
      screen.getByText('Monitor test flakiness across client test suites'),
    ).toBeInTheDocument();
    expect(screen.getByText('Rebase local worktree with origin/main changes')).toBeInTheDocument();
  });

  it('clears active tasks when clicking Clear active', async () => {
    const user = userEvent.setup();
    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(composerModeFamily(null), 'cowork');
        }}
      >
        <CoworkTaskList index={null} />
      </RecoilRoot>,
    );

    const clearBtn = screen.getByText('Clear active');
    await user.click(clearBtn);

    expect(mockMutate).toHaveBeenCalled();
  });
});
