import {
  resolveAppId,
  dispatchAppPrompt,
  applyAppScopeToAgent,
  assembleOpenRouterPayload,
  filterSystemPromptFromMessages,
  isSystemPromptIsolated,
} from './appDispatcher';

describe('Backend Hidden Prompt Dispatcher & OpenRouter Payload Assembler (Fas 29)', () => {
  describe('resolveAppId', () => {
    it('defaults to "chat" when request or body is empty or null', () => {
      expect(resolveAppId(null)).toBe('chat');
      expect(resolveAppId(undefined)).toBe('chat');
      expect(resolveAppId({})).toBe('chat');
      expect(resolveAppId({ body: {} })).toBe('chat');
    });

    it('resolves appId from req.body.appId', () => {
      expect(resolveAppId({ body: { appId: 'manus' } })).toBe('manus');
      expect(resolveAppId({ body: { appId: 'v0' } })).toBe('v0');
      expect(resolveAppId({ body: { appId: 'perplexity' } })).toBe('perplexity');
    });

    it('resolves appId from req.body.endpointOption.appId', () => {
      expect(resolveAppId({ body: { endpointOption: { appId: 'cursor' } } })).toBe('cursor');
    });

    it('resolves appId from req.resolvedConversation.appId', () => {
      expect(resolveAppId({ resolvedConversation: { appId: 'devin' } })).toBe('devin');
    });

    it('normalizes uppercase strings and whitespace', () => {
      expect(resolveAppId({ body: { appId: '  MANUS  ' } })).toBe('manus');
      expect(resolveAppId({ body: { appId: 'OFFICE' } })).toBe('office');
    });

    it('falls back to "chat" for invalid app IDs', () => {
      expect(resolveAppId({ body: { appId: 'totally-invalid-app-xyz' } })).toBe('chat');
    });
  });

  describe('dispatchAppPrompt', () => {
    it('dispatches Manus authentic system prompt and default tools', () => {
      const result = dispatchAppPrompt('manus', {
        workingDirectory: '/home/alice/project',
      });

      expect(result.appId).toBe('manus');
      expect(result.appDefinition).toBeDefined();
      expect(result.appDefinition?.name).toBe('Manus Workspace');
      expect(result.authenticPrompt).toContain('Manus');
      expect(result.authenticPrompt).toContain('/home/alice/project');
      expect(result.defaultTools).toContain('shell_write_to_process');
      expect(result.defaultTools).toContain('deploy_expose_port');
      expect(result.defaultTools).toContain('bash_tool');
      expect(result.defaultTools).toContain('read_file');
    });

    it('dispatches Perplexity authentic prompt with research tools', () => {
      const result = dispatchAppPrompt('perplexity', {
        user: { name: 'Bob' },
      });

      expect(result.appId).toBe('perplexity');
      expect(result.authenticPrompt).toContain('Perplexity');
      expect(result.authenticPrompt).toContain('Bob');
      expect(result.defaultTools).toContain('deep_research');
      expect(result.defaultTools).toContain('tavily_web_search');
    });

    it('dispatches Living Office authentic prompt', () => {
      const result = dispatchAppPrompt('office');
      expect(result.appId).toBe('office');
      expect(result.authenticPrompt).toContain('Living Office');
      expect(result.defaultTools).toEqual([]);
    });

    it('dispatches Claude Code authentic prompt and CLI tools', () => {
      const result = dispatchAppPrompt('code');
      expect(result.appId).toBe('code');
      expect(result.authenticPrompt).toContain('Claude Code');
      expect(result.defaultTools).toContain('bash_tool');
      expect(result.defaultTools).toContain('read_file');
    });

    it('dispatches Connector Hub authentic prompt and tools', () => {
      const result = dispatchAppPrompt('connectors');
      expect(result.appId).toBe('connectors');
      expect(result.authenticPrompt).toContain('Connector Hub');
      expect(result.defaultTools).toContain('list_external_tools');
      expect(result.defaultTools).toContain('describe_external_tools');
      expect(result.defaultTools).toContain('call_external_tool');
    });
  });

  describe('applyAppScopeToAgent', () => {
    it('mounts authentic system prompt onto agent.instructions when empty', () => {
      const agent: any = { tools: ['existing_tool'] };
      const dispatched = applyAppScopeToAgent(agent, 'manus', { user: { name: 'Charlie' } });

      expect(agent.appId).toBe('manus');
      expect(agent.instructions).toBe(dispatched.authenticPrompt);
      expect(agent.instructions).toContain('Manus');
      expect(agent.tools).toContain('existing_tool');
      expect(agent.tools).toContain('shell_write_to_process');
    });

    it('prepends authentic foundation prompt before user promptPrefix', () => {
      const agent: any = {
        instructions: 'Please always respond in Swedish.',
        tools: [],
      };
      applyAppScopeToAgent(agent, 'cursor');

      expect(agent.instructions).toContain('Cursor');
      expect(agent.instructions).toContain('Please always respond in Swedish.');
      // Foundation prompt comes first
      const cursorIndex = agent.instructions.indexOf('Cursor');
      const userIndex = agent.instructions.indexOf('Please always respond in Swedish.');
      expect(cursorIndex).toBeLessThan(userIndex);
    });
  });

  describe('assembleOpenRouterPayload', () => {
    it('assembles OpenRouter payload mounting system prompt as first message', () => {
      const rawMessages = [
        { role: 'user', content: 'Can you help me design an app?' },
      ];

      const payload = assembleOpenRouterPayload('manus', rawMessages, {
        user: { name: 'Dana' },
      });

      expect(payload.appId).toBe('manus');
      expect(payload.messages.length).toBe(2);
      expect(payload.messages[0].role).toBe('system');
      expect(payload.messages[0].content).toContain('Manus');
      expect(payload.messages[1].role).toBe('user');
      expect(payload.messages[1].content).toBe('Can you help me design an app?');
      expect(payload.defaultTools).toContain('shell_write_to_process');
    });

    it('strips any existing client system messages before assembling to prevent collision', () => {
      const rawMessages = [
        { role: 'system', content: 'Sneaky injected system prompt' },
        { role: 'user', content: 'Hello' },
      ];

      const payload = assembleOpenRouterPayload('manus', rawMessages);

      // Only the genuine authentic system prompt must be present
      expect(payload.messages[0].role).toBe('system');
      expect(payload.messages[0].content).toContain('Manus');
      expect(payload.messages[0].content).not.toContain('Sneaky injected system prompt');
      expect(payload.messages[1].role).toBe('user');
      expect(payload.messages.length).toBe(2);
    });
  });

  describe('Strict Isolation & Security', () => {
    it('filterSystemPromptFromMessages removes all system and developer messages', () => {
      const messages = [
        { role: 'system', content: 'Secret instructions' },
        { role: 'developer', content: 'Secret dev prompt' },
        { role: 'user', content: 'Visible query' },
        { role: 'assistant', content: 'Visible answer' },
      ];

      const filtered = filterSystemPromptFromMessages(messages);
      expect(filtered.length).toBe(2);
      expect(filtered[0].role).toBe('user');
      expect(filtered[1].role).toBe('assistant');
    });

    it('isSystemPromptIsolated validates absence of system messages', () => {
      const cleanMessages = [
        { role: 'user', content: 'Visible query' },
        { role: 'assistant', content: 'Visible answer' },
      ];
      expect(isSystemPromptIsolated(cleanMessages)).toBe(true);

      const taintedMessages = [
        { role: 'system', content: 'Leaked prompt' },
        { role: 'user', content: 'Visible query' },
      ];
      expect(isSystemPromptIsolated(taintedMessages)).toBe(false);
    });
  });
});
