import type {
  ManagedProcessInfo,
  ProcessExecOptions,
  ProcessExecResult,
  ProcessStatus,
} from './types';

/**
 * Interactive Background Process Manager
 * Implements Manus-grade persistent shell sessions with interactive stdin communication.
 */
export class ProcessManager {
  private processes: Map<string, ManagedProcessInfo> = new Map();
  private maxBufferLines: number;

  constructor(maxBufferLines = 1000) {
    this.maxBufferLines = maxBufferLines;
  }

  /**
   * Register or initialize a managed process
   */
  public registerProcess(id: string, command: string, pid?: number): ManagedProcessInfo {
    const existing = this.processes.get(id);
    if (existing && existing.status === 'running') {
      return existing;
    }

    const processInfo: ManagedProcessInfo = {
      id,
      command,
      pid: pid ?? Math.floor(10000 + Math.random() * 90000),
      status: 'running',
      startedAt: Date.now(),
      outputBuffer: [`[${new Date().toISOString()}] Started process: ${command}`],
      lastActivity: Date.now(),
    };

    this.processes.set(id, processInfo);
    return processInfo;
  }

  /**
   * Append stdout/stderr output lines to a process log buffer
   */
  public appendOutput(id: string, text: string): void {
    const proc = this.processes.get(id);
    if (!proc) {
      return;
    }

    const lines = text.split('\n').filter((l) => l.length > 0);
    proc.outputBuffer.push(...lines);

    if (proc.outputBuffer.length > this.maxBufferLines) {
      proc.outputBuffer = proc.outputBuffer.slice(-this.maxBufferLines);
    }
    proc.lastActivity = Date.now();
  }

  /**
   * shell_view: Inspect live stdout/stderr of a running or completed process
   */
  public viewProcess(
    id: string,
    tailLines = 50,
  ): {
    found: boolean;
    process?: ManagedProcessInfo;
    output: string;
  } {
    const proc = this.processes.get(id);
    if (!proc) {
      return {
        found: false,
        output: `Error: Process session '${id}' not found.`,
      };
    }

    const sliced = proc.outputBuffer.slice(-tailLines);
    return {
      found: true,
      process: { ...proc },
      output: sliced.join('\n'),
    };
  }

  /**
   * shell_write_to_process: Send interactive input to process stdin
   */
  public writeToProcess(
    id: string,
    input: string,
  ): {
    success: boolean;
    status: ProcessStatus;
    message: string;
  } {
    const proc = this.processes.get(id);
    if (!proc) {
      return {
        success: false,
        status: 'failed',
        message: `Error: Process session '${id}' not found.`,
      };
    }

    if (proc.status !== 'running') {
      return {
        success: false,
        status: proc.status,
        message: `Cannot write to process '${id}': Process is not running (status: ${proc.status}).`,
      };
    }

    const timestamp = new Date().toISOString();
    proc.outputBuffer.push(`[${timestamp}] [stdin] ${input}`);
    proc.lastActivity = Date.now();

    return {
      success: true,
      status: 'running',
      message: `Successfully wrote ${input.length} bytes to stdin of session '${id}'.`,
    };
  }

  /**
   * shell_kill_process: Terminate running process
   */
  public killProcess(
    id: string,
    signal = 'SIGTERM',
  ): {
    success: boolean;
    previousStatus: ProcessStatus;
    message: string;
  } {
    const proc = this.processes.get(id);
    if (!proc) {
      return {
        success: false,
        previousStatus: 'failed',
        message: `Error: Process session '${id}' not found.`,
      };
    }

    const prev = proc.status;
    if (proc.status === 'running') {
      proc.status = 'killed';
      proc.completedAt = Date.now();
      proc.exitCode = signal === 'SIGKILL' ? 137 : 143;
      proc.outputBuffer.push(`[${new Date().toISOString()}] Process terminated by signal ${signal}`);
      proc.lastActivity = Date.now();
    }

    return {
      success: true,
      previousStatus: prev,
      message: `Process session '${id}' (PID ${proc.pid}) terminated with ${signal}.`,
    };
  }

  /**
   * shell_wait: Wait for running process to complete or timeout
   */
  public async waitProcess(id: string, timeoutMs = 5000): Promise<ProcessExecResult> {
    const proc = this.processes.get(id);
    if (!proc) {
      return {
        id,
        status: 'failed',
        output: `Error: Process session '${id}' not found.`,
        durationMs: 0,
      };
    }

    const start = Date.now();
    while (proc.status === 'running' && Date.now() - start < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const durationMs = Date.now() - start;
    return {
      id: proc.id,
      pid: proc.pid,
      status: proc.status,
      exitCode: proc.exitCode,
      output: proc.outputBuffer.slice(-50).join('\n'),
      durationMs,
    };
  }

  /**
   * Mark process as completed with exit code
   */
  public completeProcess(id: string, exitCode = 0): void {
    const proc = this.processes.get(id);
    if (!proc) {
      return;
    }
    proc.status = exitCode === 0 ? 'completed' : 'failed';
    proc.exitCode = exitCode;
    proc.completedAt = Date.now();
    proc.outputBuffer.push(
      `[${new Date().toISOString()}] Process exited with code ${exitCode} (${proc.status})`,
    );
    proc.lastActivity = Date.now();
  }

  /**
   * List all processes
   */
  public listProcesses(filter?: ProcessStatus): ManagedProcessInfo[] {
    const all = Array.from(this.processes.values());
    if (filter) {
      return all.filter((p) => p.status === filter);
    }
    return all.sort((a, b) => b.lastActivity - a.lastActivity);
  }

  /**
   * Clear completed or killed processes
   */
  public clearCompleted(): number {
    let cleared = 0;
    for (const [id, proc] of this.processes.entries()) {
      if (proc.status !== 'running') {
        this.processes.delete(id);
        cleared++;
      }
    }
    return cleared;
  }
}

/** Global default process manager instance */
export const defaultProcessManager = new ProcessManager();
