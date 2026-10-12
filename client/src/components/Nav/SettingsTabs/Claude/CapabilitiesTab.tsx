/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Switch } from '@librechat/client';
import { ChevronDown, Info } from 'lucide-react';

interface CapabilitiesTabProps {
  onNavigateTab?: (tabId: string) => void;
}

function getDomainDescription(mode: string) {
  if (mode === 'all') {
    return 'Claude can access all domains on the internet.';
  }
  if (mode === 'strict') {
    return 'Claude can only access domains explicitly approved in your organization allowlist.';
  }
  return 'All external network egress is blocked.';
}

export default function CapabilitiesTab({ onNavigateTab }: CapabilitiesTabProps) {
  // General
  const [toolAccessMode, setToolAccessMode] = useState<'loaded' | 'ask' | 'ondemand'>('loaded');
  const [connectorSearch, setConnectorSearch] = useState(true);
  const [switchModelsFlagged, setSwitchModelsFlagged] = useState(true);

  // Visuals
  const [artifactsEnabled, setArtifactsEnabled] = useState(true);
  const [aiPoweredArtifacts, setAiPoweredArtifacts] = useState(true);
  const [inlineVisualizations, setInlineVisualizations] = useState(true);

  // Code execution
  const [cloudCodeExecution, setCloudCodeExecution] = useState(true);
  const [allowNetworkEgress, setAllowNetworkEgress] = useState(true);
  const [domainAllowlist, setDomainAllowlist] = useState<'all' | 'strict' | 'none'>('all');

  return (
    <div className="flex flex-col divide-y divide-border-light text-text-primary">
      {/* SECTION: General */}
      <div className="pb-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">General</h3>
        <div className="flex flex-col gap-4">
          {/* Tool access mode */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">Tool access mode</div>
              <div className="text-xs text-text-tertiary">
                Controls how connector tools are loaded in new conversations.
              </div>
            </div>
            <div className="relative">
              <select
                value={toolAccessMode}
                onChange={(e) => setToolAccessMode(e.target.value as any)}
                aria-label="Tool access mode"
                className="appearance-none rounded-lg border border-border-light bg-surface-secondary py-1.5 pl-3 pr-8 text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
              >
                <option value="loaded">Tools already loaded</option>
                <option value="ask">Ask before loading</option>
                <option value="ondemand">Load on demand</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            </div>
          </div>

          {/* Connector search */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">Connector search</div>
              <div className="text-xs text-text-tertiary">
                Let Claude search the connector directory and surface ones relevant to your
                conversation.
              </div>
            </div>
            <Switch
              checked={connectorSearch}
              onCheckedChange={setConnectorSearch}
              aria-label="Connector search"
            />
          </div>

          {/* Switch models when a message is flagged */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">
                Switch models when a message is flagged
              </div>
              <div className="text-xs text-text-tertiary">
                When safeguards flag a message, automatically switch to a different model to keep
                chatting. When off, your chat will pause instead.
              </div>
            </div>
            <Switch
              checked={switchModelsFlagged}
              onCheckedChange={setSwitchModelsFlagged}
              aria-label="Switch models when a message is flagged"
            />
          </div>
        </div>
      </div>

      {/* SECTION: Visuals */}
      <div className="py-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Visuals</h3>
        <div className="flex flex-col gap-4">
          {/* Artifacts */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">Artifacts</div>
              <div className="text-xs text-text-tertiary">
                Generate code, documents, and designs in a dedicated window alongside your
                conversation.
              </div>
            </div>
            <Switch
              checked={artifactsEnabled}
              onCheckedChange={setArtifactsEnabled}
              aria-label="Artifacts"
            />
          </div>

          {/* AI-powered artifacts */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">AI-powered artifacts</div>
              <div className="text-xs text-text-tertiary">
                Build apps and interactive documents that use Claude inside the artifact.
              </div>
            </div>
            <Switch
              checked={aiPoweredArtifacts}
              onCheckedChange={setAiPoweredArtifacts}
              aria-label="AI-powered artifacts"
            />
          </div>

          {/* Inline visualizations */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">Inline visualizations</div>
              <div className="text-xs text-text-tertiary">
                Allow Claude to generate interactive visualizations, charts, and diagrams directly
                in the conversation.
              </div>
            </div>
            <Switch
              checked={inlineVisualizations}
              onCheckedChange={setInlineVisualizations}
              aria-label="Inline visualizations"
            />
          </div>
        </div>
      </div>

      {/* SECTION: Code execution and file creation */}
      <div className="py-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">
          Code execution and file creation
        </h3>
        <div className="flex flex-col gap-4">
          {/* Cloud code execution */}
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <div className="text-sm font-medium text-text-primary">
                Cloud code execution and file creation
              </div>
              <div className="text-xs text-text-tertiary">
                Claude can execute code on a server and create and edit docs, spreadsheets,
                presentations, PDFs, and data reports. Required for skills.
              </div>
            </div>
            <Switch
              checked={cloudCodeExecution}
              onCheckedChange={setCloudCodeExecution}
              aria-label="Cloud code execution and file creation"
            />
          </div>

          {/* Allow network egress */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="max-w-[70%]">
                <div className="text-sm font-medium text-text-primary">Allow network egress</div>
                <div className="text-xs text-text-tertiary">
                  Give Claude network access to install packages and libraries in order to perform
                  advanced data analysis, custom visualizations, and specialized file processing.
                  Monitor chats closely as this comes with{' '}
                  <span className="cursor-pointer underline hover:text-text-primary">
                    security risks
                  </span>
                  .
                </div>
              </div>
              <Switch
                checked={allowNetworkEgress}
                onCheckedChange={setAllowNetworkEgress}
                aria-label="Allow network egress"
              />
            </div>

            {/* Nested Card: Domain allowlist */}
            {allowNetworkEgress && (
              <div className="rounded-xl border border-border-light bg-surface-secondary/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-text-primary">Domain allowlist</div>
                    <div className="text-xs text-text-tertiary">
                      Choose which domains the sandbox can access
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={domainAllowlist}
                      onChange={(e) => setDomainAllowlist(e.target.value as any)}
                      aria-label="Domain allowlist"
                      className="appearance-none rounded-lg border border-border-light bg-surface-primary py-1 pl-2.5 pr-7 text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-text-primary"
                    >
                      <option value="all">All domains</option>
                      <option value="strict">Strict allowlist</option>
                      <option value="none">No egress</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-tertiary" />
                  </div>
                </div>

                {/* Inline info banner */}
                <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-border-light/40 bg-surface-primary/80 px-2.5 py-1.5 text-xs text-text-secondary">
                  <Info className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
                  <span>{getDomainDescription(domainAllowlist)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: Skills */}
      <div className="pt-6">
        <h3 className="mb-2 text-base font-semibold text-text-primary">Skills</h3>
        <p className="text-xs text-text-secondary">
          Skills have moved to{' '}
          <button
            type="button"
            onClick={() => onNavigateTab?.('skills')}
            className="font-medium text-text-primary underline hover:text-text-primary/80"
          >
            Customize
          </button>
          .
        </p>
      </div>
    </div>
  );
}
