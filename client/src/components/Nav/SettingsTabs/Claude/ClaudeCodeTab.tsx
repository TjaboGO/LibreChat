/* eslint-disable i18next/no-literal-string */
import React, { useState, useMemo } from 'react';
import { Switch } from '@librechat/client';
import { request } from 'librechat-data-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, ChevronLeft, ChevronRight, Globe, Trash2, X } from 'lucide-react';
import { cn } from '~/utils';

interface TokenItem {
  id: string;
  application: string;
  device: string;
  connectedAgo: string;
  scopes: string[];
}

function formatTimeAgo(date?: string | Date) {
  if (!date) {
    return 'Recently';
  }
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) {
    return 'Just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function ClaudeCodeTab() {
  // 1. General
  const [classifyStates, setClassifyStates] = useState(true);
  const [switchFlaggedCloud, setSwitchFlaggedCloud] = useState(true);

  // 2. Code appearance
  const [lightTheme, setLightTheme] = useState('Claude Light');
  const [darkTheme, setDarkTheme] = useState('Catppuccin Mocha');
  const [codeFont, setCodeFont] = useState('JetBrains Mono');
  const [interfaceFont, setInterfaceFont] = useState<'Anthropic Sans' | 'System' | 'OpenDyslexic'>(
    'Anthropic Sans',
  );
  const [textSize, setTextSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [transcriptWidth, setTranscriptWidth] = useState<'Narrow' | 'Medium' | 'Wide'>('Narrow');
  const [transcriptView, setTranscriptView] = useState<'Normal' | 'Thinking' | 'Verbose'>('Normal');

  // 3. Local sessions
  const [bypassPermissions, setBypassPermissions] = useState(false);
  const [remoteControl, setRemoteControl] = useState(false);
  const [dynamicWorkflows, setDynamicWorkflows] = useState(false);
  const [drawAttention, setDrawAttention] = useState(false);
  const [keepAwake, setKeepAwake] = useState(true);
  const [keepAwakeBattery, setKeepAwakeBattery] = useState(true);
  const [archiveInactive, setArchiveInactive] = useState('Never');
  const [worktreeLocation, setWorktreeLocation] = useState('Inside project');
  const [switchFlaggedLocal, setSwitchFlaggedLocal] = useState(true);
  const [outputStyle, setOutputStyle] = useState('Default');
  const [localSandbox, setLocalSandbox] = useState(false);
  const [strictSandbox, setStrictSandbox] = useState(false);

  // 4. Browser & Mobile simulators
  const [browserTools, setBrowserTools] = useState(true);
  const [openInBuiltin, setOpenInBuiltin] = useState(true);
  const [keepCookies, setKeepCookies] = useState('Until quit');
  const [iosSimulator, setIosSimulator] = useState(true);
  const [isAllowedSitesModalOpen, setIsAllowedSitesModalOpen] = useState(false);
  const [allowedSites, setAllowedSites] = useState<string[]>([
    'localhost:3000',
    'localhost:5173',
    'claude.ai',
  ]);
  const [newSite, setNewSite] = useState('');

  // 5. Pull requests
  const [branchPrefix, setBranchPrefix] = useState('claude');
  const [autoPr, setAutoPr] = useState(false);
  const [autoFixPr, setAutoFixPr] = useState(false);
  const [autoArchivePr, setAutoArchivePr] = useState(false);

  // 6. Authorization tokens & pagination
  const queryClient = useQueryClient();
  const { data: apiKeysData } = useQuery(
    ['apiKeys'],
    () =>
      request.get<
        Array<{
          id?: string;
          _id?: string;
          name?: string;
          device?: string;
          createdAt?: string;
          scopes?: string[];
        }>
      >('/api/api-keys'),
    {
      refetchOnWindowFocus: false,
    },
  );

  const revokeMutation = useMutation((id: string) => request.delete(`/api/api-keys/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(['apiKeys']);
    },
  });

  const tokens: TokenItem[] = useMemo(() => {
    if (!apiKeysData || !Array.isArray(apiKeysData)) {
      return [];
    }
    return apiKeysData.map((k: any) => ({
      id: k.id || k._id,
      application: k.name || 'Claude Code',
      device: k.device || 'Authorized Client',
      connectedAgo: k.createdAt ? `Connected ${formatTimeAgo(k.createdAt)}` : 'Active',
      scopes: k.scopes || ['user:inference', 'user:sessions:claude_code'],
    }));
  }, [apiKeysData]);

  const [tokenPage, setTokenPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(tokens.length / pageSize));
  const paginatedTokens = tokens.slice((tokenPage - 1) * pageSize, tokenPage * pageSize);

  const [isDeleteSessionsModalOpen, setIsDeleteSessionsModalOpen] = useState(false);
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [shareLinkAccess, setShareLinkAccess] = useState<'private' | 'organization' | 'public'>(
    'organization',
  );

  const handleRevokeToken = (id: string) => {
    revokeMutation.mutate(id);
  };

  const handleAddSite = () => {
    const trimmed = newSite.trim();
    if (trimmed && !allowedSites.includes(trimmed)) {
      setAllowedSites([...allowedSites, trimmed]);
      setNewSite('');
    }
  };

  const handleRemoveSite = (site: string) => {
    setAllowedSites(allowedSites.filter((s) => s !== site));
  };

  return (
    <div className="flex flex-col gap-6 text-text-primary">
      {/* 1. GENERAL */}
      <div>
        <h3 className="border-b border-border-light pb-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          General
        </h3>
        <div className="divide-y divide-border-light/60">
          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Classify session states</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Allow Claude to automatically classify sessions as blocked, ready for review, or
                done. Classifying sessions counts towards your plan usage. Applies to new sessions.
              </p>
            </div>
            <Switch
              checked={classifyStates}
              onCheckedChange={setClassifyStates}
              aria-label="Classify session states"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Switch models when a message is flagged
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                When safeguards flag a message, automatically switch to a different model to keep
                chatting. When off, your session will pause instead. Applies to cloud sessions.
              </p>
            </div>
            <Switch
              checked={switchFlaggedCloud}
              onCheckedChange={setSwitchFlaggedCloud}
              aria-label="Switch models when a message is flagged"
            />
          </div>
        </div>
      </div>

      {/* 2. CODE APPEARANCE */}
      <div>
        <h3 className="border-b border-border-light pb-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Code appearance
        </h3>

        {/* THEMES SIDE BY SIDE */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* LIGHT THEME */}
          <div className="shadow-xs rounded-xl border border-border-light bg-surface-primary p-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-text-secondary">Light Theme</span>
              <select
                value={lightTheme}
                onChange={(e) => setLightTheme(e.target.value)}
                className="rounded-lg border border-border-light bg-surface-secondary px-2 py-1 text-xs text-text-primary focus:outline-none"
                aria-label="Light Theme"
              >
                <option value="Claude Light">Claude Light</option>
                <option value="Pierre Light">Pierre Light</option>
                <option value="One Light">One Light</option>
                <option value="Catppuccin Latte">Catppuccin Latte</option>
                <option value="Solarized Light">Solarized Light</option>
                <option value="Vitesse Light">Vitesse Light</option>
              </select>
            </div>
            <div className="rounded-lg border border-border-light/60 bg-white p-2.5 font-mono text-[11px] text-zinc-900">
              <div className="text-zinc-500">{'// TypeScript preview'}</div>
              <div>
                <span className="text-blue-600">function</span>{' '}
                <span className="text-yellow-600">greet</span>(name:{' '}
                <span className="text-emerald-600">string</span>) &#123;
              </div>
              <div className="bg-red-50 text-red-700">
                - console.log(&quot;Hello &quot; + name);
              </div>
              <div className="bg-emerald-50 text-emerald-700">
                + return `Hello, $&#123;name&#125;!`;
              </div>
              <div>&#125;</div>
            </div>
          </div>

          {/* DARK THEME */}
          <div className="shadow-xs rounded-xl border border-border-light bg-surface-primary p-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-text-secondary">Dark Theme</span>
              <select
                value={darkTheme}
                onChange={(e) => setDarkTheme(e.target.value)}
                className="rounded-lg border border-border-light bg-surface-secondary px-2 py-1 text-xs text-text-primary focus:outline-none"
                aria-label="Dark Theme"
              >
                <option value="Catppuccin Mocha">Catppuccin Mocha</option>
                <option value="Claude Dark">Claude Dark</option>
                <option value="GitHub Dark">GitHub Dark</option>
                <option value="One Dark Pro">One Dark Pro</option>
                <option value="Dracula">Dracula</option>
                <option value="Nord">Nord</option>
              </select>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 font-mono text-[11px] text-zinc-100">
              <div className="text-zinc-400">{'// TypeScript preview'}</div>
              <div>
                <span className="text-blue-400">function</span>{' '}
                <span className="text-yellow-400">greet</span>(name:{' '}
                <span className="text-emerald-400">string</span>) &#123;
              </div>
              <div className="bg-red-950/60 text-red-300">
                - console.log(&quot;Hello &quot; + name);
              </div>
              <div className="bg-emerald-950/60 text-emerald-300">
                + return `Hello, $&#123;name&#125;!`;
              </div>
              <div>&#125;</div>
            </div>
          </div>
        </div>

        {/* FONTS & TRANSCRIPT CONTROLS */}
        <div className="mt-4 divide-y divide-border-light/60">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-xs font-medium text-text-primary">Code font</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Set a custom monospace font for code and terminal.
              </p>
            </div>
            <input
              type="text"
              value={codeFont}
              onChange={(e) => setCodeFont(e.target.value)}
              placeholder="e.g. JetBrains Mono"
              className="h-8 w-44 rounded-lg border border-border-light bg-surface-secondary/50 px-2.5 text-xs text-text-primary focus:border-text-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-primary">Interface font</span>
                <span className="text-text-tertiary">·</span>
                <a
                  href="https://anthropic.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-text-secondary underline hover:text-text-primary"
                >
                  Font licenses
                </a>
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Font for the whole interface — menus, sidebars, and panels.
              </p>
            </div>
            <div className="flex rounded-lg bg-surface-secondary p-0.5 text-xs">
              {(['Anthropic Sans', 'System', 'OpenDyslexic'] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setInterfaceFont(font)}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    interfaceFont === font
                      ? 'shadow-xs bg-surface-primary text-text-primary'
                      : 'text-text-tertiary hover:text-text-primary',
                  )}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-xs font-medium text-text-primary">Transcript text size</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Size of the conversation transcript text.
              </p>
            </div>
            <div className="flex rounded-lg bg-surface-secondary p-0.5 text-xs">
              {(['Small', 'Medium', 'Large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTextSize(size)}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    textSize === size
                      ? 'shadow-xs bg-surface-primary text-text-primary'
                      : 'text-text-tertiary hover:text-text-primary',
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-xs font-medium text-text-primary">Transcript width</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Maximum width of the transcript and composer columns.
              </p>
            </div>
            <div className="flex rounded-lg bg-surface-secondary p-0.5 text-xs">
              {(['Narrow', 'Medium', 'Wide'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setTranscriptWidth(w)}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    transcriptWidth === w
                      ? 'shadow-xs bg-surface-primary text-text-primary'
                      : 'text-text-tertiary hover:text-text-primary',
                  )}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-xs font-medium text-text-primary">Default transcript view</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                The view sessions open in. Picking a view from a session&apos;s menu changes only
                that session.
              </p>
            </div>
            <div className="flex rounded-lg bg-surface-secondary p-0.5 text-xs">
              {(['Normal', 'Thinking', 'Verbose'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTranscriptView(v)}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    transcriptView === v
                      ? 'shadow-xs bg-surface-primary text-text-primary'
                      : 'text-text-tertiary hover:text-text-primary',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. LOCAL SESSIONS */}
      <div>
        <h3 className="border-b border-border-light pb-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Local sessions
        </h3>
        <div className="divide-y divide-border-light/60">
          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Allow bypass permissions mode
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Bypass all permission checks and let Claude work uninterrupted. This works well for
                workflows like fixing lint errors or generating boilerplate code. Letting Claude run
                arbitrary commands is risky and can result in data loss, system corruption, or data
                exfiltration.{' '}
                <a
                  href="https://docs.anthropic.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-text-primary"
                >
                  See best practices for safe usage
                </a>
              </p>
            </div>
            <Switch
              checked={bypassPermissions}
              onCheckedChange={setBypassPermissions}
              aria-label="Allow bypass permissions mode"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Connect new sessions to Remote Control
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Sessions you start on this computer connect to Remote Control automatically, so you
                can continue them from the terminal or claude.ai/code.
              </p>
            </div>
            <Switch
              checked={remoteControl}
              onCheckedChange={setRemoteControl}
              aria-label="Connect new sessions to Remote Control"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Dynamic workflows</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Let Claude run multiple agents in parallel for complex tasks. Workflows can use a
                lot of your usage limit quickly.
              </p>
            </div>
            <Switch
              checked={dynamicWorkflows}
              onCheckedChange={setDynamicWorkflows}
              aria-label="Dynamic workflows"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Draw attention on notifications
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Bounce the Dock icon when Claude needs your attention and the app isn&apos;t
                focused.
              </p>
            </div>
            <Switch
              checked={drawAttention}
              onCheckedChange={setDrawAttention}
              aria-label="Draw attention on notifications"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Keep computer awake while Claude works
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Prevent your computer from sleeping while a Code session is running, so long tasks
                can finish. Your display can still turn off. Closing the laptop lid will still put
                it to sleep.
              </p>
            </div>
            <Switch
              checked={keepAwake}
              onCheckedChange={setKeepAwake}
              aria-label="Keep computer awake while Claude works"
            />
          </div>

          {keepAwake && (
            <div className="flex items-center justify-between py-2.5 pl-6">
              <div className="max-w-md pr-4">
                <div className="text-xs font-medium text-text-primary">
                  Keep awake on battery power
                </div>
              </div>
              <Switch
                checked={keepAwakeBattery}
                onCheckedChange={setKeepAwakeBattery}
                aria-label="Keep awake on battery power"
              />
            </div>
          )}

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Archive inactive sessions</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Automatically archive local sessions after a period of no activity. Sessions that
                are running or have background work are never archived.
              </p>
            </div>
            <select
              value={archiveInactive}
              onChange={(e) => setArchiveInactive(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
              aria-label="Archive inactive sessions"
            >
              <option value="Never">Never</option>
              <option value="After 1 day">After 1 day</option>
              <option value="After 3 days">After 3 days</option>
              <option value="After 7 days">After 7 days</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Worktree location</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Where to store Git worktrees for isolated coding sessions.
              </p>
            </div>
            <select
              value={worktreeLocation}
              onChange={(e) => setWorktreeLocation(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
              aria-label="Worktree location"
            >
              <option value="Inside project">Inside project</option>
              <option value="Global worktree cache">Global worktree cache</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Switch models when a message is flagged
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                When safeguards flag a message, automatically switch to a different model. Applies
                to local sessions on this machine.
              </p>
            </div>
            <Switch
              checked={switchFlaggedLocal}
              onCheckedChange={setSwitchFlaggedLocal}
              aria-label="Switch models when flagged locally"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Output style</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                How Claude structures its responses in Code sessions.
              </p>
            </div>
            <select
              value={outputStyle}
              onChange={(e) => setOutputStyle(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
              aria-label="Output style"
            >
              <option value="Default">Default</option>
              <option value="Concise">Concise</option>
              <option value="Explanatory">Explanatory</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Local sandbox</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Runs commands from Claude Code in an isolated sandbox. Applies to new sessions.
              </p>
            </div>
            <Switch
              checked={localSandbox}
              onCheckedChange={setLocalSandbox}
              aria-label="Local sandbox"
            />
          </div>

          {localSandbox && (
            <div className="flex items-center justify-between py-2.5 pl-6">
              <div className="max-w-md pr-4">
                <div className="text-xs font-medium text-text-primary">Strict sandbox mode</div>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Blocks commands that can&apos;t run inside the sandbox instead of running them
                  outside it or asking you.
                </p>
              </div>
              <Switch
                checked={strictSandbox}
                onCheckedChange={setStrictSandbox}
                aria-label="Strict sandbox mode"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. BROWSER */}
      <div>
        <h3 className="border-b border-border-light pb-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Browser
        </h3>
        <div className="divide-y divide-border-light/60">
          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Browser tools</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Claude can start your dev servers, browse the web in a built-in browser, and verify
                changes with screenshots, snapshots, and DOM inspection.
              </p>
            </div>
            <Switch
              checked={browserTools}
              onCheckedChange={setBrowserTools}
              aria-label="Browser tools"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Open links in built-in browser
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Links open in the built-in browser instead of your default browser.
              </p>
            </div>
            <Switch
              checked={openInBuiltin}
              onCheckedChange={setOpenInBuiltin}
              aria-label="Open links in built-in browser"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Keep cookies</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Browser tabs keep cookies and logins across restarts in one saved browser shared by
                every session and Cowork.
              </p>
            </div>
            <select
              value={keepCookies}
              onChange={(e) => setKeepCookies(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
              aria-label="Keep cookies"
            >
              <option value="Until quit">Until quit</option>
              <option value="Always">Always</option>
              <option value="Never">Never</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Allowed sites</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Sites where Claude can use its Browser tools without a permission prompt.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAllowedSitesModalOpen(true)}
              className="rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* 5. MOBILE SIMULATORS */}
      <div>
        <h3 className="border-b border-border-light pb-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Mobile simulators
        </h3>
        <div className="divide-y divide-border-light/60">
          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">iOS Simulator</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Let Claude verify your changes in the iOS Simulator on this Mac: running your app,
                driving it through flows, and capturing screenshots and recordings.
              </p>
            </div>
            <Switch
              checked={iosSimulator}
              onCheckedChange={setIosSimulator}
              aria-label="iOS Simulator"
            />
          </div>
        </div>
      </div>

      {/* 6. PULL REQUESTS */}
      <div>
        <h3 className="border-b border-border-light pb-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Pull requests
        </h3>
        <div className="divide-y divide-border-light/60">
          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Branch prefix</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Prefix added to branch names for both local and cloud sessions.
              </p>
            </div>
            <input
              type="text"
              value={branchPrefix}
              onChange={(e) => setBranchPrefix(e.target.value)}
              className="h-8 w-36 rounded-lg border border-border-light bg-surface-secondary px-2.5 text-xs text-text-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Create pull requests automatically
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                When Claude pushes changes to a branch, it automatically opens a pull request
                without asking first. Applies to cloud sessions only.
              </p>
            </div>
            <Switch
              checked={autoPr}
              onCheckedChange={setAutoPr}
              aria-label="Create pull requests automatically"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Auto-fix pull requests</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                When you create a pull request, Claude automatically monitors it for CI failures and
                review comments, then responds proactively.
              </p>
            </div>
            <Switch
              checked={autoFixPr}
              onCheckedChange={setAutoFixPr}
              aria-label="Auto-fix pull requests"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Auto-archive after PR merge or close
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Automatically archive desktop sessions when the associated pull request is merged or
                closed.
              </p>
            </div>
            <Switch
              checked={autoArchivePr}
              onCheckedChange={setAutoArchivePr}
              aria-label="Auto-archive after PR merge or close"
            />
          </div>
        </div>
      </div>

      {/* 7. AUTHORIZATION TOKENS */}
      <div>
        <h3 className="border-b border-border-light pb-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Authorization tokens
        </h3>
        <p className="mt-1 text-xs text-text-secondary">
          Created when you sign in to Claude Code. Revoke a token to sign out from that device.
        </p>

        <div className="mt-3 overflow-hidden rounded-xl border border-border-light bg-surface-primary">
          <div className="flex justify-between border-b border-border-light bg-surface-secondary/40 px-4 py-2.5 text-[11px] font-semibold text-text-secondary">
            <span>Application</span>
            <span>Scopes & Status</span>
          </div>

          <div className="divide-y divide-border-light/60">
            {tokens.length === 0 && (
              <div className="p-6 text-center text-xs text-text-tertiary">
                No active authorization tokens. Use Claude Code CLI or generate an agent token to
                connect.
              </div>
            )}
            {paginatedTokens.map((t) => (
              <div key={t.id} className="flex items-start justify-between p-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-primary">{t.application}</span>
                    <span className="text-xs text-text-tertiary">({t.device})</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-text-secondary">{t.connectedAgo}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {t.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="rounded bg-surface-secondary px-1.5 py-0.5 font-mono text-[10px] text-text-secondary"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRevokeToken(t.id)}
                  className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>

          {/* PAGINATION FOOTER */}
          <div className="flex items-center justify-between border-t border-border-light bg-surface-secondary/30 px-4 py-2.5 text-xs text-text-secondary">
            <span>
              Showing {tokens.length === 0 ? 0 : (tokenPage - 1) * pageSize + 1}–
              {Math.min(tokenPage * pageSize, tokens.length)} of {tokens.length}
            </span>
            <div className="flex items-center gap-2">
              <span>
                Page {tokenPage} of {totalPages || 1}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={tokenPage <= 1}
                  onClick={() => setTokenPage((p) => Math.max(p - 1, 1))}
                  className="rounded border border-border-light p-1 hover:bg-surface-secondary disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={tokenPage >= totalPages}
                  onClick={() => setTokenPage((p) => Math.min(p + 1, totalPages))}
                  className="rounded border border-border-light p-1 hover:bg-surface-secondary disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CLAUDE CODE (CLI, DESKTOP, IDE) DATA CONTROLS */}
        <div className="mt-6">
          <h4 className="border-b border-border-light pb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Claude Code (CLI, Desktop, IDE)
          </h4>
          <div className="divide-y divide-border-light/60">
            <div className="flex items-center justify-between py-3.5">
              <div className="max-w-md pr-4">
                <div className="text-xs font-medium text-text-primary">
                  Delete sessions stored by Anthropic
                </div>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Permanently delete server-side copies of your Claude Code sessions. Sessions
                  stored locally on your computer aren&apos;t affected.{' '}
                  <a href="/code" className="underline hover:text-text-primary">
                    Go to Claude Code.
                  </a>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteSessionsModalOpen(true)}
                className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-500/10"
              >
                Delete…
              </button>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <div className="max-w-md pr-4">
                <div className="text-xs font-medium text-text-primary">Sharing settings</div>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Control how your claude.ai/code sessions are shared with your team or public
                  links.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSharingModalOpen(true)}
                className="rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ALLOWED SITES */}
      {isAllowedSitesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border-light bg-surface-primary p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-text-primary">Allowed sites</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAllowedSitesModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Sites where Claude can use its Browser tools without prompting for permission.
            </p>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSite();
                  }
                }}
                placeholder="e.g. localhost:3000"
                className="flex-1 rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 font-mono text-xs text-text-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSite}
                className="rounded-lg bg-text-primary px-3 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                Add site
              </button>
            </div>

            <div className="mt-4 max-h-56 divide-y divide-border-light/60 overflow-y-auto rounded-lg border border-border-light">
              {allowedSites.map((site) => (
                <div key={site} className="flex items-center justify-between p-2.5">
                  <span className="font-mono text-xs text-text-primary">{site}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSite(site)}
                    className="text-text-tertiary transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAllowedSitesModalOpen(false)}
                className="rounded-lg bg-text-primary px-4 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE SESSIONS */}
      {isDeleteSessionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border-light bg-surface-primary p-5 shadow-2xl">
            <div className="flex items-center gap-2 pb-2 text-red-600">
              <ShieldAlert className="h-5 w-5" />
              <h4 className="text-sm font-semibold">Delete server-side sessions</h4>
            </div>
            <p className="text-xs leading-relaxed text-text-secondary">
              This will permanently delete all Claude Code sessions stored in your account. Local
              sessions on your computer will remain untouched.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteSessionsModalOpen(false)}
                className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteSessionsModalOpen(false)}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Delete sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SHARING SETTINGS */}
      {isSharingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border-light bg-surface-primary p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <h4 className="text-sm font-semibold text-text-primary">Sharing settings</h4>
              <button
                type="button"
                onClick={() => setIsSharingModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Configure default visibility for shared Claude Code sessions.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { id: 'private', label: 'Private to you' },
                { id: 'organization', label: 'Anyone in your workspace' },
                { id: 'public', label: 'Anyone with the link' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border-light p-2.5 hover:bg-surface-secondary"
                >
                  <input
                    type="radio"
                    name="sharingAccess"
                    checked={shareLinkAccess === opt.id}
                    onChange={() => setShareLinkAccess(opt.id as typeof shareLinkAccess)}
                    className="h-3.5 w-3.5 text-text-primary"
                  />
                  <span className="text-xs font-medium text-text-primary">{opt.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSharingModalOpen(false)}
                className="rounded-lg bg-text-primary px-4 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
