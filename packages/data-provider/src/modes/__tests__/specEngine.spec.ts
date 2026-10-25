import type { SpecDocument } from '../types';
import {
  generateSpecMarkdown,
  parseSpecMarkdown,
  updateTaskStatus,
  validateSpecDocument,
} from '../specEngine';

describe('Spec Engine', () => {
  const sampleSpec: SpecDocument = {
    id: 'SPEC-101',
    title: 'OAuth2 Authentication Service',
    overview: 'Provide secure token issuance and identity verification using OAuth 2.1.',
    requirements: [
      'Support PKCE for public clients',
      'Issue JWT access tokens with 15-minute expiration',
      'Store refresh tokens in secure HTTP-only cookies',
    ],
    architecture: 'Express microservice interfacing with Redis cache and PostgreSQL identity database.',
    acceptanceCriteria: [
      'Invalid client credentials return 401 Unauthorized',
      'Refresh token exchange issues new access token',
      'Expired tokens are rejected with token_expired code',
    ],
    testPlan: [
      'Unit tests for JWT generation and verification',
      'Integration test for auth code exchange flow',
    ],
    tasks: [
      { id: 'Task 1.0', title: 'Initialize token cryptographic helpers', done: true },
      { id: 'Task 2.0', title: 'Create OAuth router endpoints', done: false, description: 'POST /token' },
      { id: 'Task 3.0', title: 'Write integration test suite', done: false },
    ],
  };

  it('generates structured Markdown following Kiro & Traycer specification standards', () => {
    const md = generateSpecMarkdown(sampleSpec);

    expect(md).toContain('# Specification: OAuth2 Authentication Service');
    expect(md).toContain('*Spec ID: SPEC-101*');
    expect(md).toContain('## 1. Overview & Goal');
    expect(md).toContain('## 2. Requirements');
    expect(md).toContain('- Support PKCE for public clients');
    expect(md).toContain('## 3. Architecture & Data Contracts');
    expect(md).toContain('## 4. Acceptance Criteria & TDD Test Plan');
    expect(md).toContain('- [ ] Invalid client credentials return 401 Unauthorized');
    expect(md).toContain('- **TDD:** Unit tests for JWT generation and verification');
    expect(md).toContain('## 5. Implementation Tasks');
    expect(md).toContain('- [x] **Task 1.0**: Initialize token cryptographic helpers');
    expect(md).toContain('- [ ] **Task 2.0**: Create OAuth router endpoints - POST /token');
  });

  it('parses generated Markdown back into a structured SpecDocument', () => {
    const md = generateSpecMarkdown(sampleSpec);
    const parsed = parseSpecMarkdown(md);

    expect(parsed.title).toBe(sampleSpec.title);
    expect(parsed.id).toBe(sampleSpec.id);
    expect(parsed.overview).toBe(sampleSpec.overview);
    expect(parsed.requirements.length).toBe(3);
    expect(parsed.requirements[0]).toBe('Support PKCE for public clients');
    expect(parsed.acceptanceCriteria.length).toBe(3);
    expect(parsed.tasks.length).toBe(3);
    expect(parsed.tasks[0].id).toBe('Task 1.0');
    expect(parsed.tasks[0].done).toBe(true);
    expect(parsed.tasks[1].done).toBe(false);
  });

  it('validates a complete spec as valid', () => {
    const validation = validateSpecDocument(sampleSpec);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('detects missing requirements and tasks during validation', () => {
    const invalidSpec: SpecDocument = {
      title: '',
      overview: '',
      requirements: [],
      acceptanceCriteria: [],
      tasks: [],
    };

    const validation = validateSpecDocument(invalidSpec);
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThanOrEqual(4);
  });

  it('updates task completion status correctly', () => {
    const updated = updateTaskStatus(sampleSpec, 'Task 2.0', true);
    const task2 = updated.tasks.find((t) => t.id === 'Task 2.0');
    expect(task2?.done).toBe(true);

    const task1 = updated.tasks.find((t) => t.id === 'Task 1.0');
    expect(task1?.done).toBe(true);
  });
});
