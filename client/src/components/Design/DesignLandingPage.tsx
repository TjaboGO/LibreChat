/* eslint-disable i18next/no-literal-string */
import React, { useState, useMemo } from 'react';
import { Avatar } from '@librechat/client';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  Sparkles,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Code2,
  ArrowUp,
  Search,
  Layout,
  Smartphone,
  Presentation,
  FileText,
  Boxes,
  PlaySquare,
  FileSpreadsheet,
  Box,
  Compass,
  Mail,
  Palette,
  Star,
  MoreVertical,
  Layers,
} from 'lucide-react';
import { useAuthContext } from '~/hooks/AuthContext';
import DesignSystemModal from './DesignSystemModal';
import { cn } from '~/utils';
import store from '~/store';

interface TemplateTile {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const TEMPLATES: TemplateTile[] = [
  { id: 'blank', name: 'Blank', icon: <Layout className="h-4 w-4" /> },
  { id: 'mobile', name: 'Mobile app design', icon: <Smartphone className="h-4 w-4" /> },
  { id: 'slides', name: 'Slides', icon: <Presentation className="h-4 w-4" /> },
  { id: 'document', name: 'Document', icon: <FileText className="h-4 w-4" /> },
  { id: 'wireframe', name: 'Wireframe', icon: <Boxes className="h-4 w-4" /> },
  { id: 'animation', name: 'Animation', icon: <PlaySquare className="h-4 w-4" /> },
  { id: 'ui-mockup', name: 'UI mockups', icon: <Layout className="h-4 w-4" /> },
  { id: 'resume', name: 'Résumé', icon: <FileSpreadsheet className="h-4 w-4" /> },
  { id: '3d-object', name: '3D object', icon: <Box className="h-4 w-4" /> },
  { id: 'research', name: 'Research', icon: <Compass className="h-4 w-4" /> },
  { id: 'html-email', name: 'HTML email', icon: <Mail className="h-4 w-4" /> },
  { id: 'type-pairing', name: 'Color + type pairing', icon: <Palette className="h-4 w-4" /> },
];

interface DesignProjectItem {
  id: string;
  name: string;
  lastViewed: string;
  owner: string;
  access: string;
}

interface DesignLandingPageProps {
  onOpenProject: (title: string, designSystem: string) => void;
}

export default function DesignLandingPage({ onOpenProject }: DesignLandingPageProps) {
  const { user } = useAuthContext();
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [designSystem, setDesignSystem] = useState('Modernist');
  const [isTemplateCollapsed, setIsTemplateCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'systems' | 'templates'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSystemModal, setShowSystemModal] = useState(false);

  const artifactsRecord = useRecoilValue(store.artifactsState);
  const setCurrentArtifactId = useSetRecoilState(store.currentArtifactId);

  const [projects] = useState<DesignProjectItem[]>([
    {
      id: 'dp-1',
      name: 'E-Commerce Checkout Flow',
      lastViewed: '10 minutes ago',
      owner: user?.name || 'You',
      access: 'Editable by team',
    },
    {
      id: 'dp-2',
      name: 'Landing Page Redesign',
      lastViewed: 'Yesterday',
      owner: user?.name || 'You',
      access: 'Editable by team',
    },
    {
      id: 'dp-3',
      name: 'Mobile Onboarding Deck',
      lastViewed: '3 days ago',
      owner: 'Gabriel',
      access: 'View only',
    },
    {
      id: 'dp-4',
      name: 'Design Token Showcase',
      lastViewed: 'Sep 14',
      owner: 'Design Lab',
      access: 'Editable by team',
    },
  ]);

  const allProjects = useMemo<DesignProjectItem[]>(() => {
    const liveItems: DesignProjectItem[] = [];
    if (artifactsRecord) {
      Object.entries(artifactsRecord).forEach(([id, art]) => {
        if (art && (art.title || art.identifier)) {
          liveItems.push({
            id,
            name: art.title || art.identifier || 'Untitled Artifact',
            lastViewed: 'Just now',
            owner: user?.name || 'You',
            access: 'Live Artifact',
          });
        }
      });
    }
    return [...liveItems, ...projects];
  }, [artifactsRecord, projects, user?.name]);

  const handleCreate = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const title =
      prompt.trim() ||
      `${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Project`;
    onOpenProject(title, designSystem);
  };

  const filteredProjects = allProjects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-presentation text-text-primary">
      {/* MINIMAL TOP BAR */}
      <header className="flex h-14 items-center justify-between border-b border-border-light bg-presentation px-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-tight text-text-primary">
              Claude Design
            </span>
            <span className="py-0.2 rounded bg-surface-secondary px-1.5 text-[10px] font-semibold text-text-secondary">
              Beta
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar user={user} size={28} />
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-12 text-center md:pt-16">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
          What should we create?
        </h1>

        {/* CENTERED COMPOSER CARD */}
        <form
          onSubmit={handleCreate}
          className="mt-6 w-full rounded-2xl border border-border-light bg-surface-primary p-4 text-left shadow-xl transition-all focus-within:border-text-primary"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCreate();
              }
            }}
            rows={3}
            placeholder="Attach a file, link your design system, or describe what you want to make…"
            className="w-full resize-none bg-transparent text-xs leading-relaxed text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />

          <div className="mt-3 flex items-center justify-between border-t border-border-light/60 pt-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-secondary/40 px-2.5 py-1 text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                aria-label="Attach file"
              >
                <Paperclip className="h-3.5 w-3.5" />
                <span className="text-[11px]">Attach</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSystemModal(true)}
                className="flex items-center gap-1.5 rounded-lg border border-border-light bg-surface-secondary/40 px-2.5 py-1 text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
              >
                <Palette className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-[11px] font-medium text-text-primary">{designSystem}</span>
                <ChevronDown className="h-3 w-3 text-text-tertiary" />
              </button>

              <button
                type="button"
                onClick={() => handleCreate()}
                className="rounded-lg p-1.5 text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
                aria-label="Code view"
              >
                <Code2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-text-secondary">DeepSeek Reasoner</span>
              <button
                type="submit"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-white shadow-md transition-colors hover:bg-orange-700"
                aria-label="Generate design"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>

        {/* CHOOSE A TEMPLATE SECTION */}
        <div className="mt-8 w-full">
          <div className="flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={() => setIsTemplateCollapsed((c) => !c)}
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary hover:text-text-primary"
            >
              <span>Choose a template</span>
              {isTemplateCollapsed ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {!isTemplateCollapsed && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={cn(
                      'flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all',
                      isSelected
                        ? 'shadow-xs border-blue-500 bg-surface-primary ring-1 ring-blue-500'
                        : 'border-border-light bg-surface-primary/70 hover:border-border-medium hover:bg-surface-primary',
                    )}
                  >
                    <div className="text-text-secondary">{tpl.icon}</div>
                    <span className="mt-2 line-clamp-1 text-[11px] font-medium text-text-primary">
                      {tpl.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM TABS & PROJECTS TABLE */}
        <div className="mt-12 w-full pb-16">
          {/* TAB BAR */}
          <div className="flex items-center justify-between border-b border-border-light pb-3">
            <div className="flex items-center gap-6 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={cn(
                  'pb-1 font-medium transition-colors',
                  activeTab === 'projects'
                    ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary',
                )}
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('systems')}
                className={cn(
                  'pb-1 font-medium transition-colors',
                  activeTab === 'systems'
                    ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary',
                )}
              >
                Design systems
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={cn(
                  'pb-1 font-medium transition-colors',
                  activeTab === 'templates'
                    ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary',
                )}
              >
                Templates
              </button>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="h-8 w-44 rounded-lg border border-border-light bg-surface-secondary/50 pl-8 pr-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
              />
            </div>
          </div>

          {/* TABLE */}
          {activeTab === 'projects' && (
            <div className="shadow-xs mt-3 divide-y divide-border-light/60 overflow-hidden rounded-xl border border-border-light/60 bg-surface-primary text-left">
              <div className="grid grid-cols-12 bg-surface-secondary/40 px-4 py-2.5 text-[11px] font-medium text-text-tertiary">
                <div className="col-span-5">Name</div>
                <div className="col-span-3">Last viewed</div>
                <div className="col-span-2">Owner</div>
                <div className="col-span-2 text-right">Access</div>
              </div>

              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    if (artifactsRecord && artifactsRecord[proj.id]) {
                      setCurrentArtifactId(proj.id);
                    }
                    onOpenProject(proj.name, designSystem);
                  }}
                  className="grid cursor-pointer grid-cols-12 items-center px-4 py-3 text-xs transition-colors hover:bg-surface-secondary/40"
                >
                  <div className="col-span-5 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                      <Layout className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-text-primary">{proj.name}</span>
                  </div>
                  <div className="col-span-3 text-[11px] text-text-tertiary">{proj.lastViewed}</div>
                  <div className="col-span-2 text-[11px] text-text-secondary">{proj.owner}</div>
                  <div className="col-span-2 flex items-center justify-end gap-2 text-[11px] text-text-tertiary">
                    <span>{proj.access}</span>
                    <Star className="h-3.5 w-3.5 hover:text-amber-500" />
                    <MoreVertical className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'systems' && (
            <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
              <Palette className="h-8 w-8 text-text-tertiary" />
              <h4 className="mt-2 text-xs font-semibold text-text-primary">
                Included design systems
              </h4>
              <p className="mt-1 text-xs text-text-secondary">
                Modernist, Classical, Nocturne, Organic, Broadsheet, and Industry are active.
              </p>
              <button
                type="button"
                onClick={() => setShowSystemModal(true)}
                className="mt-4 rounded-lg bg-text-primary px-3.5 py-1.5 text-xs font-medium text-surface-primary transition-colors hover:bg-text-primary/90"
              >
                Add design system
              </button>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
              <Layers className="h-8 w-8 text-text-tertiary" />
              <h4 className="mt-2 text-xs font-semibold text-text-primary">
                No custom templates yet
              </h4>
              <p className="mt-1 max-w-sm text-xs text-text-secondary">
                Claude creates templates inside design systems. Open any project and save it as a
                template.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING PROMO STICKER BADGE */}
      <button
        type="button"
        onClick={() => setShowSystemModal(true)}
        className="fixed bottom-6 right-6 hidden items-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3 text-left shadow-xl backdrop-blur-sm transition-transform hover:scale-105 md:flex"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="text-xs">
          <div className="font-semibold text-blue-600 dark:text-blue-400">
            Set up a design system!
          </div>
          <div className="text-[11px] text-text-secondary">
            Create more consistent, on-brand designs.
          </div>
        </div>
      </button>

      {/* DESIGN SYSTEM MODAL */}
      {showSystemModal && (
        <DesignSystemModal
          open={showSystemModal}
          onOpenChange={setShowSystemModal}
          onSelectSystem={(sys) => setDesignSystem(sys)}
        />
      )}
    </div>
  );
}
