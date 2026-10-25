import { useState, memo } from 'react';
import { ChevronRight, ChevronLeft, Cpu, BookOpen } from 'lucide-react';
import DeepWikiPanel from './DeepWikiPanel';
import { cn } from '~/utils';

export interface DevinWorkspaceViewProps {
  className?: string;
  defaultCollapsed?: boolean;
  onSelectPrompt?: (prompt: string) => void;
}

export const DevinWorkspaceView = memo(function DevinWorkspaceView({
  className,
  defaultCollapsed = false,
  onSelectPrompt,
}: DevinWorkspaceViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  if (isCollapsed) {
    return (
      <div
        className={cn(
          'relative flex flex-col items-center justify-between py-4 px-1 bg-surface-primary border-l border-border-light h-full w-10 select-none z-10 transition-all duration-200',
          className,
        )}
        data-testid="devin-workspace-collapsed"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          title="Expand Devin DeepWiki Workspace"
          aria-label="Expand Devin DeepWiki Workspace"
          data-testid="devin-workspace-expand-btn"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-3 my-auto">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <span
            className="text-[11px] font-semibold text-text-secondary tracking-widest uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Devin DeepWiki
          </span>
        </div>

        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          title="Open Architecture Map"
          aria-label="Open Architecture Map"
        >
          <BookOpen className="w-4 h-4 text-indigo-500" />
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
      data-testid="devin-workspace-expanded"
    >
      {/* Collapse toggle bar */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded-md hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors"
          title="Collapse Devin Workspace"
          aria-label="Collapse Devin Workspace"
          data-testid="devin-workspace-collapse-btn"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Embedded DeepWiki Panel */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <DeepWikiPanel onSelectPrompt={onSelectPrompt} />
      </div>
    </div>
  );
});

export default DevinWorkspaceView;
