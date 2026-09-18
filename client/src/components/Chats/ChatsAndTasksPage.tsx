/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@librechat/client';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Check,
  MoreVertical,
  MessageSquare,
  Users,
  Briefcase,
  Archive,
  Info,
} from 'lucide-react';
import ChatInfoModal from '~/components/Chat/Menus/ChatInfoModal';
import OpenSidebar from '~/components/Chat/Menus/OpenSidebar';
import { cn } from '~/utils';

export type ChatFilterType = 'all' | 'chat' | 'shared' | 'cowork' | 'archived';

interface ChatTaskItem {
  id: string;
  title: string;
  type: 'chat' | 'cowork' | 'shared' | 'archived';
  timeAgo: string;
  createdAt: string;
  messageCount: number;
  model: string;
}

const SAMPLE_CHATS: ChatTaskItem[] = [
  {
    id: 'c-1',
    title: 'DeepSeek Reasoner prompt optimization and system prompt review',
    type: 'chat',
    timeAgo: '2 hours ago',
    createdAt: 'Sep 18, 2026, 10:30 PM',
    messageCount: 16,
    model: 'DeepSeek Reasoner',
  },
  {
    id: 'c-2',
    title: 'Workspace refactor: Claude chat-app UI tokens and components',
    type: 'cowork',
    timeAgo: '9 hours ago',
    createdAt: 'Sep 18, 2026, 3:15 PM',
    messageCount: 28,
    model: 'Claude Sonnet 3.5',
  },
  {
    id: 'c-3',
    title: 'Project architecture discussion with Gabriel',
    type: 'shared',
    timeAgo: '21 hours ago',
    createdAt: 'Sep 18, 2026, 3:30 AM',
    messageCount: 12,
    model: 'Claude Sonnet 3.5',
  },
  {
    id: 'c-4',
    title: 'API Gateway integration tests for OpenRouter proxy',
    type: 'cowork',
    timeAgo: 'Yesterday',
    createdAt: 'Sep 17, 2026, 4:45 PM',
    messageCount: 34,
    model: 'DeepSeek Chat',
  },
  {
    id: 'c-5',
    title: 'LibreChat upstream sync & merge conflict analysis',
    type: 'chat',
    timeAgo: '2 days ago',
    createdAt: 'Sep 16, 2026, 1:20 PM',
    messageCount: 8,
    model: 'Claude Opus 3',
  },
  {
    id: 'c-6',
    title: 'Deprecated OAuth endpoint cleanup',
    type: 'archived',
    timeAgo: '5 days ago',
    createdAt: 'Sep 13, 2026, 11:00 AM',
    messageCount: 5,
    model: 'Claude Haiku',
  },
];

export default function ChatsAndTasksPage() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ChatFilterType>('all');
  const [selectedChatIds, setSelectedChatIds] = useState<Record<string, boolean>>({});
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [infoModalChat, setInfoModalChat] = useState<ChatTaskItem | null>(null);

  const filterOptions: { value: ChatFilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'chat', label: 'Chat' },
    { value: 'shared', label: 'Shared' },
    { value: 'cowork', label: 'Cowork' },
    { value: 'archived', label: 'Archived' },
  ];

  const filteredChats = SAMPLE_CHATS.filter((item) => {
    if (filter !== 'all' && item.type !== filter) {
      return false;
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const toggleSelectChat = (id: string) => {
    setSelectedChatIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getChatIcon = (type: ChatTaskItem['type']) => {
    switch (type) {
      case 'cowork':
        return <Briefcase className="h-4 w-4 text-amber-500" />;
      case 'shared':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-text-tertiary" />;
      default:
        return <MessageSquare className="h-4 w-4 text-text-secondary" />;
    }
  };

  return (
    <main className="flex h-full min-h-0 flex-col overflow-y-auto bg-presentation text-text-primary">
      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-border-light bg-presentation">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
          <div className="flex items-center gap-2.5">
            {isSmallScreen ? <OpenSidebar className="size-9 shrink-0" /> : null}
            <h1 className="truncate font-serif text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
              Chats and tasks
            </h1>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="h-8 w-36 rounded-lg border border-border-light bg-surface-secondary/50 pl-8 pr-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary sm:w-48"
              />
            </div>

            {/* Filter Dropdown */}
            <Ariakit.MenuProvider>
              <Ariakit.MenuButton
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-surface-primary text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                aria-label="Filter chats"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </Ariakit.MenuButton>
              <Ariakit.Menu
                portal
                gutter={6}
                className="z-[150] min-w-40 rounded-xl border border-border-light bg-surface-primary p-1 text-text-primary shadow-lg"
              >
                {filterOptions.map((opt) => (
                  <Ariakit.MenuItem
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-xs hover:bg-surface-secondary"
                  >
                    <span>{opt.label}</span>
                    {filter === opt.value && <Check className="h-3.5 w-3.5 text-blue-500" />}
                  </Ariakit.MenuItem>
                ))}
              </Ariakit.Menu>
            </Ariakit.MenuProvider>

            {/* Select Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setIsSelectMode((prev) => !prev);
                setSelectedChatIds({});
              }}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                isSelectMode
                  ? 'border-text-primary bg-surface-secondary text-text-primary'
                  : 'border-border-light text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
              )}
            >
              Select
            </button>

            {/* New Button */}
            <button
              type="button"
              onClick={() => navigate('/c/new')}
              className="flex items-center gap-1 rounded-full bg-text-primary px-3.5 py-1 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT LIST */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-12 pt-6 md:px-6">
        <div className="shadow-xs divide-y divide-border-light/60 overflow-hidden rounded-2xl border border-border-light/60 bg-surface-primary">
          {filteredChats.length === 0 ? (
            <div className="py-16 text-center text-xs text-text-tertiary">
              No conversations found.
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  if (isSelectMode) {
                    toggleSelectChat(chat.id);
                  } else {
                    navigate('/c/new');
                  }
                }}
                className={cn(
                  'group flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-surface-secondary/40',
                  selectedChatIds[chat.id] && 'bg-surface-secondary/60',
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {isSelectMode ? (
                    <input
                      type="checkbox"
                      checked={Boolean(selectedChatIds[chat.id])}
                      onChange={() => toggleSelectChat(chat.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-border-light text-text-primary focus:ring-1 focus:ring-text-primary"
                    />
                  ) : (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
                      {getChatIcon(chat.type)}
                    </div>
                  )}
                  <span className="truncate text-xs font-medium text-text-primary">
                    {chat.title}
                  </span>
                  {chat.type === 'cowork' && (
                    <span className="py-0.2 rounded bg-amber-500/10 px-1.5 text-[10px] font-medium text-amber-600">
                      Cowork
                    </span>
                  )}
                  {chat.type === 'shared' && (
                    <span className="py-0.2 rounded bg-blue-500/10 px-1.5 text-[10px] font-medium text-blue-600">
                      Shared
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3 pl-3 text-text-tertiary">
                  <span className="text-[11px]">{chat.timeAgo}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfoModalChat(chat);
                    }}
                    className="rounded p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                    aria-label="Chat info"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                    aria-label="More actions"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {infoModalChat && (
        <ChatInfoModal
          open={Boolean(infoModalChat)}
          onOpenChange={(open) => !open && setInfoModalChat(null)}
          info={{
            conversationId: infoModalChat.id,
            title: infoModalChat.title,
            createdAt: infoModalChat.createdAt,
            lastInteracted: infoModalChat.timeAgo,
            totalMessages: infoModalChat.messageCount,
            model: infoModalChat.model,
          }}
        />
      )}
    </main>
  );
}
