import type { ScaffoldOptions } from './types';

/**
 * Generates ready-to-run full-stack web application files.
 */
export function generateFullStackScaffold(options: ScaffoldOptions): Record<string, string> {
  const { appName, template = 'vite-react-tailwind', description = 'A modern full-stack application', port = 5173 } = options;
  const files: Record<string, string> = {};

  if (template === 'vite-react-tailwind') {
    files['package.json'] = JSON.stringify(
      {
        name: appName.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
        private: true,
        version: '0.1.0',
        type: 'module',
        scripts: {
          dev: `vite --port ${port}`,
          build: 'tsc -b && vite build',
          preview: `vite preview --port ${port}`,
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          'lucide-react': '^0.450.0',
          clsx: '^2.1.1',
          'tailwind-merge': '^2.5.2',
        },
        devDependencies: {
          '@types/react': '^18.3.5',
          '@types/react-dom': '^18.3.0',
          '@vitejs/plugin-react': '^4.3.1',
          autoprefixer: '^10.4.20',
          postcss: '^8.4.47',
          tailwindcss: '^3.4.11',
          typescript: '^5.5.3',
          vite: '^5.4.2',
        },
      },
      null,
      2,
    );

    files['vite.config.ts'] = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: ${port},
    host: true,
  },
});
`;

    files['index.html'] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
  </head>
  <body class="bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

    files['tailwind.config.js'] = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

    files['postcss.config.js'] = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

    files['src/index.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
`;

    files['src/main.tsx'] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;

    files['src/App.tsx'] = `import React, { useState } from 'react';
import { Sparkles, Activity, Layers, ArrowRight } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Self-Healing Full-Stack App</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          ${appName}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          ${description}
        </p>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
            <Activity className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Dev Server</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Live & Healthy</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
            <Layers className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Stack</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">React + Vite</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
          >
            <span>Interactive Counter: {count}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
`;
  }

  return files;
}
