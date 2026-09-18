/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Avatar, Button } from '@librechat/client';
import { useAuthContext } from '~/hooks/AuthContext';

export default function AccountTab() {
  const { user, logout } = useAuthContext();

  const [fullName, setFullName] = useState(user?.name || user?.username || 'User');
  const [callName, setCallName] = useState(user?.username || 'User');
  const [workDesc, setWorkDesc] = useState('Software engineering');
  const [instructions, setInstructions] = useState(
    'Be direct, rigorous, and insightful. Favor clear architectural explanations and working code examples.',
  );

  return (
    <div className="flex flex-col divide-y divide-border-light text-text-primary">
      {/* SECTION: Profile */}
      <div className="pb-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Profile</h3>
        <div className="flex flex-col gap-4">
          {/* Avatar row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Avatar</div>
              <div className="text-xs text-text-tertiary">Your profile avatar</div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar user={user} size={36} />
              <Button variant="outline" size="sm" className="text-xs">
                Change avatar
              </Button>
            </div>
          </div>

          {/* Full name row */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">Full name</div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-64 rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-border-xheavy"
            />
          </div>

          {/* Call you row */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">What should Claude call you?</div>
            <input
              type="text"
              value={callName}
              onChange={(e) => setCallName(e.target.value)}
              className="w-64 rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-border-xheavy"
            />
          </div>

          {/* Work description */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">What best describes your work?</div>
            <select
              value={workDesc}
              onChange={(e) => setWorkDesc(e.target.value)}
              className="w-64 rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:outline-none"
            >
              <option value="Software engineering">Software engineering</option>
              <option value="Design">Product & Design</option>
              <option value="Research">Research & Science</option>
              <option value="Writing">Writing & Content</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Instructions for Claude */}
          <div className="border-t border-border-light pt-3">
            <div className="text-sm font-medium">Instructions for Claude</div>
            <div className="mb-2 text-xs text-text-tertiary">
              Claude will keep these in mind for this and any of your associated accounts across
              chats and Cowork within Anthropic&apos;s guidelines.{' '}
              <span className="cursor-pointer underline">Learn more.</span>
            </div>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide instructions for Claude..."
              className="w-full rounded-lg border border-border-light bg-surface-secondary p-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-border-xheavy"
            />
          </div>
        </div>
      </div>

      {/* SECTION: Account */}
      <div className="py-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Account</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Log out of all devices</div>
              <div className="text-xs text-text-tertiary">
                Sign out of active sessions on other browsers and computers.
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => logout?.()} className="text-xs">
              Log out
            </Button>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium">Delete account</div>
              <div className="text-xs text-text-tertiary">
                To delete your account, please cancel your Claude Pro subscription first.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="cursor-not-allowed text-xs opacity-50"
            >
              Delete account
            </Button>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div>
              <div className="text-sm font-medium">Organization ID</div>
              <div className="text-xs text-text-tertiary">
                Identifier for API and enterprise tracking
              </div>
            </div>
            <span className="rounded bg-surface-secondary px-2 py-1 font-mono text-xs text-text-secondary">
              org_claude_copycat_01
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: Trusted devices */}
      <div className="py-6">
        <h3 className="mb-1 text-base font-semibold text-text-primary">Trusted devices</h3>
        <p className="mb-3 text-xs text-text-tertiary">
          Devices that can control your local machine through remote sessions.
        </p>
        <div className="rounded-xl border border-dashed border-border-light bg-surface-secondary/40 p-4 text-center text-xs text-text-tertiary">
          No trusted devices.
        </div>
      </div>

      {/* SECTION: Active sessions */}
      <div className="pt-6">
        <h3 className="mb-3 text-base font-semibold text-text-primary">Active sessions</h3>
        <div className="overflow-hidden rounded-xl border border-border-light text-xs">
          <table className="w-full text-left">
            <thead className="border-b border-border-light bg-surface-secondary/60 text-[10px] uppercase tracking-wider text-text-tertiary">
              <tr>
                <th className="px-4 py-2 font-medium">Device</th>
                <th className="px-4 py-2 font-medium">Location</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-text-secondary">
              <tr>
                <td className="flex items-center gap-2 px-4 py-2.5 font-medium text-text-primary">
                  <span>Current Browser</span>
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    Current
                  </span>
                </td>
                <td className="px-4 py-2.5">Localhost</td>
                <td className="px-4 py-2.5">Active session</td>
                <td className="px-4 py-2.5">Just now</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
