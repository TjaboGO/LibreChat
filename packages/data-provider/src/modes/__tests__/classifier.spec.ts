import {
  classifyIntent,
  getModeDirective,
  SPEC_MODE_DIRECTIVE,
  VIBE_MODE_DIRECTIVE,
} from '../classifier';

describe('Dual-Mode Engine Intent Classifier', () => {
  describe('classifyIntent', () => {
    it('classifies empty input as vibe mode by default', () => {
      const result = classifyIntent('');
      expect(result.mode).toBe('vibe');
      expect(result.isAuto).toBe(true);
      expect(result.confidence.vibe).toBeGreaterThan(0.5);
    });

    it('classifies direct coding and component creation requests as vibe mode', () => {
      const queries = [
        'Write a function to reverse a string',
        'Create a new React component called HeroCard',
        'Fix the syntax error in my login modal',
        'Build a dashboard page with Tailwind CSS',
        'Bygg en animerad knapp i React',
        'Koda en funktion som sorterar användare efter datum',
      ];

      for (const query of queries) {
        const result = classifyIntent(query);
        expect(result.mode).toBe('vibe');
        expect(result.confidence.vibe).toBeGreaterThan(result.confidence.spec);
      }
    });

    it('classifies explicit spec and architecture requests as spec mode', () => {
      const queries = [
        'Create a spec for the authentication system',
        'Generate a specification for our multi-tenant database migration',
        'Draft a formal requirements doc and TDD plan for checkout',
        'Ta fram en kravspecifikation och arkitekturplan för betallösningen',
        'Skapa en spec för vår nya API-gateway',
      ];

      for (const query of queries) {
        const result = classifyIntent(query);
        expect(result.mode).toBe('spec');
        expect(result.confidence.spec).toBeGreaterThan(0.6);
        expect(result.confidence.spec).toBeGreaterThan(result.confidence.vibe);
      }
    });

    it('classifies execution of spec tasks as spec mode and extracts task IDs', () => {
      const queries = [
        'Execute task 2.1 from the spec',
        'Start task 3',
        'Kör deluppgift 4 i vår specifikation',
      ];

      for (const query of queries) {
        const result = classifyIntent(query);
        expect(result.mode).toBe('spec');
        expect(result.suggestedTasks).toBeDefined();
        expect(result.suggestedTasks?.length).toBeGreaterThan(0);
      }
    });

    it('adheres to Kiro principle: when in doubt, bias towards vibe/do mode', () => {
      const queries = [
        'What is the capital of Sweden?',
        'Can you explain how promises work in JavaScript?',
        'Tell me about design patterns',
      ];

      for (const query of queries) {
        const result = classifyIntent(query);
        expect(result.mode).toBe('vibe');
      }
    });

    it('respects ongoing spec mode context when user responds affirmatively to tasks', () => {
      const history = [
        { role: 'user', content: 'Create a spec for user profile' },
        {
          role: 'assistant',
          content: '[Engine Mode: SPEC MODE]\n### Tasks\n- [ ] Task 1: Setup\n- [ ] Task 2: Implement UI',
        },
      ];

      const result = classifyIntent('proceed with task 1', history);
      expect(result.mode).toBe('spec');
    });
  });

  describe('getModeDirective', () => {
    it('returns SPEC_MODE_DIRECTIVE for spec mode', () => {
      expect(getModeDirective('spec')).toBe(SPEC_MODE_DIRECTIVE);
      expect(SPEC_MODE_DIRECTIVE).toContain('SPEC MODE (Architect & Plan)');
    });

    it('returns VIBE_MODE_DIRECTIVE for vibe mode', () => {
      expect(getModeDirective('vibe')).toBe(VIBE_MODE_DIRECTIVE);
      expect(VIBE_MODE_DIRECTIVE).toContain('VIBE MODE (Rapid Flow & Execution)');
    });
  });
});
