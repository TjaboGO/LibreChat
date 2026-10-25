import { ProcessManager } from '../processManager';

describe('Manus ProcessManager', () => {
  let pm: ProcessManager;

  beforeEach(() => {
    pm = new ProcessManager();
  });

  it('registers and tracks a new managed process', () => {
    const proc = pm.registerProcess('dev-server', 'npm run dev', 12345);
    expect(proc.id).toBe('dev-server');
    expect(proc.command).toBe('npm run dev');
    expect(proc.pid).toBe(12345);
    expect(proc.status).toBe('running');
    expect(pm.listProcesses()).toHaveLength(1);
  });

  it('appends output and allows inspecting tail lines via shell_view', () => {
    pm.registerProcess('build-task', 'npm run build');
    pm.appendOutput('build-task', 'Compiling modules...\nGenerating bundles...\nBuild finished in 1.2s');

    const viewResult = pm.viewProcess('build-task', 2);
    expect(viewResult.found).toBe(true);
    expect(viewResult.output).toContain('Generating bundles...');
    expect(viewResult.output).toContain('Build finished in 1.2s');
  });

  it('allows interactive stdin writing via shell_write_to_process', () => {
    pm.registerProcess('cli-prompt', 'npx create-app');
    const writeRes = pm.writeToProcess('cli-prompt', 'my-cool-project\n');

    expect(writeRes.success).toBe(true);
    expect(writeRes.status).toBe('running');

    const view = pm.viewProcess('cli-prompt');
    expect(view.output).toContain('[stdin] my-cool-project\n');
  });

  it('fails to write stdin if process is not running', () => {
    pm.registerProcess('dead-proc', 'exit 0');
    pm.completeProcess('dead-proc', 0);

    const writeRes = pm.writeToProcess('dead-proc', 'hello');
    expect(writeRes.success).toBe(false);
    expect(writeRes.status).toBe('completed');
  });

  it('terminates running process via shell_kill_process', () => {
    pm.registerProcess('hanging-server', 'python -m http.server 8080', 54321);
    const killRes = pm.killProcess('hanging-server', 'SIGTERM');

    expect(killRes.success).toBe(true);
    expect(killRes.previousStatus).toBe('running');

    const view = pm.viewProcess('hanging-server');
    expect(view.process?.status).toBe('killed');
    expect(view.process?.exitCode).toBe(143);
  });

  it('filters processes by status and clears completed processes', () => {
    pm.registerProcess('p1', 'cmd1');
    pm.registerProcess('p2', 'cmd2');
    pm.completeProcess('p1', 0);

    expect(pm.listProcesses('running')).toHaveLength(1);
    expect(pm.listProcesses('completed')).toHaveLength(1);

    const cleared = pm.clearCompleted();
    expect(cleared).toBe(1);
    expect(pm.listProcesses()).toHaveLength(1);
  });
});
