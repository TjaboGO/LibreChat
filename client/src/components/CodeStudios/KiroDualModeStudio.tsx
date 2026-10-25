import { useState, memo } from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ListTodo,
  FileCheck,
  ChevronRight,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { cn } from '~/utils';

export type KiroMode = 'spec' | 'vibe';

export interface KiroDualModeStudioProps {
  className?: string;
  defaultMode?: KiroMode;
  onSelectPrompt?: (prompt: string) => void;
}

export const KiroDualModeStudio = memo(function KiroDualModeStudio({
  className,
  defaultMode = 'spec',
  onSelectPrompt,
}: KiroDualModeStudioProps) {
  const [activeMode, setActiveMode] = useState<KiroMode>(defaultMode);

  const specChecklist = [
    { label: 'Architectural Invariants Defined', done: true },
    { label: 'Interface & Type Contracts Specified', done: true },
    { label: 'Isolated Test Case Created Before Implementation', done: false },
    { label: 'Zero Premature Execution / Speculative Code Check', done: true },
    { label: 'Absolute Minimal Code Invariant Enforced', done: false },
  ];

  const vibeTemplates = [
    {
      title: 'Modern React 19 Hero Section',
      desc: 'Bold typography, subtle glows, and responsive CTA buttons.',
      prompt: 'Scaffold a modern React 19 hero section using Tailwind CSS and Radix UI primitives.',
    },
    {
      title: 'Full-Stack Data Table with Filters',
      desc: 'Virtual scrolling, column sorting, and multi-field search.',
      prompt: 'Build a high-performance Data Table component with search, pagination, and multi-select.',
    },
    {
      title: 'Zod-Validated Form Wizard',
      desc: 'Multi-step onboarding form with instant field validation.',
      prompt: 'Create a 3-step form wizard validated with Zod schemas and accessible input components.',
    },
    {
      title: 'Analytics Dashboard Grid',
      desc: 'Metrics stat cards, XY chart placeholders, and period filters.',
      prompt: 'Generate an analytics dashboard layout with 4 stat cards and interactive time filters.',
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full bg-surface-primary text-text-primary border-l border-border-light text-sm select-none',
        className,
      )}
      data-testid="kiro-studio"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-surface-secondary/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-xs text-text-primary">
              <span>Kiro / Traycer</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                Dual-Mode Engine
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">Spec / Architecture vs. Vibe Prototyping</p>
          </div>
        </div>
      </div>

      {/* Mode Selector Switcher */}
      <div className="p-3 border-b border-border-light bg-surface-secondary/20">
        <div className="flex rounded-lg bg-surface-tertiary p-1 border border-border-light gap-1">
          <button
            onClick={() => setActiveMode('spec')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all',
              activeMode === 'spec'
                ? 'bg-surface-primary text-indigo-500 shadow-sm border border-indigo-500/30'
                : 'text-text-secondary hover:text-text-primary',
            )}
            data-testid="kiro-mode-spec-btn"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Spec Mode</span>
          </button>

          <button
            onClick={() => setActiveMode('vibe')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all',
              activeMode === 'vibe'
                ? 'bg-surface-primary text-emerald-500 shadow-sm border border-emerald-500/30'
                : 'text-text-secondary hover:text-text-primary',
            )}
            data-testid="kiro-mode-vibe-btn"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Vibe Mode</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeMode === 'spec' ? (
          <div className="space-y-4" data-testid="kiro-spec-content">
            {/* Spec Mode Invariants Card */}
            <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/20 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Spec Mode Active · Architectural Invariants</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Refuses speculative file writing. Enforces strict test-driven development, minimal diffs,
                and formal verification before any code generation.
              </p>
            </div>

            {/* Spec Verification Checklist */}
            <div className="p-3.5 bg-surface-secondary/30 border border-border-light rounded-lg space-y-2.5">
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
                Verification Checklist
              </span>
              <div className="space-y-1.5">
                {specChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {item.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-border-medium shrink-0" />
                    )}
                    <span className={cn(item.done ? 'text-text-primary' : 'text-text-secondary')}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spec Actions */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
                Spec Actions
              </span>
              <button
                onClick={() =>
                  onSelectPrompt?.(
                    'Analyze the current requirements and output a formal Specification Document with interface definitions and test criteria.',
                  )
                }
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary hover:bg-surface-tertiary border border-border-light text-xs font-medium text-text-primary transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-500" />
                  <span>Generate Architectural Specification</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              </button>

              <button
                onClick={() =>
                  onSelectPrompt?.(
                    'Create an isolated TDD unit test file verifying edge cases and boundary conditions before generating the implementation.',
                  )
                }
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary hover:bg-surface-tertiary border border-border-light text-xs font-medium text-text-primary transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-indigo-500" />
                  <span>Scaffold TDD Test Suite</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4" data-testid="kiro-vibe-content">
            {/* Vibe Mode Card */}
            <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 font-semibold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Vibe Mode Active · Rapid Prototyping</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Prioritizes creative flow, instant feedback, modern aesthetics, and fluid component scaffolding.
              </p>
            </div>

            {/* Quick Component Scaffolding Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
                Rapid Scaffolding Presets
              </span>
              <div className="space-y-2">
                {vibeTemplates.map((template, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectPrompt?.(template.prompt)}
                    className="p-3 bg-surface-secondary/40 hover:bg-surface-secondary border border-border-light hover:border-emerald-500/40 rounded-lg cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary group-hover:text-emerald-500 transition-colors">
                        {template.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-secondary group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <p className="text-xs text-text-secondary leading-snug">{template.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default KiroDualModeStudio;
