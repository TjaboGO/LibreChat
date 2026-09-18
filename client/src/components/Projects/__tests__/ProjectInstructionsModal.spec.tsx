import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ProjectInstructionsModal from '../ProjectInstructionsModal';

describe('ProjectInstructionsModal', () => {
  it('renders modal with project name and instructions textarea', () => {
    render(
      <ProjectInstructionsModal
        open={true}
        onOpenChange={jest.fn()}
        projectName="Test Project"
        initialInstructions="Sample instructions"
        onSave={jest.fn()}
      />,
    );

    expect(screen.getByText('Set project instructions')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sample instructions')).toBeInTheDocument();
  });

  it('calls onSave with updated instructions', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <ProjectInstructionsModal
        open={true}
        onOpenChange={onOpenChange}
        projectName="Test Project"
        initialInstructions=""
        onSave={onSave}
      />,
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'New custom instructions');

    const saveBtn = screen.getByText('Save instructions');
    await user.click(saveBtn);

    expect(onSave).toHaveBeenCalledWith('New custom instructions');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
