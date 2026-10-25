import { memo, useId, useMemo, useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { DropdownPopup } from '@librechat/client';
import { getAppSections, listAppsBySection } from 'librechat-data-provider';
import { NavLink as RouterNavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  SquarePen,
  FolderKanban,
  Boxes,
  Clock,
  Sparkles,
  MoreHorizontal,
  MessagesSquare,
} from 'lucide-react';
import type { MenuItemProps } from '~/common';
import useUnifiedSidebarLinks from '~/hooks/Nav/useUnifiedSidebarLinks';
import { useActivePanel, DEFAULT_PANEL } from '~/Providers';
import { useCoworkTasksQuery } from '~/data-provider';
import useNewChat from '~/hooks/Chat/useNewChat';
import AppSectionGroup from './AppSectionGroup';
import PinnedAppsRow from './PinnedAppsRow';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

const rowClassName =
  'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover';

function NewChatRow() {
  const localize = useLocalize();
  const { setActive } = useActivePanel();
  const { handleNewChatClick } = useNewChat({ onNewChat: () => setActive(DEFAULT_PANEL) });
  const location = useLocation();
  const isOnNewChat = location.pathname === '/c/new';

  return (
    <a
      href="/c/new"
      data-testid="sidebar-new-chat-button"
      onClick={handleNewChatClick}
      className={cn(rowClassName, isOnNewChat && 'bg-surface-active-alt font-semibold')}
    >
      <SquarePen className="h-4 w-4" aria-hidden="true" />
      <span>{localize('com_ui_new')}</span>
    </a>
  );
}

function RouteRow({
  to,
  icon: Icon,
  label,
  showDot = false,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  label: string;
  showDot?: boolean;
}) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <RouterNavLink
      to={to}
      className={cn(rowClassName, isActive && 'bg-surface-active-alt font-semibold')}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="relative flex items-center">
        <span>{label}</span>
        {showDot && (
          <span
            className="ml-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"
            title="Active background runs"
          />
        )}
      </span>
    </RouterNavLink>
  );
}

/** The overflow items that don't have their own top-level nav row yet — the
 *  same panels the narrow icon rail already exposes, reached instead from a
 *  "More" flyout so they stay reachable without cluttering the flat list.
 *  Panel-based items still swap the wide pane's content the way the icon
 *  rail already does; that's an existing behavior, not new here. */
function MoreMenu() {
  const localize = useLocalize();
  const navigate = useNavigate();
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const { setActive } = useActivePanel();
  const links = useUnifiedSidebarLinks();

  const overflowLinks = useMemo(
    () => links.filter((link) => link.id !== 'conversations' && link.id !== 'skills'),
    [links],
  );

  const menuItems = useMemo<MenuItemProps[]>(() => {
    const items: MenuItemProps[] = [
      {
        id: 'more-chats-and-tasks',
        label: 'Chats and tasks',
        icon: <MessagesSquare className="size-4 text-text-secondary" aria-hidden="true" />,
        onClick: () => navigate('/chats'),
      },
      ...overflowLinks.map((link) => ({
        id: `more-${link.id}`,
        label: localize(link.title),
        icon: <link.icon className="size-4 text-text-secondary" aria-hidden="true" />,
        onClick: (e?: React.MouseEvent) => {
          if (link.onClick) {
            link.onClick(e);
            return;
          }
          setActive(link.id);
        },
      })),
    ];
    return items;
  }, [overflowLinks, localize, setActive, navigate]);

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <DropdownPopup
      portal={true}
      focusLoop={true}
      unmountOnHide={true}
      menuId={menuId}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="z-[125] min-w-52"
      trigger={
        <Ariakit.MenuButton className={cn(rowClassName, 'w-full', isOpen && 'bg-surface-hover')}>
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          <span>{localize('com_ui_more')}</span>
        </Ariakit.MenuButton>
      }
      items={menuItems}
    />
  );
}

/**
 * The flat, always-visible nav list above "Pinned"/"Chats and tasks" — matches
 * the real Claude sidebar's New/Projects/Artifacts/Scheduled/Code/Design/Customize/
 * More order (see docs/ui-reference/PLAN.md). Route-based items navigate the
 * main content area; "More" reuses the existing panel-switching mechanism for
 * items that don't have their own page yet.
 */
function SidebarNavList() {
  const localize = useLocalize();
  const { data: coworkData } = useCoworkTasksQuery();
  const hasActiveTasks = useMemo(
    () => (coworkData?.tasks ?? []).some((t) => t.status === 'running' || t.status === 'queued'),
    [coworkData],
  );

  const sections = useMemo(() => getAppSections(), []);

  return (
    <div className="flex flex-col gap-0.5 px-2 pb-2.5">
      <NewChatRow />
      <RouteRow to="/projects" icon={FolderKanban} label={localize('com_ui_projects')} />
      <RouteRow to="/artifacts" icon={Boxes} label={localize('com_ui_artifacts')} />
      <RouteRow
        to="/scheduled"
        icon={Clock}
        label={localize('com_ui_scheduled')}
        showDot={hasActiveTasks}
      />
      <RouteRow to="/skills" icon={Sparkles} label={localize('com_ui_customize')} />
      <MoreMenu />

      <div className="my-1 border-b border-border-light" />

      {/* Quick Dock for Pinned/Favorite Apps */}
      <PinnedAppsRow />

      <div className="my-1 border-b border-border-light" />

      {/* 4 App Sections with Badges & Collapsible Groups */}
      <div className="flex flex-col gap-0.5">
        {sections.map((section) => (
          <AppSectionGroup
            key={section.id}
            section={section}
            apps={listAppsBySection(section.id)}
            defaultExpanded={true}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(SidebarNavList);
