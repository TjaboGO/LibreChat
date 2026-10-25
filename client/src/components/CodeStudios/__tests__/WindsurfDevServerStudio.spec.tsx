import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WindsurfDevServerStudio from '../WindsurfDevServerStudio';

jest.mock('librechat-data-provider', () => ({
  request: {
    get: jest.fn().mockResolvedValue({ ok: true, sessions: [] }),
    post: jest.fn().mockResolvedValue({ ok: true, message: 'Healed' }),
  },
}));

describe('WindsurfDevServerStudio (Fas 39)', () => {
  it('renders live preview header and dev server controls', () => {
    render(<WindsurfDevServerStudio />);

    expect(screen.getByText('Windsurf Wave')).toBeInTheDocument();
    expect(screen.getByText('Self-Healing Dev Server')).toBeInTheDocument();
    expect(screen.getByText('http://localhost:5173')).toBeInTheDocument();
  });

  it('displays intercepted console errors in the console panel', () => {
    render(<WindsurfDevServerStudio />);

    expect(screen.getByText(/Cannot read properties of undefined/)).toBeInTheDocument();
    expect(screen.getByText(/1 errors detected/)).toBeInTheDocument();
  });

  it('triggers auto-heal when Auto-Heal button is clicked', async () => {
    render(<WindsurfDevServerStudio />);

    const healBtn = screen.getByTestId('windsurf-auto-heal-btn');
    fireEvent.click(healBtn);

    expect(screen.getByText(/Cascade analyzing console error trace/)).toBeInTheDocument();
  });
});
