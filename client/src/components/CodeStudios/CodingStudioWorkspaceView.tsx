import { useState, memo } from 'react';
import { ChevronRight, ChevronLeft, GitCommit, Activity, Compass } from 'lucide-react';
import WindsurfDevServerStudio from './WindsurfDevServerStudio';
import KiroDualModeStudio from './KiroDualModeStudio';
import CursorDiffStudio from './CursorDiffStudio';
import { cn } from '~/utils';

export interface CodingStudioWorkspaceViewProps {
  appId: 'cursor' | 'windsurf' | 'kiro' | string;
  className?: string;
  defaultCollapsed?: boolean;
  onSelectPrompt?: (prompt: string) => void;
}

export const CodingStudioWorkspaceView = memo(function CodingStudioWorkspaceView({
  appId,
  className,
  defaultCollapsed = false,
  onSelectPrompt,
}: CodingStudioWorkspaceViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const getStudioMeta = () => {
    switch (appId) {
      case 'cursor':
        return {
          title: 'Cursor Diff Studio',
          icon: GitCommit,
          colorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          expandTestId: 'cursor-studio-expand-btn',
          collapseTestId: 'cursor-studio-collapse-btn',
        };
      case 'windsurf':
        return {
          title: 'Windsurf Dev Server',
          icon: Activity,
          colorClass: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
          expandTestId: 'windsurf-studio-expand-btn',
          collapseTestId: 'windsurf-studio-collapse-btn',
        };
      case 'kiro':
      default:
        return {
          title: 'Kiro Dual-Mode',
          icon: Compass,
          colorClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
          expandTestId: 'kiro-studio-expand-btn',
          collapseTestId: 'kiro-studio-collapse-btn',
        };
    }
  };

  const meta = getStudioMeta();
  const IconComponent = meta.icon;

  if (isCollapsed) {
    return (
      <div
        className={cn(
          'relative flex flex-col items-center justify-between py-4 px-1 bg-surface-primary border-l border-border-light h-full w-10 select-none z-10 transition-all duration-200',
          className,
        )}
        data-testid="coding-studio-collapsed"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          title={`Expand ${meta.title}`}
          aria-label={`Expand ${meta.title}`}
          data-testid={meta.expandTestId}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-3 my-auto">
          <div className={cn('flex items-center justify-center w-7 h-7 rounded-lg border', meta.colorClass)}>
            <IconComponent className="w-4 h-4" />
          </div>
          <span
            className="text-[11px] font-semibold text-text-secondary tracking-widest uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {meta.title}
          </span>
        </div>

        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          title="Open Studio"
          aria-label="Open Studio"
        >
          <IconComponent className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex flex-col h-full w-[460px] md:w-[520px] bg-surface-primary border-l border-border-light z-10 shadow-lg transition-all duration-200 shrink-0 overflow-hidden',
        className,
      )}
      data-testid="coding-studio-expanded"
    >
      {/* Collapse toggle bar */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded-md hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors"
          title={`Collapse ${meta.title}`}
          aria-label={`Collapse ${meta.title}`}
          data-testid={meta.collapseTestId}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Render appropriate specialized studio */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {appId === 'cursor' && <CursorDiffStudio onSelectPrompt={onSelectPrompt} />}
        {appId === 'windsurf' && <WindsurfDevServerStudio />}
        {appId === 'kiro' && <KiroDualModeStudio onSelectPrompt={onSelectPrompt} />}
      </div>
    </div>
  );
});

export default CodingStudioWorkspaceView;
