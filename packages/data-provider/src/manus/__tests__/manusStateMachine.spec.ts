import { ManusStateMachine } from '../manusStateMachine';

describe('Manus Agent State Machine', () => {
  let sm: ManusStateMachine;

  beforeEach(() => {
    sm = new ManusStateMachine(10);
  });

  it('starts in IDLE state and advances upon receiving a message event', () => {
    expect(sm.getState()).toBe('IDLE');
    sm.pushEvent('message', { text: 'Create a full stack app with Vite' });
    expect(sm.getState()).toBe('ANALYZE_EVENTS');
    expect(sm.getEventStream()).toHaveLength(1);
  });

  it('executes a step of tool selection and observation recording', () => {
    sm.pushEvent('message', { text: 'Start server' });
    sm.analyzeEvents();
    expect(sm.getState()).toBe('SELECT_TOOL');

    const selectRes = sm.selectTool('shell_exec', { id: 'srv', command: 'npm run dev' });
    expect(selectRes.nextState).toBe('WAIT_EXECUTION');
    expect(sm.getIteration()).toBe(1);

    const obsRes = sm.recordObservation('shell_exec', 'Vite v5 ready at http://localhost:5173');
    expect(obsRes.nextState).toBe('ITERATE');

    sm.iterate(true);
    expect(sm.getState()).toBe('ANALYZE_EVENTS');
  });

  it('enters STANDBY when idle tool is selected', () => {
    sm.pushEvent('message', { text: 'Finish' });
    sm.analyzeEvents();

    const res = sm.selectTool('idle', { summary: 'Completed all tasks' });
    expect(res.nextState).toBe('STANDBY');
    expect(sm.getState()).toBe('STANDBY');
  });

  it('synchronizes and parses todo.md checklist', () => {
    const todoMd = `
# Task Plan
- [x] 1. Inspect environment
- [ ] 2. Install dependencies
- [ ] 3. Expose port and verify
    `;

    const items = sm.syncTodoMd(todoMd);
    expect(items).toHaveLength(3);
    expect(items[0].completed).toBe(true);
    expect(items[0].text).toContain('Inspect environment');
    expect(items[1].completed).toBe(false);
    expect(items[2].completed).toBe(false);

    expect(sm.getTodoList()).toEqual(items);
  });
});
