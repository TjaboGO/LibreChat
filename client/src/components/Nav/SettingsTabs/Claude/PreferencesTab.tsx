/* eslint-disable i18next/no-literal-string */
import React, { useContext, useState, useCallback } from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';
import { ThemeContext, Switch } from '@librechat/client';
import { cn } from '~/utils';

export default function PreferencesTab() {
  const { theme, setTheme } = useContext(ThemeContext);

  // Chat font state
  const [chatFont, setChatFont] = useState<'serif' | 'sans' | 'mono'>('serif');

  // Motion state
  const [motion, setMotion] = useState<'system' | 'reduced'>('system');

  // Voice state
  const [voiceLang, setVoiceLang] = useState('English');
  const [voiceStyle, setVoiceStyle] = useState('Rounded');
  const [voiceSpeed, setVoiceSpeed] = useState('Normal');

  // Notification toggles (exact 5 from reference screenshots)
  const [notifyCompletions, setNotifyCompletions] = useState(true);
  const [notifyScheduled, setNotifyScheduled] = useState(true);
  const [notifyCode, setNotifyCode] = useState(true);
  const [notifyCodePermissions, setNotifyCodePermissions] = useState(true);
  const [notifyCodeEmails, setNotifyCodeEmails] = useState(true);

  const handleThemeChange = useCallback(
    (newTheme: string) => {
      setTheme(newTheme);
    },
    [setTheme],
  );

  return (
    <div className="flex flex-col divide-y divide-border-light text-text-primary">
      {/* SECTION: Appearance */}
      <div className="pb-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Appearance</h3>
        <div className="flex flex-col gap-4">
          {/* Row: Theme */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-text-tertiary">Select color appearance</div>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-surface-secondary p-1">
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                title="System theme"
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                  theme === 'system'
                    ? 'bg-surface-primary text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>System</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                title="Light theme"
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                  theme === 'light'
                    ? 'bg-surface-primary text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                <Sun className="h-3.5 w-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                title="Dark theme"
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                  theme === 'dark'
                    ? 'bg-surface-primary text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Row: Chat font */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div>
              <div className="text-sm font-medium">Chat font</div>
              <div className="text-xs text-text-tertiary">Typeface for chat messages</div>
            </div>
            <select
              value={chatFont}
              onChange={(e) => setChatFont(e.target.value as 'serif' | 'sans' | 'mono')}
              className="rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:outline-none"
            >
              <option value="serif">Anthropic Serif</option>
              <option value="sans">Classic Sans</option>
              <option value="mono">Monospace</option>
            </select>
          </div>

          {/* Row: Motion */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium">Motion</div>
              <div className="text-xs text-text-tertiary">
                Reduce animation in streaming responses and other interface elements.
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-surface-secondary p-1">
              <button
                type="button"
                onClick={() => setMotion('system')}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                  motion === 'system'
                    ? 'bg-surface-primary text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                System
              </button>
              <button
                type="button"
                onClick={() => setMotion('reduced')}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                  motion === 'reduced'
                    ? 'bg-surface-primary text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                Reduced
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Voice */}
      <div className="py-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Voice</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Language</div>
            <select
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Swedish">Swedish</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">Style</div>
            <select
              value={voiceStyle}
              onChange={(e) => setVoiceStyle(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:outline-none"
            >
              <option value="Rounded">Rounded</option>
              <option value="Natural">Natural</option>
              <option value="Concise">Concise</option>
              <option value="Warm">Warm</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">Speed</div>
            <select
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(e.target.value)}
              className="rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:outline-none"
            >
              <option value="Slower">Slower</option>
              <option value="Normal">Normal</option>
              <option value="Faster">Faster</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION: Notifications */}
      <div className="pt-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Notifications</h3>
        <div className="flex flex-col gap-4">
          {/* Notification 1 */}
          <div className="flex items-center justify-between">
            <div className="max-w-[75%]">
              <div className="text-sm font-medium">Response completions</div>
              <div className="text-xs text-text-tertiary">
                Get notified when Claude has finished a response. Useful for long-running tasks.
              </div>
            </div>
            <Switch
              id="notify-completions"
              aria-label="Response completions"
              checked={notifyCompletions}
              onCheckedChange={setNotifyCompletions}
            />
          </div>

          {/* Notification 2 */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="max-w-[75%]">
              <div className="text-sm font-medium">Scheduled tasks</div>
              <div className="text-xs text-text-tertiary">
                Get notified when scheduled tasks finish, can&apos;t run, or need your input.
              </div>
            </div>
            <Switch
              id="notify-scheduled"
              aria-label="Scheduled tasks"
              checked={notifyScheduled}
              onCheckedChange={setNotifyScheduled}
            />
          </div>

          {/* Notification 3 */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="max-w-[75%]">
              <div className="text-sm font-medium">Code notifications</div>
              <div className="text-xs text-text-tertiary">
                Claude can choose to notify you about important updates from a Code session.
              </div>
            </div>
            <Switch
              id="notify-code"
              aria-label="Code notifications"
              checked={notifyCode}
              onCheckedChange={setNotifyCode}
            />
          </div>

          {/* Notification 4 */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="max-w-[75%]">
              <div className="text-sm font-medium">Code permission requests</div>
              <div className="text-xs text-text-tertiary">
                Get a push notification when Claude needs your approval to run a command in a Code
                session.
              </div>
            </div>
            <Switch
              id="notify-code-perms"
              aria-label="Code permission requests"
              checked={notifyCodePermissions}
              onCheckedChange={setNotifyCodePermissions}
            />
          </div>

          {/* Notification 5 */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="max-w-[75%]">
              <div className="text-sm font-medium">Emails from Claude Code cloud sessions</div>
              <div className="text-xs text-text-tertiary">
                Get an email when a cloud session has finished building or needs your response.
              </div>
            </div>
            <Switch
              id="notify-code-emails"
              aria-label="Emails from Claude Code cloud sessions"
              checked={notifyCodeEmails}
              onCheckedChange={setNotifyCodeEmails}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
