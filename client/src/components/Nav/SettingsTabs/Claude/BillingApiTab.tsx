/* eslint-disable i18next/no-literal-string */
import React from 'react';
import { ExternalLink, CheckCircle, Zap, ShieldAlert, Key } from 'lucide-react';
import { useGetUserBalance, useGetStartupConfig } from '~/data-provider';
import { useAuthContext } from '~/hooks/AuthContext';
import ProviderKeys from '../ProviderKeys';

export default function BillingApiTab() {
  const { isAuthenticated } = useAuthContext();
  const { data: startupConfig } = useGetStartupConfig();
  const balanceQuery = useGetUserBalance({
    enabled: !!isAuthenticated && startupConfig?.balance?.enabled,
  });

  return (
    <div className="flex flex-col divide-y divide-border-light text-text-primary">
      {/* SECTION: Overview Banner */}
      <div className="pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-primary">API & Providers</h3>
            <p className="mt-1 text-xs text-text-tertiary">
              Manage your self-hosted inference gateways (OpenRouter & DeepSeek). No Claude Pro
              subscription required.
            </p>
          </div>
          <a
            href="https://openrouter.ai/credits"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1 rounded-full bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-hover"
          >
            <span>OpenRouter Credits</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Balance Card if enabled */}
        {startupConfig?.balance?.enabled && balanceQuery.data != null && (
          <div className="mt-4 rounded-xl border border-border-light bg-surface-secondary/40 p-4">
            <div className="text-xs text-text-tertiary">Workspace Token Credits</div>
            <div className="mt-1 text-2xl font-bold">
              {new Intl.NumberFormat().format(Math.round(balanceQuery.data.tokenCredits))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION: Primary Gateway - OpenRouter */}
      <div className="py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-text-primary">OpenRouter Gateway</h4>
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
              <CheckCircle className="h-2.5 w-2.5" />
              Active Primary
            </span>
          </div>
          <span className="font-mono text-xs text-text-tertiary">https://openrouter.ai/api/v1</span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-text-tertiary">
          Powers multi-model reasoning (DeepSeek-R1, Qwen 2.5, GLM-4.6) and standard chat models
          with streaming thinking tokens and function calling.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border-light bg-surface-secondary/50 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Extended Thinking / Effort</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">
              Controlled via the Effort selector (Low, Medium, High &quot;Default&quot;, Extra,
              Max). Maps directly to OpenRouter reasoning tokens.
            </p>
          </div>

          <div className="rounded-xl border border-border-light bg-surface-secondary/50 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <ShieldAlert className="h-3.5 w-3.5 text-blue-500" />
              <span>Stop-Token Protection</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">
              <code>dropParams: [&apos;stop&apos;]</code> active in configuration to prevent 400 Bad
              Request across upstream inference providers.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border-light pt-3">
          <div className="text-xs text-text-tertiary">
            API key configured via <code>OPENROUTER_KEY</code> environment variable or custom keys.
          </div>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1 text-xs font-medium text-text-primary underline hover:text-text-secondary"
          >
            <span>Manage on OpenRouter</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* SECTION: Direct Endpoint - DeepSeek */}
      <div className="py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-text-primary">DeepSeek Direct</h4>
            <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              Configured
            </span>
          </div>
          <span className="font-mono text-xs text-text-tertiary">https://api.deepseek.com</span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-text-tertiary">
          Direct connection to DeepSeek&apos;s official inference servers for low-latency reasoning
          (<code>deepseek-reasoner</code>) and conversational output (<code>deepseek-chat</code>).
        </p>
      </div>

      {/* SECTION: User-Provided Provider Keys */}
      <div className="pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Key className="h-4 w-4 text-text-secondary" />
          <h4 className="text-sm font-semibold text-text-primary">User Provider Keys</h4>
        </div>
        <p className="mb-4 text-xs text-text-tertiary">
          Optionally store your personal keys in your browser or user record for specific endpoints.
        </p>
        <div className="rounded-xl border border-border-light bg-surface-secondary/40 p-4">
          <ProviderKeys />
        </div>
      </div>
    </div>
  );
}
