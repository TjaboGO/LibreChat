import type { ManusToolDefinition, ManusToolName } from './types';

/**
 * 30+ Manus-Grade Discretionary Tools
 * Exact reverse-engineered schemas from Manus Agent runtime.
 */
export const MANUS_TOOLS: ManusToolDefinition[] = [
  // 1. message_notify_user
  {
    type: 'function',
    function: {
      name: 'message_notify_user',
      description:
        'Send a message to user without requiring a response. Use for acknowledging receipt of messages, providing progress updates, reporting task completion, or explaining changes in approach.',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Message text to display to user',
          },
          attachments: {
            anyOf: [{ type: 'string' }, { items: { type: 'string' }, type: 'array' }],
            description: '(Optional) List of attachments to show to user, can be file paths or URLs',
          },
        },
        required: ['text'],
      },
    },
  },
  // 2. message_ask_user
  {
    type: 'function',
    function: {
      name: 'message_ask_user',
      description:
        'Ask user a question and wait for response. Use for requesting clarification, asking for confirmation, or gathering additional information.',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Question text to present to user',
          },
          attachments: {
            anyOf: [{ type: 'string' }, { items: { type: 'string' }, type: 'array' }],
            description: '(Optional) List of question-related files or reference materials',
          },
          suggest_user_takeover: {
            type: 'string',
            enum: ['none', 'browser'],
            description: '(Optional) Suggested operation for user takeover',
          },
        },
        required: ['text'],
      },
    },
  },
  // 3. file_read
  {
    type: 'function',
    function: {
      name: 'file_read',
      description:
        'Read file content. Use for checking file contents, analyzing logs, or reading configuration files.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'Absolute path of the file to read',
          },
          start_line: {
            type: 'integer',
            description: '(Optional) Starting line to read from, 0-based',
          },
          end_line: {
            type: 'integer',
            description: '(Optional) Ending line number (exclusive)',
          },
          sudo: {
            type: 'boolean',
            description: '(Optional) Whether to use sudo privileges',
          },
        },
        required: ['file'],
      },
    },
  },
  // 4. file_write
  {
    type: 'function',
    function: {
      name: 'file_write',
      description:
        'Overwrite or append content to a file. Use for creating new files, appending content, or modifying existing files.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'Absolute path of the file to write to',
          },
          content: {
            type: 'string',
            description: 'Text content to write',
          },
          append: {
            type: 'boolean',
            description: '(Optional) Whether to append content to the end of the file',
          },
          sudo: {
            type: 'boolean',
            description: '(Optional) Whether to use sudo privileges',
          },
        },
        required: ['file', 'content'],
      },
    },
  },
  // 5. file_str_replace
  {
    type: 'function',
    function: {
      name: 'file_str_replace',
      description:
        'Replace specified string in a file. Use for updating specific content without rewriting entire file.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'Absolute path of the file to modify',
          },
          old_str: {
            type: 'string',
            description: 'Original string to be replaced (must match existing content uniquely)',
          },
          new_str: {
            type: 'string',
            description: 'New string to replace with',
          },
          sudo: {
            type: 'boolean',
            description: '(Optional) Whether to use sudo privileges',
          },
        },
        required: ['file', 'old_str', 'new_str'],
      },
    },
  },
  // 6. file_find_in_content
  {
    type: 'function',
    function: {
      name: 'file_find_in_content',
      description:
        'Search for matching text within file content. Use for finding specific code snippets or text across files.',
      parameters: {
        type: 'object',
        properties: {
          dir: {
            type: 'string',
            description: 'Directory to search in',
          },
          pattern: {
            type: 'string',
            description: 'Regex pattern or substring to search for',
          },
          case_sensitive: {
            type: 'boolean',
            description: '(Optional) Whether the search is case-sensitive',
          },
        },
        required: ['dir', 'pattern'],
      },
    },
  },
  // 7. file_find_by_name
  {
    type: 'function',
    function: {
      name: 'file_find_by_name',
      description:
        'Find files by name pattern in specified directory. Use for locating files or checking directory structure.',
      parameters: {
        type: 'object',
        properties: {
          dir: {
            type: 'string',
            description: 'Directory to search in',
          },
          pattern: {
            type: 'string',
            description: 'Filename pattern to match (e.g., *.py, config.*)',
          },
          max_depth: {
            type: 'integer',
            description: '(Optional) Maximum search depth in directories',
          },
        },
        required: ['dir', 'pattern'],
      },
    },
  },
  // 8. shell_exec
  {
    type: 'function',
    function: {
      name: 'shell_exec',
      description:
        'Execute commands in a specified shell session. Use for running code, installing packages, or managing background processes.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique session identifier for the shell (e.g., default, dev-server)',
          },
          command: {
            type: 'string',
            description: 'Shell command string to execute',
          },
          cwd: {
            type: 'string',
            description: '(Optional) Working directory for the command',
          },
          background: {
            type: 'boolean',
            description: '(Optional) Run as persistent background process without waiting for exit',
          },
        },
        required: ['id', 'command'],
      },
    },
  },
  // 9. shell_view
  {
    type: 'function',
    function: {
      name: 'shell_view',
      description:
        'View the stdout and stderr content of a specified shell session. Use for checking command execution results or background process logs.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Shell session identifier to view',
          },
          tail_lines: {
            type: 'integer',
            description: '(Optional) Number of recent log lines to display (default: 50)',
          },
        },
        required: ['id'],
      },
    },
  },
  // 10. shell_wait
  {
    type: 'function',
    function: {
      name: 'shell_wait',
      description:
        'Wait for the running process in a specified shell session to return. Use when awaiting compilation or long tasks.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Shell session identifier to wait for',
          },
          timeout_ms: {
            type: 'integer',
            description: '(Optional) Milliseconds to wait before returning current state',
          },
        },
        required: ['id'],
      },
    },
  },
  // 11. shell_write_to_process
  {
    type: 'function',
    function: {
      name: 'shell_write_to_process',
      description:
        'Write input to a running interactive process in a specified shell session. Use for answering interactive prompts (y/n), entering passwords, or communicating with interactive REPLs.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Target shell session identifier hosting the running process',
          },
          input: {
            type: 'string',
            description: 'Text string input to write to the process stdin (include \\n if needed)',
          },
        },
        required: ['id', 'input'],
      },
    },
  },
  // 12. shell_kill_process
  {
    type: 'function',
    function: {
      name: 'shell_kill_process',
      description:
        'Terminate a running process in a specified shell session. Use for stopping unresponsive commands or shutting down dev servers.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Shell session identifier hosting the target process to terminate',
          },
          signal: {
            type: 'string',
            enum: ['SIGINT', 'SIGTERM', 'SIGKILL'],
            description: '(Optional) Termination signal to send (default: SIGTERM)',
          },
        },
        required: ['id'],
      },
    },
  },
  // 13. browser_view
  {
    type: 'function',
    function: {
      name: 'browser_view',
      description:
        'View content of the current browser page. Use for checking the latest layout, rendered elements, and extracted text.',
      parameters: {
        type: 'object',
        properties: {
          include_markdown: {
            type: 'boolean',
            description: '(Optional) Whether to return page text content as Markdown',
          },
        },
        required: [],
      },
    },
  },
  // 14. browser_navigate
  {
    type: 'function',
    function: {
      name: 'browser_navigate',
      description:
        'Navigate browser to specified URL. Use when accessing new web pages or applications.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'Target URL to load in the browser',
          },
        },
        required: ['url'],
      },
    },
  },
  // 15. browser_restart
  {
    type: 'function',
    function: {
      name: 'browser_restart',
      description:
        'Restart browser instance and navigate to specified URL. Use when browser state becomes corrupted or unresponsive.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'URL to load upon fresh browser start',
          },
        },
        required: ['url'],
      },
    },
  },
  // 16. browser_click
  {
    type: 'function',
    function: {
      name: 'browser_click',
      description:
        'Click on elements in the current browser page. Use when clicking buttons, links, or coordinates.',
      parameters: {
        type: 'object',
        properties: {
          index: {
            type: 'integer',
            description: '(Optional) Numerical index of visible element to click',
          },
          x: {
            type: 'number',
            description: '(Optional) Viewport X coordinate in pixels',
          },
          y: {
            type: 'number',
            description: '(Optional) Viewport Y coordinate in pixels',
          },
        },
        required: [],
      },
    },
  },
  // 17. browser_input
  {
    type: 'function',
    function: {
      name: 'browser_input',
      description:
        'Overwrite text in editable elements on the current browser page. Use when typing into input fields.',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Text string to type into the field',
          },
          index: {
            type: 'integer',
            description: '(Optional) Element index to focus and input text into',
          },
          press_enter: {
            type: 'boolean',
            description: '(Optional) Press Enter key after input',
          },
        },
        required: ['text'],
      },
    },
  },
  // 18. browser_move_mouse
  {
    type: 'function',
    function: {
      name: 'browser_move_mouse',
      description: 'Move cursor to specified coordinate on the current browser page to trigger hovers.',
      parameters: {
        type: 'object',
        properties: {
          x: {
            type: 'number',
            description: 'Target X coordinate in pixels',
          },
          y: {
            type: 'number',
            description: 'Target Y coordinate in pixels',
          },
        },
        required: ['x', 'y'],
      },
    },
  },
  // 19. browser_press_key
  {
    type: 'function',
    function: {
      name: 'browser_press_key',
      description: 'Simulate key press in current browser page (e.g., Enter, Escape, ArrowDown).',
      parameters: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: 'Key name to press (e.g., Enter, Escape, Tab, Backspace)',
          },
        },
        required: ['key'],
      },
    },
  },
  // 20. browser_select_option
  {
    type: 'function',
    function: {
      name: 'browser_select_option',
      description: 'Select specified option from dropdown list element in current page.',
      parameters: {
        type: 'object',
        properties: {
          index: {
            type: 'integer',
            description: 'Element index of the select tag',
          },
          value: {
            type: 'string',
            description: 'Value attribute or text of the option to select',
          },
        },
        required: ['index', 'value'],
      },
    },
  },
  // 21. browser_scroll_up
  {
    type: 'function',
    function: {
      name: 'browser_scroll_up',
      description: 'Scroll up the current browser page to view content above.',
      parameters: {
        type: 'object',
        properties: {
          pixels: {
            type: 'integer',
            description: '(Optional) Distance in pixels to scroll up (default: 500)',
          },
        },
        required: [],
      },
    },
  },
  // 22. browser_scroll_down
  {
    type: 'function',
    function: {
      name: 'browser_scroll_down',
      description: 'Scroll down the current browser page to view content below.',
      parameters: {
        type: 'object',
        properties: {
          pixels: {
            type: 'integer',
            description: '(Optional) Distance in pixels to scroll down (default: 500)',
          },
        },
        required: [],
      },
    },
  },
  // 23. browser_console_exec
  {
    type: 'function',
    function: {
      name: 'browser_console_exec',
      description: 'Execute JavaScript code in browser console for custom evaluation or DOM querying.',
      parameters: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'JavaScript code snippet to execute in page context',
          },
        },
        required: ['code'],
      },
    },
  },
  // 24. browser_console_view
  {
    type: 'function',
    function: {
      name: 'browser_console_view',
      description: 'View browser console output and JavaScript errors.',
      parameters: {
        type: 'object',
        properties: {
          tail_lines: {
            type: 'integer',
            description: '(Optional) Number of recent console lines to return (default: 50)',
          },
        },
        required: [],
      },
    },
  },
  // 25. info_search_web
  {
    type: 'function',
    function: {
      name: 'info_search_web',
      description:
        'Search web pages using search engine. Use for obtaining latest information, documentation, or facts.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search keywords or phrase',
          },
          num_results: {
            type: 'integer',
            description: '(Optional) Number of results to return (default: 5)',
          },
        },
        required: ['query'],
      },
    },
  },
  // 26. deploy_expose_port
  {
    type: 'function',
    function: {
      name: 'deploy_expose_port',
      description:
        'Expose specified local port for temporary preview and access. Use when providing running web services (Vite, Next.js, Flask, FastAPI).',
      parameters: {
        type: 'object',
        properties: {
          port: {
            type: 'integer',
            description: 'Local port number being listened on (e.g., 3000, 5173, 8000)',
          },
          protocol: {
            type: 'string',
            enum: ['http', 'https', 'ws', 'tcp'],
            description: '(Optional) Protocol of the service (default: http)',
          },
          ttl_minutes: {
            type: 'integer',
            description: '(Optional) Lifetime in minutes for port forwarding (default: 60)',
          },
        },
        required: ['port'],
      },
    },
  },
  // 27. deploy_get_exposed_ports
  {
    type: 'function',
    function: {
      name: 'deploy_get_exposed_ports',
      description: 'List all currently active exposed ports and their URLs.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  // 28. deploy_close_port
  {
    type: 'function',
    function: {
      name: 'deploy_close_port',
      description: 'Close an active exposed port and terminate forwarding.',
      parameters: {
        type: 'object',
        properties: {
          port: {
            type: 'integer',
            description: 'Port number to close',
          },
        },
        required: ['port'],
      },
    },
  },
  // 29. deploy_apply_deployment
  {
    type: 'function',
    function: {
      name: 'deploy_apply_deployment',
      description:
        'Deploy website or application to public production environment (Netlify/Vercel/Static).',
      parameters: {
        type: 'object',
        properties: {
          dir: {
            type: 'string',
            description: 'Directory path containing built production assets',
          },
          title: {
            type: 'string',
            description: 'Name/title of the deployment project',
          },
        },
        required: ['dir'],
      },
    },
  },
  // 30. make_manus_page
  {
    type: 'function',
    function: {
      name: 'make_manus_page',
      description: 'Make an interactive Manus Page deliverable from a local Markdown/MDX file.',
      parameters: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'Absolute path of MDX file to compile into deliverable page',
          },
          title: {
            type: 'string',
            description: '(Optional) Title of the deliverable',
          },
        },
        required: ['file'],
      },
    },
  },
  // 31. idle
  {
    type: 'function',
    function: {
      name: 'idle',
      description:
        'A special tool to indicate you have completed all tasks and are about to enter standby. Must send final deliverable to user before calling.',
      parameters: {
        type: 'object',
        properties: {
          summary: {
            type: 'string',
            description: 'Comprehensive summary of completed actions and deliverables provided',
          },
        },
        required: [],
      },
    },
  },
];

/** Index mapping tool name to its definition */
export const MANUS_TOOLS_BY_NAME = new Map<ManusToolName, ManusToolDefinition>(
  MANUS_TOOLS.map((t) => [t.function.name, t]),
);

export function getManusTool(name: ManusToolName): ManusToolDefinition | undefined {
  return MANUS_TOOLS_BY_NAME.get(name);
}

export function getAllManusTools(): ManusToolDefinition[] {
  return MANUS_TOOLS;
}

export function isManusTool(name: string): name is ManusToolName {
  return MANUS_TOOLS_BY_NAME.has(name as ManusToolName);
}

export function validateManusToolCall(
  name: string,
  args: Record<string, unknown>,
): { valid: boolean; errors: string[] } {
  const tool = MANUS_TOOLS_BY_NAME.get(name as ManusToolName);
  if (!tool) {
    return { valid: false, errors: [`Unknown Manus tool: ${name}`] };
  }
  const errors: string[] = [];
  const required = tool.function.parameters.required || [];
  for (const field of required) {
    if (args[field] === undefined || args[field] === null || args[field] === '') {
      errors.push(`Missing required field '${field}' for tool '${name}'`);
    }
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}
