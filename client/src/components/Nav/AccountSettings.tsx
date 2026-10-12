/* eslint-disable i18next/no-literal-string */
import { useState, memo, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import * as Menu from '@ariakit/react/menu';
import { GearIcon, DropdownMenuSeparator, Avatar } from '@librechat/client';
import {
  Archive,
  BarChart2,
  BookOpen,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  Globe,
  History,
  Keyboard,
  LogOut,
  MessageSquare,
  Puzzle,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ArchivedChatsModal } from '~/components/Nav/SettingsTabs/General/ArchivedChatsModal';
import { useGetStartupConfig, useGetUserBalance } from '~/data-provider';
import { useAuthContext } from '~/hooks/AuthContext';
import { ClaudeSettingsTab } from './Settings/types';
import { useLocalize } from '~/hooks';
import Settings from './Settings';
import store from '~/store';

function LearnMoreSubmenu({
  helpAndFaqURL,
  termsOfServiceURL,
  privacyPolicyURL,
  onShowShortcuts,
  onShowArchived,
}: {
  helpAndFaqURL?: string;
  termsOfServiceURL?: string;
  privacyPolicyURL?: string;
  onShowShortcuts: () => void;
  onShowArchived: () => void;
}) {
  const localize = useLocalize();
  const hasHelpFaq = Boolean(helpAndFaqURL && helpAndFaqURL !== '/');
  const hasTos = Boolean(termsOfServiceURL);
  const hasPrivacy = Boolean(privacyPolicyURL);

  return (
    <Menu.MenuProvider placement="right-start">
      <Menu.MenuItem
        hideOnClick={false}
        render={
          <Menu.MenuButton className="select-item flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary" />
        }
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="icon-md text-text-secondary" aria-hidden="true" />
          <span>Learn more</span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" aria-hidden="true" />
      </Menu.MenuItem>
      <Menu.Menu
        portal
        gutter={8}
        className="account-settings-popover popover-ui popover-from-left z-[126] min-w-56 rounded-xl border border-border-light bg-surface-primary p-1 text-text-primary shadow-xl"
      >
        <Menu.MenuItem
          onClick={() =>
            window.open(
              hasHelpFaq ? helpAndFaqURL : 'https://docs.anthropic.com',
              '_blank',
              'noopener,noreferrer',
            )
          }
          className="select-item flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="icon-md text-text-secondary" aria-hidden="true" />
            <span>Documentation</span>
          </div>
          <ExternalLink className="h-3 w-3 text-text-tertiary" />
        </Menu.MenuItem>
        <Menu.MenuItem
          onClick={onShowShortcuts}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <Keyboard className="icon-md text-text-secondary" aria-hidden="true" />
          <span>{localize('com_shortcut_keyboard_shortcuts')}</span>
        </Menu.MenuItem>
        <Menu.MenuItem
          onClick={onShowArchived}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <Archive className="icon-md text-text-secondary" aria-hidden="true" />
          <span>{localize('com_nav_archived_chats')}</span>
        </Menu.MenuItem>
        {(hasTos || hasPrivacy) && <DropdownMenuSeparator />}
        {hasTos && (
          <Menu.MenuItem
            onClick={() => window.open(termsOfServiceURL, '_blank', 'noopener,noreferrer')}
            className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
          >
            <Scale className="icon-md text-text-secondary" aria-hidden="true" />
            <span>{localize('com_ui_terms_of_service')}</span>
          </Menu.MenuItem>
        )}
        {hasPrivacy && (
          <Menu.MenuItem
            onClick={() => window.open(privacyPolicyURL, '_blank', 'noopener,noreferrer')}
            className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
          >
            <ShieldCheck className="icon-md text-text-secondary" aria-hidden="true" />
            <span>{localize('com_ui_privacy_policy')}</span>
          </Menu.MenuItem>
        )}
      </Menu.Menu>
    </Menu.MenuProvider>
  );
}

function AccountSettings({ collapsed = false }: { collapsed?: boolean }) {
  const localize = useLocalize();
  const { user, isAuthenticated, logout } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: Boolean(isAuthenticated && startupConfig?.balance?.enabled),
  });
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<ClaudeSettingsTab | undefined>(undefined);
  const setShowShortcutsDialog = useSetRecoilState(store.showShortcutsDialog);
  const [showArchived, setShowArchived] = useState(false);
  const accountSettingsButtonRef = useRef<HTMLButtonElement>(null);

  const openSettings = (tab?: ClaudeSettingsTab) => {
    setSettingsTab(tab);
    setShowSettings(true);
  };

  const handleGetHelp = () => {
    const url =
      startupConfig?.helpAndFaqURL && startupConfig.helpAndFaqURL !== '/'
        ? startupConfig.helpAndFaqURL
        : 'https://support.anthropic.com';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGiveFeedback = () => {
    window.open('https://feedback.anthropic.com', '_blank', 'noopener,noreferrer');
  };

  const handleViewChangelog = () => {
    window.open('https://claude.ai/changelog', '_blank', 'noopener,noreferrer');
  };

  return (
    <Menu.MenuProvider placement={collapsed ? 'right-end' : undefined}>
      <Menu.MenuButton
        ref={accountSettingsButtonRef}
        aria-label={localize('com_nav_account_settings')}
        data-testid="nav-user"
        className={
          collapsed
            ? 'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-surface-active-alt aria-[expanded=true]:bg-surface-active-alt'
            : 'mt-text-sm flex h-auto w-full items-center gap-2 rounded-xl p-2 text-sm transition-all duration-200 ease-in-out hover:bg-surface-active-alt aria-[expanded=true]:bg-surface-active-alt'
        }
      >
        <div
          className={collapsed ? 'size-7 flex-shrink-0' : '-ml-0.9 -mt-0.8 h-8 w-8 flex-shrink-0'}
        >
          <div className="relative flex">
            <Avatar user={user} size={collapsed ? 28 : 32} />
          </div>
        </div>
        {!collapsed && (
          <div
            className="mt-2 grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-text-primary"
            style={{ marginTop: '0', marginLeft: '0' }}
          >
            {user?.name ?? user?.username ?? localize('com_nav_user')}
          </div>
        )}
      </Menu.MenuButton>
      <Menu.Menu
        portal
        className="account-settings-popover popover-ui z-[125] min-w-56 rounded-xl border border-border-light bg-surface-primary p-1 text-text-primary shadow-xl"
        style={{
          transformOrigin: collapsed ? 'left bottom' : 'bottom',
          translate: collapsed ? '4px 0' : '0 -4px',
        }}
      >
        <div className="px-2.5 py-2 text-xs text-text-tertiary" role="note">
          {user?.email ?? user?.name ?? localize('com_nav_user')}
        </div>
        {startupConfig?.balance?.enabled === true && balanceQuery.data != null && (
          <div className="px-2.5 pb-2 text-[11px] text-text-tertiary" role="note">
            {localize('com_nav_balance')}:{' '}
            {new Intl.NumberFormat().format(Math.round(balanceQuery.data.tokenCredits))}
          </div>
        )}

        <DropdownMenuSeparator />

        {/* SECTION 1: Settings, Usage, Language, Get help, Give feedback */}
        <Menu.MenuItem
          onClick={() => openSettings(ClaudeSettingsTab.PREFERENCES)}
          className="select-item flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
          data-testid="nav-settings"
        >
          <div className="flex items-center gap-2.5">
            <GearIcon className="icon-md text-text-secondary" aria-hidden="true" />
            <span>{localize('com_nav_settings')}</span>
          </div>
          <kbd className="font-sans text-[11px] text-text-tertiary">⌘,</kbd>
        </Menu.MenuItem>

        <Menu.MenuItem
          onClick={() => openSettings(ClaudeSettingsTab.BILLING)}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <BarChart2 className="icon-md text-text-secondary" aria-hidden="true" />
          <span>Usage</span>
        </Menu.MenuItem>

        <Menu.MenuItem
          onClick={() => openSettings(ClaudeSettingsTab.PREFERENCES)}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <Globe className="icon-md text-text-secondary" aria-hidden="true" />
          <span>Language</span>
        </Menu.MenuItem>

        <Menu.MenuItem
          onClick={handleGetHelp}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <CircleHelp className="icon-md text-text-secondary" aria-hidden="true" />
          <span>Get help</span>
        </Menu.MenuItem>

        <Menu.MenuItem
          onClick={handleGiveFeedback}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <MessageSquare className="icon-md text-text-secondary" aria-hidden="true" />
          <span>Give feedback</span>
        </Menu.MenuItem>

        <DropdownMenuSeparator />

        {/* SECTION 2: View all plans, Get apps and extensions, View changelog, Learn more */}
        <Menu.MenuItem
          onClick={() => openSettings(ClaudeSettingsTab.BILLING)}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <Sparkles className="icon-md text-text-secondary" aria-hidden="true" />
          <span>View all plans</span>
        </Menu.MenuItem>

        <Menu.MenuItem
          onClick={() => openSettings(ClaudeSettingsTab.EXTENSIONS)}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <Puzzle className="icon-md text-text-secondary" aria-hidden="true" />
          <span>Get apps and extensions</span>
        </Menu.MenuItem>

        <Menu.MenuItem
          onClick={handleViewChangelog}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <History className="icon-md text-text-secondary" aria-hidden="true" />
          <span>View changelog</span>
        </Menu.MenuItem>

        <LearnMoreSubmenu
          helpAndFaqURL={startupConfig?.helpAndFaqURL}
          termsOfServiceURL={startupConfig?.interface?.termsOfService?.externalUrl}
          privacyPolicyURL={startupConfig?.interface?.privacyPolicy?.externalUrl}
          onShowShortcuts={() => setShowShortcutsDialog(true)}
          onShowArchived={() => setShowArchived(true)}
        />

        <DropdownMenuSeparator />

        {/* SECTION 3: Log out */}
        <Menu.MenuItem
          onClick={() => logout()}
          className="select-item flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-secondary"
        >
          <LogOut className="icon-md text-text-secondary" aria-hidden="true" />
          <span>{localize('com_nav_log_out')}</span>
        </Menu.MenuItem>
      </Menu.Menu>
      {showArchived && (
        <ArchivedChatsModal
          open={showArchived}
          onOpenChange={setShowArchived}
          triggerRef={accountSettingsButtonRef}
        />
      )}
      {showSettings && (
        <Settings open={showSettings} onOpenChange={setShowSettings} initialTab={settingsTab} />
      )}
    </Menu.MenuProvider>
  );
}

export default memo(AccountSettings);
