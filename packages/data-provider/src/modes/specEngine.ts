import type { SpecDocument, SpecTask } from './types';

/**
 * Generates structured Markdown for a formal specification document.
 */
export function generateSpecMarkdown(spec: SpecDocument): string {
  const lines: string[] = [];

  lines.push(`# Specification: ${spec.title}`);
  if (spec.id) {
    lines.push(`*Spec ID: ${spec.id}*`);
  }
  lines.push('');

  lines.push('## 1. Overview & Goal');
  lines.push(spec.overview.trim());
  lines.push('');

  lines.push('## 2. Requirements');
  if (spec.requirements.length === 0) {
    lines.push('- No explicit requirements defined.');
  } else {
    for (const req of spec.requirements) {
      lines.push(`- ${req}`);
    }
  }
  lines.push('');

  if (spec.architecture) {
    lines.push('## 3. Architecture & Data Contracts');
    lines.push(spec.architecture.trim());
    lines.push('');
  }

  lines.push('## 4. Acceptance Criteria & TDD Test Plan');
  if (spec.acceptanceCriteria.length === 0) {
    lines.push('- [ ] No acceptance criteria specified.');
  } else {
    for (const ac of spec.acceptanceCriteria) {
      lines.push(`- [ ] ${ac}`);
    }
  }
  if (spec.testPlan && spec.testPlan.length > 0) {
    lines.push('');
    lines.push('### Test Scenarios');
    for (const test of spec.testPlan) {
      lines.push(`- **TDD:** ${test}`);
    }
  }
  lines.push('');

  lines.push('## 5. Implementation Tasks');
  if (spec.tasks.length === 0) {
    lines.push('- [ ] Task 1.0: Initial implementation');
  } else {
    for (const task of spec.tasks) {
      const check = task.done ? '[x]' : '[ ]';
      const desc = task.description ? ` - ${task.description}` : '';
      lines.push(`- ${check} **${task.id}**: ${task.title}${desc}`);
    }
  }

  return lines.join('\n');
}

/**
 * Parses structured markdown into a SpecDocument object.
 */
export function parseSpecMarkdown(markdown: string): SpecDocument {
  const titleMatch = markdown.match(/#\s+(?:Specification:\s*)?(.*)/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled Specification';

  const idMatch = markdown.match(/\*Spec ID:\s*([^*]+)\*/i);
  const id = idMatch ? idMatch[1].trim() : undefined;

  // Extract Overview
  let overview = '';
  const overviewMatch = markdown.match(/##\s+1\.\s+Overview[^\n]*\n([\s\S]*?)(?=##\s+2|$)/i);
  if (overviewMatch) {
    overview = overviewMatch[1].trim();
  }

  // Extract Requirements
  const requirements: string[] = [];
  const reqMatch = markdown.match(/##\s+2\.\s+Requirements[^\n]*\n([\s\S]*?)(?=##\s+3|$)/i);
  if (reqMatch) {
    const rawReqs = reqMatch[1].split('\n');
    for (const line of rawReqs) {
      const cleaned = line.replace(/^\s*[-*]\s*/, '').trim();
      if (cleaned && !cleaned.toLowerCase().startsWith('no explicit')) {
        requirements.push(cleaned);
      }
    }
  }

  // Extract Architecture
  let architecture: string | undefined;
  const archMatch = markdown.match(/##\s+3\.\s+Architecture[^\n]*\n([\s\S]*?)(?=##\s+4|$)/i);
  if (archMatch) {
    architecture = archMatch[1].trim();
  }

  // Extract Acceptance Criteria
  const acceptanceCriteria: string[] = [];
  const acMatch = markdown.match(/##\s+4\.\s+Acceptance Criteria[^\n]*\n([\s\S]*?)(?=##\s+5|$)/i);
  if (acMatch) {
    const rawAcs = acMatch[1].split('\n');
    for (const line of rawAcs) {
      const cleaned = line.replace(/^\s*[-*]\s*\[[ xX]\]\s*/, '').trim();
      if (cleaned && !cleaned.toLowerCase().startsWith('no acceptance') && !cleaned.startsWith('###')) {
        acceptanceCriteria.push(cleaned);
      }
    }
  }

  // Extract Tasks
  const tasks: SpecTask[] = [];
  const taskSectionMatch = markdown.match(/##\s+5\.\s+Implementation Tasks[^\n]*\n([\s\S]*?)$/i);
  if (taskSectionMatch) {
    const rawTasks = taskSectionMatch[1].split('\n');
    for (const line of rawTasks) {
      const m = line.match(/^\s*[-*]\s*\[([ xX])\]\s*(?:\*\*([^*]+)\*\*:\s*)?(.*)/);
      if (m) {
        const done = m[1].toLowerCase() === 'x';
        const taskId = m[2] ? m[2].trim() : `Task-${tasks.length + 1}`;
        const rest = m[3] ? m[3].trim() : '';
        const [taskTitle, ...descParts] = rest.split(' - ');
        tasks.push({
          id: taskId,
          title: taskTitle.trim() || `Step ${tasks.length + 1}`,
          description: descParts.length > 0 ? descParts.join(' - ').trim() : undefined,
          done,
        });
      }
    }
  }

  return {
    id,
    title,
    overview,
    requirements,
    architecture,
    acceptanceCriteria,
    tasks,
  };
}

/**
 * Validates a SpecDocument to ensure essential architectural requirements are defined.
 */
export function validateSpecDocument(spec: SpecDocument): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!spec.title || spec.title.trim().length === 0) {
    errors.push('Specification must have a title.');
  }

  if (!spec.overview || spec.overview.trim().length === 0) {
    errors.push('Specification must have an overview or goal.');
  }

  if (!spec.requirements || spec.requirements.length === 0) {
    errors.push('Specification must specify at least one requirement.');
  }

  if (!spec.acceptanceCriteria || spec.acceptanceCriteria.length === 0) {
    errors.push('Specification must define at least one acceptance criterion.');
  }

  if (!spec.tasks || spec.tasks.length === 0) {
    errors.push('Specification must contain at least one implementation task.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Updates the completion status of a task in the spec.
 */
export function updateTaskStatus(
  spec: SpecDocument,
  taskId: string,
  done: boolean,
): SpecDocument {
  return {
    ...spec,
    tasks: spec.tasks.map((task) => (task.id === taskId ? { ...task, done } : task)),
  };
}
