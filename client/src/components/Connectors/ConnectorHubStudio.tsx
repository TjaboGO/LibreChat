import { useState, memo, useMemo } from 'react';
import {
  Plug,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Play,
  AtSign,
  Layers,
  Terminal,
  Check,
  Code2,
  Send,
} from 'lucide-react';
import {
  listExternalTools,
  describeExternalTools,
  callExternalTool,
  connectExternalTool,
  disconnectExternalTool,
  detectConnectorMention,
  type ConnectorDefinition,
} from 'librechat-data-provider';
import { cn } from '~/utils';

export type ConnectorTab = 'catalog' | 'mentions' | 'execution';

export interface ConnectorHubStudioProps {
  onSelectPrompt?: (prompt: string) => void;
  defaultCollapsed?: boolean;
}

export const ConnectorHubStudio = memo(function ConnectorHubStudio({
  onSelectPrompt,
  defaultCollapsed = false,
}: ConnectorHubStudioProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<ConnectorTab>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [mentionInput, setMentionInput] = useState('@GitHub list open pull requests in gabrielodenhagen/claude-copycat');
  const [activeToolName, setActiveToolName] = useState('github_search_repos');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Initial list of connectors from provider
  const [connectors, setConnectors] = useState(() => listExternalTools().connectors);

  const refreshConnectors = () => {
    setConnectors(listExternalTools().connectors);
  };

  const filteredConnectors = useMemo(() => {
    let result = connectors;

    if (selectedCategory !== 'ALL') {
      result = result.filter((c) => c.category.toUpperCase() === selectedCategory.toUpperCase());
    }

    if (selectedStatus !== 'ALL') {
      result = result.filter((c) => c.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tools.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [connectors, selectedCategory, selectedStatus, searchQuery]);

  const detectedMentions = useMemo(() => {
    return detectConnectorMention(mentionInput);
  }, [mentionInput]);

  const handleToggleConnect = (connectorId: string, currentStatus: string) => {
    if (currentStatus === 'CONNECTED') {
      disconnectExternalTool(connectorId);
      setActionNotice(`Disconnected connector: ${connectorId}`);
    } else {
      connectExternalTool(connectorId);
      setActionNotice(`Connected connector: ${connectorId}`);
    }
    refreshConnectors();
    setTimeout(() => setActionNotice(null), 2500);
  };

  const handleExecuteTool = async () => {
    setIsExecuting(true);
    try {
      const res = await callExternalTool({
        tool_name: activeToolName,
        source_id: activeToolName.split('_')[0],
        arguments: { query: 'react' },
      });
      setExecutionResult(res);
    } catch (err: any) {
      setExecutionResult({ success: false, error: err.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSendMentionToChat = () => {
    onSelectPrompt?.(mentionInput);
    setActionNotice('Dispatched @mention query to chat!');
    setTimeout(() => setActionNotice(null), 2500);
  };

  if (isCollapsed) {
    return (
      <div
        data-testid="connectors-studio-collapsed"
        className="w-8 border-l border-border bg-card/60 backdrop-blur flex flex-col items-center py-4 select-none shrink-0"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          data-testid="connectors-studio-expand-btn"
          title="Expand Connector Hub"
          aria-label="Expand Connector Hub"
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground hover:scale-105 transition"
        >
          <ChevronLeft className="w-4 h-4 text-purple-400" />
          <Plug className="w-4 h-4 text-purple-400" />
          <span className="text-[11px] font-semibold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            Connectors
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid="connectors-studio-panel"
      className="w-[540px] xl:w-[620px] border-l border-border bg-card/90 backdrop-blur flex flex-col h-full shrink-0 select-none z-10 transition-all duration-200"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Plug className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-tight text-foreground">Connector Hub</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/20 font-medium">
                On-Demand MCP
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">External Tools & @Mention Integration</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('catalog')}
            data-testid="connectors-tab-catalog"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'catalog'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Catalog ({connectors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('mentions')}
            data-testid="connectors-tab-mentions"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'mentions'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <AtSign className="w-3.5 h-3.5 text-blue-400" />
            <span>@Mentions</span>
          </button>
          <button
            onClick={() => setActiveTab('execution')}
            data-testid="connectors-tab-execution"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'execution'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Runner</span>
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(true)}
          data-testid="connectors-studio-collapse-btn"
          title="Collapse Connector Hub"
          aria-label="Collapse Connector Hub"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Notification Banner */}
      {actionNotice && (
        <div className="px-3 py-1.5 bg-purple-500/10 border-b border-purple-500/20 text-purple-300 text-xs flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-purple-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Content Stage */}
      <div className="flex-1 overflow-hidden flex flex-col bg-background">
        {/* TAB 1: CONNECTOR CATALOG */}
        {activeTab === 'catalog' && (
          <div data-testid="connectors-catalog-stage" className="flex-1 flex flex-col overflow-hidden">
            {/* Filter Toolbar */}
            <div className="p-2.5 border-b border-border bg-muted/20 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search connectors (GitHub, Slack, PostgreSQL...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-foreground focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
                  {['ALL', 'developer', 'communication', 'productivity', 'data', 'finance'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        'px-2 py-0.5 rounded capitalize transition',
                        selectedCategory === cat ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-background border border-border text-[10px] rounded px-1.5 py-0.5 text-foreground focus:outline-hidden"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="CONNECTED">Connected</option>
                  <option value="DISCONNECTED">Disconnected</option>
                </select>
              </div>
            </div>

            {/* Connectors Grid */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {filteredConnectors.map((c) => {
                const isConnected = c.status === 'CONNECTED';
                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl border border-border bg-card hover:border-purple-500/30 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">{c.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground uppercase font-mono">
                          {c.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-semibold border',
                            isConnected
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700',
                          )}
                        >
                          {c.status}
                        </span>
                        <button
                          onClick={() => handleToggleConnect(c.id, c.status)}
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-semibold transition',
                            isConnected
                              ? 'border border-border text-muted-foreground hover:text-rose-400'
                              : 'bg-primary text-primary-foreground hover:bg-primary/90',
                          )}
                        >
                          {isConnected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground">{c.description}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.tools.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] px-1.5 py-0.2 rounded bg-muted/60 text-muted-foreground font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: @MENTIONS LIVE DETECTOR */}
        {activeTab === 'mentions' && (
          <div data-testid="connectors-mentions-stage" className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-foreground">Sensitive @Mention Detection</h3>
              <p className="text-[11px] text-muted-foreground">
                Type `@` followed by any service name to trigger on-demand external tool discovery.
              </p>
            </div>

            {/* Quick Mention Suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {['@GitHub', '@Slack', '@Notion', '@Postgres', '@Stripe', '@Linear'].map((mention) => (
                <button
                  key={mention}
                  onClick={() => setMentionInput((prev) => `${prev} ${mention}`)}
                  className="px-2 py-1 rounded-md text-[11px] font-mono font-medium border border-border bg-card hover:border-purple-500/40 text-primary transition"
                >
                  {mention}
                </button>
              ))}
            </div>

            {/* Live Input Box */}
            <div className="border border-border rounded-lg p-2.5 bg-card space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Prompt with Mentions
              </span>
              <textarea
                data-testid="connectors-mention-input"
                rows={3}
                value={mentionInput}
                onChange={(e) => setMentionInput(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-foreground focus:outline-hidden leading-relaxed font-sans resize-none"
              />
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-[10px] text-muted-foreground font-mono">
                  {detectedMentions.mentionedConnectors.length} service(s) detected
                </span>
                <button
                  onClick={handleSendMentionToChat}
                  data-testid="connectors-send-mention-btn"
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1 transition"
                >
                  <Send className="w-3 h-3" />
                  <span>Send to Chat</span>
                </button>
              </div>
            </div>

            {/* Detected Services Cards */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground">Discovered External Connectors</span>
              {detectedMentions.mentionedConnectors.length === 0 ? (
                <div className="p-3 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground italic">
                  No @mentions detected. Type @GitHub or click a badge above.
                </div>
              ) : (
                detectedMentions.mentionedConnectors.map((cId) => (
                  <div key={cId} className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/5 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span className="font-mono text-purple-400">@{cId.toUpperCase()}</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Tools Armed & Ready</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Agent will dynamically invoke tools from this connector during reasoning.
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TEST TOOL RUNNER */}
        {activeTab === 'execution' && (
          <div data-testid="connectors-execution-stage" className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-foreground">Live MCP Tool Execution</h3>
              <p className="text-[11px] text-muted-foreground">
                Simulate on-demand calling of external connectors without prompt bloating.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeToolName}
                onChange={(e) => setActiveToolName(e.target.value)}
                className="bg-background border border-border text-xs rounded-md px-2 py-1 font-mono text-foreground focus:outline-hidden flex-1"
              >
                <option value="github_search_repos">github_search_repos</option>
                <option value="slack_post_message">slack_post_message</option>
                <option value="postgres_execute_query">postgres_execute_query</option>
              </select>

              <button
                onClick={handleExecuteTool}
                data-testid="connectors-run-tool-btn"
                disabled={isExecuting}
                className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1 transition shadow-xs"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{isExecuting ? 'Running...' : 'Run Tool'}</span>
              </button>
            </div>

            {/* Execution Result Box */}
            <div className="flex-1 border border-border rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300 overflow-auto select-text">
              {executionResult ? (
                <pre className="whitespace-pre">{JSON.stringify(executionResult, null, 2)}</pre>
              ) : (
                <span className="text-zinc-600 italic">Click "Run Tool" to execute external tool call</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ConnectorHubStudio;
