import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import type { Artifact } from '~/common';
import ArtifactImageStudio from '../ArtifactImageStudio';
import { TOOL_ARTIFACT_TYPES } from '~/utils/artifacts';

const mockArtifact: Artifact = {
  id: 'img-123',
  type: TOOL_ARTIFACT_TYPES.IMAGE,
  title: 'Neon Cyberpunk Cityscape',
  content: 'https://example.com/cyberpunk.png',
  lastUpdateTime: Date.now(),
};

describe('ArtifactImageStudio', () => {
  it('renders the image canvas, controls, and studio sidebar', () => {
    render(<ArtifactImageStudio artifact={mockArtifact} />);

    expect(screen.getByAltText('Neon Cyberpunk Cityscape')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom In')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom Out')).toBeInTheDocument();
    expect(screen.getByTitle('Copy Image URL')).toBeInTheDocument();
    expect(screen.getByTitle('Download PNG')).toBeInTheDocument();

    expect(screen.getByText('Nano Banana 2 Studio')).toBeInTheDocument();
    expect(screen.getByText('Nano Banana 2')).toBeInTheDocument();
    expect(screen.getByText('Google Imagen 3')).toBeInTheDocument();
  });

  it('toggles the in-painting studio sidebar visibility', async () => {
    const user = userEvent.setup();
    render(<ArtifactImageStudio artifact={mockArtifact} />);

    expect(screen.getByText('Nano Banana 2 Studio')).toBeInTheDocument();
    const toggleBtn = screen.getByRole('button', { name: /Hide Studio/i });

    await user.click(toggleBtn);
    expect(screen.queryByText('Nano Banana 2 Studio')).not.toBeInTheDocument();

    const openBtn = screen.getByRole('button', { name: /Edit with AI/i });
    await user.click(openBtn);
    expect(screen.getByText('Nano Banana 2 Studio')).toBeInTheDocument();
  });

  it('allows model selection and aspect ratio changes', async () => {
    const user = userEvent.setup();
    render(<ArtifactImageStudio artifact={mockArtifact} />);

    const imagenBtn = screen.getByRole('button', { name: /Google Imagen 3/i });
    await user.click(imagenBtn);
    expect(imagenBtn).toHaveClass('border-amber-500/50');

    const ratio169 = screen.getByRole('button', { name: '16:9' });
    await user.click(ratio169);
    expect(ratio169).toHaveClass('bg-amber-500');
  });

  it('allows selecting style enhancers and typing an in-painting directive', async () => {
    const user = userEvent.setup();
    render(<ArtifactImageStudio artifact={mockArtifact} />);

    const styleChip = screen.getByRole('button', { name: '✦ Crisp Typography' });
    await user.click(styleChip);
    expect(styleChip).toHaveClass('bg-amber-500/20');

    const textarea = screen.getByPlaceholderText(/What should change/i);
    await user.type(textarea, 'Change billboard text to FUTURE AI');
    expect(textarea).toHaveValue('Change billboard text to FUTURE AI');

    const submitBtn = screen.getByRole('button', { name: /Send In-Painting Prompt/i });
    expect(submitBtn).toBeEnabled();
    await user.click(submitBtn);

    expect(screen.getByText(/Sent to prompt box!/i)).toBeInTheDocument();
  });
});
