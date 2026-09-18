/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { X, Plus, Folder, FolderPlus, Search, ChevronRight } from 'lucide-react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';

interface CodeFolderItem {
  id: string;
  name: string;
  chatCount: number;
  updatedAt: string;
}

interface CodeFoldersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CodeFoldersModal({ open, onOpenChange }: CodeFoldersModalProps) {
  const [folders, setFolders] = useState<CodeFolderItem[]>([
    { id: 'f-1', name: 'Frontend Refactors', chatCount: 4, updatedAt: 'Yesterday' },
    { id: 'f-2', name: 'OpenRouter Integration', chatCount: 7, updatedAt: '2 days ago' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hideFolderedChats, setHideFolderedChats] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      return;
    }
    const newFolder: CodeFolderItem = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      chatCount: 0,
      updatedAt: 'Just now',
    };
    setFolders((prev) => [newFolder, ...prev]);
    setNewFolderName('');
    setIsCreating(false);
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent
        showCloseButton={false}
        className="max-w-lg rounded-2xl bg-surface-primary p-6 text-text-primary shadow-2xl"
      >
        <OGDialogHeader className="flex flex-row items-center justify-between pb-3">
          <OGDialogTitle className="text-base font-semibold text-text-primary">
            Folders
          </OGDialogTitle>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-text-secondary">
              <input
                type="checkbox"
                checked={hideFolderedChats}
                onChange={(e) => setHideFolderedChats(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border-light text-orange-600 focus:ring-orange-500"
              />
              <span>Hide foldered chats</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1 rounded-full border border-border-light bg-surface-primary px-3 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Folder</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </OGDialogHeader>

        {/* SEARCH INPUT */}
        <div className="py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search folders and chats…"
              className="w-full rounded-xl border border-border-light bg-surface-secondary/50 py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-tertiary focus:border-orange-500 focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* INLINE CREATE FORM */}
        {isCreating && (
          <form onSubmit={handleCreateFolder} className="my-2 flex items-center gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="flex-1 rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-lg border border-border-light px-2.5 py-1.5 text-xs text-text-secondary hover:bg-surface-secondary"
            >
              Cancel
            </button>
          </form>
        )}

        {/* CONTENT */}
        <div className="mt-2 min-h-56">
          {filteredFolders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
                <Folder className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h4 className="mt-3 text-xs font-semibold text-text-primary">No folders yet</h4>
              <p className="mt-1 text-xs text-text-secondary">
                Create folders to organize your chats.
              </p>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="mt-4 flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>Create first folder</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border-light/60 rounded-xl border border-border-light/60 bg-surface-primary">
              {filteredFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex items-center justify-between p-3 transition-colors hover:bg-surface-secondary/40"
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className="h-4 w-4 text-orange-600" />
                    <div>
                      <span className="text-xs font-medium text-text-primary">{folder.name}</span>
                      <span className="ml-2 text-[11px] text-text-tertiary">
                        {folder.chatCount} chats
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
                    <span>{folder.updatedAt}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </OGDialogContent>
    </OGDialog>
  );
}
