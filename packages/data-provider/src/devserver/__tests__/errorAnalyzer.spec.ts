import { buildSelfHealingPrompt, diagnoseConsoleError } from '../errorAnalyzer';

describe('Dev Server Error Analyzer', () => {
  it('diagnoses Vite module resolution errors and identifies missing package', () => {
    const rawError = '[vite] Internal server error: Failed to resolve import "canvas-confetti" from "src/components/Celebration.tsx". Does the file exist?';
    const diagnosed = diagnoseConsoleError(rawError);

    expect(diagnosed.errorType).toBe('ModuleResolutionError');
    expect(diagnosed.file).toBe('src/components/Celebration.tsx');
    expect(diagnosed.rootCause).toContain('canvas-confetti');
    expect(diagnosed.suggestedFix).toContain('npm install canvas-confetti');
    expect(diagnosed.canAutoHeal).toBe(true);
  });

  it('diagnoses TypeError undefined property access and extracts location', () => {
    const rawError = {
      id: '1',
      level: 'error' as const,
      message: 'Uncaught TypeError: Cannot read properties of undefined (reading "map")',
      stack: 'TypeError: Cannot read properties of undefined (reading "map")\n    at UserList (http://localhost:5173/src/components/UserList.tsx:18:24)',
      timestamp: Date.now(),
    };

    const diagnosed = diagnoseConsoleError(rawError);

    expect(diagnosed.errorType).toBe('TypeError');
    expect(diagnosed.file).toBe('src/components/UserList.tsx');
    expect(diagnosed.line).toBe(18);
    expect(diagnosed.rootCause).toContain("'map'");
    expect(diagnosed.suggestedFix).toContain('optional chaining');
  });

  it('diagnoses ReferenceError undeclared variable', () => {
    const rawError = 'ReferenceError: calculateTotal is not defined in src/pages/Checkout.tsx:42:5';
    const diagnosed = diagnoseConsoleError(rawError);

    expect(diagnosed.errorType).toBe('ReferenceError');
    expect(diagnosed.file).toBe('src/pages/Checkout.tsx');
    expect(diagnosed.line).toBe(42);
    expect(diagnosed.rootCause).toContain("'calculateTotal'");
    expect(diagnosed.suggestedFix).toContain("Import or declare 'calculateTotal'");
  });

  it('diagnoses SyntaxError JSX compilation failures', () => {
    const rawError = 'SyntaxError: Unexpected token, expected "}" in src/App.tsx:29:1';
    const diagnosed = diagnoseConsoleError(rawError);

    expect(diagnosed.errorType).toBe('SyntaxError');
    expect(diagnosed.file).toBe('src/App.tsx');
    expect(diagnosed.line).toBe(29);
    expect(diagnosed.suggestedFix).toContain('unbalanced brackets');
  });

  it('builds an actionable prompt for the AI self-healing agent', () => {
    const diagnosed = diagnoseConsoleError('ReferenceError: activeTab is not defined in src/App.tsx:12:3');
    const prompt = buildSelfHealingPrompt(diagnosed);

    expect(prompt).toContain('[Self-Healing Dev Server Error Detected]');
    expect(prompt).toContain('Location: src/App.tsx:12');
    expect(prompt).toContain("Root Cause: 'activeTab' was used without being declared");
    expect(prompt).toContain('ACTION REQUIRED: Inspect the identified file and apply the minimal correct code change');
  });
});
