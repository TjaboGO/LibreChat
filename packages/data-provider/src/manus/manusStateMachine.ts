import type {
  ManusAgentState,
  ManusEvent,
  ManusEventType,
  ManusStateTransition,
  ManusToolName,
} from './types';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Manus Agent State Machine & Event Stream Protocol
 * Drives autonomous step-by-step task completion through an event-driven loop.
 */
export class ManusStateMachine {
  private currentState: ManusAgentState = 'IDLE';
  private eventStream: ManusEvent[] = [];
  private history: ManusStateTransition[] = [];
  private currentIteration = 0;
  private maxIterations: number;
  private todoList: TodoItem[] = [];

  constructor(maxIterations = 50) {
    this.maxIterations = maxIterations;
  }

  public getState(): ManusAgentState {
    return this.currentState;
  }

  public getIteration(): number {
    return this.currentIteration;
  }

  public getEventStream(): ManusEvent[] {
    return [...this.eventStream];
  }

  public getTransitions(): ManusStateTransition[] {
    return [...this.history];
  }

  public getTodoList(): TodoItem[] {
    return [...this.todoList];
  }

  /**
   * Append an event to the chronological event stream
   */
  public pushEvent(type: ManusEventType, data: Record<string, unknown>, summary?: string): ManusEvent {
    const event: ManusEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      timestamp: Date.now(),
      data,
      summary,
    };
    this.eventStream.push(event);

    // Auto-advance from IDLE upon receiving a message
    if (this.currentState === 'IDLE' && type === 'message') {
      this.transitionTo('ANALYZE_EVENTS', 'New user message arrived');
    }

    return event;
  }

  /**
   * Transition state with audit history
   */
  public transitionTo(nextState: ManusAgentState, reason?: string): ManusStateTransition {
    const transition: ManusStateTransition = {
      from: this.currentState,
      to: nextState,
      reason,
      timestamp: Date.now(),
      iteration: this.currentIteration,
    };

    this.history.push(transition);
    this.currentState = nextState;
    return transition;
  }

  /**
   * Step 1: Analyze Events & Task State
   */
  public analyzeEvents(): {
    state: ManusAgentState;
    eventCount: number;
    latestUserMessage?: Record<string, unknown>;
  } {
    if (this.currentState !== 'ANALYZE_EVENTS') {
      this.transitionTo('ANALYZE_EVENTS', 'Analyzing event stream');
    }

    const userMessages = this.eventStream.filter((e) => e.type === 'message');
    const latest = userMessages[userMessages.length - 1];

    this.transitionTo('SELECT_TOOL', 'Ready for tool selection');
    return {
      state: this.currentState,
      eventCount: this.eventStream.length,
      latestUserMessage: latest?.data,
    };
  }

  /**
   * Step 2: Select Tool (Enforces strictly 1 tool call per iteration)
   */
  public selectTool(
    toolName: ManusToolName,
    toolArgs: Record<string, unknown>,
  ): {
    actionEvent: ManusEvent;
    nextState: ManusAgentState;
  } {
    this.currentIteration++;
    if (this.currentIteration > this.maxIterations) {
      this.transitionTo('SUBMIT_RESULTS', 'Max iterations exceeded, concluding');
      throw new Error(`Max iterations (${this.maxIterations}) exceeded in Manus Agent loop.`);
    }

    const actionEvent = this.pushEvent('action', {
      tool: toolName,
      parameters: toolArgs,
      iteration: this.currentIteration,
    }, `Executing ${toolName}`);

    if (toolName === 'idle') {
      this.transitionTo('STANDBY', 'Agent completed all tasks and called idle()');
    } else {
      this.transitionTo('WAIT_EXECUTION', `Waiting for ${toolName} execution`);
    }

    return {
      actionEvent,
      nextState: this.currentState,
    };
  }

  /**
   * Step 3: Record Observation from tool execution
   */
  public recordObservation(
    toolName: string,
    result: unknown,
    success = true,
  ): {
    observationEvent: ManusEvent;
    nextState: ManusAgentState;
  } {
    const observationEvent = this.pushEvent('observation', {
      tool: toolName,
      success,
      result,
      iteration: this.currentIteration,
    }, `Observation for ${toolName}`);

    this.transitionTo('ITERATE', 'Observation received, deciding next step');
    return {
      observationEvent,
      nextState: this.currentState,
    };
  }

  /**
   * Step 4: Iterate or submit
   */
  public iterate(hasMoreTasks = true): ManusAgentState {
    if (hasMoreTasks) {
      this.transitionTo('ANALYZE_EVENTS', 'Proceeding to next step in task plan');
    } else {
      this.transitionTo('SUBMIT_RESULTS', 'All planned tasks finished, submitting final response');
    }
    return this.currentState;
  }

  /**
   * Synchronize todo.md checklist
   */
  public syncTodoMd(todoContent: string): TodoItem[] {
    const lines = todoContent.split('\n');
    const items: TodoItem[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = /^-\s*\[([ xX])\]\s*(.+)$/.exec(line);
      if (match) {
        items.push({
          id: `todo-${i + 1}`,
          completed: match[1].toLowerCase() === 'x',
          text: match[2].trim(),
        });
      }
    }

    this.todoList = items;
    this.pushEvent('plan', { todoCount: items.length, items }, 'Synchronized todo.md');
    return this.todoList;
  }

  /**
   * Reset machine for new conversation or session
   */
  public reset(): void {
    this.currentState = 'IDLE';
    this.eventStream = [];
    this.history = [];
    this.currentIteration = 0;
    this.todoList = [];
  }
}
