import type { DiagnosedError, WebConsoleLog } from './types';

/**
 * Extracts file, line and column from error stack trace or message.
 */
function extractSourceLocation(message: string, stack?: string): { file?: string; line?: number; column?: number } {
  const combined = `${message}\n${stack || ''}`;

  // Pattern 1: Vite / Webpack import resolution: from "src/App.tsx" or in /src/components/Header.tsx:12:4
  const viteMatch = combined.match(/(?:from|in)\s+["']?([^"'\s\n]+\.(?:tsx|ts|jsx|js|vue|svelte|css))(?::(\d+)(?::(\d+))?)?/i);
  if (viteMatch) {
    return {
      file: viteMatch[1],
      line: viteMatch[2] ? parseInt(viteMatch[2], 10) : undefined,
      column: viteMatch[3] ? parseInt(viteMatch[3], 10) : undefined,
    };
  }

  // Pattern 2: Standard JS stack trace: at Component (http://localhost:5173/src/App.tsx:24:12) or at src/App.tsx:24:12
  const stackMatch = combined.match(/(?:at\s+(?:[^\n(]+\()?(?:https?:\/\/[^/]+)?\/?)((?:src\/|components\/|pages\/|lib\/|app\/)[^\s:)]+\.(?:tsx|ts|jsx|js))(?::(\d+))?(?::(\d+))?/i);
  if (stackMatch) {
    return {
      file: stackMatch[1],
      line: stackMatch[2] ? parseInt(stackMatch[2], 10) : undefined,
      column: stackMatch[3] ? parseInt(stackMatch[3], 10) : undefined,
    };
  }

  // Pattern 3: Generic file:line:col
  const genericMatch = combined.match(/([a-zA-Z0-9_\-./]+\.(?:tsx|ts|jsx|js)):(\d+):(\d+)/i);
  if (genericMatch) {
    return {
      file: genericMatch[1],
      line: parseInt(genericMatch[2], 10),
      column: parseInt(genericMatch[3], 10),
    };
  }

  return {};
}

/**
 * Diagnoses a web console error log and produces actionable self-healing guidance.
 */
export function diagnoseConsoleError(log: WebConsoleLog | string): DiagnosedError {
  const message = typeof log === 'string' ? log : log.message;
  const stack = typeof log === 'string' ? undefined : log.stack;
  const timestamp = typeof log === 'string' ? Date.now() : log.timestamp;

  const { file, line, column } = extractSourceLocation(message, stack);

  let errorType = 'RuntimeError';
  let rootCause = 'An unexpected runtime exception was thrown in the browser.';
  let suggestedFix = 'Inspect the error stack trace and handle edge cases.';
  let canAutoHeal = true;

  // 1. Missing module / import resolution error (Vite / bundler)
  if (/Failed to resolve import|Cannot find module|Module not found/i.test(message)) {
    errorType = 'ModuleResolutionError';
    const pkgMatch = message.match(/(?:resolve import|find module)\s+["']([^"']+)["']/i);
    const missingModule = pkgMatch ? pkgMatch[1] : 'the requested package';
    rootCause = `The import ${missingModule} does not exist or has not been installed.`;
    suggestedFix = `Install the dependency via npm (npm install ${missingModule}) or fix the relative import path in ${file || 'the source file'}.`;
  }
  // 2. Syntax / JSX parse error
  else if (/SyntaxError|Unexpected token/i.test(message)) {
    errorType = 'SyntaxError';
    rootCause = 'Invalid JavaScript or JSX syntax detected during compilation or parsing.';
    suggestedFix = `Fix unbalanced brackets, missing semicolons, or invalid JSX tags in ${file ? `${file}${line ? ` at line ${line}` : ''}` : 'the component'}.`;
  }
  // 3. Undefined property access (TypeError)
  else if (/Cannot read properties? of (undefined|null)|is not a function/i.test(message)) {
    errorType = 'TypeError';
    const propMatch = message.match(/Cannot read properties? of (?:undefined|null) \(reading ['"]([^'"]+)['"]\)/i);
    const prop = propMatch ? propMatch[1] : 'property';
    rootCause = `Attempted to access property '${prop}' on an undefined or null object before it was loaded or initialized.`;
    suggestedFix = `Add optional chaining (?.) or a nullish default check (e.g. data?.${prop} || []) in ${file ? `${file}${line ? ` around line ${line}` : ''}` : 'the rendering logic'}.`;
  }
  // 4. ReferenceError
  else if (/ReferenceError|is not defined/i.test(message)) {
    errorType = 'ReferenceError';
    const varMatch = message.match(/([a-zA-Z0-9_$]+) is not defined/i);
    const variable = varMatch ? varMatch[1] : 'Variable';
    rootCause = `'${variable}' was used without being declared or imported.`;
    suggestedFix = `Import or declare '${variable}' at the top of ${file || 'the source file'}.`;
  }
  // 5. Network / API 404/500 fetch error
  else if (/404|500|Failed to fetch|NetworkError/i.test(message)) {
    errorType = 'NetworkError';
    rootCause = 'API endpoint request failed or returned an error status code.';
    suggestedFix = 'Verify backend API route registration or mock the response during local preview.';
  }
  // 6. React hydration or hook error
  else if (/Hydration|Rendered more hooks|Invalid hook call/i.test(message)) {
    errorType = 'ReactLifecycleError';
    rootCause = 'React hook rules or client/server hydration mismatch occurred.';
    suggestedFix = 'Ensure hooks are called unconditionally at the top level and state is initialized client-side.';
  }

  return {
    id: `diag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    errorType,
    rawMessage: message,
    file,
    line,
    column,
    rootCause,
    suggestedFix,
    canAutoHeal,
    timestamp,
  };
}

/**
 * Builds the prompt injected into the AI loop to self-heal the error.
 */
export function buildSelfHealingPrompt(error: DiagnosedError): string {
  const lines: string[] = [];
  lines.push('[Self-Healing Dev Server Error Detected]');
  lines.push(`Error Type: ${error.errorType}`);
  if (error.file) {
    const loc = error.line ? `${error.file}:${error.line}${error.column ? `:${error.column}` : ''}` : error.file;
    lines.push(`Location: ${loc}`);
  }
  lines.push(`Message: ${error.rawMessage}`);
  lines.push(`Root Cause: ${error.rootCause}`);
  lines.push(`Suggested Fix: ${error.suggestedFix}`);
  lines.push('');
  lines.push('ACTION REQUIRED: Inspect the identified file and apply the minimal correct code change to resolve this error immediately.');

  return lines.join('\n');
}
