import { useState, memo, useMemo } from 'react';
import {
  Heart,
  Zap,
  Database,
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Table,
  Check,
  Copy,
  Download,
  Play,
  Terminal,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '~/utils';

export type BuilderAppId = 'lovable' | 'bolt';
export type BuilderTab = 'preview' | 'supabase' | 'templates';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface SqlColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  defaultValue?: string;
  references?: string;
}

export interface RlsPolicy {
  name: string;
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  role: string;
  using: string;
  withCheck?: string;
}

export interface SupabaseTableDef {
  id: string;
  name: string;
  description: string;
  columns: SqlColumn[];
  policies: RlsPolicy[];
}

export interface StarterTemplate {
  id: string;
  title: string;
  description: string;
  badge: string;
  stack: string[];
  suggestedPrompt: string;
}

export const INITIAL_SUPABASE_TABLES: SupabaseTableDef[] = [
  {
    id: 'profiles',
    name: 'profiles',
    description: 'User profile records linked to Supabase auth.users',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, references: 'auth.users.id' },
      { name: 'email', type: 'text', isNullable: false },
      { name: 'full_name', type: 'text', isNullable: true },
      { name: 'avatar_url', type: 'text', isNullable: true },
      { name: 'role', type: 'text', defaultValue: "'member'" },
      { name: 'created_at', type: 'timestamp with time zone', defaultValue: 'now()' },
    ],
    policies: [
      {
        name: 'profiles_select_authenticated',
        command: 'SELECT',
        role: 'authenticated',
        using: 'true',
      },
      {
        name: 'profiles_update_own',
        command: 'UPDATE',
        role: 'authenticated',
        using: 'auth.uid() = id',
        withCheck: 'auth.uid() = id',
      },
    ],
  },
  {
    id: 'products',
    name: 'products',
    description: 'Product catalog with prices, stock, and Stripe SKU sync',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, defaultValue: 'gen_random_uuid()' },
      { name: 'name', type: 'text', isNullable: false },
      { name: 'description', type: 'text', isNullable: true },
      { name: 'price_cents', type: 'integer', isNullable: false },
      { name: 'stripe_price_id', type: 'text', isNullable: true },
      { name: 'is_active', type: 'boolean', defaultValue: 'true' },
      { name: 'created_at', type: 'timestamp with time zone', defaultValue: 'now()' },
    ],
    policies: [
      {
        name: 'products_select_public',
        command: 'SELECT',
        role: 'anon, authenticated',
        using: 'is_active = true',
      },
      {
        name: 'products_admin_modify',
        command: 'ALL',
        role: 'authenticated',
        using: "exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')",
      },
    ],
  },
  {
    id: 'messages',
    name: 'messages',
    description: 'Realtime chat channels with presence and typing indicators',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, defaultValue: 'gen_random_uuid()' },
      { name: 'channel_id', type: 'text', isNullable: false },
      { name: 'user_id', type: 'uuid', references: 'auth.users.id' },
      { name: 'content', type: 'text', isNullable: false },
      { name: 'created_at', type: 'timestamp with time zone', defaultValue: 'now()' },
    ],
    policies: [
      {
        name: 'messages_select_channel',
        command: 'SELECT',
        role: 'authenticated',
        using: 'true',
      },
      {
        name: 'messages_insert_own',
        command: 'INSERT',
        role: 'authenticated',
        using: 'auth.uid() = user_id',
        withCheck: 'auth.uid() = user_id',
      },
    ],
  },
];

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'saas-starter',
    title: 'SaaS Supabase Starter',
    description: 'Modern SaaS foundation with Supabase Auth, Row-Level Security, and Stripe subscriptions.',
    badge: 'Full-Stack Auth',
    stack: ['React 19', 'Vite', 'Tailwind CSS', 'Supabase Auth', 'Stripe'],
    suggestedPrompt:
      'Build a full-stack SaaS dashboard with Supabase email/password authentication, protected routes, team member invitations, and subscription billing via Stripe webhooks.',
  },
  {
    id: 'realtime-chat',
    title: 'Real-Time Chat & Collab',
    description: 'Multi-room team chat powered by Supabase Realtime broadcast channels and PostgreSQL presence.',
    badge: 'Real-Time Sync',
    stack: ['React 19', 'Vite', 'Supabase Realtime', 'PostgreSQL', 'Tailwind'],
    suggestedPrompt:
      'Create a modern Slack-like team chat application with live channels, typing indicators, read receipts, and Supabase Realtime postgres_changes listeners.',
  },
  {
    id: 'ecommerce-store',
    title: 'Modern E-Commerce Store',
    description: 'High-conversion product storefront with shopping cart, filterable catalog, and order checkout.',
    badge: 'E-Commerce',
    stack: ['React 19', 'Vite', 'PostgreSQL RLS', 'Stripe Checkout', 'Lucide'],
    suggestedPrompt:
      'Scaffold an e-commerce marketplace featuring product cards, instant category filtering, persistent cart drawer, and order confirmation linking to Supabase tables.',
  },
];

export const MOCK_MIGRATIONS: Record<string, string> = {
  profiles: `-- Migration: 20261026_create_profiles.sql
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'member',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using ( true );

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ( auth.uid() = id )
  with check ( auth.uid() = id );
`,
  products: `-- Migration: 20261026_create_products.sql
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null,
  stripe_price_id text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "products_select_public"
  on public.products for select
  to anon, authenticated
  using ( is_active = true );

create policy "products_admin_modify"
  on public.products for all
  to authenticated
  using ( exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin') );
`,
  messages: `-- Migration: 20261026_create_messages.sql
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id text not null,
  user_id uuid references auth.users on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "messages_select_channel"
  on public.messages for select
  to authenticated
  using ( true );

create policy "messages_insert_own"
  on public.messages for insert
  to authenticated
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- Enable Realtime publication
alter publication supabase_realtime add table public.messages;
`,
};

export interface FullStackStudioProps {
  appId?: BuilderAppId;
  onSelectPrompt?: (prompt: string) => void;
  defaultCollapsed?: boolean;
}

export const FullStackStudio = memo(function FullStackStudio({
  appId = 'lovable',
  onSelectPrompt,
  defaultCollapsed = false,
}: FullStackStudioProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<BuilderTab>('preview');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [selectedTableId, setSelectedTableId] = useState<string>('profiles');
  const [tables, setTables] = useState<SupabaseTableDef[]>(INITIAL_SUPABASE_TABLES);
  const [activePort, setActivePort] = useState<string>('5173');
  const [copiedMigration, setCopiedMigration] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);
  const [logs, setLogs] = useState<Array<{ id: string; time: string; text: string; level: 'info' | 'success' | 'warn' }>>([
    { id: '1', time: '00:01', text: '[Vite 6.0] Dev server started on http://localhost:5173', level: 'info' },
    { id: '2', time: '00:02', text: '[Supabase] Connected to PostgreSQL client (RLS active)', level: 'success' },
    { id: '3', time: '00:03', text: '[HMR] Hot module replacement connected and listening', level: 'info' },
  ]);

  const isLovable = appId === 'lovable';
  const appTitle = isLovable ? 'Lovable Studio' : 'Bolt.new';
  const appSubtitle = isLovable
    ? 'React 19 + Vite + Supabase PostgreSQL'
    : 'WebContainers + Vite Dev Server + Supabase';
  const accentColor = isLovable ? 'text-rose-400' : 'text-amber-400';
  const badgeColor = isLovable
    ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
    : 'bg-amber-500/10 text-amber-300 border-amber-500/20';

  const selectedTable = useMemo(() => {
    return tables.find((t) => t.id === selectedTableId) || tables[0];
  }, [tables, selectedTableId]);

  const activeMigrationSql = useMemo(() => {
    return MOCK_MIGRATIONS[selectedTableId] || `-- Migration for ${selectedTableId}`;
  }, [selectedTableId]);

  const handleCopyMigration = () => {
    navigator.clipboard.writeText(activeMigrationSql);
    setCopiedMigration(true);
    setTimeout(() => setCopiedMigration(false), 2000);
  };

  const handleRunMigration = () => {
    setMigrationStatus('Applying migration to Supabase PostgreSQL...');
    setTimeout(() => {
      setMigrationStatus('Migration applied successfully! RLS policies active.');
      setLogs((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          time: new Date().toLocaleTimeString().slice(0, 5),
          text: `[Supabase] Applied migration for "${selectedTable.name}" successfully`,
          level: 'success',
        },
      ]);
      setTimeout(() => setMigrationStatus(null), 3000);
    }, 600);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  if (isCollapsed) {
    const expandTestId = isLovable ? 'lovable-studio-expand-btn' : 'bolt-studio-expand-btn';
    const collapsedContainerTestId = isLovable ? 'lovable-studio-collapsed' : 'bolt-studio-collapsed';
    return (
      <div
        data-testid={collapsedContainerTestId}
        className="w-8 border-l border-border bg-card/60 backdrop-blur flex flex-col items-center py-4 select-none shrink-0"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          data-testid={expandTestId}
          title={`Expand ${appTitle}`}
          aria-label={`Expand ${appTitle}`}
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground hover:scale-105 transition"
        >
          <ChevronLeft className="w-4 h-4 text-primary" />
          {isLovable ? (
            <Heart className="w-4 h-4 text-rose-400" />
          ) : (
            <Zap className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-[11px] font-semibold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            {appTitle}
          </span>
        </button>
      </div>
    );
  }

  const collapseTestId = isLovable ? 'lovable-studio-collapse-btn' : 'bolt-studio-collapse-btn';

  return (
    <div
      data-testid="fullstack-studio-panel"
      className="w-[520px] xl:w-[600px] border-l border-border bg-card/90 backdrop-blur flex flex-col h-full shrink-0 select-none z-10 transition-all duration-200"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          {isLovable ? (
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Heart className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-tight text-foreground">{appTitle}</span>
              <span className={cn('text-[10px] px-1.5 py-0.2 rounded-full border font-medium', badgeColor)}>
                {isLovable ? 'Full-Stack' : 'WebContainers'}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">{appSubtitle}</p>
          </div>
        </div>

        {/* Studio View Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('preview')}
            data-testid="fullstack-tab-preview"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'preview'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            data-testid="fullstack-tab-supabase"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'supabase'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase SQL</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            data-testid="fullstack-tab-templates"
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition',
              activeTab === 'templates'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Templates</span>
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(true)}
          data-testid={collapseTestId}
          title={`Collapse ${appTitle}`}
          aria-label={`Collapse ${appTitle}`}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* TAB 1: LIVE SANDBOXED PREVIEW */}
        {activeTab === 'preview' && (
          <div data-testid="fullstack-preview-stage" className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Browser Navigation / Port Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/20 text-xs">
              <div className="flex items-center gap-1.5 flex-1 max-w-sm">
                <button
                  onClick={() => {
                    setLogs((prev) => [
                      ...prev,
                      {
                        id: String(Date.now()),
                        time: new Date().toLocaleTimeString().slice(0, 5),
                        text: '[Vite] Page refreshed manually',
                        level: 'info',
                      },
                    ]);
                  }}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
                  title="Reload Preview"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-1 flex-1 bg-background border border-border rounded px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  <span className="text-emerald-500 font-bold">http://</span>
                  <span className="text-foreground">localhost:{activePort}/</span>
                </div>
              </div>

              {/* Viewport & External Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 bg-muted/50 p-0.5 rounded border border-border">
                  <button
                    onClick={() => setViewport('desktop')}
                    className={cn(
                      'p-1 rounded transition',
                      viewport === 'desktop' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground',
                    )}
                    title="Desktop (100%)"
                  >
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setViewport('tablet')}
                    className={cn(
                      'p-1 rounded transition',
                      viewport === 'tablet' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground',
                    )}
                    title="Tablet (768px)"
                  >
                    <Tablet className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setViewport('mobile')}
                    className={cn(
                      'p-1 rounded transition',
                      viewport === 'mobile' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground',
                    )}
                    title="Mobile (375px)"
                  >
                    <Smartphone className="w-3 h-3" />
                  </button>
                </div>

                <select
                  value={activePort}
                  onChange={(e) => setActivePort(e.target.value)}
                  className="bg-background border border-border text-[11px] font-mono rounded px-1.5 py-0.5 text-foreground focus:outline-hidden"
                >
                  <option value="5173">:5173 (Vite)</option>
                  <option value="3000">:3000 (Next)</option>
                  <option value="8080">:8080 (Prod)</option>
                </select>
              </div>
            </div>

            {/* Sandbox Canvas */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-zinc-950/40">
              <div
                className={cn(
                  'h-full border border-border rounded-xl bg-card shadow-lg flex flex-col overflow-hidden transition-all duration-200',
                  viewport === 'desktop' && 'w-full',
                  viewport === 'tablet' && 'w-[420px] max-w-full',
                  viewport === 'mobile' && 'w-[320px] max-w-full',
                )}
              >
                {/* Mock Application Interface */}
                <div className="border-b border-border px-4 py-2.5 flex items-center justify-between bg-muted/20">
                  <div className="flex items-center gap-2">
                    {isLovable ? (
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    ) : (
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                    )}
                    <span className="font-bold text-xs">Full-Stack App</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                    Live HMR
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 space-y-4 overflow-y-auto">
                  <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">Supabase Connected Client</span>
                      <span className="text-[10px] font-mono text-muted-foreground">public_anon_key</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Connected to PostgreSQL schema with Row-Level Security active.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Active Table</span>
                      <div className="text-sm font-bold font-mono text-primary">{selectedTable.name}</div>
                      <span className="text-[10px] text-muted-foreground">{selectedTable.columns.length} columns</span>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">RLS Policies</span>
                      <div className="text-sm font-bold text-emerald-500">{selectedTable.policies.length} Active</div>
                      <span className="text-[10px] text-muted-foreground">Secured with auth.uid()</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                    <span className="text-xs font-semibold">Quick Actions</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setLogs((prev) => [
                            ...prev,
                            {
                              id: String(Date.now()),
                              time: new Date().toLocaleTimeString().slice(0, 5),
                              text: `[Supabase] SELECT * FROM ${selectedTable.name} LIMIT 10`,
                              level: 'info',
                            },
                          ]);
                        }}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition"
                      >
                        Query {selectedTable.name}
                      </button>
                      <button
                        onClick={handleRunMigration}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition"
                      >
                        Apply Schema
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Console Feed */}
            <div className="h-32 border-t border-border bg-zinc-950 flex flex-col shrink-0">
              <div className="flex items-center justify-between px-3 py-1 bg-zinc-900 border-b border-zinc-800 text-[10px]">
                <div className="flex items-center gap-1.5 text-zinc-400 font-mono">
                  <Terminal className="w-3 h-3 text-zinc-400" />
                  <span>DevServer Console ({logs.length})</span>
                </div>
                <button
                  onClick={handleClearLogs}
                  data-testid="fullstack-console-clear-btn"
                  className="text-zinc-500 hover:text-zinc-300 transition text-[10px]"
                >
                  Clear Logs
                </button>
              </div>
              <div className="flex-1 p-2 font-mono text-[11px] overflow-y-auto space-y-1 select-text">
                {logs.length === 0 ? (
                  <span className="text-zinc-600 italic">No console output</span>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 leading-tight">
                      <span className="text-zinc-600 select-none text-[10px]">{log.time}</span>
                      <span
                        className={cn(
                          log.level === 'info' && 'text-zinc-300',
                          log.level === 'success' && 'text-emerald-400',
                          log.level === 'warn' && 'text-amber-400',
                        )}
                      >
                        {log.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUPABASE SQL SCHEMA STUDIO */}
        {activeTab === 'supabase' && (
          <div data-testid="fullstack-supabase-stage" className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Table Selector & Migration Bar */}
            <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold">Table:</span>
                <select
                  data-testid="fullstack-table-select"
                  value={selectedTableId}
                  onChange={(e) => setSelectedTableId(e.target.value)}
                  className="bg-background border border-border text-xs rounded-md px-2 py-1 font-mono font-medium focus:outline-hidden"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMigration}
                  data-testid="fullstack-export-sql-btn"
                  className="px-2.5 py-1 rounded-md text-xs font-medium border border-border bg-background hover:bg-muted text-foreground flex items-center gap-1 transition"
                  title="Copy Migration SQL"
                >
                  {copiedMigration ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMigration ? 'Copied' : 'Copy SQL'}</span>
                </button>
                <button
                  onClick={handleRunMigration}
                  data-testid="fullstack-sql-runner-btn"
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1 transition shadow-xs"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Run Migration</span>
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {migrationStatus && (
              <div className="px-3 py-1.5 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{migrationStatus}</span>
              </div>
            )}

            {/* Split View: Columns & RLS Policies */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Columns Table */}
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="px-3 py-2 bg-muted/40 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold">Columns ({selectedTable.columns.length})</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{selectedTable.description}</span>
                </div>
                <div className="divide-y divide-border">
                  {selectedTable.columns.map((col) => (
                    <div key={col.name} className="px-3 py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{col.name}</span>
                        {col.isPrimary && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                            PK
                          </span>
                        )}
                        {col.references && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                            FK → {col.references}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                        <span>{col.type}</span>
                        {col.defaultValue && <span className="text-zinc-500">default: {col.defaultValue}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RLS Policies Panel */}
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="px-3 py-2 bg-muted/40 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold">Row-Level Security (RLS) Policies</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                    RLS ENABLED
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {selectedTable.policies.map((policy) => (
                    <div key={policy.name} className="p-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-primary">{policy.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono uppercase">
                            {policy.command}
                          </span>
                          <span className="text-[10px] text-muted-foreground">Role: {policy.role}</span>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono bg-zinc-950 p-2 rounded border border-zinc-800 text-emerald-400">
                        USING ({policy.using})
                        {policy.withCheck && <span className="text-zinc-400"> WITH CHECK ({policy.withCheck})</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Migration SQL Preview */}
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="px-3 py-2 bg-muted/40 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-semibold">Idempotent SQL Migration</span>
                  <span className="text-[10px] font-mono text-muted-foreground">PostgreSQL 15+</span>
                </div>
                <div className="p-3 bg-zinc-950 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed select-text">
                  <pre className="whitespace-pre">{activeMigrationSql}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STARTER TEMPLATES */}
        {activeTab === 'templates' && (
          <div
            data-testid="fullstack-templates-stage"
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-background"
          >
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isLovable ? 'Lovable Starters' : 'Bolt.new Presets'}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                One-click scaffolds combining responsive frontend views with Supabase schemas.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {STARTER_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="font-bold text-xs">{tmpl.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                      {tmpl.badge}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{tmpl.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {tmpl.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => onSelectPrompt?.(tmpl.suggestedPrompt)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center gap-1"
                    >
                      <span>Use Starter</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default FullStackStudio;
