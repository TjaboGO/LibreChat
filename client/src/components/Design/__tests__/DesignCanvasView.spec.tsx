import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import DesignCanvasView from '../DesignCanvasView';

describe('DesignCanvasView', () => {
  it('renders project title, design system badge, and viewport switcher', () => {
    render(
      <DesignCanvasView
        projectTitle="Mobile Banking App"
        designSystemName="Modernist"
        onBack={jest.fn()}
      />,
    );

    expect(screen.getByText('Mobile Banking App')).toBeInTheDocument();
    expect(screen.getByText('Modernist')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desktop view' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tablet view' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mobile view' })).toBeInTheDocument();
  });

  it('switches between Layers and Tokens panels', async () => {
    const user = userEvent.setup();
    render(
      <DesignCanvasView
        projectTitle="Mobile Banking App"
        designSystemName="Modernist"
        onBack={jest.fn()}
      />,
    );

    expect(screen.getByText('Hero Artboard')).toBeInTheDocument();

    const tokensButton = screen.getByRole('button', { name: /Tokens/i });
    await user.click(tokensButton);

    expect(screen.getByText('Palette')).toBeInTheDocument();
    expect(screen.getByText('Typography')).toBeInTheDocument();
  });

  it('calls onBack when clicking back button', async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();
    render(
      <DesignCanvasView
        projectTitle="Mobile Banking App"
        designSystemName="Modernist"
        onBack={onBack}
      />,
    );

    const backButton = screen.getByRole('button', { name: 'Back to projects' });
    await user.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
