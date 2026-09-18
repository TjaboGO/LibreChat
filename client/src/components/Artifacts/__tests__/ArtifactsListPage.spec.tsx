import React from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ArtifactsListPage from '../ArtifactsListPage';

const mockNavigate = jest.fn();
const mockNewConversation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/hooks/useNewConvo', () => () => ({
  newConversation: mockNewConversation,
}));

describe('ArtifactsListPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockNewConversation.mockClear();
  });

  it('renders page title, creation cards, and date-grouped list', () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <ArtifactsListPage />
        </MemoryRouter>
      </RecoilRoot>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Artifacts' })).toBeInTheDocument();
    expect(screen.getByText('Make something new')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /docs/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /slides/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /design/i })).toBeInTheDocument();

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Landing Page Interactive Prototype')).toBeInTheDocument();
  });

  it('filters artifacts by search query', async () => {
    const user = userEvent.setup();
    render(
      <RecoilRoot>
        <MemoryRouter>
          <ArtifactsListPage />
        </MemoryRouter>
      </RecoilRoot>,
    );

    const searchInput = screen.getByPlaceholderText('Search artifacts');
    await user.type(searchInput, 'Benchmarks');

    expect(screen.getByText('DeepSeek Reasoner Model Context Benchmarks')).toBeInTheDocument();
    expect(screen.queryByText('Landing Page Interactive Prototype')).not.toBeInTheDocument();
  });

  it('navigates to new conversation when clicking a creation card', async () => {
    const user = userEvent.setup();
    render(
      <RecoilRoot>
        <MemoryRouter>
          <ArtifactsListPage />
        </MemoryRouter>
      </RecoilRoot>,
    );

    const docsCard = screen.getByRole('button', { name: /docs/i });
    await user.click(docsCard);

    expect(mockNavigate).toHaveBeenCalledWith('/c/new');
    expect(mockNewConversation).toHaveBeenCalled();
  });
});
