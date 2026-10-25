/* eslint-disable i18next/no-literal-string */
import React, { useRef, useMemo, useCallback, useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { FileUpload, TooltipAnchor } from '@librechat/client';
import {
  Plus,
  Paperclip,
  Camera,
  FolderPlus,
  Sparkles,
  Plug,
  Palette,
  PackagePlus,
  Compass,
  Globe,
  Brain,
  Video,
  ChevronRight,
  Check,
  Lightbulb,
  BookOpen,
  Cpu,
  Layers,
  HelpCircle,
  Laptop,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import type { TConversation } from 'librechat-data-provider';
import type { ExtendedFile, FileSetter } from '~/common';
import { useFileHandlingNoChatContext, useLocalize } from '~/hooks';
import { useBadgeRowContext } from '~/Providers/BadgeRowContext';
import ConnectorHubModal from '../ConnectorHubModal';
import RecordSkillModal from '../RecordSkillModal';
import { cn } from '~/utils';
import store from '~/store';

export interface AttachPlusMenuProps {
  index?: number;
  disabled?: boolean | null;
  disableInputs?: boolean | null;
  conversation: TConversation | null;
  files: Map<string, ExtendedFile>;
  setFiles: FileSetter;
  setFilesLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Claude-styled composer "+" attach menu.
 * Matches docs/ui-reference/batch-4-screenshots.md and Task 007 exactly.
 * Adapts between Chat mode (with Web search, Research, Project) and
 * Cowork mode (with Devices submenu).
 */
export default function AttachPlusMenu({
  index = 0,
  disabled = false,
  disableInputs = false,
  conversation,
  files,
  setFiles,
  setFilesLoading,
}: AttachPlusMenuProps) {
  const localize = useLocalize();
  const inputRef = useRef<HTMLInputElement>(null);
  const isUploadDisabled = (disabled || disableInputs) ?? false;

  const [researchMode, setResearchMode] = useRecoilState(store.researchModeFamily(index));
  const [recordSkillOpen, setRecordSkillOpen] = useState(false);
  const [isConnectorHubOpen, setIsConnectorHubOpen] = useState(false);

  const menuStore = Ariakit.useMenuStore({ placement: 'top-start' });
  const isOpen = menuStore.useState('open');

  const projectSubmenu = Ariakit.useMenuStore({ placement: 'right-start' });
  const skillsSubmenu = Ariakit.useMenuStore({ placement: 'right-start' });
  const connectorsSubmenu = Ariakit.useMenuStore({ placement: 'right-start' });
  const designSubmenu = Ariakit.useMenuStore({ placement: 'right-start' });

  const badgeContext = useBadgeRowContext();
  const isWebSearchEnabled = Boolean(badgeContext?.webSearch?.toggleState);
  const isMemoryEnabled = Boolean(badgeContext?.memory?.toggleState);

  const conversationId = conversation?.conversationId ?? 'new';
  const setPendingManualSkills = useSetRecoilState(
    store.pendingManualSkillsByConvoId(conversationId),
  );

  const handleSelectSkill = useCallback(
    (skillName: string) => {
      menuStore.hide();
      setPendingManualSkills((prev) => (prev.includes(skillName) ? prev : [...prev, skillName]));
    },
    [menuStore, setPendingManualSkills],
  );

  const { handleFileChange } = useFileHandlingNoChatContext(undefined, {
    files,
    setFiles,
    setFilesLoading,
    conversation,
  });

  const handleUploadClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.value = '';
    inputRef.current.accept = '';
    inputRef.current.click();
    menuStore.hide();
  }, [menuStore]);

  const handleTakeScreenshot = useCallback(async () => {
    menuStore.hide();
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        handleUploadClick();
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      track.stop();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png'),
      );
      if (!blob) {
        return;
      }

      const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
      const dt = new DataTransfer();
      dt.items.add(file);
      if (inputRef.current) {
        inputRef.current.files = dt.files;
        handleFileChange({
          target: { files: dt.files },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    } catch (err) {
      console.warn('Screenshot capture cancelled or unsupported:', err);
    }
  }, [menuStore, handleUploadClick, handleFileChange]);

  const toggleWebSearch = useCallback(() => {
    badgeContext?.webSearch?.debouncedChange({ value: !isWebSearchEnabled });
    menuStore.hide();
  }, [badgeContext, isWebSearchEnabled, menuStore]);

  const toggleMemory = useCallback(() => {
    badgeContext?.memory?.debouncedChange({ value: !isMemoryEnabled });
    menuStore.hide();
  }, [badgeContext, isMemoryEnabled, menuStore]);

  const toggleResearch = useCallback(() => {
    setResearchMode((prev) => !prev);
    menuStore.hide();
  }, [setResearchMode, menuStore]);

  // Global shortcut ⌘U / Ctrl+U
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        handleUploadClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUploadClick]);

  const isMac = useMemo(
    () => typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent),
    [],
  );

  return (
    <>
      <FileUpload ref={inputRef} handleFileChange={handleFileChange}>
        <Ariakit.MenuProvider store={menuStore}>
          <TooltipAnchor
            description={`${localize('com_ui_attach_content_and_tools')} (${isMac ? '⌘U' : 'Ctrl+U'})`}
            disabled={isOpen}
            render={
              <Ariakit.MenuButton
                disabled={isUploadDisabled}
                id="composer-plus-menu-button"
                data-testid="composer-plus-menu-button"
                aria-label={localize('com_ui_attach_content_and_tools')}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border border-border-light text-text-secondary transition-colors duration-150',
                  'hover:border-border-medium hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary',
                  isOpen && 'border-border-medium bg-surface-secondary text-text-primary',
                  isUploadDisabled && 'cursor-not-allowed opacity-50',
                )}
              >
                <Plus className="size-4 stroke-[2.2]" aria-hidden="true" />
              </Ariakit.MenuButton>
            }
          />

          <Ariakit.Menu
            portal={true}
            gutter={8}
            unmountOnHide={true}
            data-testid="composer-plus-menu"
            className={cn(
              'z-50 flex min-w-[240px] max-w-[280px] flex-col rounded-2xl border border-border-light bg-surface-primary p-1.5 shadow-xl',
              'origin-bottom-left opacity-0 transition-[opacity,transform] duration-150 ease-out',
              'data-[enter]:scale-100 data-[enter]:opacity-100',
              'scale-95 data-[leave]:scale-95 data-[leave]:opacity-0',
            )}
          >
            {/* Row 1: Add files or photos */}
            <Ariakit.MenuItem
              onClick={handleUploadClick}
              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
            >
              <span className="flex items-center gap-2.5">
                <Paperclip className="h-4 w-4 shrink-0 text-text-secondary" />
                <span>{localize('com_ui_add_files_or_photos')}</span>
              </span>
              <span className="ml-auto font-mono text-xs text-text-tertiary">
                {isMac ? '⌘U' : 'Ctrl+U'}
              </span>
            </Ariakit.MenuItem>

            {/* Row 2: Take a screenshot */}
            <Ariakit.MenuItem
              onClick={handleTakeScreenshot}
              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
            >
              <span className="flex items-center gap-2.5">
                <Camera className="h-4 w-4 shrink-0 text-text-secondary" />
                <span>{localize('com_ui_take_screenshot')}</span>
              </span>
            </Ariakit.MenuItem>

            {/* Row 2: Add to project */}
            <Ariakit.MenuProvider store={projectSubmenu}>
              <Ariakit.MenuItem
                render={
                  <Ariakit.MenuButton className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover">
                    <span className="flex items-center gap-2.5">
                      <FolderPlus className="h-4 w-4 shrink-0 text-text-secondary" />
                      <span>{localize('com_ui_add_to_project')}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-text-tertiary" />
                  </Ariakit.MenuButton>
                }
              />
              <Ariakit.Menu
                portal={true}
                gutter={6}
                className="z-50 flex min-w-[200px] flex-col rounded-2xl border border-border-light bg-surface-primary p-1.5 shadow-xl outline-none"
              >
                <Ariakit.MenuItem
                  onClick={() => menuStore.hide()}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  {localize('com_ui_current_project')}
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => menuStore.hide()}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  {localize('com_ui_create_new_project')}
                </Ariakit.MenuItem>
              </Ariakit.Menu>
            </Ariakit.MenuProvider>

            {/* Row 3: Take a screenshot */}
            <Ariakit.MenuItem
              onClick={handleTakeScreenshot}
              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
            >
              <span className="flex items-center gap-2.5">
                <Camera className="h-4 w-4 shrink-0 text-text-secondary" />
                <span>{localize('com_ui_take_screenshot')}</span>
              </span>
            </Ariakit.MenuItem>

            {/* Row 4: Record a skill */}
            <Ariakit.MenuItem
              onClick={() => {
                menuStore.hide();
                setRecordSkillOpen(true);
              }}
              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
            >
              <span className="flex items-center gap-2.5">
                <Video className="h-4 w-4 shrink-0 text-text-secondary" />
                <span>Record a skill</span>
              </span>
            </Ariakit.MenuItem>

            <div className="my-1 border-t border-border-light" />

            {/* Skills Submenu */}
            <Ariakit.MenuProvider store={skillsSubmenu}>
              <Ariakit.MenuItem
                render={
                  <Ariakit.MenuButton className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover">
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 shrink-0 text-text-secondary" />
                      <span>{localize('com_ui_skills')}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-text-tertiary" />
                  </Ariakit.MenuButton>
                }
              />
              <Ariakit.Menu
                portal={true}
                gutter={6}
                className="z-50 flex min-w-[220px] flex-col rounded-2xl border border-border-light bg-surface-primary p-1.5 shadow-xl outline-none"
              >
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {localize('com_ui_skills')}
                </div>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('socratic-brainstorm')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>Socratic Brainstorm</span>
                  </span>
                  <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                    Anti-Sycophancy
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('nano-banana-image-studio')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>Nano Banana 2 Studio</span>
                  </span>
                  <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                    Continuity
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('deep-learning-citations')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-teal-500" />
                    <span>Deep Learning & Citations</span>
                  </span>
                  <span className="rounded bg-teal-500/10 px-1 py-0.5 text-[9px] font-semibold text-teal-600 dark:text-teal-400">
                    Active Recall
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('higgsfield-site-builder')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-lime-500" />
                    <span>Higgsfield Site Builder</span>
                  </span>
                  <span className="rounded bg-lime-500/10 px-1 py-0.5 text-[9px] font-semibold text-lime-600 dark:text-lime-400">
                    Superhero
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('manus-agent-orchestrator')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-500" />
                    <span>Manus Agent (30+ Tools)</span>
                  </span>
                  <span className="rounded bg-purple-500/10 px-1 py-0.5 text-[9px] font-semibold text-purple-600 dark:text-purple-400">
                    Autonomous
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('dual-mode-engine')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-500" />
                    <span>Dual-Mode Engine (Spec vs Vibe)</span>
                  </span>
                  <span className="rounded bg-cyan-500/10 px-1 py-0.5 text-[9px] font-semibold text-cyan-600 dark:text-cyan-400">
                    Kiro / Traycer
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('interactive-form-cards')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-emerald-500" />
                    <span>In-Chat Form Cards (Ask Questions)</span>
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                    v0 / Antigravity
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('self-healing-dev-server')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-rose-500" />
                    <span>Self-Healing Dev Server (Full-Stack)</span>
                  </span>
                  <span className="rounded bg-rose-500/10 px-1 py-0.5 text-[9px] font-semibold text-rose-600 dark:text-rose-400">
                    Windsurf / Lovable
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('deep-research-engine')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-cyan-500" />
                    <span>Deep Research Engine (Multi-Hop)</span>
                  </span>
                  <span className="rounded bg-cyan-500/10 px-1 py-0.5 text-[9px] font-semibold text-cyan-600 dark:text-cyan-400">
                    Perplexity / OpenAI
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('living-office-artifacts')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                    <span>Living Office Suite (Word, Excel, PPT)</span>
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                    GPT-5.6 / Claude Office
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('cognitive-output-styles')}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span>Cognitive Persona Styles (/concise, /learning)</span>
                  </span>
                  <span className="rounded bg-purple-500/10 px-1 py-0.5 text-[9px] font-semibold text-purple-600 dark:text-purple-400">
                    Claude Code
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('live-docs-and-slides')}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  Live Docs & Slides
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('artifacts-designer')}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  Artifacts Designer
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => handleSelectSkill('code-analyzer')}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  Code Analyzer
                </Ariakit.MenuItem>
                <div className="my-1 border-t border-border-light" />
                <Ariakit.MenuItem
                  onClick={() => menuStore.hide()}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                >
                  {localize('com_ui_explore_skills')}
                </Ariakit.MenuItem>
              </Ariakit.Menu>
            </Ariakit.MenuProvider>

            {/* Connectors Submenu */}
            <Ariakit.MenuProvider store={connectorsSubmenu}>
              <Ariakit.MenuItem
                render={
                  <Ariakit.MenuButton className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover">
                    <span className="flex items-center gap-2.5">
                      <Plug className="h-4 w-4 shrink-0 text-text-secondary" />
                      <span>{localize('com_ui_connectors')}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-text-tertiary" />
                  </Ariakit.MenuButton>
                }
              />
              <Ariakit.Menu
                portal={true}
                gutter={6}
                className="z-50 flex min-w-[220px] flex-col rounded-2xl border border-border-light bg-surface-primary p-1.5 shadow-xl outline-none"
              >
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  {localize('com_ui_connectors')}
                </div>
                <Ariakit.MenuItem
                  onClick={() => {
                    menuStore.hide();
                    setIsConnectorHubOpen(true);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  <span className="flex items-center gap-2">
                    <Plug className="h-4 w-4 text-purple-500" />
                    <span>Perplexity Connector Hub</span>
                  </span>
                  <span className="rounded bg-purple-500/10 px-1 py-0.5 text-[9px] font-semibold text-purple-600 dark:text-purple-400">
                    On-Demand
                  </span>
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => menuStore.hide()}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  Filesystem MCP
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => menuStore.hide()}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  Web Search MCP (Tavily)
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => menuStore.hide()}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  GitHub MCP (Repos & PRs)
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => menuStore.hide()}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  Slack MCP (Channels & DMs)
                </Ariakit.MenuItem>
                <div className="my-1 border-t border-border-light" />
                <Ariakit.MenuItem
                  onClick={() => {
                    menuStore.hide();
                    setIsConnectorHubOpen(true);
                  }}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                >
                  {localize('com_ui_add_custom_connector')}
                </Ariakit.MenuItem>
              </Ariakit.Menu>
            </Ariakit.MenuProvider>

            {/* Design system Submenu */}
            <Ariakit.MenuProvider store={designSubmenu}>
              <Ariakit.MenuItem
                render={
                  <Ariakit.MenuButton className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover">
                    <span className="flex items-center gap-2.5">
                      <Palette className="h-4 w-4 shrink-0 text-text-secondary" />
                      <span>{localize('com_ui_design_system')}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-text-tertiary" />
                  </Ariakit.MenuButton>
                }
              />
              <Ariakit.Menu
                portal={true}
                gutter={6}
                className="z-50 flex min-w-[200px] flex-col rounded-2xl border border-border-light bg-surface-primary p-1.5 shadow-xl outline-none"
              >
                <Ariakit.MenuItem
                  onClick={() => menuStore.hide()}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  {localize('com_ui_using_claude')}
                </Ariakit.MenuItem>
                <Ariakit.MenuItem
                  onClick={() => menuStore.hide()}
                  className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  {localize('com_ui_using_claude_code')}
                </Ariakit.MenuItem>
              </Ariakit.Menu>
            </Ariakit.MenuProvider>

            {/* Add plugins */}
            <Ariakit.MenuItem
              onClick={() => menuStore.hide()}
              className="flex cursor-pointer items-center rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
            >
              <span className="flex items-center gap-2.5">
                <PackagePlus className="h-4 w-4 shrink-0 text-text-secondary" />
                <span>{localize('com_ui_add_plugins')}</span>
              </span>
            </Ariakit.MenuItem>

            <div className="my-1 border-t border-border-light" />

            {/* Research row */}
            <Ariakit.MenuItem
              onClick={toggleResearch}
              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
            >
              <span className="flex items-center gap-2.5">
                <Compass className="h-4 w-4 shrink-0 text-text-secondary" />
                <span>{localize('com_ui_research')}</span>
              </span>
              {researchMode && <Check className="ml-auto h-4 w-4 stroke-[2.5] text-text-primary" />}
            </Ariakit.MenuItem>

            {/* Web search row */}
            <Ariakit.MenuItem
              onClick={toggleWebSearch}
              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
            >
              <span className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 shrink-0 text-text-secondary" />
                <span>{localize('com_ui_web_search')}</span>
              </span>
              {isWebSearchEnabled && (
                <Check className="ml-auto h-4 w-4 stroke-[2.5] text-text-primary" />
              )}
            </Ariakit.MenuItem>

            {/* Memory row */}
            <Ariakit.MenuItem
              onClick={toggleMemory}
              className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text-primary outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
            >
              <span className="flex items-center gap-2.5">
                <Brain className="h-4 w-4 shrink-0 text-text-secondary" />
                <span>{localize('com_ui_memory')}</span>
              </span>
              {isMemoryEnabled && (
                <Check className="ml-auto h-4 w-4 stroke-[2.5] text-text-primary" />
              )}
            </Ariakit.MenuItem>
          </Ariakit.Menu>
        </Ariakit.MenuProvider>
      </FileUpload>
      <RecordSkillModal open={recordSkillOpen} onOpenChange={setRecordSkillOpen} />
      <ConnectorHubModal open={isConnectorHubOpen} onOpenChange={setIsConnectorHubOpen} />
    </>
  );
}
