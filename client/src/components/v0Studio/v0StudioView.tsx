import { useState, memo } from 'react';
import {
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Code,
  Eye,
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import v0AskUserQuestionsCard, { DEMO_V0_QUESTIONS } from './v0AskUserQuestionsCard';
import { cn } from '~/utils';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type v0StudioTab = 'preview' | 'questions' | 'code';

export interface ComponentPreset {
  id: string;
  name: string;
  badge: string;
  code: string;
}

export const V0_PRESETS: ComponentPreset[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Analytics',
    badge: 'shadcn/ui',
    code: `import React, { useState } from 'react';
import { Activity, ArrowUpRight, Users, CreditCard, DollarSign } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('30d');

  const stats = [
    { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign },
    { title: 'Subscriptions', value: '+2,350', change: '+180.1%', icon: Users },
    { title: 'Sales', value: '+12,234', change: '+19%', icon: CreditCard },
    { title: 'Active Now', value: '+573', change: '+201 since last hour', icon: Activity },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Overview</h2>
          <p className="text-xs text-zinc-400">Real-time metrics for your SaaS platform.</p>
        </div>
        <div className="flex rounded-lg bg-zinc-900 border border-zinc-800 p-1 text-xs">
          {['7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={"px-2.5 py-1 rounded-md font-medium transition " + (period === p ? "bg-zinc-800 text-white shadow-xs" : "text-zinc-400 hover:text-white")}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-medium">{s.title}</span>
                <Icon className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                <span>{s.change}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
  },
  {
    id: 'pricing',
    name: 'SaaS Pricing Cards',
    badge: 'Tailwind CSS',
    code: `import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    { name: 'Starter', price: annual ? 19 : 24, desc: 'For individuals and small experiments.' },
    { name: 'Pro', price: annual ? 49 : 59, popular: true, desc: 'For growing teams building production software.' },
    { name: 'Enterprise', price: annual ? 99 : 119, desc: 'Dedicated infra, SLAs, and unlimited seats.' },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6 flex flex-col items-center justify-center space-y-8 font-sans">
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight">Predictable Pricing</h2>
        <p className="text-xs text-zinc-400">Scale without surprises. Cancel or upgrade anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className={"p-6 rounded-2xl border flex flex-col justify-between space-y-6 " + (t.popular ? "bg-zinc-900 border-zinc-200 shadow-xl" : "bg-zinc-950 border-zinc-800")}
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">{t.name}</h3>
                {t.popular && <span className="px-2 py-0.5 text-[10px] rounded-full bg-white text-zinc-950 font-bold">Popular</span>}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">\${t.price}</span>
                <span className="text-xs text-zinc-400">/month</span>
              </div>
              <p className="mt-2 text-xs text-zinc-400">{t.desc}</p>
            </div>
            <button className={"w-full py-2 rounded-xl text-xs font-semibold transition " + (t.popular ? "bg-white text-zinc-950 hover:bg-zinc-100" : "bg-zinc-800 text-white hover:bg-zinc-700")}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
];

export interface v0StudioViewProps {
  className?: string;
  defaultCollapsed?: boolean;
  onSelectPrompt?: (prompt: string) => void;
}

export const v0StudioView = memo(function v0StudioView({
  className,
  defaultCollapsed = false,
  onSelectPrompt,
}: v0StudioViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<v0StudioTab>('preview');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('dashboard');
  const [copiedCode, setCopiedCode] = useState(false);

  const activePreset = V0_PRESETS.find((p) => p.id === selectedPresetId) || V0_PRESETS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activePreset.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (isCollapsed) {
    return (
      <div
        className={cn(
          'relative flex flex-col items-center justify-between py-4 px-1 bg-surface-primary border-l border-border-light h-full w-10 select-none z-10 transition-all duration-200',
          className,
        )}
        data-testid="v0-studio-collapsed"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          title="Expand v0 Studio"
          aria-label="Expand v0 Studio"
          data-testid="v0-studio-expand-btn"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-3 my-auto">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-800 text-zinc-100 font-mono font-bold text-xs border border-zinc-700">
            v0
          </div>
          <span
            className="text-[11px] font-semibold text-text-secondary tracking-widest uppercase"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            v0 Generative UI
          </span>
        </div>

        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          title="Open Preview"
          aria-label="Open Preview"
        >
          <Sparkles className="w-4 h-4 text-zinc-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex flex-col h-full w-[480px] md:w-[560px] lg:w-[620px] bg-surface-primary border-l border-border-light z-10 shadow-lg transition-all duration-200 shrink-0 overflow-hidden',
        className,
      )}
      data-testid="v0-studio-expanded"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-surface-secondary/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-800 text-zinc-100 font-mono font-bold text-xs border border-zinc-700">
            v0
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-xs text-text-primary">
              <span>v0 Studio</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
                shadcn/ui & React 19
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">Generative UI Multi-Viewport Runner</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-md hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors"
            title="Collapse v0 Studio"
            aria-label="Collapse v0 Studio"
            data-testid="v0-studio-collapse-btn"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs and Viewport Controls */}
      <div className="flex items-center justify-between border-b border-border-light bg-surface-secondary/30 px-3 py-1.5">
        {/* Main Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
              activeTab === 'preview'
                ? 'bg-surface-primary text-text-primary shadow-xs font-semibold'
                : 'text-text-secondary hover:text-text-primary',
            )}
            data-testid="v0-tab-preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Runner</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
              activeTab === 'questions'
                ? 'bg-surface-primary text-text-primary shadow-xs font-semibold'
                : 'text-text-secondary hover:text-text-primary',
            )}
            data-testid="v0-tab-questions"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>AskUserQuestions</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
              activeTab === 'code'
                ? 'bg-surface-primary text-text-primary shadow-xs font-semibold'
                : 'text-text-secondary hover:text-text-primary',
            )}
            data-testid="v0-tab-code"
          >
            <Code className="w-3.5 h-3.5" />
            <span>TSX Code</span>
          </button>
        </div>

        {/* Viewport Controls (Desktop, Tablet, Mobile) */}
        {activeTab === 'preview' && (
          <div className="flex items-center gap-1 bg-surface-tertiary p-0.5 rounded-lg border border-border-light text-xs">
            <button
              onClick={() => setViewport('desktop')}
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
                viewport === 'desktop'
                  ? 'bg-surface-primary text-text-primary shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-primary',
              )}
              title="Desktop (100% Fluid)"
              data-testid="v0-viewport-desktop"
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden sm:inline">Desktop</span>
            </button>

            <button
              onClick={() => setViewport('tablet')}
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
                viewport === 'tablet'
                  ? 'bg-surface-primary text-text-primary shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-primary',
              )}
              title="Tablet (768px)"
              data-testid="v0-viewport-tablet"
            >
              <Tablet className="w-3 h-3" />
              <span className="hidden sm:inline">Tablet</span>
            </button>

            <button
              onClick={() => setViewport('mobile')}
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
                viewport === 'mobile'
                  ? 'bg-surface-primary text-text-primary shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-primary',
              )}
              title="Mobile (375px)"
              data-testid="v0-viewport-mobile"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        )}
      </div>

      {/* Preset Selector Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-light bg-surface-secondary/20 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-text-secondary font-medium">Component Preset:</span>
          {V0_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] border transition-colors',
                preset.id === selectedPresetId
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-700 font-medium'
                  : 'border-border-light bg-surface-primary text-text-secondary hover:text-text-primary',
              )}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {activeTab === 'code' && (
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-text-primary transition-colors"
          >
            {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        )}
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-auto bg-zinc-950 p-3 flex flex-col items-center">
        {activeTab === 'preview' && (
          <div
            style={{
              width: viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px',
              maxWidth: '100%',
              height: '100%',
            }}
            className={cn(
              'h-full overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl transition-[width] duration-200',
              viewport !== 'desktop' && 'ring-1 ring-zinc-700',
            )}
            data-testid="v0-runner-stage"
          >
            {/* Live Rendered Component Representation */}
            <div className="w-full h-full p-4 text-zinc-100 font-sans space-y-4 select-text">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{activePreset.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {activePreset.badge}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {viewport === 'desktop' ? '100% Fluid' : viewport === 'tablet' ? '768px' : '375px'}
                </span>
              </div>

              {/* Dynamic Mock View based on selected preset */}
              {selectedPresetId === 'dashboard' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                      <span className="text-[11px] text-zinc-400 font-medium">Total Revenue</span>
                      <div className="text-xl font-bold">$45,231.89</div>
                      <span className="text-[10px] text-emerald-400 font-medium">+20.1% vs last month</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                      <span className="text-[11px] text-zinc-400 font-medium">Active Users</span>
                      <div className="text-xl font-bold">+2,350</div>
                      <span className="text-[10px] text-emerald-400 font-medium">+180 new today</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                    <span className="text-xs font-semibold text-zinc-300">Live Activity Feed</span>
                    <div className="space-y-1.5 text-xs text-zinc-400 font-mono text-[11px]">
                      <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                        <span>Invoice #1042 paid by Acme Corp</span>
                        <span className="text-emerald-400">+$1,200.00</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                        <span>New Team Member added (Sarah K.)</span>
                        <span className="text-zinc-500">2m ago</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span>API Keys generated for Production</span>
                        <span className="text-zinc-500">14m ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Starter ($19/mo)', 'Pro ($49/mo)', 'Enterprise ($99/mo)'].map((tier, idx) => (
                    <div
                      key={tier}
                      className={cn(
                        'p-4 rounded-xl border flex flex-col justify-between space-y-3',
                        idx === 1
                          ? 'bg-zinc-900 border-zinc-200 shadow-lg'
                          : 'bg-zinc-950 border-zinc-800',
                      )}
                    >
                      <span className="font-bold text-xs">{tier}</span>
                      <p className="text-[11px] text-zinc-400">
                        Full access to all AI components with unlimited requests.
                      </p>
                      <button
                        className={cn(
                          'w-full py-1.5 rounded-lg text-xs font-semibold',
                          idx === 1
                            ? 'bg-white text-zinc-950 hover:bg-zinc-200'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700',
                        )}
                      >
                        Choose Plan
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="w-full max-w-xl h-full overflow-y-auto" data-testid="v0-questions-stage">
            <v0AskUserQuestionsCard
              onSubmitAnswers={(answers) => {
                onSelectPrompt?.(
                  `Here are my answers to the clarification questions:\n${JSON.stringify(answers, null, 2)}`,
                );
              }}
            />
          </div>
        )}

        {activeTab === 'code' && (
          <div
            className="w-full h-full p-3 font-mono text-[11px] bg-zinc-950 text-zinc-200 rounded-lg overflow-auto border border-zinc-800 leading-relaxed select-text"
            data-testid="v0-code-stage"
          >
            <pre className="whitespace-pre">{activePreset.code}</pre>
          </div>
        )}
      </div>
    </div>
  );
});

export default v0StudioView;
