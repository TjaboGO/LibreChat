import React, { memo, useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { ExternalLink, Copy, Check, ShieldCheck, BookOpen, Newspaper, Globe } from 'lucide-react';
import { FaviconImage, getCleanDomain } from '~/components/Web/SourceHovercard';
import { cn } from '~/utils';

export interface CitationBadgeProps {
  index: number | string;
  url: string;
  title?: string;
  snippet?: string;
  reliability?: 'academic' | 'primary' | 'official' | 'news' | 'community';
  className?: string;
}

const hovercardClass = cn(
  'z-[999] w-[340px] max-w-[calc(100vw-2rem)] rounded-xl border border-border-medium bg-surface-primary p-3.5 text-text-primary shadow-xl',
  'origin-top -translate-y-1 opacity-0 transition-[opacity,transform] duration-150 ease-out',
  'data-[enter]:translate-y-0 data-[enter]:opacity-100',
  'data-[leave]:-translate-y-1 data-[leave]:opacity-0',
);

function getReliabilityBadge(tier?: string) {
  switch (tier) {
    case 'academic':
      return {
        label: 'Academic',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        icon: BookOpen,
      };
    case 'primary':
      return {
        label: 'Primary Source',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        icon: ShieldCheck,
      };
    case 'official':
      return {
        label: 'Official',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        icon: ShieldCheck,
      };
    case 'news':
      return {
        label: 'News Outlet',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        icon: Newspaper,
      };
    default:
      return {
        label: 'Web Source',
        color: 'text-text-tertiary bg-surface-tertiary border-border-light',
        icon: Globe,
      };
  }
}

export const CitationBadge = memo(function CitationBadge({
  index,
  url,
  title,
  snippet,
  reliability,
  className,
}: CitationBadgeProps) {
  const [copied, setCopied] = useState(false);
  const hovercard = Ariakit.useHovercardStore({ showTimeout: 120, hideTimeout: 150 });
  const domain = getCleanDomain(url);
  const badgeConfig = getReliabilityBadge(reliability);
  const BadgeIcon = badgeConfig.icon;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const label = typeof index === 'string' && index.startsWith('[') ? index : `[${index}]`;

  return (
    <span className={cn('relative inline-flex items-center align-baseline mx-0.5', className)}>
      <Ariakit.HovercardProvider store={hovercard}>
        <Ariakit.HovercardAnchor
          render={
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Source ${label}`}
              className={cn(
                'group inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md',
                'text-[11px] font-mono font-medium leading-none',
                'bg-surface-secondary/80 hover:bg-surface-hover text-text-secondary hover:text-text-primary',
                'border border-border-light hover:border-border-medium transition-all duration-150',
                'cursor-pointer select-none no-underline',
              )}
            >
              <FaviconImage domain={domain} className="size-2.5 opacity-80 group-hover:opacity-100" />
              <span>{label}</span>
            </a>
          }
        />

        <Ariakit.Hovercard gutter={12} className={hovercardClass} portal unmountOnHide>
          <div className="flex flex-col gap-2">
            {/* Header: Domain, Favicon, Reliability Badge */}
            <div className="flex items-center justify-between border-b border-border-light pb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <FaviconImage domain={domain} className="size-4" />
                <span className="truncate text-xs font-semibold text-text-primary">{domain}</span>
              </div>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium border',
                  badgeConfig.color,
                )}
              >
                <BadgeIcon className="size-2.5" />
                <span>{badgeConfig.label}</span>
              </span>
            </div>

            {/* Title & Link */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/title flex items-start justify-between gap-1 text-xs font-medium text-text-primary hover:text-blue-500 transition-colors"
            >
              <span className="line-clamp-2 leading-snug">{title || url}</span>
              <ExternalLink className="size-3 shrink-0 mt-0.5 opacity-60 group-hover/title:opacity-100 transition-opacity" />
            </a>

            {/* Snippet / Citation Claim */}
            {snippet && (
              <p className="line-clamp-3 text-[11px] leading-relaxed text-text-secondary italic border-l-2 border-border-medium pl-2 bg-surface-secondary/50 py-1 rounded-r">
                &ldquo;{snippet}&rdquo;
              </p>
            )}

            {/* Footer with Copy Action */}
            <div className="flex items-center justify-between pt-1 text-[10px] text-text-tertiary">
              <span className="truncate max-w-[200px]">{url}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-surface-secondary hover:text-text-primary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="size-2.5 text-green-500" />
                    <span className="text-green-500 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-2.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Ariakit.Hovercard>
      </Ariakit.HovercardProvider>
    </span>
  );
});

export default CitationBadge;
