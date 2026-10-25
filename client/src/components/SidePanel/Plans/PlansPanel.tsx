/* eslint-disable i18next/no-literal-string */
import React, { useMemo, useState } from 'react';
import { Button } from '@librechat/client';
import { useParams } from 'react-router-dom';
import { parsePlanChecklist, type PlanStepItem, ContentTypes } from 'librechat-data-provider';
import {
  ListTodo,
  CheckCircle2,
  Circle,
  Loader2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Workflow,
  Terminal,
  Play,
  Check,
  Cpu,
} from 'lucide-react';
import {
  useGetMessagesByConvoId,
  useCoworkTasksQuery,
  useCreateCoworkTaskMutation,
} from '~/data-provider';
import ExecutionWorkflow, { type WorkflowNode } from './ExecutionWorkflow';
import ProcessManagerView from './ProcessManagerView';
import ExecutionLog from './ExecutionLog';
import { cn } from '~/utils';

export default function PlansPanel() {
  const { conversationId } = useParams();
  const { data: messages = [] } = useGetMessagesByConvoId(conversationId ?? '');
  const { data: coworkData } = useCoworkTasksQuery();
  const createTaskMutation = useCreateCoworkTaskMutation();

  const [activeTab, setActiveTab] = useState<'plan' | 'workflow' | 'processes' | 'logs'>('plan');
  const [toggledSteps, setToggledSteps] = useState<Record<string, boolean>>({});
  const [completedOpen, setCompletedOpen] = useState(true);
  const [pendingOpen, setPendingOpen] = useState(true);
  const [triggerSuccess, setTriggerSuccess] = useState(false);

  // Find active cowork tasks for this conversation
  const activeTask = useMemo(() => {
    if (!coworkData?.tasks || !conversationId) {
      return undefined;
    }
    return coworkData.tasks.find(
      (t) =>
        t.conversationId === conversationId && (t.status === 'running' || t.status === 'queued'),
    );
  }, [coworkData, conversationId]);

  // Extract latest plan from conversation messages
  const extractedPlan = useMemo(() => {
    if (!messages || messages.length === 0) {
      return null;
    }

    // Traverse in reverse order to find the latest assistant plan
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.sender === 'User') {
        continue;
      }
      const text = msg.text || '';
      const parsed = parsePlanChecklist(text);
      if (parsed.hasPlan) {
        return parsed;
      }
    }
    return null;
  }, [messages]);

  // Combine extracted plan with local toggle overrides
  const { completedSteps, pendingSteps, totalCount, completedCount } = useMemo(() => {
    if (!extractedPlan) {
      return {
        completedSteps: [] as PlanStepItem[],
        pendingSteps: [] as PlanStepItem[],
        totalCount: 0,
        completedCount: 0,
      };
    }

    const all = [...extractedPlan.completedSteps, ...extractedPlan.pendingSteps];
    const completed: PlanStepItem[] = [];
    const pending: PlanStepItem[] = [];

    for (const step of all) {
      const isDone = toggledSteps[step.id] !== undefined ? toggledSteps[step.id] : step.completed;
      const updatedStep: PlanStepItem = {
        ...step,
        completed: isDone,
        category: isDone ? 'completed' : 'pending',
      };
      if (isDone) {
        completed.push(updatedStep);
      } else {
        pending.push(updatedStep);
      }
    }

    return {
      completedSteps: completed,
      pendingSteps: pending,
      totalCount: all.length,
      completedCount: completed.length,
    };
  }, [extractedPlan, toggledSteps]);

  // Extract execution nodes and detailed tool calls for Make.com visual workflow
  const { workflowNodes } = useMemo(() => {
    const nodes: WorkflowNode[] = [];

    // 1. Initial Trigger Node
    const firstUserMsg = messages.find((m) => m.sender === 'User');
    const triggerTitle =
      activeTask?.type === 'scheduled' ? 'Trigger: Scheduled Cron' : 'Trigger: User Prompt';
    const triggerSubtitle = firstUserMsg?.text
      ? firstUserMsg.text.slice(0, 60) + (firstUserMsg.text.length > 60 ? '...' : '')
      : 'Incoming request trigger';

    nodes.push({
      id: 'node-trigger',
      type: 'trigger',
      title: triggerTitle,
      subtitle: triggerSubtitle,
      iconType: 'zap',
      status: 'completed',
      durationMs: 12,
      inputPayload: firstUserMsg?.text || 'Trigger event fired',
    });

    // 2. Decision Engine Node
    nodes.push({
      id: 'node-decision',
      type: 'decision',
      title: 'Decision Engine: Tool Routing & Strategy',
      subtitle: 'Claude 3.7 Thinking / Multi-Step Planner',
      iconType: 'cpu',
      status: 'completed',
      durationMs: 840,
      inputPayload: {
        strategy: 'Analyze request, synthesize plan and dispatch deterministic tool calls',
      },
    });

    // 3. Extract dynamic tool calls from assistant messages
    let toolIndex = 1;
    for (const msg of messages) {
      if (msg.sender === 'User') {
        continue;
      }

      const parts = Array.isArray(msg.content) ? msg.content : [];
      for (const part of parts) {
        if (!part) {
          continue;
        }
        const isToolCall = part.type === ContentTypes.TOOL_CALL;
        if (!isToolCall) {
          continue;
        }

        const toolCall = (part as any)[ContentTypes.TOOL_CALL] || (part as any).tool_call;
        if (!toolCall) {
          continue;
        }

        const name: string = toolCall.name || `Tool Step ${toolIndex}`;
        const lowerName = name.toLowerCase();

        let iconType: WorkflowNode['iconType'] = 'cpu';
        if (
          lowerName.includes('search') ||
          lowerName.includes('tavily') ||
          lowerName.includes('perplexity')
        ) {
          iconType = 'search';
        } else if (
          lowerName.includes('browser') ||
          lowerName.includes('playwright') ||
          lowerName.includes('navigate')
        ) {
          iconType = 'globe';
        } else if (lowerName.includes('code') || lowerName.includes('artifact')) {
          iconType = 'code';
        } else if (
          lowerName.includes('bash') ||
          lowerName.includes('terminal') ||
          lowerName.includes('exec')
        ) {
          iconType = 'terminal';
        } else if (
          lowerName.includes('database') ||
          lowerName.includes('sql') ||
          lowerName.includes('mongo')
        ) {
          iconType = 'database';
        }

        const runStatus = toolCall.runStepStatus;
        let nodeStatus: WorkflowNode['status'] = 'completed';
        if (runStatus === 'in_progress') {
          nodeStatus = 'running';
        } else if (runStatus === 'failed') {
          nodeStatus = 'failed';
        }

        nodes.push({
          id: `node-tool-${toolIndex}`,
          type: 'action',
          title: `Action: ${name}`,
          subtitle: `Executed via MCP/Tool protocol`,
          iconType,
          status: nodeStatus,
          durationMs: toolCall.runStepDurationMs ?? 210,
          inputPayload: toolCall.args,
          outputPayload:
            typeof toolCall.output === 'string'
              ? toolCall.output
              : JSON.stringify(toolCall.output ?? ''),
        });

        toolIndex++;
      }
    }

    // 4. Terminal Output Node
    nodes.push({
      id: 'node-output',
      type: 'output',
      title: 'Output: Stream & Artifact Delivery',
      subtitle: activeTask ? 'Execution in progress...' : 'Response delivered and state synced',
      iconType: 'check',
      status: activeTask ? 'running' : 'completed',
      durationMs: 45,
    });

    return { workflowNodes: nodes };
  }, [messages, activeTask]);

  const toggleStep = (stepId: string, currentStatus: boolean) => {
    setToggledSteps((prev) => ({
      ...prev,
      [stepId]: !currentStatus,
    }));
  };

  const handleTriggerRun = () => {
    if (!conversationId) {
      return;
    }
    createTaskMutation.mutate(
      {
        title: extractedPlan?.summary
          ? `Automation: ${extractedPlan.summary.slice(0, 30)}`
          : 'Manual Cowork Run',
        type: 'task',
        conversationId,
      },
      {
        onSuccess: () => {
          setTriggerSuccess(true);
          setTimeout(() => setTriggerSuccess(false), 2500);
        },
      },
    );
  };

  let triggerButtonContent: React.ReactNode = (
    <>
      <Play className="h-3 w-3 fill-current" />
      <span>Run Now</span>
    </>
  );
  if (triggerSuccess) {
    triggerButtonContent = (
      <>
        <Check className="h-3 w-3 text-emerald-500" />
        <span className="text-emerald-500">Triggered!</span>
      </>
    );
  } else if (createTaskMutation.isLoading) {
    triggerButtonContent = (
      <>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Starting...</span>
      </>
    );
  }

  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden p-4 text-text-primary"
      data-testid="plans-panel"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-border-light pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-tertiary text-text-primary">
            <ListTodo className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Plans & Execution</h2>
            <p className="text-xs text-text-secondary">Agent progress & task tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTask ? (
            <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              Active run
            </span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={createTaskMutation.isLoading}
              onClick={handleTriggerRun}
              className="h-7 gap-1 px-2 text-xs font-normal text-text-secondary hover:text-text-primary"
              title="Trigger immediate automation run"
            >
              {triggerButtonContent}
            </Button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation: Plan / Workflow / Logs */}
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-border-light bg-surface-secondary/50 p-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('plan')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-colors',
            activeTab === 'plan'
              ? 'shadow-xs bg-surface-primary text-text-primary'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          <ListTodo className="h-3.5 w-3.5" />
          <span>Plan</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('workflow')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-colors',
            activeTab === 'workflow'
              ? 'shadow-xs bg-surface-primary text-text-primary'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          <Workflow className="h-3.5 w-3.5" />
          <span>Workflow</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('processes')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-colors',
            activeTab === 'processes'
              ? 'shadow-xs bg-surface-primary text-text-primary'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Processes</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-colors',
            activeTab === 'logs'
              ? 'shadow-xs bg-surface-primary text-text-primary'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Logs</span>
        </button>
      </div>

      {/* Active Background Task Card */}
      {activeTask && (
        <div className="mb-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs">
          <div className="flex items-center gap-2 font-medium text-blue-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Cowork Task: {activeTask.title || 'Running job'}</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-text-tertiary">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Status: {activeTask.status}
            </span>
            {activeTask.timeAgo && <span>Started: {activeTask.timeAgo}</span>}
          </div>
        </div>
      )}

      {/* TAB 1: Plan Checklist */}
      {activeTab === 'plan' &&
        (extractedPlan && totalCount > 0 ? (
          <div className="flex flex-col gap-4">
            {/* Progress Overview Bar */}
            <div className="rounded-lg border border-border-light bg-surface-secondary p-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span>Progress</span>
                <span>
                  {completedCount} of {totalCount} completed ({percentCompleted}%)
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-tertiary">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${percentCompleted}%` }}
                />
              </div>
              {extractedPlan.summary && (
                <p className="mt-2 text-xs italic text-text-secondary">
                  &ldquo;{extractedPlan.summary}&rdquo;
                </p>
              )}
            </div>

            {/* Completed Steps (Gjort och testat lokalt) */}
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setCompletedOpen(!completedOpen)}
                className="flex items-center justify-between text-xs font-semibold text-text-secondary hover:text-text-primary"
              >
                <div className="flex items-center gap-1.5">
                  {completedOpen ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  <span>Gjort och testat lokalt</span>
                </div>
                <span className="rounded bg-surface-tertiary px-1.5 py-0.5 text-[10px] text-text-tertiary">
                  {completedSteps.length}
                </span>
              </button>

              {completedOpen && (
                <div className="flex flex-col gap-1 pl-1">
                  {completedSteps.length === 0 ? (
                    <p className="py-1 text-xs text-text-tertiary">No steps completed yet</p>
                  ) : (
                    completedSteps.map((step) => (
                      <div
                        key={step.id}
                        onClick={() => toggleStep(step.id, true)}
                        className="group flex cursor-pointer items-start gap-2 rounded-md p-1.5 text-xs transition-colors hover:bg-surface-secondary"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                        <div className="flex-1 leading-snug">
                          <span className="font-medium text-text-primary">{step.title}</span>
                          {step.description && (
                            <p className="mt-0.5 text-[11px] text-text-secondary">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Pending Steps (Kvar att göra) */}
            <div className="flex flex-col gap-1.5 border-t border-border-light pt-3">
              <button
                type="button"
                onClick={() => setPendingOpen(!pendingOpen)}
                className="flex items-center justify-between text-xs font-semibold text-text-secondary hover:text-text-primary"
              >
                <div className="flex items-center gap-1.5">
                  {pendingOpen ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  <span>Kvar att göra</span>
                </div>
                <span className="rounded bg-surface-tertiary px-1.5 py-0.5 text-[10px] text-text-tertiary">
                  {pendingSteps.length}
                </span>
              </button>

              {pendingOpen && (
                <div className="flex flex-col gap-1 pl-1">
                  {pendingSteps.length === 0 ? (
                    <div className="flex items-center gap-1.5 py-2 text-xs text-green-500">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>All planned steps finished!</span>
                    </div>
                  ) : (
                    pendingSteps.map((step, idx) => {
                      const isCurrent = idx === 0 && Boolean(activeTask);
                      return (
                        <div
                          key={step.id}
                          onClick={() => toggleStep(step.id, false)}
                          className={cn(
                            'group flex cursor-pointer items-start gap-2 rounded-md p-1.5 text-xs transition-colors hover:bg-surface-secondary',
                            isCurrent && 'border border-blue-500/30 bg-blue-500/5',
                          )}
                        >
                          {isCurrent ? (
                            <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-blue-500" />
                          ) : (
                            <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-tertiary group-hover:text-text-primary" />
                          )}
                          <div className="flex-1 leading-snug">
                            <span
                              className={cn(
                                'font-medium',
                                isCurrent ? 'text-blue-500' : 'text-text-primary',
                              )}
                            >
                              {step.title}
                            </span>
                            {step.description && (
                              <p className="mt-0.5 text-[11px] text-text-secondary">
                                {step.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary text-text-tertiary">
              <ListTodo className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-medium text-text-primary">
              No active plan in this conversation
            </h3>
            <p className="mt-1 text-xs text-text-secondary">
              When Claude organizes multi-step tasks or runs Cowork/MRP loops, your plan checklist
              will appear here live.
            </p>
            <div className="mt-4 rounded-md border border-border-light bg-surface-secondary p-2.5 text-left text-xs text-text-secondary">
              <p className="font-medium text-text-primary">How to create a plan:</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-[11px]">
                <li>
                  Type <span className="font-mono text-text-primary">/plan</span> in the prompt box
                </li>
                <li>Ask Claude to organize multi-step work</li>
                <li>Launch a background Cowork or Browser task</li>
              </ul>
            </div>
          </div>
        ))}

      {/* TAB 2: Make.com Style Visual Workflow */}
      {activeTab === 'workflow' && (
        <ExecutionWorkflow nodes={workflowNodes} activeTaskTitle={activeTask?.title} />
      )}

      {/* TAB 3: Interactive Process Management & Network Hub */}
      {activeTab === 'processes' && <ProcessManagerView />}

      {/* TAB 4: Execution Determinism Logs */}
      {activeTab === 'logs' && <ExecutionLog nodes={workflowNodes} />}
    </div>
  );
}
