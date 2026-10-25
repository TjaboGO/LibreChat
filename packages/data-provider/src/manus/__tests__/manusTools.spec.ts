import {
  MANUS_TOOLS,
  MANUS_TOOLS_BY_NAME,
  getManusTool,
  getAllManusTools,
  isManusTool,
  validateManusToolCall,
} from '../manusTools';

describe('Manus Tools Catalog', () => {
  it('registers all 31 discrete Manus-grade tools', () => {
    expect(MANUS_TOOLS.length).toBe(31);
    expect(getAllManusTools().length).toBe(31);
    expect(MANUS_TOOLS_BY_NAME.size).toBe(31);
  });

  it('correctly identifies valid and invalid tool names', () => {
    expect(isManusTool('shell_write_to_process')).toBe(true);
    expect(isManusTool('deploy_expose_port')).toBe(true);
    expect(isManusTool('browser_console_exec')).toBe(true);
    expect(isManusTool('make_manus_page')).toBe(true);
    expect(isManusTool('idle')).toBe(true);
    expect(isManusTool('non_existent_tool')).toBe(false);
  });

  it('retrieves tool definitions by name with required parameters', () => {
    const shellWrite = getManusTool('shell_write_to_process');
    expect(shellWrite).toBeDefined();
    expect(shellWrite?.function.parameters.required).toContain('id');
    expect(shellWrite?.function.parameters.required).toContain('input');

    const portExpose = getManusTool('deploy_expose_port');
    expect(portExpose).toBeDefined();
    expect(portExpose?.function.parameters.required).toContain('port');
  });

  it('validates tool arguments accurately', () => {
    const validCall = validateManusToolCall('shell_write_to_process', {
      id: 'session-1',
      input: 'y\n',
    });
    expect(validCall.valid).toBe(true);
    expect(validCall.errors).toHaveLength(0);

    const missingArgsCall = validateManusToolCall('shell_write_to_process', {
      id: 'session-1',
    });
    expect(missingArgsCall.valid).toBe(false);
    expect(missingArgsCall.errors).toContain("Missing required field 'input' for tool 'shell_write_to_process'");

    const unknownToolCall = validateManusToolCall('unknown_tool', {});
    expect(unknownToolCall.valid).toBe(false);
  });
});
