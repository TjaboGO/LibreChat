/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@librechat/client';
import {
  FileText,
  Presentation,
  Palette,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  Lock,
  Globe,
  MoreVertical,
  Code2,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import OpenSidebar from '~/components/Chat/Menus/OpenSidebar';
import useNewConvo from '~/hooks/useNewConvo';
import { cn } from '~/utils';

interface ArtifactItem {
  id: string;
  title: string;
  type: 'code' | 'doc' | 'slides' | 'design' | 'chart';
  visibility: 'private' | 'public';
  updatedAt: string;
  timeGroup: 'Today' | 'Yesterday' | 'Last week';
}

const SAMPLE_ARTIFACTS: ArtifactItem[] = [
  {
    id: 'art-1',
    title: 'Landing Page Interactive Prototype',
    type: 'design',
    visibility: 'private',
    updatedAt: 'Viewed 2 hours ago',
    timeGroup: 'Today',
  },
  {
    id: 'art-2',
    title: 'DeepSeek Reasoner Model Context Benchmarks',
    type: 'chart',
    visibility: 'public',
    updatedAt: 'Edited 4 hours ago',
    timeGroup: 'Today',
  },
  {
    id: 'art-3',
    title: 'Claude Copycat Architecture & Tool Integration Specs',
    type: 'doc',
    visibility: 'private',
    updatedAt: 'Edited yesterday',
    timeGroup: 'Yesterday',
  },
  {
    id: 'art-4',
    title: 'OpenRouter Streaming Client & SSE Adapter',
    type: 'code',
    visibility: 'private',
    updatedAt: 'Viewed yesterday',
    timeGroup: 'Yesterday',
  },
  {
    id: 'art-5',
    title: 'Product Roadmap Presentation Q3-Q4',
    type: 'slides',
    visibility: 'public',
    updatedAt: 'Edited 5 days ago',
    timeGroup: 'Last week',
  },
];

export default function ArtifactsListPage() {
  const navigate = useNavigate();
  const { newConversation } = useNewConvo();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const [activeTab, setActiveTab] = useState<'all' | 'yours' | 'shared'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const handleCreateArtifact = (_format: string) => {
    navigate('/c/new');
    newConversation();
  };

  const getArtifactIcon = (type: ArtifactItem['type']) => {
    switch (type) {
      case 'code':
        return <Code2 className="h-4 w-4 text-blue-500" />;
      case 'chart':
        return <BarChart3 className="h-4 w-4 text-emerald-500" />;
      case 'doc':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'slides':
        return <Presentation className="h-4 w-4 text-purple-500" />;
      case 'design':
        return <Palette className="h-4 w-4 text-rose-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-text-secondary" />;
    }
  };

  const filteredArtifacts = SAMPLE_ARTIFACTS.filter((art) => {
    if (activeTab === 'shared' && art.visibility !== 'public') {
      return false;
    }
    if (selectedType !== 'all' && art.type !== selectedType) {
      return false;
    }
    if (searchQuery && !art.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const timeGroups: ('Today' | 'Yesterday' | 'Last week')[] = ['Today', 'Yesterday', 'Last week'];

  return (
    <main className="flex h-full min-h-0 flex-col overflow-y-auto bg-presentation text-text-primary">
      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-border-light bg-presentation">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2.5 px-4 md:h-16 md:px-6">
          {isSmallScreen ? <OpenSidebar className="size-9 shrink-0" /> : null}
          <h1 className="truncate text-balance font-serif text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
            Artifacts
          </h1>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-12 pt-6 md:px-6 md:pt-8">
        {/* FILTER ROW */}
        <div className="flex flex-col gap-4 border-b border-border-light pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={cn(
                'pb-1 font-medium transition-colors',
                activeTab === 'all'
                  ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('yours')}
              className={cn(
                'pb-1 font-medium transition-colors',
                activeTab === 'yours'
                  ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              Yours
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shared')}
              className={cn(
                'pb-1 font-medium transition-colors',
                activeTab === 'shared'
                  ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              Shared with you
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artifacts"
                className="h-8 w-44 rounded-lg border border-border-light bg-surface-secondary/50 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>

            {/* Type selector */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                aria-label="Filter artifact types"
                className="h-8 appearance-none rounded-lg border border-border-light bg-surface-secondary/50 py-1 pl-2.5 pr-7 text-xs font-medium text-text-secondary focus:outline-none focus:ring-1 focus:ring-text-primary"
              >
                <option value="all">All types</option>
                <option value="code">Code</option>
                <option value="doc">Documents</option>
                <option value="slides">Slides</option>
                <option value="design">Design</option>
                <option value="chart">Visualizations</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-tertiary" />
            </div>

            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-border-light bg-surface-secondary/40 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-md p-1 transition-colors',
                  viewMode === 'list'
                    ? 'shadow-xs bg-surface-primary text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary',
                )}
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-md p-1 transition-colors',
                  viewMode === 'grid'
                    ? 'shadow-xs bg-surface-primary text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary',
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* "MAKE SOMETHING NEW" SECTION */}
        <section className="py-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Make something new
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Docs Card */}
            <button
              type="button"
              onClick={() => handleCreateArtifact('doc')}
              className="shadow-xs group flex flex-col items-start rounded-2xl border border-border-light bg-surface-primary p-4 text-left transition-colors hover:border-border-medium hover:bg-surface-secondary/40"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-text-primary">Docs</span>
                <span className="py-0.2 rounded bg-blue-500/10 px-1.5 text-[10px] font-semibold text-blue-600">
                  Beta
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                Create structured documents, reports, and formatted copy.
              </p>
            </button>

            {/* Slides Card */}
            <button
              type="button"
              onClick={() => handleCreateArtifact('slides')}
              className="shadow-xs group flex flex-col items-start rounded-2xl border border-border-light bg-surface-primary p-4 text-left transition-colors hover:border-border-medium hover:bg-surface-secondary/40"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <Presentation className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-text-primary">Slides</span>
                <span className="py-0.2 rounded bg-blue-500/10 px-1.5 text-[10px] font-semibold text-blue-600">
                  Beta
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                Generate presentation slides, pitch decks, and outlines.
              </p>
            </button>

            {/* Design Card */}
            <button
              type="button"
              onClick={() => handleCreateArtifact('design')}
              className="shadow-xs group flex flex-col items-start rounded-2xl border border-border-light bg-surface-primary p-4 text-left transition-colors hover:border-border-medium hover:bg-surface-secondary/40"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                <Palette className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-text-primary">Design</span>
                <span className="py-0.2 rounded bg-blue-500/10 px-1.5 text-[10px] font-semibold text-blue-600">
                  Beta
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                Craft interactive prototypes, UI mockups, and components.
              </p>
            </button>
          </div>
        </section>

        {/* DATE-GROUPED ARTIFACTS LIST */}
        <section className="flex flex-col gap-6 pt-2">
          {timeGroups.map((group) => {
            const items = filteredArtifacts.filter((a) => a.timeGroup === group);
            if (items.length === 0) {
              return null;
            }

            return (
              <div key={group} className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  {group}
                </h3>
                <div className="divide-y divide-border-light/60 overflow-hidden rounded-xl border border-border-light/60 bg-surface-primary">
                  {items.map((artifact) => (
                    <div
                      key={artifact.id}
                      onClick={() => navigate('/c/new')}
                      className="group flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-surface-secondary/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
                          {getArtifactIcon(artifact.type)}
                        </div>
                        <span className="truncate text-xs font-semibold text-text-primary">
                          {artifact.title}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-4 pl-3 text-text-tertiary">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          {artifact.visibility === 'private' ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Globe className="h-3 w-3" />
                          )}
                          <span>{artifact.updatedAt}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded p-1 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                          aria-label="Artifact options"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
