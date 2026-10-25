import { generateFullStackScaffold } from '../scaffolder';

describe('Full-Stack Web App Scaffolder', () => {
  it('generates a complete Vite React Tailwind project structure', () => {
    const files = generateFullStackScaffold({
      appName: 'SuperTasker',
      template: 'vite-react-tailwind',
      description: 'An AI task manager',
      port: 5173,
    });

    expect(files['package.json']).toBeDefined();
    expect(files['vite.config.ts']).toBeDefined();
    expect(files['index.html']).toBeDefined();
    expect(files['tailwind.config.js']).toBeDefined();
    expect(files['src/main.tsx']).toBeDefined();
    expect(files['src/App.tsx']).toBeDefined();

    const pkg = JSON.parse(files['package.json']);
    expect(pkg.name).toBe('supertasker');
    expect(pkg.dependencies.react).toBeDefined();
    expect(pkg.dependencies['lucide-react']).toBeDefined();
    expect(pkg.scripts.dev).toContain('--port 5173');

    expect(files['src/App.tsx']).toContain('SuperTasker');
    expect(files['src/App.tsx']).toContain('Self-Healing Full-Stack App');
  });
});
