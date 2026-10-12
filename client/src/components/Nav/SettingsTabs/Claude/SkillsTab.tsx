/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import * as Ariakit from '@ariakit/react';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  Sparkles,
  Upload,
  Pencil,
  Video,
  Table,
  Check,
  MoreVertical,
  Briefcase,
  Layers,
  Megaphone,
  Share2,
  DollarSign,
  PieChart,
} from 'lucide-react';
import { cn } from '~/utils';

interface SkillItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  isNew?: boolean;
  author: string;
  updatedAt: string;
  iconBg?: string;
}

interface DiscoverSkill {
  id: string;
  title: string;
  description: string;
  author: string;
  installs: string;
  icon: React.ReactNode;
}

const YOUR_SKILLS: SkillItem[] = [
  {
    id: 'skill-1',
    name: 'TypeScript Architect',
    description: 'Generates clean TypeScript types, interfaces, and strict functional components.',
    tags: ['Code', 'Development'],
    isNew: true,
    author: 'you',
    updatedAt: 'yesterday',
  },
  {
    id: 'skill-2',
    name: 'Documentation Drafter',
    description: 'Summarizes architectural designs, roadmaps, and changelogs.',
    tags: ['Writing', 'Docs'],
    isNew: true,
    author: 'you',
    updatedAt: '2d ago',
  },
  {
    id: 'skill-3',
    name: 'Full Stack API Integrator',
    description: 'Builds OpenRouter proxy integrations, REST endpoints, and schema validators.',
    tags: ['Backend', 'APIs', '+2'],
    author: 'you',
    updatedAt: 'Jul 25',
  },
  {
    id: 'skill-4',
    name: 'UI Design Refiner',
    description: 'Aligns Tailwind classes, tokens, and contrast ratios with reference mockups.',
    tags: ['Design', 'UI'],
    author: 'you',
    updatedAt: 'Jul 12',
  },
];

const DISCOVER_SKILLS: DiscoverSkill[] = [
  {
    id: 'disc-1',
    title: 'Productivity',
    description:
      'Automate repetitive workflows, summarize lengthy threads, and organize checklists.',
    author: 'from Anthropic',
    installs: '2.7M installs',
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: 'disc-2',
    title: 'Design',
    description: 'Transform wireframes into accessible React components and design tokens.',
    author: 'from Anthropic',
    installs: '1.9M installs',
    icon: <Layers className="h-4 w-4" />,
  },
  {
    id: 'disc-3',
    title: 'Marketing',
    description: 'Draft product announcements, release notes, and targeted communication copy.',
    author: 'from Anthropic',
    installs: '1.4M installs',
    icon: <Megaphone className="h-4 w-4" />,
  },
  {
    id: 'disc-4',
    title: 'Postiz',
    description: 'Connect to social channels, schedule posts, and analyze reach metrics.',
    author: 'from Nevo David',
    installs: '840K installs',
    icon: <Share2 className="h-4 w-4" />,
  },
  {
    id: 'disc-5',
    title: 'Finance',
    description: 'Analyze financial statements, parse revenue forecasts, and model runaways.',
    author: 'from Anthropic',
    installs: '1.2M installs',
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    id: 'disc-6',
    title: 'Product Management',
    description: 'Structure user stories, acceptance criteria, PRDs, and delivery milestones.',
    author: 'from Anthropic',
    installs: '1.5M installs',
    icon: <PieChart className="h-4 w-4" />,
  },
];

export default function SkillsTab() {
  const [activeTab, setActiveTab] = useState<'yours' | 'discover'>('yours');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedSkills, setAddedSkills] = useState<Record<string, boolean>>({});

  const toggleAddDiscoverSkill = (id: string) => {
    setAddedSkills((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredYourSkills = YOUR_SKILLS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredDiscoverSkills = DISCOVER_SKILLS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col text-text-primary">
      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col gap-3 pb-4">
        <h3 className="text-lg font-semibold text-text-primary">Skills</h3>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills and plugins"
            className="w-full rounded-xl border border-border-light bg-surface-secondary/50 py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
          />
        </div>
      </div>

      {/* TABS & TOP-RIGHT CONTROLS */}
      <div className="flex items-center justify-between border-b border-border-light pb-3">
        <div className="flex items-center gap-4 text-xs">
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
            Your skills
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('discover')}
            className={cn(
              'pb-1 font-medium transition-colors',
              activeTab === 'discover'
                ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                : 'text-text-tertiary hover:text-text-primary',
            )}
          >
            Discover
          </button>
        </div>

        {activeTab === 'yours' ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-primary px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Filter</span>
              <ChevronDown className="h-3 w-3 text-text-tertiary" />
            </button>

            {/* ADD DROPDOWN */}
            <Ariakit.MenuProvider>
              <Ariakit.MenuButton
                className="flex items-center gap-1 rounded-lg bg-text-primary px-2.5 py-1 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
                aria-label="Add skill"
              >
                <span>Add</span>
                <ChevronDown className="h-3 w-3" />
              </Ariakit.MenuButton>
              <Ariakit.Menu
                portal
                gutter={6}
                className="z-[150] min-w-44 rounded-xl border border-border-light bg-surface-primary p-1 text-text-primary shadow-lg"
              >
                <Ariakit.MenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary">
                  <Upload className="h-3.5 w-3.5 text-text-secondary" />
                  <span>Upload skill</span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary">
                  <Pencil className="h-3.5 w-3.5 text-text-secondary" />
                  <span>Create a skill</span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span>Create with Claude</span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary">
                  <Video className="h-3.5 w-3.5 text-text-secondary" />
                  <span>Record your screen</span>
                </Ariakit.MenuItem>
              </Ariakit.Menu>
            </Ariakit.MenuProvider>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-primary px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Filter</span>
              <ChevronDown className="h-3 w-3 text-text-tertiary" />
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-primary px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
            >
              <span>Sort</span>
              <ChevronDown className="h-3 w-3 text-text-tertiary" />
            </button>
          </div>
        )}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'yours' ? (
        <div className="pt-4">
          <div className="mb-2 text-xs font-medium text-text-tertiary">
            Created by you · {filteredYourSkills.length}
          </div>
          <div className="divide-y divide-border-light/60 overflow-hidden rounded-xl border border-border-light/60 bg-surface-primary">
            {filteredYourSkills.map((skill) => (
              <div
                key={skill.id}
                className="group flex items-center justify-between px-3.5 py-3 transition-colors hover:bg-surface-secondary/40"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-text-secondary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary">{skill.name}</span>
                      {skill.isNew && (
                        <span className="py-0.2 rounded bg-blue-500/10 px-1.5 text-[10px] font-semibold text-blue-600">
                          New
                        </span>
                      )}
                      {skill.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="py-0.2 rounded bg-surface-secondary px-1.5 text-[10px] text-text-tertiary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-text-secondary">
                      by {skill.author} · {skill.description}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 pl-3">
                  <span className="text-[11px] text-text-tertiary">{skill.updatedAt}</span>
                  <button
                    type="button"
                    className="rounded p-1 text-text-tertiary hover:bg-surface-secondary hover:text-text-primary"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* DISCOVER TAB */
        <div className="flex flex-col gap-6 pt-4">
          {/* FEATURED BANNER (SAGE GREEN) */}
          <div className="relative flex items-center justify-between rounded-2xl border border-[#526B5C]/30 bg-[#526B5C]/15 p-5 dark:bg-[#526B5C]/25">
            <div className="max-w-[70%]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#3D5245] dark:text-[#A4C2B0]">
                From Anthropic
              </span>
              <h4 className="mt-1 text-lg font-bold text-text-primary">Data</h4>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                Query, chart and explain your data — SQL, spreadsheets and dashboards in one place.
              </p>
              <button
                type="button"
                className="mt-3.5 rounded-lg bg-text-primary px-3.5 py-1.5 text-xs font-semibold text-surface-primary transition-colors hover:bg-text-primary/90"
              >
                Add
              </button>
            </div>
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#526B5C]/20 text-[#3D5245] dark:text-[#A4C2B0] sm:flex">
              <Table className="h-8 w-8" />
            </div>
          </div>

          {/* FOR YOU GRID */}
          <div>
            <h4 className="mb-3 text-xs font-semibold text-text-primary">For you</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredDiscoverSkills.map((disc) => {
                const isAdded = addedSkills[disc.id];
                return (
                  <div
                    key={disc.id}
                    className="shadow-xs flex flex-col justify-between rounded-xl border border-border-light bg-surface-primary p-3.5 transition-colors hover:border-border-medium"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-secondary text-text-secondary">
                            {disc.icon}
                          </div>
                          <span className="text-xs font-semibold text-text-primary">
                            {disc.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleAddDiscoverSkill(disc.id)}
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
                            isAdded
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-border-light bg-surface-primary text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
                          )}
                          aria-label={`Add ${disc.title}`}
                        >
                          {isAdded ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-text-secondary">
                        {disc.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-text-tertiary">
                      <span>{disc.author}</span>
                      <span>{disc.installs}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
