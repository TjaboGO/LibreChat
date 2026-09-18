/* eslint-disable i18next/no-literal-string */
import React from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ChatsAndTasksPage from '../ChatsAndTasksPage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/components/Chat/Menus/OpenSidebar', () => () => (
  <button data-testid="open-sidebar">Sidebar</button>
));

describe('ChatsAndTasksPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderPage = () =>
    render(
      <RecoilRoot>
        <MemoryRouter>
          <ChatsAndTasksPage />
        </MemoryRouter>
      </RecoilRoot>,
    );

  it('renders page title, search, filter button, select toggle, and new button', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Chats and tasks' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter chats/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
  });

  it('filters conversation list when typing in search field', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText(/DeepSeek Reasoner prompt optimization/i)).toBeInTheDocument();
    expect(screen.getByText(/Workspace refactor: Claude chat-app UI tokens/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search');
    await user.type(searchInput, 'OpenRouter');

    expect(
      screen.getByText(/API Gateway integration tests for OpenRouter proxy/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/DeepSeek Reasoner prompt optimization/i)).not.toBeInTheDocument();
  });

  it('toggles select mode and allows selecting items', async () => {
    const user = userEvent.setup();
    renderPage();

    const selectButton = screen.getByRole('button', { name: 'Select' });
    await user.click(selectButton);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);

    expect(checkboxes[0]).not.toBeChecked();
    await user.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
  });

  it('navigates to /c/new when clicking the New button', async () => {
    const user = userEvent.setup();
    renderPage();

    const newButton = screen.getByRole('button', { name: 'New' });
    await user.click(newButton);

    expect(mockNavigate).toHaveBeenCalledWith('/c/new');
  });

  it('opens ChatInfoModal when clicking the info button on a chat item', async () => {
    const user = userEvent.setup();
    renderPage();

    const infoButtons = screen.getAllByRole('button', { name: 'Chat info' });
    await user.click(infoButtons[0]);

    expect(screen.getByRole('heading', { level: 2, name: 'Chat info' })).toBeInTheDocument();
  });
});
