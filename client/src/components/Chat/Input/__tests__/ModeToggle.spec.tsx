import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, fireEvent } from '@testing-library/react';
import ModeToggle from '../ModeToggle';

describe('ModeToggle (Dual-Mode Engine)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders with default Auto mode', () => {
    render(
      <RecoilRoot>
        <ModeToggle index={0} />
      </RecoilRoot>,
    );

    const button = screen.getByRole('button', { name: /engine mode: auto/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Auto')).toBeInTheDocument();
  });

  it('opens popover showing Dual-Mode Engine choices', () => {
    render(
      <RecoilRoot>
        <ModeToggle index={0} />
      </RecoilRoot>,
    );

    const button = screen.getByRole('button', { name: /engine mode: auto/i });
    fireEvent.click(button);

    expect(screen.getByText('Dual-Mode Engine')).toBeInTheDocument();
    expect(screen.getByText('Auto (Classifier)')).toBeInTheDocument();
    expect(screen.getByText('Spec Mode')).toBeInTheDocument();
    expect(screen.getByText('Vibe Mode')).toBeInTheDocument();
    expect(
      screen.getByText(/Read-only planning. Generates rigorous specifications/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Direct implementation. Rapidly creates working code/i),
    ).toBeInTheDocument();
  });

  it('selects Spec Mode and persists to localStorage', () => {
    render(
      <RecoilRoot>
        <ModeToggle index={0} />
      </RecoilRoot>,
    );

    const button = screen.getByRole('button', { name: /engine mode: auto/i });
    fireEvent.click(button);

    const specOption = screen.getByText('Spec Mode');
    fireEvent.click(specOption);

    expect(localStorage.getItem('claude_engine_mode')).toBe('spec');
    expect(screen.getByRole('button', { name: /engine mode: spec mode/i })).toBeInTheDocument();
  });

  it('selects Vibe Mode and persists to localStorage', () => {
    render(
      <RecoilRoot>
        <ModeToggle index={0} />
      </RecoilRoot>,
    );

    const button = screen.getByRole('button', { name: /engine mode: auto/i });
    fireEvent.click(button);

    const vibeOption = screen.getByText('Vibe Mode');
    fireEvent.click(vibeOption);

    expect(localStorage.getItem('claude_engine_mode')).toBe('vibe');
    expect(screen.getByRole('button', { name: /engine mode: vibe mode/i })).toBeInTheDocument();
  });

  it('respects the disabled prop', () => {
    render(
      <RecoilRoot>
        <ModeToggle index={0} disabled={true} />
      </RecoilRoot>,
    );

    const button = screen.getByRole('button', { name: /engine mode: auto/i });
    expect(button).toBeDisabled();
  });
});
