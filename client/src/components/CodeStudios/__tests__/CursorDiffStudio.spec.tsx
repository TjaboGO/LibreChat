import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import CursorDiffStudio from '../CursorDiffStudio';

describe('CursorDiffStudio (Fas 39)', () => {
  it('renders Cursor Fast Diff header and hunks selector', () => {
    render(<CursorDiffStudio />);

    expect(screen.getByText('Cursor Studio')).toBeInTheDocument();
    expect(screen.getByText('Fast Diff Editor')).toBeInTheDocument();
    expect(screen.getByText('AppRoute.tsx')).toBeInTheDocument();
  });

  it('accepts a hunk when Accept button is clicked', () => {
    render(<CursorDiffStudio />);

    const acceptBtn = screen.getByTestId('cursor-accept-hunk-btn');
    fireEvent.click(acceptBtn);

    expect(screen.getByText('ACCEPTED')).toBeInTheDocument();
  });

  it('accepts all hunks when Accept All button is clicked', () => {
    render(<CursorDiffStudio />);

    const acceptAllBtn = screen.getByTestId('cursor-accept-all-btn');
    fireEvent.click(acceptAllBtn);

    expect(screen.getByText('0 pending hunks · 3 accepted')).toBeInTheDocument();
  });
});
