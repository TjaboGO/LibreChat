import { getAuthenticPrompt, hasPrompt, interpolatePrompt } from '../../apps/promptStore';
import { getAppDefinition } from '../../apps/appsRegistry';
import { MANUS_AGENT_PROMPT } from '../manusPrompt';

describe('Manus Autonomous Agent Prompt (Fas 37)', () => {
  it('contains all required structural sections and competencies', () => {
    expect(MANUS_AGENT_PROMPT).toContain('<identity>');
    expect(MANUS_AGENT_PROMPT).toContain('<core_competencies>');
    expect(MANUS_AGENT_PROMPT).toContain('<system_capabilities>');
    expect(MANUS_AGENT_PROMPT).toContain('<agent_loop>');
    expect(MANUS_AGENT_PROMPT).toContain('<process_and_terminal_discipline>');

    // Competencies and capabilities
    expect(MANUS_AGENT_PROMPT).toContain('Information gathering, fact-checking');
    expect(MANUS_AGENT_PROMPT).toContain('Linux sandbox environment with active internet');
    expect(MANUS_AGENT_PROMPT).toContain('Utilize your 31 discrete tools');
    expect(MANUS_AGENT_PROMPT).toContain('deploy_expose_port');
    expect(MANUS_AGENT_PROMPT).toContain('shell_write_to_process');

    // Agent loop steps
    expect(MANUS_AGENT_PROMPT).toContain('1. Analyze Events');
    expect(MANUS_AGENT_PROMPT).toContain('2. Select Tools');
    expect(MANUS_AGENT_PROMPT).toContain('3. Wait for Execution');
    expect(MANUS_AGENT_PROMPT).toContain('4. Iterate');
    expect(MANUS_AGENT_PROMPT).toContain('5. Submit Results');
    expect(MANUS_AGENT_PROMPT).toContain('6. Enter Standby');
  });

  it('contains expected placeholders and interpolates cleanly', () => {
    expect(MANUS_AGENT_PROMPT).toContain('{{CURRENT_DATE}}');
    expect(MANUS_AGENT_PROMPT).toContain('{{CURRENT_TIME}}');
    expect(MANUS_AGENT_PROMPT).toContain('{{WORKING_DIRECTORY}}');
    expect(MANUS_AGENT_PROMPT).toContain('{{CURRENT_OS}}');
    expect(MANUS_AGENT_PROMPT).toContain('{{KNOWLEDGE_CUTOFF}}');

    const interpolated = interpolatePrompt(MANUS_AGENT_PROMPT, {
      currentDate: '2026-10-26',
      currentTime: '15:45:00 UTC',
      workingDirectory: '/home/ubuntu/manus-project',
      currentOs: 'linux',
      knowledgeCutoff: 'March 2026',
    });

    expect(interpolated).not.toContain('{{CURRENT_DATE}}');
    expect(interpolated).not.toContain('{{CURRENT_TIME}}');
    expect(interpolated).not.toContain('{{WORKING_DIRECTORY}}');
    expect(interpolated).not.toContain('{{CURRENT_OS}}');
    expect(interpolated).not.toContain('{{KNOWLEDGE_CUTOFF}}');
    expect(interpolated).toContain('Today is 2026-10-26.');
    expect(interpolated).toContain('Current time: 15:45:00 UTC.');
    expect(interpolated).toContain('Working directory: /home/ubuntu/manus-project.');
    expect(interpolated).toContain('Environment: Linux sandbox on linux.');
  });

  it('resolves manus app and manus-agent prompt id correctly', () => {
    const app = getAppDefinition('manus');
    expect(app).toBeDefined();
    expect(app?.systemPromptId).toBe('manus-agent');
    expect(hasPrompt('manus')).toBe(true);
    expect(hasPrompt('manus-agent')).toBe(true);

    const byApp = getAuthenticPrompt('manus');
    const byId = getAuthenticPrompt('manus-agent');
    expect(byApp).toBe(byId);
    expect(byApp).toContain('You are Manus, an autonomous general-purpose AI agent');
    expect(byApp).toContain('31 discrete tools');
  });
});
