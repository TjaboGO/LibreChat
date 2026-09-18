/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Switch } from '@librechat/client';
import { RotateCw, Check, Plus, X, Laptop } from 'lucide-react';
import { cn } from '~/utils';

export default function GeneralTab() {
  // General desktop settings
  const [runOnStartup, setRunOnStartup] = useState(true);
  const [quickAccessShortcut, setQuickAccessShortcut] = useState('Tap Option twice');
  const [voiceShortcut, setVoiceShortcut] = useState('No shortcut');
  const [dictationShortcut, setDictationShortcut] = useState('Command+D');
  const [showInMenuBar, setShowInMenuBar] = useState(true);
  const [keepComputerAwake, setKeepComputerAwake] = useState(true);

  // Browser use
  const [isRechecking, setIsRechecking] = useState(false);
  const [connectedBrowsers] = useState([
    { id: '8f4c-20a1', name: 'Browser 1 / macOS', active: true },
  ]);

  // Computer use
  const [enableComputerUse, setEnableComputerUse] = useState(true);
  const [unhideApps, setUnhideApps] = useState(true);
  const [appUsageMode, setAppUsageMode] = useState<'Background' | 'Full control'>('Background');
  const [deniedApps, setDeniedApps] = useState<string[]>([]);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');

  const handleRecheck = () => {
    setIsRechecking(true);
    setTimeout(() => {
      setIsRechecking(false);
    }, 600);
  };

  const handleAddDeniedApp = () => {
    const trimmed = newAppName.trim();
    if (trimmed && !deniedApps.includes(trimmed)) {
      setDeniedApps([...deniedApps, trimmed]);
      setNewAppName('');
      setIsAddAppModalOpen(false);
    }
  };

  const handleRemoveDeniedApp = (appName: string) => {
    setDeniedApps(deniedApps.filter((a) => a !== appName));
  };

  return (
    <div className="flex flex-col gap-6 text-text-primary">
      {/* 1. GENERAL DESKTOP SETTINGS */}
      <div>
        <h3 className="border-b border-border-light pb-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          General desktop settings
        </h3>
        <div className="divide-y divide-border-light/60">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <div className="text-xs font-medium text-text-primary">Desktop app version</div>
            </div>
            <span className="font-mono text-xs text-text-secondary">2.2553.1</span>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Run on startup</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Automatically start Claude when you log in to your computer.
              </p>
            </div>
            <Switch
              checked={runOnStartup}
              onCheckedChange={setRunOnStartup}
              aria-label="Run on startup"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Quick access shortcut</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Message Claude from anywhere on your desktop.
              </p>
            </div>
            <select
              value={quickAccessShortcut}
              onChange={(e) => setQuickAccessShortcut(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
              aria-label="Quick access shortcut"
            >
              <option value="Tap Option twice">Tap Option twice</option>
              <option value="Command+Space">Command+Space</option>
              <option value="Option+Space">Option+Space</option>
              <option value="No shortcut">No shortcut</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Voice shortcut</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Speak to Claude from anywhere on your desktop.
              </p>
            </div>
            <select
              value={voiceShortcut}
              onChange={(e) => setVoiceShortcut(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
              aria-label="Voice shortcut"
            >
              <option value="No shortcut">No shortcut</option>
              <option value="Option+V">Option+V</option>
              <option value="Command+Shift+V">Command+Shift+V</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Dictation shortcut</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Start or stop dictation in the chat you&apos;re typing in.
              </p>
            </div>
            <select
              value={dictationShortcut}
              onChange={(e) => setDictationShortcut(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
              aria-label="Dictation shortcut"
            >
              <option value="Command+D">Command+D</option>
              <option value="Option+D">Option+D</option>
              <option value="No shortcut">No shortcut</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Menu bar</div>
              <p className="mt-0.5 text-xs text-text-secondary">Show Claude in the menu bar.</p>
            </div>
            <Switch
              checked={showInMenuBar}
              onCheckedChange={setShowInMenuBar}
              aria-label="Menu bar"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Keep computer awake</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Prevent your computer from idle-sleeping while Claude is open so scheduled tasks can
                run. Your display can still turn off. Closing the laptop lid will still put it to
                sleep.
              </p>
            </div>
            <Switch
              checked={keepComputerAwake}
              onCheckedChange={setKeepComputerAwake}
              aria-label="Keep computer awake"
            />
          </div>
        </div>
      </div>

      {/* 2. BROWSER USE */}
      <div>
        <div className="flex items-center justify-between border-b border-border-light pb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Browser use
          </h3>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Not available in cloud Code sessions, which don&apos;t run on this computer.
        </p>

        <div className="mt-3 divide-y divide-border-light/60">
          <div className="py-3.5">
            <div className="flex items-center justify-between pb-2">
              <div className="max-w-md pr-4">
                <div className="text-xs font-medium text-text-primary">Connected browsers</div>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Chrome instances signed in to your account that Claude can automate.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRecheck}
                className="flex items-center gap-1.5 rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
              >
                <RotateCw className={cn('h-3.5 w-3.5', isRechecking && 'animate-spin')} />
                <span>Recheck</span>
              </button>
            </div>

            <div className="mt-2 rounded-xl border border-border-light bg-surface-primary p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">
                  {connectedBrowsers.length} browser connected
                </span>
              </div>
              <div className="mt-2 divide-y divide-border-light/60">
                {connectedBrowsers.map((b) => (
                  <div key={b.id} className="flex items-center justify-between py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-text-primary">{b.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-text-tertiary">
                      Device ID: {b.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMPUTER USE */}
      <div>
        <div className="flex items-center gap-2 border-b border-border-light pb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Computer use
          </h3>
          <span className="rounded bg-surface-secondary px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">
            Beta
          </span>
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Not available in cloud Code sessions, which don&apos;t run on this computer.
        </p>

        <div className="mt-3 divide-y divide-border-light/60">
          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Enable computer use</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Let Claude see and act in the apps you allow, working in the background or with full
                control of your screen.{' '}
                <a
                  href="https://docs.anthropic.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-text-primary"
                >
                  Learn more
                </a>
              </p>
            </div>
            <Switch
              checked={enableComputerUse}
              onCheckedChange={setEnableComputerUse}
              aria-label="Enable computer use"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                Unhide apps when Claude finishes
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                When Claude has full control of your screen, apps hidden during a task are restored
                when Claude stops.
              </p>
            </div>
            <Switch
              checked={unhideApps}
              onCheckedChange={setUnhideApps}
              aria-label="Unhide apps when Claude finishes"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">
                How Claude uses the apps you allow
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Background: Claude works inside the apps you allow while you keep using your
                computer. Full control: Claude takes control of your screen, mouse, and keyboard.
              </p>
            </div>
            <div className="flex rounded-lg bg-surface-secondary p-0.5 text-xs">
              {(['Background', 'Full control'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAppUsageMode(mode)}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    appUsageMode === mode
                      ? 'shadow-xs bg-surface-primary text-text-primary'
                      : 'text-text-tertiary hover:text-text-primary',
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div className="max-w-md pr-4">
              <div className="text-xs font-medium text-text-primary">Denied apps</div>
              <p className="mt-0.5 text-xs text-text-secondary">
                Any request Claude makes to access these apps is automatically rejected.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddAppModalOpen(true)}
              className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add app</span>
            </button>
          </div>

          {deniedApps.length > 0 && (
            <div className="py-2">
              <div className="flex flex-wrap gap-1.5">
                {deniedApps.map((app) => (
                  <span
                    key={app}
                    className="flex items-center gap-1 rounded-lg border border-border-light bg-surface-secondary px-2 py-1 text-xs text-text-primary"
                  >
                    <span>{app}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeniedApp(app)}
                      className="text-text-tertiary hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PERMISSIONS STATUS */}
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-xs font-medium text-text-primary">Accessibility</div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
              Granted
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-xs font-medium text-text-primary">Screen recording</div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
              Granted
            </span>
          </div>
        </div>
      </div>

      {/* MODAL: ADD DENIED APP */}
      {isAddAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border-light bg-surface-primary p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-text-secondary" />
                <h4 className="text-sm font-semibold text-text-primary">Deny app access</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAppModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Enter the application name or bundle ID you want to block Claude from accessing.
            </p>
            <input
              type="text"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddDeniedApp();
                }
              }}
              placeholder="e.g. 1Password or com.apple.Terminal"
              className="mt-3 w-full rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddAppModalOpen(false)}
                className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDeniedApp}
                className="rounded-lg bg-text-primary px-3 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
