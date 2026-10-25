import { useState, useMemo, memo } from 'react';
import {
  GitCommit,
  Check,
  X,
  FileCode,
  Search,
  Replace,
  ChevronRight,
  ChevronLeft,
  Copy,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { cn } from '~/utils';

export interface DiffHunk {
  id: string;
  file: string;
  oldStart: number;
  newStart: number;
  originalText: string;
  modifiedText: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const INITIAL_DIFF_HUNKS: DiffHunk[] = [
  {
    id: 'hunk-1',
    file: 'client/src/routes/AppRoute.tsx',
    oldStart: 30,
    newStart: 30,
    originalText: `  if (appId === 'manus') {\n    return <ManusWorkspaceView />;\n  }`,
    modifiedText: `  if (appId === 'cursor' || appId === 'windsurf' || appId === 'kiro') {\n    return (\n      <div className="relative flex h-full w-full overflow-hidden">\n        <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">\n          <ChatRoute />\n        </div>\n        <CodingStudioWorkspaceView appId={appId} />\n      </div>\n    );\n  }`,
    status: 'pending',
  },
  {
    id: 'hunk-2',
    file: 'packages/api/src/agents/appDispatcher.ts',
    oldStart: 45,
    newStart: 45,
    originalText: `  // Forward assistant message payload\n  payload.messages.push({ role: 'assistant', content: msg.content });`,
    modifiedText: `  // Forward assistant message payload with full reasoning preservation\n  payload.messages.push({\n    role: 'assistant',\n    content: msg.content,\n    ...(msg.reasoning_content ? { reasoning_content: msg.reasoning_content } : {}),\n  });`,
    status: 'pending',
  },
  {
    id: 'hunk-3',
    file: 'packages/data-provider/src/apps/promptStore.ts',
    oldStart: 125,
    newStart: 125,
    originalText: `  'cursor-composer': 'Placeholder prompt',`,
    modifiedText: `  'cursor-composer': CURSOR_COMPOSER_PROMPT,\n  cursor: CURSOR_COMPOSER_PROMPT,`,
    status: 'accepted',
  },
];

export interface CursorDiffStudioProps {
  className?: string;
  onSelectPrompt?: (prompt: string) => void;
}

export const CursorDiffStudio = memo(function CursorDiffStudio({
  className,
  onSelectPrompt,
}: CursorDiffStudioProps) {
  const [hunks, setHunks] = useState<DiffHunk[]>(INITIAL_DIFF_HUNKS);
  const [selectedHunkId, setSelectedHunkId] = useState<string>('hunk-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedHunk = useMemo(() => {
    return hunks.find((h) => h.id === selectedHunkId) || hunks[0];
  }, [hunks, selectedHunkId]);

  const handleUpdateStatus = (id: string, status: 'accepted' | 'rejected' | 'pending') => {
    setHunks((prev) => prev.map((h) => (h.id === id ? { ...h, status } : h)));
  };

  const handleAcceptAll = () => {
    setHunks((prev) => prev.map((h) => ({ ...h, status: 'accepted' })));
  };

  const handleRejectAll = () => {
    setHunks((prev) => prev.map((h) => ({ ...h, status: 'rejected' })));
  };

  const handleExecuteReplace = () => {
    if (!searchQuery) return;
    setHunks((prev) =>
      prev.map((h) => {
        if (h.id !== selectedHunkId) return h;
        return {
          ...h,
          modifiedText: h.modifiedText.replaceAll(searchQuery, replaceQuery),
        };
      }),
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const acceptedCount = hunks.filter((h) => h.status === 'accepted').length;
  const pendingCount = hunks.filter((h) => h.status === 'pending').length;

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full bg-surface-primary text-text-primary border-l border-border-light text-sm select-none',
        className,
      )}
      data-testid="cursor-diff-studio"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-surface-secondary/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <GitCommit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-xs text-text-primary">
              <span>Cursor Studio</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Fast Diff Editor
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              {pendingCount} pending hunks · {acceptedCount} accepted
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRejectAll}
            className="px-2 py-1 text-xs rounded border border-border-light text-text-secondary hover:text-red-400 hover:border-red-400/40 transition-colors"
            title="Reject all diffs"
          >
            Reject All
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-2.5 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            title="Accept all diffs"
            data-testid="cursor-accept-all-btn"
          >
            Accept All
          </button>
        </div>
      </div>

      {/* Files List / Hunks Selector */}
      <div className="px-3 py-2 border-b border-border-light bg-surface-secondary/20 overflow-x-auto flex gap-1.5">
        {hunks.map((hunk) => {
          const isSelected = hunk.id === selectedHunkId;
          return (
            <button
              key={hunk.id}
              onClick={() => setSelectedHunkId(hunk.id)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md border transition-all shrink-0',
                isSelected
                  ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-semibold'
                  : 'border-border-light bg-surface-primary text-text-secondary hover:text-text-primary hover:border-border-medium',
              )}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="truncate max-w-[140px]">{hunk.file.split('/').pop()}</span>
              {hunk.status === 'accepted' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Accepted" />
              )}
              {hunk.status === 'rejected' && (
                <span className="w-2 h-2 rounded-full bg-red-500" title="Rejected" />
              )}
              {hunk.status === 'pending' && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title="Pending review" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Replace Bar */}
      <div className="px-3 py-2 border-b border-border-light/60 bg-surface-secondary/40 space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in hunk..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-surface-primary font-mono border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="relative flex-1">
            <Replace className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-text-secondary" />
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace with..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-surface-primary font-mono border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleExecuteReplace}
            disabled={!searchQuery}
            className="px-2.5 py-1 text-xs font-medium rounded bg-surface-tertiary hover:bg-surface-secondary text-text-primary border border-border-light disabled:opacity-40 transition-colors shrink-0"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Active Diff Editor View */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {selectedHunk && (
          <div className="space-y-3">
            {/* Hunk Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-text-primary">
                  {selectedHunk.file}
                </span>
                <span
                  className={cn(
                    'text-[10px] uppercase font-bold px-1.5 py-0.2 rounded',
                    selectedHunk.status === 'accepted' && 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
                    selectedHunk.status === 'rejected' && 'bg-red-500/10 text-red-500 border border-red-500/20',
                    selectedHunk.status === 'pending' && 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
                  )}
                >
                  {selectedHunk.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(selectedHunk.id, 'rejected')}
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 text-xs rounded border transition-colors',
                    selectedHunk.status === 'rejected'
                      ? 'bg-red-500 text-white border-red-600'
                      : 'border-border-light text-text-secondary hover:text-red-400 hover:border-red-400/40',
                  )}
                  title="Reject this hunk"
                >
                  <X className="w-3 h-3" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedHunk.id, 'accepted')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded border transition-colors',
                    selectedHunk.status === 'accepted'
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700',
                  )}
                  title="Accept this hunk"
                  data-testid="cursor-accept-hunk-btn"
                >
                  <Check className="w-3 h-3" />
                  <span>Accept</span>
                </button>
              </div>
            </div>

            {/* Side-by-side or Unified Red/Green Diff Box */}
            <div className="border border-border-light rounded-lg overflow-hidden font-mono text-[11px]">
              {/* Original (Red) */}
              <div className="bg-red-950/20 border-b border-border-light p-2.5 text-red-300">
                <div className="flex items-center justify-between text-[10px] text-red-400 uppercase font-bold tracking-wider mb-1">
                  <span>- Original (Line {selectedHunk.oldStart})</span>
                </div>
                <pre className="whitespace-pre-wrap select-text leading-relaxed">
                  {selectedHunk.originalText}
                </pre>
              </div>

              {/* Modified (Green) */}
              <div className="bg-emerald-950/20 p-2.5 text-emerald-300">
                <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-1">
                  <span>+ Proposed Diffs (Line {selectedHunk.newStart})</span>
                  <button
                    onClick={() => handleCopy(selectedHunk.id, selectedHunk.modifiedText)}
                    className="flex items-center gap-1 text-[10px] text-text-secondary hover:text-emerald-400"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === selectedHunk.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap select-text leading-relaxed">
                  {selectedHunk.modifiedText}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default CursorDiffStudio;
