import { useState, memo } from 'react';
import {
  FileText,
  Table,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Plus,
  Sparkles,
  Download,
  Copy,
  Check,
  FolderTree,
  BookOpen,
  Layers,
  ArrowUpRight,
  User,
  Tag,
} from 'lucide-react';
import { triggerDownload, cn } from '~/utils';

export type NotionTab = 'wiki' | 'database' | 'export';

export interface NotionTaskRecord {
  id: string;
  title: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  assignee: string;
  priority: 'P0' | 'P1' | 'P2';
  relation: string;
}

export interface NotionPageDef {
  id: string;
  title: string;
  icon: string;
  summary: string;
  callout: string;
  checklist: Array<{ id: string; text: string; done: boolean }>;
  toggleTitle: string;
  toggleContent: string;
}

export const INITIAL_NOTION_PAGES: NotionPageDef[] = [
  {
    id: 'engineering-wiki',
    title: 'Core Architecture Wiki',
    icon: '⚡',
    summary: 'Central architectural conventions, security boundaries, and data flow pipelines.',
    callout: 'All microservices communicate via validated schemas. Direct cross-boundary state access is strictly forbidden.',
    checklist: [
      { id: '1', text: 'Adhere to zero prompt-leakage interpolation invariants', done: true },
      { id: '2', text: 'Enforce client-side ISO/IEC 29500 Office exports', done: true },
      { id: '3', text: 'Implement bi-directional relational database rollups', done: false },
    ],
    toggleTitle: 'Authentication & Session Token Lifecycle',
    toggleContent: 'Access tokens refresh automatically via httpOnly cookie rotation with 15-minute expiration windows.',
  },
  {
    id: 'product-spec',
    title: 'Product Roadmap 2026',
    icon: '🚀',
    summary: 'Executive release milestones for autonomous coding studios, office suites, and research agents.',
    callout: 'Milestone 4 requires complete living office spreadsheet formula calculation before public preview.',
    checklist: [
      { id: '4', text: 'Finalize v0 Generative UI integration', done: true },
      { id: '5', text: 'Ship Lovable & Bolt full-stack studios', done: true },
      { id: '6', text: 'Release Living Office & Notion AI suites', done: true },
    ],
    toggleTitle: 'Tiered Pricing Strategy & Quotas',
    toggleContent: 'Free tier includes standard models. Professional tier unlocks deep reasoning and unlimited office exports.',
  },
];

export const INITIAL_NOTION_RECORDS: NotionTaskRecord[] = [
  { id: '1', title: 'Implement =SUM and =AVERAGE formula engine', status: 'Completed', assignee: 'Alex R.', priority: 'P0', relation: 'Core Architecture Wiki' },
  { id: '2', title: 'Design 16:9 PowerPoint widescreen canvas', status: 'Completed', assignee: 'Elena M.', priority: 'P1', relation: 'Product Roadmap 2026' },
  { id: '3', title: 'Build relational database cross-page references', status: 'In Progress', assignee: 'Dev Team', priority: 'P1', relation: 'Core Architecture Wiki' },
  { id: '4', title: 'Add multi-select tags and status column badges', status: 'Completed', assignee: 'Gabriel O.', priority: 'P2', relation: 'Core Architecture Wiki' },
];

export interface NotionWorkspaceViewProps {
  onSelectPrompt?: (prompt: string) => void;
  defaultCollapsed?: boolean;
}

export const NotionWorkspaceView = memo(function NotionWorkspaceView({
  onSelectPrompt,
  defaultCollapsed = false,
}: NotionWorkspaceViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<NotionTab>('wiki');
  const [selectedPageId, setSelectedPageId] = useState<string>('engineering-wiki');
  const [pages, setPages] = useState<NotionPageDef[]>(INITIAL_NOTION_PAGES);
  const [records, setRecords] = useState<NotionTaskRecord[]>(INITIAL_NOTION_RECORDS);
  const [toggleOpen, setToggleOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const activePage = pages.find((p) => p.id === selectedPageId) || pages[0];

  const handleToggleChecklist = (pageId: string, itemId: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          checklist: page.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        };
      }),
    );
  };

  const handleAddRecord = () => {
    setRecords((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: 'New Workspace Task Initiative',
        status: 'In Progress',
        assignee: 'Current User',
        priority: 'P1',
        relation: activePage.title,
      },
    ]);
  };

  const handleExportMarkdown = () => {
    const md = `# ${activePage.icon} ${activePage.title}

> 💡 **Notice:** ${activePage.callout}

${activePage.summary}

### Tasks & Action Items
${activePage.checklist.map((c) => `- [${c.done ? 'x' : ' '}] ${c.text}`).join('\n')}

### ${activePage.toggleTitle}
${activePage.toggleContent}

---
*Exported from Notion AI Studio*
`;

    triggerDownload(`data:text/markdown;charset=utf-8,${encodeURIComponent(md)}`, `${activePage.id}.md`);
  };

  const handleExportCsv = () => {
    const headers = 'Task,Status,Assignee,Priority,Relation\n';
    const rows = records
      .map((r) => `"${r.title}","${r.status}","${r.assignee}","${r.priority}","${r.relation}"`)
      .join('\n');

    triggerDownload(`data:text/csv;charset=utf-8,${encodeURIComponent(headers + rows)}`, 'Notion_Database.csv');
  };

  if (isCollapsed) {
    return (
      <div
        data-testid="notion-studio-collapsed"
        className="w-8 border-l border-border bg-card/60 backdrop-blur flex flex-col items-center py-4 select-none shrink-0"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          data-testid="notion-studio-expand-btn"
          title="Expand Notion AI Studio"
          aria-label="Expand Notion AI Studio"
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground hover:scale-105 transition"
        >
          <ChevronLeft className="w-4 h-4 text-stone-400" />
          <FileText className="w-4 h-4 text-stone-300" />
          <span className="text-[11px] font-semibold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            Notion AI
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid="notion-workspace-panel"
      className="w-[540px] xl:w-[620px] border-l border-border bg-card/90 backdrop-blur flex flex-col h-full shrink-0 select-none z-10 transition-all duration-200"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-stone-500/10 border border-stone-500/20 text-stone-300">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-tight text-foreground">Notion AI Studio</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full border bg-stone-500/10 text-stone-300 border-stone-500/20 font-medium">
                Workspace 3.0
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Wikis, Relational Databases & Docs</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('wiki')}
            data-testid="notion-tab-wiki"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'wiki'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-300" />
            <span>Wiki Pages</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            data-testid="notion-tab-database"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'database'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Table className="w-3.5 h-3.5 text-blue-400" />
            <span>Database</span>
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(true)}
          data-testid="notion-studio-collapse-btn"
          title="Collapse Notion AI Studio"
          aria-label="Collapse Notion AI Studio"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Workspace Stage */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        {/* TAB 1: WIKI PAGES */}
        {activeTab === 'wiki' && (
          <div data-testid="notion-wiki-stage" className="flex-1 flex overflow-hidden">
            {/* Left Page Tree */}
            <div className="w-44 border-r border-border bg-muted/20 p-2.5 space-y-1 overflow-y-auto shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">Pages</span>
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPageId(p.id)}
                  className={cn(
                    'w-full text-left px-2 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition',
                    selectedPageId === p.id
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                  )}
                >
                  <span>{p.icon}</span>
                  <span className="truncate">{p.title}</span>
                </button>
              ))}

              <div className="pt-3 border-t border-border mt-3 px-2">
                <button
                  onClick={handleExportMarkdown}
                  data-testid="notion-export-md-btn"
                  className="w-full py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground border border-border rounded bg-background hover:bg-muted transition flex items-center justify-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Export .md</span>
                </button>
              </div>
            </div>

            {/* Right Page Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-1">
                <div className="text-2xl">{activePage.icon}</div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">{activePage.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{activePage.summary}</p>
              </div>

              {/* Callout Block */}
              <div className="p-3 rounded-lg bg-stone-500/10 border border-stone-500/20 text-xs text-foreground flex items-start gap-2">
                <span className="text-base select-none">💡</span>
                <p className="leading-relaxed text-[11px] text-muted-foreground">{activePage.callout}</p>
              </div>

              {/* Interactive Checklist */}
              <div className="space-y-2 border border-border rounded-lg p-3 bg-card">
                <span className="text-xs font-semibold text-foreground">Action Items</span>
                <div className="space-y-1.5">
                  {activePage.checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleToggleChecklist(activePage.id, item.id)}
                      className="flex items-center gap-2 text-xs text-left w-full hover:text-foreground transition group"
                    >
                      {item.done ? (
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-foreground" />
                      )}
                      <span className={cn('text-[11px]', item.done && 'line-through text-muted-foreground')}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle List Block */}
              <div className="border border-border rounded-lg p-3 bg-card space-y-1.5">
                <button
                  onClick={() => setToggleOpen(!toggleOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-foreground w-full text-left"
                >
                  {toggleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span>{activePage.toggleTitle}</span>
                </button>
                {toggleOpen && (
                  <p className="text-[11px] text-muted-foreground pl-5 leading-relaxed">
                    {activePage.toggleContent}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RELATIONAL DATABASE */}
        {activeTab === 'database' && (
          <div data-testid="notion-database-stage" className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-2.5 border-b border-border bg-muted/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-foreground">Relational Tasks & Epics</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  {records.length} Records
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddRecord}
                  data-testid="notion-add-record-btn"
                  className="px-2 py-1 rounded-md border border-border bg-background hover:bg-muted text-foreground flex items-center gap-1 transition text-xs font-medium"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Record</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  data-testid="notion-export-csv-btn"
                  className="px-2.5 py-1 rounded-md bg-stone-700 text-stone-100 hover:bg-stone-600 flex items-center gap-1 transition text-xs font-semibold shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Records Table */}
            <div className="flex-1 overflow-auto p-3">
              <table className="w-full text-xs text-left border-collapse border border-border font-sans">
                <thead>
                  <tr className="bg-muted/60 text-muted-foreground uppercase text-[10px]">
                    <th className="p-2 border border-border">Task Name</th>
                    <th className="p-2 border border-border">Status</th>
                    <th className="p-2 border border-border">Assignee</th>
                    <th className="p-2 border border-border">Priority</th>
                    <th className="p-2 border border-border">Relation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/20 transition">
                      <td className="p-2 border border-border font-medium text-foreground">{r.title}</td>
                      <td className="p-2 border border-border">
                        <span
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-semibold border',
                            r.status === 'Completed' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                            r.status === 'In Progress' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                            r.status === 'Not Started' && 'bg-zinc-800 text-zinc-400 border-zinc-700',
                          )}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-2 border border-border text-muted-foreground text-[11px]">{r.assignee}</td>
                      <td className="p-2 border border-border">
                        <span
                          className={cn(
                            'text-[10px] font-mono font-bold px-1.5 py-0.2 rounded',
                            r.priority === 'P0' && 'text-rose-400 bg-rose-500/10',
                            r.priority === 'P1' && 'text-amber-400 bg-amber-500/10',
                            r.priority === 'P2' && 'text-zinc-400 bg-zinc-800',
                          )}
                        >
                          {r.priority}
                        </span>
                      </td>
                      <td className="p-2 border border-border text-[11px] text-blue-400 hover:underline cursor-pointer">
                        {r.relation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default NotionWorkspaceView;
