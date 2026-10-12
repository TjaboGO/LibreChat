/* eslint-disable i18next/no-literal-string */
import React, { useCallback, useId, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as Ariakit from '@ariakit/react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Constants, QueryKeys } from 'librechat-data-provider';
import { Button, Spinner, DropdownPopup, TooltipAnchor, useMediaQuery } from '@librechat/client';
import {
  ArrowLeft,
  ArrowUpDown,
  Check,
  Folder,
  Pencil,
  Plus,
  Trash2,
  Pin,
  Search,
  FileText,
  X,
} from 'lucide-react';
import type { ConversationListResponse } from 'librechat-data-provider';
import type { MenuItemProps, RenderProp } from '~/common';
import { useConversationsInfiniteQuery, useProjectQuery } from '~/data-provider';
import ProjectInstructionsModal from './ProjectInstructionsModal';
import OpenSidebar from '~/components/Chat/Menus/OpenSidebar';
import ProjectDeleteDialog from './ProjectDeleteDialog';
import ProjectEditDialog from './ProjectEditDialog';
import { useLocalize, useNewConvo } from '~/hooks';
import { cn, clearMessagesCache } from '~/utils';
import ProjectChatList from './ProjectChatList';
import store from '~/store';

type ChatSortField = 'updatedAt' | 'createdAt';

function renderSortMenuItem(label: string, isSelected: boolean): RenderProp {
  return function SortMenuItem({ className, ...props }) {
    return (
      <div {...props} className={cn(className, 'justify-between gap-5')}>
        <span className="truncate">{label}</span>
        {isSelected ? (
          <Check className="h-4 w-4 shrink-0 text-text-primary" aria-hidden="true" />
        ) : (
          <span className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
      </div>
    );
  };
}

export default function ProjectWorkspace() {
  const localize = useLocalize();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { projectId = '' } = useParams();
  const [sortBy, setSortBy] = useState<ChatSortField>('updatedAt');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [projectInstructions, setProjectInstructions] = useState('');
  const [isNoticeVisible, setIsNoticeVisible] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  const sortMenuId = useId();
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const { data: project, isLoading: isProjectLoading } = useProjectQuery(projectId);
  const conversation = useRecoilValue(store.conversationByIndex(0));
  const { newConversation } = useNewConvo();
  const activeProjectId = project?._id;
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const sortOptions = useMemo(
    () => [
      { value: 'updatedAt' as const, label: localize('com_ui_sort_updated') },
      { value: 'createdAt' as const, label: localize('com_ui_sort_created') },
    ],
    [localize],
  );
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ?? localize('com_ui_sort_updated');
  const sortMenuItems = useMemo<MenuItemProps[]>(
    () =>
      sortOptions.map((option) => {
        const isSelected = sortBy === option.value;
        return {
          id: `project-chat-sort-${option.value}`,
          ariaLabel: option.label,
          ariaChecked: isSelected,
          onClick: () => setSortBy(option.value),
          render: renderSortMenuItem(option.label, isSelected),
        };
      }),
    [sortBy, sortOptions],
  );

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: isConversationsLoading,
  } = useConversationsInfiniteQuery(
    {
      projectId: activeProjectId,
      sortBy,
      sortDirection: 'desc',
    },
    {
      enabled: Boolean(activeProjectId),
      staleTime: 30000,
      cacheTime: 300000,
    },
  );

  const conversations = useMemo(
    () => data?.pages.flatMap((page) => page.conversations) ?? [],
    [data?.pages],
  );

  const hasNextPage = useMemo(() => {
    const pages = data?.pages;
    if (!pages?.length) {
      return false;
    }
    const lastPage: ConversationListResponse = pages[pages.length - 1];
    return lastPage.nextCursor !== null;
  }, [data?.pages]);

  const startProjectChat = useCallback(() => {
    if (!activeProjectId) {
      return;
    }
    clearMessagesCache(queryClient, conversation?.conversationId);
    queryClient.invalidateQueries([QueryKeys.messages]);
    navigate(`/c/${Constants.NEW_CONVO}?projectId=${encodeURIComponent(activeProjectId)}`);
    newConversation({ template: { chatProjectId: activeProjectId } });
  }, [activeProjectId, conversation?.conversationId, navigate, newConversation, queryClient]);

  if (isProjectLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-presentation">
        <Spinner className="text-text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-presentation px-6 text-center">
        <p className="text-sm text-text-secondary">{localize('com_ui_project_not_found')}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => navigate('/projects')}>
          {localize('com_ui_all_projects')}
        </Button>
      </div>
    );
  }

  return (
    <main className="flex h-full min-h-0 flex-col overflow-y-auto bg-presentation text-text-primary">
      {/* TOP BREADCRUMB & ACTION HEADER */}
      <header className="sticky top-0 z-10 border-b border-border-light bg-presentation">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-4 md:h-16 md:px-6">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            {isSmallScreen ? <OpenSidebar className="size-9 shrink-0" /> : null}
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="flex items-center gap-1 transition-colors hover:text-text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Projects</span>
            </button>
            <span className="text-text-tertiary">/</span>
            <span className="truncate font-semibold text-text-primary">{project.name}</span>
          </div>

          <div className="flex items-center gap-1 text-text-secondary">
            <button
              type="button"
              onClick={() => setIsPinned((prev) => !prev)}
              className={cn(
                'rounded-lg p-2 transition-colors hover:bg-surface-secondary hover:text-text-primary',
                isPinned && 'text-blue-500',
              )}
              aria-label={isPinned ? 'Unpin project' : 'Pin project'}
            >
              <Pin className="h-4 w-4" />
            </button>
            <TooltipAnchor
              description={localize('com_ui_edit_project')}
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-text-secondary hover:text-text-primary"
                  aria-label={localize('com_ui_edit_project')}
                  onClick={() => setIsEditOpen(true)}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Button>
              }
            />
            <TooltipAnchor
              description={localize('com_ui_delete_project_action')}
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-text-secondary hover:text-text-destructive"
                  aria-label={localize('com_ui_delete_project_action')}
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              }
            />
          </div>
        </div>
      </header>

      {/* NOTICE BANNER */}
      {isNoticeVisible && (
        <div className="border-b border-border-light bg-surface-secondary/40 px-4 py-2 md:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs">
            <span className="text-text-secondary">
              Usage limit reached · Resets 9:00 PM ·{' '}
              <a
                href="https://openrouter.ai/credits"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-text-primary"
              >
                limits shared with Claude Code
              </a>
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://openrouter.ai/credits"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-text-primary px-3 py-1 text-[11px] font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
              >
                Get more usage
              </a>
              <button
                type="button"
                onClick={() => setIsNoticeVisible(false)}
                className="p-0.5 text-text-tertiary hover:text-text-primary"
                aria-label="Dismiss notice"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN BODY */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pb-12 pt-6 md:px-6 lg:flex-row">
        {/* CENTER / LEFT COLUMN: Project Details, Composer, Recents */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* PROJECT HEADING */}
          <div className="flex items-start gap-4 pb-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-secondary text-text-secondary">
              <Folder className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-serif text-3xl font-semibold tracking-tight text-text-primary">
                {project.name}
              </h1>
              {project.description ? (
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {project.description}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="mt-1 text-sm text-text-tertiary hover:text-text-primary"
                >
                  {localize('com_ui_add_description')}
                </button>
              )}
            </div>
          </div>

          {/* PROJECT COMPOSER BUTTON */}
          <button
            type="button"
            onClick={startProjectChat}
            className={cn(
              'shadow-xs mt-4 flex w-full items-center gap-3 rounded-2xl border border-border-light bg-surface-primary px-4 py-3.5 text-left',
              'transition-colors duration-150 hover:border-border-medium hover:bg-surface-secondary/40',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary',
            )}
            aria-label={localize('com_ui_new_chat_in_project', { name: project.name })}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-text-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 truncate text-xs text-text-tertiary">
              How can I help you in {project.name}?
            </span>
            <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-tertiary">
              Chat
            </span>
          </button>

          {/* RECENTS SECTION */}
          <section className="mt-8 flex min-h-0 flex-1 flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-text-primary">
                Recents{' '}
                <span className="ml-1 text-xs font-normal text-text-tertiary">
                  ({project.conversationCount})
                </span>
              </h2>
              <DropdownPopup
                portal={true}
                focusLoop={true}
                unmountOnHide={true}
                menuId={sortMenuId}
                isOpen={isSortMenuOpen}
                setIsOpen={setIsSortMenuOpen}
                className="z-[125] min-w-44"
                trigger={
                  <Ariakit.MenuButton
                    aria-label={localize('com_ui_sort_chats_by')}
                    className={cn(
                      'inline-flex h-7 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary',
                      isSortMenuOpen && 'bg-surface-hover text-text-primary',
                    )}
                  >
                    <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                    {selectedSortLabel}
                  </Ariakit.MenuButton>
                }
                items={sortMenuItems}
              />
            </div>
            <ProjectChatList
              conversations={conversations}
              isLoading={isConversationsLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              sortBy={sortBy}
              emptyLabel={localize('com_ui_no_project_chats')}
              loadMore={() => fetchNextPage()}
            />
          </section>
        </div>

        {/* RIGHT SIDEBAR PANEL: Instructions, Memory, Context, Folder, Scheduled */}
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-80">
          {/* INSTRUCTIONS CARD */}
          <div className="shadow-xs rounded-2xl border border-border-light bg-surface-primary p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Instructions
              </span>
              <button
                type="button"
                onClick={() => setIsInstructionsOpen(true)}
                className="rounded p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                aria-label="Edit project instructions"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-text-secondary">
              {projectInstructions ||
                'Provide Claude with instructions for chats in this project. Click edit to set custom instructions.'}
            </p>
          </div>

          {/* MEMORY CARD */}
          <div className="shadow-xs rounded-2xl border border-border-light bg-surface-primary p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Memory
                </span>
                <span className="py-0.2 rounded bg-surface-secondary px-1.5 text-[10px] text-text-tertiary">
                  Only you
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="text-xs font-medium text-text-secondary underline transition-colors hover:text-text-primary"
              >
                View memory
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-tertiary">
              Memories generated in chats within this project are scoped to your workspace and
              shared context.
            </p>
          </div>

          {/* CONTEXT CARD */}
          <div className="shadow-xs rounded-2xl border border-border-light bg-surface-primary p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Context
              </span>
              <div className="flex items-center gap-1 text-text-tertiary">
                <button
                  type="button"
                  className="p-1 hover:text-text-primary"
                  aria-label="Search context"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-text-primary"
                  aria-label="Add context file"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-text-tertiary">
                <span>18% of project capacity used</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
                <div className="h-full w-[18%] rounded-full bg-text-primary" />
              </div>
            </div>

            {/* File chips */}
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between rounded-lg border border-border-light/60 bg-surface-secondary/40 px-2.5 py-1.5 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
                  <span className="truncate text-text-primary">PROJECT_GUIDE.md</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-text-tertiary">
                  <span>14 KB</span>
                  <span className="rounded bg-surface-secondary px-1 text-[9px]">MD</span>
                </div>
              </div>
            </div>
          </div>

          {/* FOLDER CARD */}
          <div className="shadow-xs rounded-2xl border border-border-light bg-surface-primary p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Folder
                </span>
                <span className="py-0.2 rounded bg-surface-secondary px-1.5 text-[10px] text-text-tertiary">
                  Only you
                </span>
              </div>
              <button
                type="button"
                className="p-1 text-text-tertiary hover:text-text-primary"
                aria-label="Add folder"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              Add a folder on this computer for Claude to work in.
            </p>
          </div>

          {/* SCHEDULED CARD */}
          <div className="shadow-xs rounded-2xl border border-border-light bg-surface-primary p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Scheduled
              </span>
              <button
                type="button"
                className="p-1 text-text-tertiary hover:text-text-primary"
                aria-label="Set up scheduled tasks"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              Set up recurring tasks for this project.
            </p>
          </div>
        </aside>
      </div>

      <ProjectEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} project={project} />
      <ProjectDeleteDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} project={project} />
      <ProjectInstructionsModal
        open={isInstructionsOpen}
        onOpenChange={setIsInstructionsOpen}
        projectName={project.name}
        initialInstructions={projectInstructions}
        onSave={setProjectInstructions}
      />
    </main>
  );
}
