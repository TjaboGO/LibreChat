import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import KiroDualModeStudio from '../KiroDualModeStudio';

describe('KiroDualModeStudio (Fas 39)', () => {
  it('renders in Spec Mode by default with architectural checklist', () => {
    render(<KiroDualModeStudio />);

    expect(screen.getByText('Kiro / Traycer')).toBeInTheDocument();
    expect(screen.getByTestId('kiro-spec-content')).toBeInTheDocument();
    expect(screen.getByText(/Spec Mode Active · Architectural Invariants/)).toBeInTheDocument();
    expect(screen.getByText('Architectural Invariants Defined')).toBeInTheDocument();
  });

  it('switches to Vibe Mode when Vibe Mode button is clicked', () => {
    render(<KiroDualModeStudio />);

    const vibeBtn = screen.getByTestId('kiro-mode-vibe-btn');
    fireEvent.click(vibeBtn);

    expect(screen.getByTestId('kiro-vibe-content')).toBeInTheDocument();
    expect(screen.getByText(/Vibe Mode Active · Rapid Prototyping/)).toBeInTheDocument();
    expect(screen.getByText('Modern React 19 Hero Section')).toBeInTheDocument();
  });

  it('switches back to Spec Mode', () => {
    render(<KiroDualModeStudio defaultMode="vibe" />);

    expect(screen.getByTestId('kiro-vibe-content')).toBeInTheDocument();

    const specBtn = screen.getByTestId('kiro-mode-spec-btn');
    fireEvent.click(specBtn);

    expect(screen.getByTestId('kiro-spec-content')).toBeInTheDocument();
  });
});
