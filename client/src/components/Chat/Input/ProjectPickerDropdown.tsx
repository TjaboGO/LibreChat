import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Folder, FolderPlus, Plus, Search, Filter, ChevronDown, Check } from 'lucide-react';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

interface ProjectPickerDropdownProps {
  currentProjectName?: string;
  onSelectProject?: (project: string) => void;
  onCreateProject?: () => void;
  onAddFolder?: () => void;
}

export default function ProjectPickerDropdown({
  currentProjectName,
  onSelectProject,
  onCreateProject,
  onAddFolder,
}: ProjectPickerDropdownProps) {
  const localize = useLocalize();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(currentProjectName || '');

  const pinnedProjects = [
    { id: 'claude-copycat', name: 'Claude Copycat' },
    { id: 'main-workspace', name: 'Main Workspace' },
  ];

  const filteredProjects = pinnedProjects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-primary"
        >
          <Folder className="h-3 w-3 text-text-tertiary" aria-hidden="true" />
          <span>{selectedProject || localize('com_ui_project_or_folder')}</span>
          <ChevronDown className="h-3 w-3 text-text-tertiary" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 w-64 rounded-xl border border-border-light bg-surface-primary p-2 shadow-lg focus:outline-none"
        >
          {/* Search input */}
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={localize('com_ui_search_projects')}
              className="w-full rounded-lg border border-border-light bg-surface-secondary py-1 pl-7 pr-7 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-border-xheavy"
            />
            <Filter className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-tertiary" />
          </div>

          {/* Section: Pinned */}
          <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
            {localize('com_ui_pinned')}
          </div>

          <div className="flex flex-col gap-0.5">
            {filteredProjects.map((p) => (
              <DropdownMenu.Item
                key={p.id}
                onClick={() => {
                  setSelectedProject(p.name);
                  onSelectProject?.(p.name);
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none',
                  selectedProject === p.name && 'bg-surface-secondary font-medium',
                )}
              >
                <div className="flex items-center gap-2">
                  <Folder className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
                  <span>{p.name}</span>
                </div>
                {selectedProject === p.name && <Check className="h-3 w-3 text-text-primary" />}
              </DropdownMenu.Item>
            ))}
          </div>

          <DropdownMenu.Separator className="my-1.5 h-px bg-border-light" />

          {/* Action rows */}
          <div className="flex flex-col gap-0.5">
            <DropdownMenu.Item
              onClick={() => onCreateProject?.()}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-text-primary transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none"
            >
              <Plus className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
              <span>{localize('com_ui_new_project')}</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => onAddFolder?.()}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-text-primary transition-colors hover:bg-surface-hover focus:bg-surface-hover focus:outline-none"
            >
              <FolderPlus className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
              <span>{localize('com_ui_add_folder')}</span>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
