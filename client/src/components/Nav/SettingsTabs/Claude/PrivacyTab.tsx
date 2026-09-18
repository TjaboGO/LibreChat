/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Button, Switch } from '@librechat/client';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '~/utils';

export default function PrivacyTab() {
  const [protectExpanded, setProtectExpanded] = useState(false);
  const [useExpanded, setUseExpanded] = useState(false);

  const [locationMeta, setLocationMeta] = useState(true);
  const [helpImproveAI, setHelpImproveAI] = useState(false);

  return (
    <div className="flex flex-col divide-y divide-border-light text-text-primary">
      {/* SECTION: Privacy intro & practices */}
      <div className="pb-6">
        <h3 className="mb-2 text-base font-semibold text-text-primary">Privacy</h3>
        <p className="mb-4 text-xs leading-relaxed text-text-tertiary">
          Anthropic believes in transparent data practices. Learn how your information is protected
          when using Anthropic products, and visit our{' '}
          <span className="cursor-pointer underline">Privacy Center</span> and{' '}
          <span className="cursor-pointer underline">Privacy Policy</span> for more details.
        </p>

        <div className="flex flex-col divide-y divide-border-light rounded-xl border border-border-light bg-surface-secondary/50">
          {/* Collapsible 1: Protect */}
          <div className="p-3">
            <button
              type="button"
              onClick={() => setProtectExpanded((p) => !p)}
              className="flex w-full items-center justify-between text-left text-xs font-medium text-text-primary"
            >
              <span>How we protect your data</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-text-tertiary transition-transform',
                  protectExpanded && 'rotate-180',
                )}
              />
            </button>
            {protectExpanded && (
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                We employ industry-standard encryption in transit and at rest, sandboxed container
                execution for code environments, and fine-grained authorization controls for
                multi-tenant workspaces.
              </p>
            )}
          </div>

          {/* Collapsible 2: Use */}
          <div className="p-3">
            <button
              type="button"
              onClick={() => setUseExpanded((p) => !p)}
              className="flex w-full items-center justify-between text-left text-xs font-medium text-text-primary"
            >
              <span>How we use your data</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-text-tertiary transition-transform',
                  useExpanded && 'rotate-180',
                )}
              />
            </button>
            {useExpanded && (
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Your prompt queries, code executions, and uploaded files are delivered directly to
                your configured inference gateway (OpenRouter or direct endpoints) without
                unauthorized model training by default.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: Preferences */}
      <div className="py-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Preferences</h3>
        <div className="flex flex-col gap-4">
          {/* Location metadata */}
          <div className="flex items-center justify-between">
            <div className="max-w-[75%]">
              <div className="text-sm font-medium">Location metadata</div>
              <div className="text-xs text-text-tertiary">
                Allow Claude to use coarse location metadata (city/region) to improve product
                experiences. <span className="cursor-pointer underline">Learn more.</span>
              </div>
            </div>
            <Switch
              id="location-meta"
              aria-label="Location metadata"
              checked={locationMeta}
              onCheckedChange={setLocationMeta}
            />
          </div>

          {/* Help improve our AI models */}
          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="max-w-[75%]">
              <div className="text-sm font-medium">Help improve our AI models</div>
              <div className="text-xs text-text-tertiary">
                Allow the use of your chats and coding sessions to train and improve Anthropic AI
                models. <span className="cursor-pointer underline">Learn more.</span>
              </div>
            </div>
            <Switch
              id="help-improve-ai"
              aria-label="Help improve our AI models"
              checked={helpImproveAI}
              onCheckedChange={setHelpImproveAI}
            />
          </div>
        </div>
      </div>

      {/* SECTION: Your data */}
      <div className="pt-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Your data</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Export data</div>
              <div className="text-xs text-text-tertiary">
                Download your conversation and artifact archives
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Export data
            </Button>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">Shared chats</div>
            <Button variant="outline" size="sm" className="text-xs">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">Shared artifacts</div>
            <Button variant="outline" size="sm" className="text-xs">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">Uploaded files</div>
            <Button variant="outline" size="sm" className="text-xs">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">Your feedback</div>
            <Button variant="outline" size="sm" className="text-xs">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between border-t border-border-light pt-3">
            <div className="text-sm font-medium">Memory preferences</div>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <span>Manage</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
