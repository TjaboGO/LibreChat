import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CodeFoldersModal from '../CodeFoldersModal';

describe('CodeFoldersModal', () => {
  it('renders modal header, checkbox, search field, and folder list', () => {
    render(<CodeFoldersModal open={true} onOpenChange={jest.fn()} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Folders' })).toBeInTheDocument();
    expect(screen.getByLabelText('Hide foldered chats')).toBeChecked();
    expect(screen.getByPlaceholderText('Search folders and chats…')).toBeInTheDocument();
    expect(screen.getByText('Frontend Refactors')).toBeInTheDocument();
    expect(screen.getByText('OpenRouter Integration')).toBeInTheDocument();
  });

  it('allows creating a new folder inline', async () => {
    const user = userEvent.setup();
    render(<CodeFoldersModal open={true} onOpenChange={jest.fn()} />);

    const addFolderButton = screen.getByRole('button', { name: /Add Folder/i });
    await user.click(addFolderButton);

    const folderInput = screen.getByPlaceholderText('Folder name');
    await user.type(folderInput, 'API Documentation');

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(screen.getByText('API Documentation')).toBeInTheDocument();
  });

  it('filters folders by search input', async () => {
    const user = userEvent.setup();
    render(<CodeFoldersModal open={true} onOpenChange={jest.fn()} />);

    const searchInput = screen.getByPlaceholderText('Search folders and chats…');
    await user.type(searchInput, 'OpenRouter');

    expect(screen.getByText('OpenRouter Integration')).toBeInTheDocument();
    expect(screen.queryByText('Frontend Refactors')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when clicking close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(<CodeFoldersModal open={true} onOpenChange={onOpenChange} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
