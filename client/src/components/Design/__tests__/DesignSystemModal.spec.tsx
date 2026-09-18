import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import DesignSystemModal from '../DesignSystemModal';

describe('DesignSystemModal', () => {
  it('renders modal header, method cards, and preset options', () => {
    render(<DesignSystemModal open={true} onOpenChange={jest.fn()} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Add a design system' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Create here')).toBeInTheDocument();
    expect(screen.getByText('Using Claude Code')).toBeInTheDocument();
    expect(screen.getByText('Modernist')).toBeInTheDocument();
    expect(screen.getByText('Classical')).toBeInTheDocument();
    expect(screen.getByText('Nocturne')).toBeInTheDocument();
  });

  it('selects preset and calls onSelectSystem on submit', async () => {
    const user = userEvent.setup();
    const onSelectSystem = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <DesignSystemModal open={true} onOpenChange={onOpenChange} onSelectSystem={onSelectSystem} />,
    );

    const classicalPreset = screen.getByRole('button', { name: /Classical/i });
    await user.click(classicalPreset);

    const applyButton = screen.getByRole('button', { name: /Apply design system/i });
    await user.click(applyButton);

    expect(onSelectSystem).toHaveBeenCalledWith('Classical');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
