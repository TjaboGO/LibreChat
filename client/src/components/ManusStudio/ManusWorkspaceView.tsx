import { useState, useRef, useEffect, memo } from 'react';
import {
  Terminal,
  Globe,
  RefreshCw,
  Play,
  Square,
  Send,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Cpu,
  Layers,
  AlertCircle,
  Plus,
} from 'lucide-react';
import {
  useProcessesQuery,
  useProcessOutputQuery,
  useSendStdinMutation,
  useKillProcessMutation,
  useExposedPortsQuery,
  useExposePortMutation,
  useClosePortMutation,
} from '~/data-provider/Manus/queries';
import { cn } from '~/utils';

export interface ManusWorkspaceViewProps {
  className?: string;
  defaultCollapsed?: boolean;
}

export const ManusWorkspaceView = memo(function ManusWorkspaceView({
  className,
  defaultCollapsed = false,
}: ManusWorkspaceViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<'terminal' | 'browser'>('terminal');
  const [selectedProcessId, setSelectedProcessId] = useState<string>('');
  const [stdinInput, setStdinInput] = useState('');
  const [newPortInput, setNewPortInput] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Queries & Mutations
  const { data: processesData, refetch: refetchProcesses } = useProcessesQuery();
  const { data: portsData, refetch: refetchPorts } = useExposedPortsQuery();

  const processes = processesData?.processes ?? [];
  const ports = portsData?.ports ?? [];

  // Default selected process
  useEffect(() => {
    if (!selectedProcessId && processes.length > 0) {
      setSelectedProcessId(processes[0].id);
    } else if (
      selectedProcessId &&
      !processes.some((p) => p.id === selectedProcessId) &&
      processes.length > 0
    ) {
      setSelectedProcessId(processes[0].id);
    }
  }, [processes, selectedProcessId]);

  const { data: outputData, refetch: refetchOutput } = useProcessOutputQuery(
    selectedProcessId,
    100,
    { enabled: !!selectedProcessId },
  );

  const sendStdinMutation = useSendStdinMutation();
  const killProcessMutation = useKillProcessMutation();
  const exposePortMutation = useExposePortMutation();
  const closePortMutation = useClosePortMutation();

  const selectedProcess = processes.find((p) => p.id === selectedProcessId);
  const rawOutput = outputData?.output ?? '';

  // Auto-scroll terminal on new output
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [rawOutput, autoScroll]);

  const handleSendStdin = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!selectedProcessId || !stdinInput.trim()) {
      return;
    }

    sendStdinMutation.mutate({
      id: selectedProcessId,
      input: stdinInput,
    });
    setStdinInput('');
  };

  const handleKillProcess = (id: string) => {
    killProcessMutation.mutate({ id, signal: 'SIGTERM' });
  };

  const handleExposePort = (e: React.FormEvent) => {
    e.preventDefault();
    const portNum = parseInt(newPortInput, 10);
    if (!portNum || isNaN(portNum)) {
      return;
    }
    exposePortMutation.mutate({ port: portNum });
    setNewPortInput('');
  };

  const [selectedPortNum, setSelectedPortNum] = useState<number | null>(null);

  useEffect(() => {
    if (ports.length > 0 && selectedPortNum === null) {
      setSelectedPortNum(ports[0].port);
    }
  }, [ports, selectedPortNum]);

  const activePort = ports.find((p) => p.port === selectedPortNum) || ports[0];
  const previewUrl = activePort
    ? activePort.url || `http://localhost:${activePort.port}`
    : null;

  if (isCollapsed) {
    return (
      <div className="relative flex h-full shrink-0 items-center border-l border-border-light bg-surface-primary">
        <button
          type="button"
          data-testid="manus-workspace-expand-btn"
          onClick={() => setIsCollapsed(false)}
          className="group flex h-28 w-8 flex-col items-center justify-center rounded-l-md border-y border-l border-border-medium bg-surface-secondary text-text-secondary shadow-sm transition hover:bg-surface-hover hover:text-text-primary"
          title="Expand Manus Workspace (Terminal & Preview)"
          aria-label="Expand Manus Workspace"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <div className="my-1 flex items-center justify-center">
            <Cpu className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary [writing-mode:vertical-rl]">
            Manus
          </span>
        </button>
      </div>
    );
  }

  return (
    <aside
      data-testid="manus-workspace-view"
      className={cn(
        'relative flex h-full w-[460px] max-w-full shrink-0 flex-col border-l border-border-light bg-surface-primary shadow-lg transition-all duration-200 xl:w-[540px]',
        className,
      )}
    >
      {/* Top Header Bar */}
      <div className="flex h-13 shrink-0 items-center justify-between border-b border-border-light bg-surface-secondary/70 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-purple-500/20 bg-purple-500/10 text-purple-500">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-text-primary">Manus Workspace</span>
              <span className="rounded bg-purple-500/15 px-1.5 py-0.2 text-[9px] font-medium text-purple-600 dark:text-purple-400">
                31 Tools
              </span>
            </div>
            <p className="text-[10px] text-text-tertiary">Live Terminal & Port Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Tab Switcher */}
          <div className="flex items-center rounded-lg border border-border-light bg-surface-tertiary/60 p-0.5">
            <button
              type="button"
              data-testid="manus-tab-terminal"
              onClick={() => setActiveTab('terminal')}
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition',
                activeTab === 'terminal'
                  ? 'bg-surface-primary text-text-primary shadow-2xs'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Terminal</span>
              {processes.length > 0 && (
                <span className="ml-0.5 rounded-full bg-purple-500/20 px-1 py-0.2 text-[9px] font-bold text-purple-600 dark:text-purple-400">
                  {processes.length}
                </span>
              )}
            </button>

            <button
              type="button"
              data-testid="manus-tab-browser"
              onClick={() => setActiveTab('browser')}
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition',
                activeTab === 'browser'
                  ? 'bg-surface-primary text-text-primary shadow-2xs'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Preview</span>
              {ports.length > 0 && (
                <span className="ml-0.5 rounded-full bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                  {ports.length}
                </span>
              )}
            </button>
          </div>

          {/* Collapse Button */}
          <button
            type="button"
            data-testid="manus-workspace-collapse-btn"
            onClick={() => setIsCollapsed(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition hover:bg-surface-hover hover:text-text-primary"
            title="Collapse Workspace"
            aria-label="Collapse Workspace"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ======================================================== */}
        {/* TERMINAL TAB */}
        {/* ======================================================== */}
        {activeTab === 'terminal' && (
          <div className="flex h-full flex-col">
            {/* Process Selector Subheader */}
            <div className="flex items-center justify-between border-b border-border-light bg-surface-secondary/40 px-3 py-1.5 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-[11px] font-medium text-text-tertiary">Process:</span>
                {processes.length > 0 ? (
                  <select
                    value={selectedProcessId}
                    onChange={(e) => setSelectedProcessId(e.target.value)}
                    className="max-w-[200px] truncate rounded border border-border-medium bg-surface-primary px-2 py-0.5 text-xs font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {processes.map((proc) => (
                      <option key={proc.id} value={proc.id}>
                        {proc.id} ({proc.status}) - {proc.command}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="font-mono text-xs text-text-tertiary">No active processes</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {selectedProcess && selectedProcess.status === 'running' && (
                  <button
                    type="button"
                    onClick={() => handleKillProcess(selectedProcess.id)}
                    className="flex items-center gap-1 rounded border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-500 hover:bg-red-500/20"
                    title="Terminate Process"
                  >
                    <Square className="h-2.5 w-2.5 fill-current" />
                    <span>Kill</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    refetchProcesses();
                    refetchOutput();
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
                  title="Refresh Output"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Terminal Screen / Output Buffer */}
            <div
              data-testid="manus-terminal-screen"
              className="relative flex-1 overflow-y-auto bg-gray-950 p-3 font-mono text-xs text-gray-200 select-text"
            >
              {selectedProcess ? (
                <div className="space-y-1">
                  <div className="mb-2 text-[10px] text-gray-500">
                    # [manus-sandbox] Process: {selectedProcess.id} | Command: &quot;{selectedProcess.command}&quot; | Status: {selectedProcess.status}
                  </div>
                  {rawOutput ? (
                    <pre className="whitespace-pre-wrap break-all font-mono leading-relaxed text-emerald-400">
                      {rawOutput}
                    </pre>
                  ) : (
                    <div className="py-8 text-center text-gray-600">
                      (No output in buffer. Process running in background...)
                    </div>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                  <Terminal className="mb-2 h-8 w-8 text-gray-700" />
                  <p className="text-xs">No process selected.</p>
                  <p className="mt-1 text-[10px] text-gray-600">
                    Execute a command via Manus Agent loop to spawn a live terminal process.
                  </p>
                </div>
              )}
            </div>

            {/* Interactive Stdin Bar */}
            <form
              onSubmit={handleSendStdin}
              className="flex items-center gap-1.5 border-t border-border-light bg-surface-secondary/80 p-2"
            >
              <div className="flex h-7 items-center justify-center rounded px-2 font-mono text-[11px] text-text-tertiary bg-surface-tertiary">
                stdin $
              </div>
              <input
                type="text"
                data-testid="manus-stdin-input"
                disabled={!selectedProcessId || selectedProcess?.status !== 'running'}
                value={stdinInput}
                onChange={(e) => setStdinInput(e.target.value)}
                placeholder={
                  selectedProcess?.status === 'running'
                    ? 'Send interactive stdin to process...'
                    : 'Process not running'
                }
                className="flex-1 rounded border border-border-medium bg-surface-primary px-2.5 py-1 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
              />
              <button
                type="submit"
                data-testid="manus-stdin-submit"
                disabled={
                  !selectedProcessId ||
                  selectedProcess?.status !== 'running' ||
                  !stdinInput.trim() ||
                  sendStdinMutation.isLoading
                }
                className="flex h-7 items-center justify-center gap-1 rounded bg-purple-600 px-2.5 text-xs font-medium text-white shadow-2xs hover:bg-purple-700 disabled:opacity-50"
                title="Send Input"
              >
                <Send className="h-3 w-3" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* BROWSER & PORTS PREVIEW TAB */}
        {/* ======================================================== */}
        {activeTab === 'browser' && (
          <div className="flex h-full flex-col">
            {/* Port Navigation Bar */}
            <div className="flex items-center justify-between border-b border-border-light bg-surface-secondary/50 px-3 py-1.5 text-xs">
              <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-semibold uppercase text-text-tertiary">Ports:</span>
                {ports.map((p) => (
                  <button
                    key={p.port}
                    type="button"
                    onClick={() => setSelectedPortNum(p.port)}
                    className={cn(
                      'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-mono transition',
                      selectedPortNum === p.port
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'border-border-light bg-surface-primary text-text-secondary hover:bg-surface-hover',
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>:{p.port}</span>
                  </button>
                ))}

                {/* Expose Port Form */}
                <form onSubmit={handleExposePort} className="flex items-center gap-1 pl-1">
                  <input
                    type="number"
                    value={newPortInput}
                    onChange={(e) => setNewPortInput(e.target.value)}
                    placeholder="Port..."
                    className="w-14 rounded border border-border-medium bg-surface-primary px-1.5 py-0.5 text-[11px] font-mono focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex h-5 items-center justify-center rounded border border-border-medium bg-surface-primary px-1 text-[10px] text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    title="Expose Port"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-1">
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-6 w-6 items-center justify-center rounded text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
                    title="Open in new window"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => refetchPorts()}
                  className="flex h-6 w-6 items-center justify-center rounded text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
                  title="Refresh Ports"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* URL Display */}
            {previewUrl && (
              <div className="flex items-center gap-2 border-b border-border-light bg-surface-primary px-3 py-1 text-xs">
                <Globe className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="truncate font-mono text-[11px] text-text-secondary">{previewUrl}</span>
              </div>
            )}

            {/* Browser Preview Frame */}
            <div className="relative flex-1 bg-surface-secondary/30">
              {previewUrl ? (
                <iframe
                  title="Manus Live Browser Preview"
                  src={previewUrl}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  className="h-full w-full border-0 bg-white"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center text-text-tertiary">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-border-light bg-surface-tertiary text-text-tertiary">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-semibold text-text-primary">No Live Port Preview</h4>
                  <p className="mt-1 max-w-[260px] text-[11px] text-text-tertiary">
                    When Manus starts a development server or exposes a local port, the live web interface will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
});

export default ManusWorkspaceView;
