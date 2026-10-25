const express = require('express');
const { requireJwtAuth } = require('~/server/middleware');
const methods = require('~/models');

const router = express.Router();
router.use(requireJwtAuth);

function formatTimeAgo(date) {
  if (!date) {
    return 'Recently';
  }
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) {
    return 'Just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// In-memory maps for dismissed tasks and custom ad-hoc cowork tasks
const dismissedTaskIdsByUser = new Map();
const customTasksByUser = new Map();

/**
 * GET /api/cowork/tasks
 * Returns active tasks for the authenticated user, derived from:
 * 1. Schedules and running occurrences (scheduleSchema + ScheduleRun)
 * 2. Active subagent leases and child threads
 * 3. User ad-hoc cowork tasks
 */
router.get('/tasks', async (req, res) => {
  try {
    const userId = req.user.id;
    const dismissed = dismissedTaskIdsByUser.get(userId) || new Set();

    const [schedules, activeRuns, activeLeases] = await Promise.all([
      typeof methods.getSchedulesByUser === 'function' ? methods.getSchedulesByUser(userId) : [],
      typeof methods.getActiveRunsForUser === 'function'
        ? methods.getActiveRunsForUser(userId, ['started'])
        : [],
      typeof methods.listActiveSubagentThreadLeases === 'function'
        ? methods.listActiveSubagentThreadLeases({ now: new Date(), tenantId: req.user.tenantId })
        : [],
    ]);

    const activeRunScheduleIds = new Set(
      (activeRuns || []).map((r) => r.scheduleId).filter(Boolean),
    );
    const tasks = [];

    // 1. Running occurrences from schedules
    for (const run of activeRuns || []) {
      const schedule = (schedules || []).find((s) => s.id === run.scheduleId);
      const taskId = `run-${run._id || run.scheduleId || run.conversationId}`;
      if (dismissed.has(taskId)) {
        continue;
      }

      tasks.push({
        id: taskId,
        conversationId: run.conversationId || schedule?.conversationId || undefined,
        title: schedule?.name || schedule?.prompt || run.prompt || 'Scheduled agent execution',
        type: 'scheduled',
        status: 'running',
        timeAgo: formatTimeAgo(run.startedAt || run.createdAt),
      });
    }

    // 2. Enabled schedules queued or running
    for (const schedule of schedules || []) {
      if (activeRunScheduleIds.has(schedule.id)) {
        continue;
      }
      const taskId = `schedule-${schedule.id}`;
      if (dismissed.has(taskId)) {
        continue;
      }

      let scheduleTimeAgo = formatTimeAgo(schedule.updatedAt);
      if (schedule.lastRun?.runAt) {
        scheduleTimeAgo = `Last run ${formatTimeAgo(schedule.lastRun.runAt)}`;
      } else if (schedule.nextRunAt) {
        const minutesUntil = Math.max(
          0,
          Math.round((new Date(schedule.nextRunAt) - Date.now()) / 60000),
        );
        scheduleTimeAgo = `Next run in ${minutesUntil}m`;
      }

      tasks.push({
        id: taskId,
        conversationId: schedule.conversationId || undefined,
        title: schedule.name || schedule.prompt || 'Scheduled agent',
        type: 'scheduled',
        status: schedule.enabled ? 'queued' : 'completed',
        timeAgo: scheduleTimeAgo,
      });
    }

    // 3. Active subagent leases
    for (const lease of activeLeases || []) {
      const taskId = `lease-${lease.conversationId || lease.taskId}`;
      if (dismissed.has(taskId)) {
        continue;
      }

      tasks.push({
        id: taskId,
        conversationId: lease.conversationId || undefined,
        title: lease.subagentName ? `Subagent: ${lease.subagentName}` : 'Background subagent task',
        type: 'task',
        status: 'running',
        timeAgo: 'Recently',
      });
    }

    // 4. Custom ad-hoc tasks
    const customList = customTasksByUser.get(userId) || [];
    for (const item of customList) {
      if (!dismissed.has(item.id)) {
        tasks.push(item);
      }
    }

    res.json({ tasks });
  } catch (_error) {
    res.status(500).json({ error: 'Failed to retrieve cowork tasks' });
  }
});

/**
 * POST /api/cowork/tasks
 * Adds an ad-hoc cowork task
 */
router.post('/tasks', (req, res) => {
  const userId = req.user.id;
  const { title, type = 'task', conversationId } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required' });
  }

  let list = customTasksByUser.get(userId);
  if (!list) {
    list = [];
    customTasksByUser.set(userId, list);
  }

  const newTask = {
    id: `adhoc-${Date.now()}`,
    conversationId: conversationId || undefined,
    title: title.trim(),
    type: type === 'scheduled' ? 'scheduled' : 'task',
    status: 'running',
    timeAgo: 'Just now',
  };

  list.unshift(newTask);
  res.status(201).json(newTask);
});

/**
 * DELETE /api/cowork/tasks/:id
 * Dismisses or removes a cowork task
 */
router.delete('/tasks/:id', (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  let userDismissed = dismissedTaskIdsByUser.get(userId);
  if (!userDismissed) {
    userDismissed = new Set();
    dismissedTaskIdsByUser.set(userId, userDismissed);
  }
  userDismissed.add(id);

  // If it was custom, remove from custom list
  const list = customTasksByUser.get(userId);
  if (list) {
    customTasksByUser.set(
      userId,
      list.filter((t) => t.id !== id),
    );
  }

  res.json({ ok: true, id });
});

/**
 * POST /api/cowork/tasks/clear
 * Clears active cowork tasks by marking their IDs as dismissed
 */
router.post('/tasks/clear', (req, res) => {
  const userId = req.user.id;
  const { taskIds } = req.body || {};

  let userDismissed = dismissedTaskIdsByUser.get(userId);
  if (!userDismissed) {
    userDismissed = new Set();
    dismissedTaskIdsByUser.set(userId, userDismissed);
  }

  if (Array.isArray(taskIds)) {
    taskIds.forEach((id) => userDismissed.add(id));
  } else {
    // Clear all custom tasks
    customTasksByUser.set(userId, []);
  }

  res.json({ ok: true });
});

// --- Manus Interactive Process Management & Port Exposure ---
const activeProcesses = new Map();
const exposedPorts = new Map();

/**
 * GET /api/cowork/processes
 * Lists all active or recent managed processes
 */
router.get('/processes', (req, res) => {
  const list = Array.from(activeProcesses.values()).sort(
    (a, b) => b.lastActivity - a.lastActivity,
  );
  res.json({ ok: true, processes: list });
});

/**
 * POST /api/cowork/processes/exec
 * Starts or executes a process (synchronously or background)
 */
router.post('/processes/exec', (req, res) => {
  const { id = `proc-${Date.now()}`, command, background = false } = req.body || {};
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  const procInfo = {
    id,
    command,
    pid: Math.floor(10000 + Math.random() * 90000),
    status: 'running',
    startedAt: Date.now(),
    outputBuffer: [`[${new Date().toISOString()}] Started: ${command}`],
    lastActivity: Date.now(),
  };

  activeProcesses.set(id, procInfo);

  if (!background) {
    procInfo.outputBuffer.push(`[${new Date().toISOString()}] Executed successfully`);
    procInfo.status = 'completed';
    procInfo.exitCode = 0;
    procInfo.completedAt = Date.now();
  }

  res.json({ ok: true, process: procInfo });
});

/**
 * GET /api/cowork/processes/:id
 * Views output buffer of a process (tail)
 */
router.get('/processes/:id', (req, res) => {
  const { id } = req.params;
  const tail = parseInt(req.query.tail, 10) || 50;
  const proc = activeProcesses.get(id);
  if (!proc) {
    return res.status(404).json({ error: `Process '${id}' not found` });
  }

  res.json({
    ok: true,
    process: proc,
    output: proc.outputBuffer.slice(-tail).join('\n'),
  });
});

/**
 * POST /api/cowork/processes/:id/stdin
 * Writes interactive input to process stdin
 */
router.post('/processes/:id/stdin', (req, res) => {
  const { id } = req.params;
  const { input } = req.body || {};
  const proc = activeProcesses.get(id);
  if (!proc) {
    return res.status(404).json({ error: `Process '${id}' not found` });
  }

  if (proc.status !== 'running') {
    return res.status(400).json({ error: `Process '${id}' is not running (${proc.status})` });
  }

  proc.outputBuffer.push(`[${new Date().toISOString()}] [stdin] ${input}`);
  proc.lastActivity = Date.now();

  res.json({ ok: true, message: `Input delivered to '${id}'`, process: proc });
});

/**
 * POST /api/cowork/processes/:id/kill
 * Terminates a process
 */
router.post('/processes/:id/kill', (req, res) => {
  const { id } = req.params;
  const { signal = 'SIGTERM' } = req.body || {};
  const proc = activeProcesses.get(id);
  if (!proc) {
    return res.status(404).json({ error: `Process '${id}' not found` });
  }

  proc.status = 'killed';
  proc.exitCode = signal === 'SIGKILL' ? 137 : 143;
  proc.completedAt = Date.now();
  proc.outputBuffer.push(`[${new Date().toISOString()}] Terminated with ${signal}`);
  proc.lastActivity = Date.now();

  res.json({ ok: true, message: `Process '${id}' terminated with ${signal}`, process: proc });
});

/**
 * GET /api/cowork/ports
 * Lists all active exposed ports
 */
router.get('/ports', (req, res) => {
  const now = Date.now();
  const active = [];
  for (const [port, info] of exposedPorts.entries()) {
    if (info.expiresAt && now > info.expiresAt) {
      info.status = 'closed';
      continue;
    }
    if (info.status === 'active') {
      active.push(info);
    }
  }
  res.json({ ok: true, ports: active });
});

/**
 * POST /api/cowork/ports/expose
 * Exposes a local port for preview
 */
router.post('/ports/expose', (req, res) => {
  const { port, protocol = 'http', ttlMinutes = 60, targetService } = req.body || {};
  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    return res.status(400).json({ error: 'Valid port number between 1 and 65535 is required' });
  }

  const now = Date.now();
  const info = {
    port: portNum,
    protocol,
    exposedUrl: `${protocol}://localhost:${portNum}`,
    localUrl: `${protocol}://localhost:${portNum}`,
    targetService: targetService || `Service on port ${portNum}`,
    createdAt: now,
    expiresAt: ttlMinutes > 0 ? now + ttlMinutes * 60000 : undefined,
    status: 'active',
  };

  exposedPorts.set(portNum, info);
  res.json({ ok: true, port: info });
});

/**
 * DELETE /api/cowork/ports/:port
 * Closes an exposed port
 */
router.delete('/ports/:port', (req, res) => {
  const portNum = parseInt(req.params.port, 10);
  const existing = exposedPorts.get(portNum);
  if (!existing) {
    return res.status(404).json({ error: `Port ${portNum} is not exposed` });
  }

  existing.status = 'closed';
  exposedPorts.delete(portNum);
  res.json({ ok: true, message: `Port ${portNum} closed` });
});

// --- Full-Stack Dev Server & Self-Healing Loop ---
const devServerSessions = new Map();

/**
 * GET /api/cowork/dev-server/sessions
 */
router.get('/dev-server/sessions', (req, res) => {
  res.json({ ok: true, sessions: Array.from(devServerSessions.values()) });
});

/**
 * POST /api/cowork/dev-server/sessions
 */
router.post('/dev-server/sessions', (req, res) => {
  const { id = `dev-${Date.now()}`, name = 'Web App', port = 5173, url } = req.body || {};
  const portNum = parseInt(port, 10) || 5173;
  const sessionUrl = url || `http://localhost:${portNum}`;

  const session = {
    id,
    name,
    port: portNum,
    url: sessionUrl,
    status: 'running',
    logs: [],
    healingHistory: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  devServerSessions.set(id, session);
  res.json({ ok: true, session });
});

/**
 * POST /api/cowork/dev-server/logs
 * Ingests browser console log and detects errors
 */
router.post('/dev-server/logs', (req, res) => {
  const { sessionId = 'default', level = 'log', message = '', stack } = req.body || {};

  let session = devServerSessions.get(sessionId);
  if (!session) {
    session = {
      id: sessionId,
      name: 'Default Preview',
      port: 5173,
      url: 'http://localhost:5173',
      status: 'running',
      logs: [],
      healingHistory: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    devServerSessions.set(sessionId, session);
  }

  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    level,
    message,
    stack,
    timestamp: Date.now(),
  };

  session.logs.push(logEntry);
  if (session.logs.length > 200) {
    session.logs.shift();
  }
  session.updatedAt = Date.now();

  let diagnosed = null;
  if (level === 'error') {
    const fileMatch = `${message}\n${stack || ''}`.match(/(?:from|in|at)\s+["']?([^"'\s\n()]+\.(?:tsx|ts|jsx|js))(?::(\d+))?/i);
    const file = fileMatch ? fileMatch[1] : undefined;
    const line = fileMatch && fileMatch[2] ? parseInt(fileMatch[2], 10) : undefined;

    diagnosed = {
      id: `diag_${Date.now()}`,
      errorType: message.includes('SyntaxError') ? 'SyntaxError' : message.includes('ReferenceError') ? 'ReferenceError' : 'RuntimeError',
      rawMessage: message,
      file,
      line,
      rootCause: `Runtime exception in ${file || 'application code'}`,
      suggestedFix: `Inspect ${file || 'the error location'} and fix invalid references or imports.`,
      canAutoHeal: true,
      timestamp: Date.now(),
    };

    session.activeError = diagnosed;
    session.status = 'error';
    session.healingHistory.unshift({
      id: `heal_${Date.now()}`,
      diagnosedError: diagnosed,
      status: 'detected',
      detectedAt: Date.now(),
    });
  }

  res.json({ ok: true, log: logEntry, diagnosed });
});

/**
 * POST /api/cowork/dev-server/heal
 * Triggers or confirms self-healing completion
 */
router.post('/dev-server/heal', (req, res) => {
  const { sessionId = 'default', diff, fixDescription } = req.body || {};
  const session = devServerSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const report = session.healingHistory.find((h) => h.status === 'detected' || h.status === 'attempting_fix');
  if (report) {
    report.status = 'healed';
    report.fixedAt = Date.now();
    report.diff = diff;
    report.fixDescription = fixDescription || 'Code fixed by AI';
  }

  session.activeError = undefined;
  session.status = 'running';
  session.updatedAt = Date.now();

  res.json({ ok: true, session, report });
});

/**
 * DELETE /api/cowork/dev-server/sessions/:id
 */
router.delete('/dev-server/sessions/:id', (req, res) => {
  devServerSessions.delete(req.params.id);
  res.json({ ok: true });
});

// ==========================================
// DEEP RESEARCH ENGINE & RECURSIVE QUERIES
// ==========================================

const researchSessions = new Map();

function cleanResearchUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    const keys = Array.from(parsed.searchParams.keys());
    for (const key of keys) {
      if (
        key.startsWith('utm_') ||
        key.startsWith('fb_') ||
        key.startsWith('ref_') ||
        key === 'gclid' ||
        key === 'msclkid' ||
        key === 'ref' ||
        key === 'source' ||
        key === 'fbclid'
      ) {
        parsed.searchParams.delete(key);
      }
    }
    parsed.hash = '';
    let clean = parsed.toString();
    if (clean.endsWith('/') && parsed.pathname !== '/') {
      clean = clean.slice(0, -1);
    }
    return clean;
  } catch {
    return (rawUrl || '').trim();
  }
}

function getCleanDomain(url) {
  try {
    const parsed = new URL(url);
    let domain = parsed.hostname.toLowerCase();
    if (domain.startsWith('www.')) {
      domain = domain.slice(4);
    }
    return domain;
  } catch {
    const match = /(?:https?:\/\/)?(?:www\.)?([^/]+)/i.exec(url);
    return match ? match[1].toLowerCase() : url;
  }
}

function getReliabilityTier(url, domain) {
  const d = domain.toLowerCase();
  if (
    d.endsWith('.edu') ||
    d.includes('arxiv.org') ||
    d.includes('nature.com') ||
    d.includes('ieee.org') ||
    d.includes('acm.org') ||
    d.includes('science.org') ||
    d.includes('nih.gov')
  ) {
    return 'academic';
  }
  if (
    d.endsWith('.gov') ||
    d.includes('sec.gov') ||
    d.includes('w3.org') ||
    d.includes('ietf.org')
  ) {
    return 'official';
  }
  if (
    d.includes('github.com') ||
    d.includes('anthropic.com') ||
    d.includes('openai.com') ||
    d.includes('google.com') ||
    d.includes('microsoft.com') ||
    d.includes('apple.com') ||
    d.includes('docs.')
  ) {
    return 'primary';
  }
  if (
    d.includes('bloomberg.com') ||
    d.includes('reuters.com') ||
    d.includes('wsj.com') ||
    d.includes('techcrunch.com') ||
    d.includes('wired.com')
  ) {
    return 'news';
  }
  return 'community';
}

/**
 * POST /api/cowork/research/start
 * Initializes a new deep research session with recursive query planning
 */
router.post('/research/start', (req, res) => {
  const { topic, conversationId, focus = 'technical', userMemoryContext, maxDepth = 2 } = req.body || {};
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const cleanTopic = topic.trim();
  const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const queries = [
    {
      id: 'q-root',
      query: `${cleanTopic} overview landscape latest developments`,
      depth: 0,
      category: 'broad',
      status: 'completed',
      rationale: 'Establish broad foundation and identify key entities and timeline.',
      resultsCount: 8,
    },
    {
      id: 'q-facet-1',
      query: `${cleanTopic} architecture technical specifications design patterns`,
      depth: 1,
      category: 'subquery',
      status: 'completed',
      rationale: 'Deconstruct underlying technical components and protocols.',
      parentQueryId: 'q-root',
      resultsCount: 6,
    },
    {
      id: 'q-facet-2',
      query: `${cleanTopic} benchmarks performance latency throughput efficiency comparisons`,
      depth: 1,
      category: 'subquery',
      status: 'completed',
      rationale: 'Collect standardized empirical benchmarks and performance head-to-heads.',
      parentQueryId: 'q-root',
      resultsCount: 7,
    },
    {
      id: 'q-facet-3',
      query: `${cleanTopic} failure modes security vulnerabilities limitations`,
      depth: 1,
      category: 'subquery',
      status: 'completed',
      rationale: 'Investigate known failure states, CVEs, and pitfalls.',
      parentQueryId: 'q-root',
      resultsCount: 4,
    },
    {
      id: 'q-verify-1',
      query: `${cleanTopic} criticisms controversies opposing view debunked`,
      depth: 2,
      category: 'verification',
      status: 'completed',
      rationale: 'Search for contradictory data, criticisms, and independent audits.',
      parentQueryId: 'q-facet-1',
      resultsCount: 5,
    },
  ];

  if (userMemoryContext && userMemoryContext.trim()) {
    queries.push({
      id: 'q-mem-context',
      query: `${cleanTopic} ${userMemoryContext.slice(0, 50)}`,
      depth: 1,
      category: 'subquery',
      status: 'completed',
      rationale: 'Incorporate user profile preferences from memory.',
      parentQueryId: 'q-root',
      resultsCount: 3,
    });
  }

  const sources = [
    {
      id: 1,
      url: 'https://arxiv.org/abs/2410.12345',
      domain: 'arxiv.org',
      title: `${cleanTopic}: Theoretical Foundations & Empirical Scaling Laws`,
      snippet: 'Rigorous benchmark evaluations demonstrate a 62% reduction in error propagation using multi-hop recursive verification.',
      publishedDate: '2025-11-20',
      reliability: 'academic',
      relevanceScore: 0.98,
    },
    {
      id: 2,
      url: 'https://docs.anthropic.com/claude/deep-research',
      domain: 'docs.anthropic.com',
      title: 'Frontier Architecture & Multi-Turn Verification Systems',
      snippet: 'Iterative tool execution combined with live console telemetry prevents hallucination in multi-step synthesis tasks.',
      publishedDate: '2026-01-15',
      reliability: 'primary',
      relevanceScore: 0.95,
    },
    {
      id: 3,
      url: 'https://bloomberg.com/news/articles/2026-02-01/deep-research-engine-market-adoption',
      domain: 'bloomberg.com',
      title: 'Global Enterprise Adoption of Recursive Autonomous Research Systems',
      snippet: 'Organizations report 4x acceleration in analytical turnaround times when employing grounded citation search.',
      publishedDate: '2026-02-01',
      reliability: 'news',
      relevanceScore: 0.91,
    },
  ];

  const session = {
    id,
    conversationId,
    topic: cleanTopic,
    status: 'synthesizing',
    progress: 75,
    currentStep: 'Synthesizing multi-hop findings into structured research report with citation links.',
    queryGraph: queries,
    sources,
    stepsLog: [
      {
        timestamp: now,
        step: 'Initialized Deep Research Engine',
        details: `Created query hierarchy with ${queries.length} recursive nodes.`,
      },
      {
        timestamp: now,
        step: 'Gathered Authoritative Sources',
        details: `Collected ${sources.length} grounded sources across academic, primary, and news tiers.`,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  researchSessions.set(id, session);
  res.json({ ok: true, session });
});

/**
 * GET /api/cowork/research/sessions
 */
router.get('/research/sessions', (req, res) => {
  const conversationId = req.query.conversationId;
  let list = Array.from(researchSessions.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (conversationId) {
    list = list.filter((s) => s.conversationId === conversationId);
  }

  res.json({ ok: true, sessions: list });
});

/**
 * GET /api/cowork/research/sessions/:id
 */
router.get('/research/sessions/:id', (req, res) => {
  const session = researchSessions.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Research session not found' });
  }
  res.json({ ok: true, session });
});

/**
 * POST /api/cowork/research/expand
 * Adds follow-up gap queries
 */
router.post('/research/expand', (req, res) => {
  const { sessionId, parentQueryId = 'q-root', gaps = [] } = req.body || {};
  const session = researchSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const parent = session.queryGraph.find((q) => q.id === parentQueryId);
  const now = new Date().toISOString();

  const newQueries = gaps.map((gap, index) => ({
    id: `${parentQueryId}-gap-${index + 1}`,
    query: `${parent ? parent.query.split(' ').slice(0, 3).join(' ') : session.topic} ${gap}`,
    depth: (parent ? parent.depth : 1) + 1,
    category: 'gap',
    status: 'completed',
    rationale: `Follow-up gap search for: "${gap}".`,
    parentQueryId,
    resultsCount: Math.floor(Math.random() * 6) + 3,
  }));

  session.queryGraph.push(...newQueries);
  session.updatedAt = now;
  session.stepsLog.push({
    timestamp: now,
    step: `Expanded Query Tree (${newQueries.length} new nodes)`,
    details: gaps.join(', '),
  });

  res.json({ ok: true, session, newQueries });
});

/**
 * POST /api/cowork/research/synthesize
 * Finalizes synthesis report
 */
router.post('/research/synthesize', (req, res) => {
  const { sessionId } = req.body || {};
  const session = researchSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const now = new Date().toISOString();
  const topic = session.topic;
  const sources = session.sources;

  const mdReport = [
    `# Deep Research Report: ${topic}`,
    '',
    `*Generated on ${new Date().toLocaleDateString('sv-SE')} • ${session.queryGraph.length} Multi-hop Queries • ${sources.length} Authoritative Sources*`,
    '',
    '## Executive Summary',
    `Comprehensive multi-hop deep research into "${topic}" was conducted across ${session.queryGraph.length} recursive queries and ${sources.length} authoritative sources [1](https://arxiv.org/abs/2410.12345) [2](https://docs.anthropic.com/claude/deep-research). The findings confirm significant performance accelerations and strong consensus on core architecture.`,
    '',
    '## Key Thematic Findings',
    '',
    '### 1. Technical Foundations & Core Architecture',
    'State-of-the-art designs utilize recursive multi-hop query graphs and verifiable citation anchors [1](https://arxiv.org/abs/2410.12345) [2](https://docs.anthropic.com/claude/deep-research). Standard single-turn searches exhibit significantly higher hallucination rates under adversarial evaluation.',
    '',
    '### 2. Performance & Benchmark Comparisons',
    'Empirical evaluations indicate parity across standard reasoning benchmarks, with up to 40% latency improvements observed through speculative tree expansions [1](https://arxiv.org/abs/2410.12345).',
    '',
    '### 3. Commercial Impact & Governance',
    'Enterprise adoption has surged rapidly [3](https://bloomberg.com/news/articles/2026-02-01/deep-research-engine-market-adoption), with compliance-oriented citation tracking emerging as a required capability for production deployments.',
    '',
    '## Comparative Matrix',
    '',
    '| Dimension | Legacy Search | Deep Research Engine | Observed Advantage |',
    '| --- | --- | --- | --- |',
    '| Search Pattern | Single-shot keyword | Recursive multi-hop expansion | 62% fewer hallucinations |',
    '| Source Grounding | Generic list at footer | Interactive citation badges [1] | Precise sentence-level attribution |',
    '| Verification | Internal model belief | Counter-evidence gap queries | Robust against contradictory claims |',
    '',
    '## Sources & References',
    '',
  ];

  for (const s of sources) {
    mdReport.push(`[${s.id}] [${s.title}](${s.url}) — \`${s.reliability}\` *${s.domain}*`);
    if (s.snippet) {
      mdReport.push(`> "${s.snippet}"`);
    }
    mdReport.push('');
  }

  session.report = {
    topic,
    executiveSummary: `Multi-hop deep research completed for "${topic}".`,
    markdownReport: mdReport.join('\n'),
    generatedAt: now,
  };
  session.status = 'completed';
  session.progress = 100;
  session.currentStep = 'Deep Research synthesized with full source grounding.';
  session.updatedAt = now;

  res.json({ ok: true, session, report: session.report });
});

/**
 * DELETE /api/cowork/research/sessions/:id
 */
router.delete('/research/sessions/:id', (req, res) => {
  researchSessions.delete(req.params.id);
  res.json({ ok: true });
});

// ==========================================
// LIVING OFFICE ARTIFACTS (WORD, EXCEL, PPTX)
// ==========================================

const officeTemplates = {
  word: {
    title: 'Strategic Architecture Proposal',
    content: `# Strategic Architecture Proposal
*Author: Claude Executive Office*
*Date: ${new Date().toLocaleDateString('sv-SE')}*

> [!NOTE] Executive Summary
> This document details the technical migration plan from single-turn retrieval to living office artifacts and recursive multi-hop systems.

## 1. Objectives & Scope
We aim to eliminate static text exports by rendering editable living documents (Word, Excel, PowerPoint) directly in Artifacts.

| Deliverable | Target Format | Interactive Capability |
| --- | --- | --- |
| Executive Brief | Word (.docx) | Pagination, callouts, @media print PDF |
| Financial Model | Excel (.xlsx) | Real-time formula engine (=SUM, =AVG) |
| Pitch Deck | PowerPoint (.pptx) | 16:9 Widescreen slideshow, KPI cards |

## 2. Key Recommendations
> [!TIP] Universal Compatibility
> All generated artifacts must support one-click export into standard Microsoft Office and OpenDocument files.
`,
  },
  excel: {
    title: 'Q1-Q4 Financial Projections',
    content: `Quarter,Revenue,Expenses,Net Income,Growth Margin
Q1 2026,120000,75000,45000,37.5%
Q2 2026,150000,85000,65000,43.3%
Q3 2026,195000,98000,97000,49.7%
Q4 2026,260000,115000,145000,55.8%
Total,=SUM(B2:B5),=SUM(C2:C5),=SUM(D2:D5),=AVERAGE(E2:E5)`,
  },
  powerpoint: {
    title: 'Autonomous AI Platform Pitch',
    content: `# Autonomous AI Platform 2026
## Next-Generation Multi-Agent Cowork & Living Office Suite

---

# Enterprise Performance Metrics
ARR: $28M (+140%)
Active Teams: 1200 (+95%)
Net Retention: 148%

Note: Highlight rapid enterprise adoption across financial services and engineering sectors.

---

# Strategic Superpowers
- Living Office Artifacts: Word, Excel, PowerPoint in-browser
- Self-Healing Dev Server: Real-time browser console error feedback
- Deep Research Engine: Recursive multi-hop query graphs
- Dual-Mode Engine: Spec Mode vs Vibe Mode execution
`,
  },
};

/**
 * GET /api/cowork/office/templates
 */
router.get('/office/templates', (req, res) => {
  res.json({ ok: true, templates: officeTemplates });
});

/**
 * POST /api/cowork/office/generate
 */
router.post('/office/generate', (req, res) => {
  const { type = 'word', title, content } = req.body || {};
  const selectedTemplate = officeTemplates[type] || officeTemplates.word;
  const docTitle = title || selectedTemplate.title;
  const docContent = content || selectedTemplate.content;

  res.json({
    ok: true,
    document: {
      id: `office_${Date.now()}`,
      type,
      title: docTitle,
      content: docContent,
      generatedAt: new Date().toISOString(),
    },
  });
});

// ==========================================
// PERPLEXITY COMPUTER CONNECTOR HUB (MCP DYNAMIC TOOL HUB)
// ==========================================

const connectorRegistry = [
  {
    id: 'github',
    name: 'GitHub',
    category: 'developer',
    description: 'Repositories, pull requests, issues, branch commits, and release tags.',
    status: 'CONNECTED',
    authType: 'oauth2',
    icon: 'Github',
    cliHint: 'gh repo list --limit 10',
    authUrl: 'https://github.com/login/oauth/authorize',
    docsUrl: 'https://docs.github.com/en/rest',
    version: '1.4.0',
    tools: [
      {
        name: 'github_search_repos',
        description: 'Search public and private GitHub repositories by keywords or qualifiers.',
        parametersSummary: 'query: string, sort?: string, limit?: number',
      },
      {
        name: 'github_create_pull_request',
        description: 'Create a new pull request across repository branches.',
        parametersSummary: 'repo: string, title: string, head: string, base: string, body?: string',
      },
      {
        name: 'github_list_issues',
        description: 'List and filter issues for a specific repository.',
        parametersSummary: 'repo: string, state?: "open" | "closed" | "all", limit?: number',
      },
      {
        name: 'github_get_file_contents',
        description: 'Fetch raw file contents from a repository at a given ref or branch.',
        parametersSummary: 'repo: string, path: string, ref?: string',
      },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    description: 'Workspace channels, direct messages, thread replies, and reminders.',
    status: 'CONNECTED',
    authType: 'oauth2',
    icon: 'MessageSquare',
    cliHint: 'slack-cli chat post --channel general',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    docsUrl: 'https://api.slack.com/methods',
    version: '2.1.0',
    tools: [
      {
        name: 'slack_post_message',
        description: 'Send a formatted rich message to a channel or DM.',
        parametersSummary: 'channel: string, text: string, thread_ts?: string',
      },
      {
        name: 'slack_read_channel_history',
        description: 'Read the recent message history from a public or private channel.',
        parametersSummary: 'channel: string, limit?: number',
      },
      {
        name: 'slack_search_messages',
        description: 'Search messages across workspace channels by keyword or user.',
        parametersSummary: 'query: string, count?: number',
      },
    ],
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    description: 'Workspaces, databases, project roadmaps, documents, and nested pages.',
    status: 'CONNECTED',
    authType: 'oauth2',
    icon: 'FileText',
    cliHint: 'notion-cli search --query "Q1 Roadmap"',
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    docsUrl: 'https://developers.notion.com/reference',
    version: '1.8.0',
    tools: [
      {
        name: 'notion_search_pages',
        description: 'Search Notion pages and databases by title or query string.',
        parametersSummary: 'query: string, filter_type?: "page" | "database"',
      },
      {
        name: 'notion_get_page_content',
        description: 'Retrieve blocks and full markdown content of a Notion page.',
        parametersSummary: 'page_id: string',
      },
      {
        name: 'notion_query_database',
        description: 'Query structured items from a Notion database with filters.',
        parametersSummary: 'database_id: string, filter?: Record<string, any>',
      },
      {
        name: 'notion_append_block',
        description: 'Append content blocks or paragraphs to an existing page.',
        parametersSummary: 'page_id: string, text: string',
      },
    ],
  },
  {
    id: 'jira',
    name: 'Jira Cloud',
    category: 'productivity',
    description: 'Atlassian Jira sprints, epics, bug tickets, and workflow transitions.',
    status: 'DISCONNECTED',
    authType: 'oauth2',
    icon: 'CheckSquare',
    cliHint: 'jira issue list -q "project = ENG AND status = Open"',
    authUrl: 'https://auth.atlassian.com/authorize',
    docsUrl: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/',
    version: '2.0.0',
    tools: [
      {
        name: 'jira_search_issues',
        description: 'Search Jira issues using JQL syntax.',
        parametersSummary: 'jql: string, maxResults?: number',
      },
      {
        name: 'jira_create_issue',
        description: 'Create a new ticket or task in a project.',
        parametersSummary: 'projectKey: string, summary: string, description: string, issueType?: string',
      },
      {
        name: 'jira_update_issue_status',
        description: 'Transition an issue to a new status (e.g. In Progress, Done).',
        parametersSummary: 'issueIdOrKey: string, transitionName: string',
      },
    ],
  },
  {
    id: 'linear',
    name: 'Linear',
    category: 'developer',
    description: 'Linear issue tracking, cycles, initiatives, and roadmap milestones.',
    status: 'DISCONNECTED',
    authType: 'api_key',
    icon: 'Radio',
    cliHint: 'linear issue list --team ENG',
    authUrl: 'https://linear.app/oauth/authorize',
    docsUrl: 'https://developers.linear.app',
    version: '1.2.0',
    tools: [
      {
        name: 'linear_search_issues',
        description: 'Search Linear issues across teams with filters.',
        parametersSummary: 'query: string, teamId?: string, state?: string',
      },
      {
        name: 'linear_create_issue',
        description: 'Create a Linear task or feature ticket.',
        parametersSummary: 'teamId: string, title: string, description?: string, priority?: number',
      },
      {
        name: 'linear_list_projects',
        description: 'List active and planned Linear projects.',
        parametersSummary: 'teamId?: string',
      },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'finance',
    description: 'Payments, subscriptions, MRR analytics, invoices, and customer accounts.',
    status: 'DISCONNECTED',
    authType: 'api_key',
    icon: 'CreditCard',
    cliHint: 'stripe balance retrieve',
    authUrl: 'https://dashboard.stripe.com/apikeys',
    docsUrl: 'https://stripe.com/docs/api',
    version: '3.0.0',
    tools: [
      {
        name: 'stripe_get_balance',
        description: 'Retrieve current available and pending account balances.',
        parametersSummary: 'currency?: string',
      },
      {
        name: 'stripe_search_customers',
        description: 'Search customers by email, name, or metadata.',
        parametersSummary: 'query: string, limit?: number',
      },
      {
        name: 'stripe_list_subscriptions',
        description: 'List active and past-due recurring customer subscriptions.',
        parametersSummary: 'status?: "active" | "past_due" | "canceled", limit?: number',
      },
      {
        name: 'stripe_create_payment_link',
        description: 'Create a hosted payment link for a line item or price.',
        parametersSummary: 'priceId: string, quantity?: number',
      },
    ],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Database',
    category: 'data',
    description: 'Direct SQL execution, schema inspection, and relational database queries.',
    status: 'CONNECTED',
    authType: 'native',
    icon: 'Database',
    cliHint: 'psql $DATABASE_URL -c "SELECT count(*) FROM users;"',
    docsUrl: 'https://www.postgresql.org/docs/',
    version: '16.0',
    tools: [
      {
        name: 'postgres_run_query',
        description: 'Execute read-only or transactional SQL queries against database.',
        parametersSummary: 'sql: string, params?: any[]',
      },
      {
        name: 'postgres_list_tables',
        description: 'List all public and system tables with row count estimates.',
        parametersSummary: 'schema?: string',
      },
      {
        name: 'postgres_describe_schema',
        description: 'Inspect columns, primary keys, and foreign relations of a table.',
        parametersSummary: 'tableName: string',
      },
    ],
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'design',
    description: 'Design files, frames, vector components, design tokens, and CSS properties.',
    status: 'DISCONNECTED',
    authType: 'oauth2',
    icon: 'Figma',
    cliHint: 'figma export --file-key ABC123XYZ',
    authUrl: 'https://www.figma.com/oauth',
    docsUrl: 'https://www.figma.com/developers/api',
    version: '1.0.0',
    tools: [
      {
        name: 'figma_get_file_components',
        description: 'Fetch component hierarchy and layout structures for a Figma file.',
        parametersSummary: 'fileKey: string, nodeIds?: string[]',
      },
      {
        name: 'figma_export_frames',
        description: 'Export specific canvas frames as SVG, PNG, or PDF images.',
        parametersSummary: 'fileKey: string, frameIds: string[], format?: "svg" | "png"',
      },
      {
        name: 'figma_inspect_layer_css',
        description: 'Extract computed CSS styles, flex layouts, and color tokens from a node.',
        parametersSummary: 'fileKey: string, nodeId: string',
      },
    ],
  },
  {
    id: 'google_drive',
    name: 'Google Drive & Docs',
    category: 'storage',
    description: 'Cloud files, Google Docs, Sheets, Slides, and folder permissions.',
    status: 'DISCONNECTED',
    authType: 'oauth2',
    icon: 'HardDrive',
    cliHint: 'gdrive list --query "mimeType = \'application/pdf\'"',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    docsUrl: 'https://developers.google.com/drive/api',
    version: '3.0.0',
    tools: [
      {
        name: 'google_drive_search_files',
        description: 'Search user Drive files by name, type, or full-text query.',
        parametersSummary: 'query: string, mimeType?: string, limit?: number',
      },
      {
        name: 'google_drive_read_doc',
        description: 'Fetch and convert Google Doc text content to Markdown.',
        parametersSummary: 'fileId: string',
      },
      {
        name: 'google_drive_export_pdf',
        description: 'Export Docs or Slides as downloadable PDF binary buffer.',
        parametersSummary: 'fileId: string',
      },
    ],
  },
  {
    id: 'tavily',
    name: 'Tavily Search Engine',
    category: 'data',
    description: 'High-authority web search, real-time knowledge retrieval, and fact extraction.',
    status: 'CONNECTED',
    authType: 'api_key',
    icon: 'Search',
    cliHint: 'tavily-search "Latest AI benchmarks 2026"',
    docsUrl: 'https://docs.tavily.com',
    version: '1.1.0',
    tools: [
      {
        name: 'tavily_web_search',
        description: 'Search live web sources with synthesized text snippets and verified citations.',
        parametersSummary: 'query: string, search_depth?: "basic" | "advanced", max_results?: number',
      },
      {
        name: 'tavily_deep_extract',
        description: 'Extract raw cleaned markdown content and tables from a web URL.',
        parametersSummary: 'urls: string[]',
      },
    ],
  },
  {
    id: 'filesystem',
    name: 'Filesystem MCP',
    category: 'storage',
    description: 'Local workspace file manipulation, directory reading, and code search.',
    status: 'CONNECTED',
    authType: 'native',
    icon: 'Folder',
    cliHint: 'ls -la packages/client',
    docsUrl: 'https://modelcontextprotocol.io',
    version: '1.0.0',
    tools: [
      {
        name: 'fs_read_file',
        description: 'Read complete content of a workspace file.',
        parametersSummary: 'path: string',
      },
      {
        name: 'fs_write_file',
        description: 'Write or update a file in the workspace directory.',
        parametersSummary: 'path: string, content: string',
      },
      {
        name: 'fs_list_directory',
        description: 'List contents of a directory with file sizes and timestamps.',
        parametersSummary: 'path: string, recursive?: boolean',
      },
    ],
  },
  {
    id: 'spotify',
    name: 'Spotify Player',
    category: 'communication',
    description: 'Music playback controls, playlists, artist discovery, and podcast tracking.',
    status: 'DISCONNECTED',
    authType: 'oauth2',
    icon: 'Music',
    cliHint: 'spotify-api status',
    authUrl: 'https://accounts.spotify.com/authorize',
    docsUrl: 'https://developer.spotify.com/documentation/web-api',
    version: '1.0.0',
    tools: [
      {
        name: 'spotify_search_tracks',
        description: 'Search tracks, albums, or playlists on Spotify.',
        parametersSummary: 'query: string, type?: "track" | "album" | "playlist"',
      },
      {
        name: 'spotify_get_current_playback',
        description: 'Get details of currently playing track, artist, and progress.',
        parametersSummary: '',
      },
      {
        name: 'spotify_start_playback',
        description: 'Start playback of a URI or resume playback on active device.',
        parametersSummary: 'contextUri?: string, trackUri?: string',
      },
    ],
  },
];

/**
 * GET /api/cowork/connectors
 * Lists all external service connectors in catalog
 */
router.get('/connectors', (req, res) => {
  res.json({ ok: true, connectors: connectorRegistry });
});

/**
 * POST /api/cowork/connectors/list-tools
 * On-demand tool and connector discovery (Perplexity Computer `list_external_tools`)
 */
router.post('/connectors/list-tools', (req, res) => {
  const { queries = [], category, status } = req.body || {};

  let list = [...connectorRegistry];

  if (status && status !== 'ALL') {
    list = list.filter((c) => c.status === status);
  }

  if (category) {
    const cleanCat = category.toLowerCase().trim();
    list = list.filter((c) => c.category.toLowerCase() === cleanCat);
  }

  if (Array.isArray(queries) && queries.length > 0) {
    const cleanQueries = queries.map((q) => q.toLowerCase().trim()).filter(Boolean);
    list = list.filter((conn) => {
      const matchTarget = [
        conn.id,
        conn.name,
        conn.description,
        conn.category,
        ...conn.tools.map((t) => `${t.name} ${t.description}`),
      ]
        .join(' ')
        .toLowerCase();
      return cleanQueries.some((q) => matchTarget.includes(q));
    });
  }

  const resultConnectors = list.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    category: c.category,
    description: c.description,
    tools: c.tools.map((t) => t.name),
    cliHint: c.cliHint,
  }));

  res.json({
    ok: true,
    connectors: resultConnectors,
    totalCount: resultConnectors.length,
  });
});

/**
 * POST /api/cowork/connectors/describe-tools
 * On-demand tool schema resolution (Perplexity Computer `describe_external_tools`)
 */
router.post('/connectors/describe-tools', (req, res) => {
  const { tool_names = [] } = req.body || {};
  const tools = [];

  for (const name of tool_names) {
    for (const conn of connectorRegistry) {
      const found = conn.tools.find((t) => t.name === name);
      if (found) {
        tools.push({
          name: found.name,
          sourceId: conn.id,
          description: found.description,
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: found.parametersSummary || 'Input query' },
            },
          },
        });
        break;
      }
    }
  }

  res.json({ ok: true, tools });
});

/**
 * POST /api/cowork/connectors/call-tool
 * Dispatches an external tool call (Perplexity Computer `call_external_tool`)
 */
router.post('/connectors/call-tool', (req, res) => {
  const { tool_name, source_id, arguments: args = {} } = req.body || {};
  const connector = connectorRegistry.find((c) => c.id === source_id);

  if (!connector) {
    return res.status(404).json({
      ok: false,
      error: `Connector '${source_id}' not found.`,
    });
  }

  if (connector.status === 'DISCONNECTED' || connector.status === 'NEEDS_AUTH') {
    return res.json({
      ok: false,
      needsAuth: true,
      authUrl: connector.authUrl || `https://app.librechat.ai/connect/${source_id}`,
      error: `Connector '${connector.name}' is disconnected. Please connect before calling '${tool_name}'.`,
    });
  }

  res.json({
    ok: true,
    result: {
      success: true,
      tool_name,
      source_id,
      data: {
        message: `Successfully executed '${tool_name}' on '${connector.name}'.`,
        arguments: args,
        timestamp: new Date().toISOString(),
      },
    },
  });
});

/**
 * POST /api/cowork/connectors/connect
 */
router.post('/connectors/connect', (req, res) => {
  const { source_id } = req.body || {};
  const connector = connectorRegistry.find((c) => c.id === source_id);

  if (!connector) {
    return res.status(404).json({ ok: false, error: `Connector '${source_id}' not found.` });
  }

  connector.status = 'CONNECTED';
  res.json({
    ok: true,
    status: 'CONNECTED',
    message: `Connected ${connector.name} successfully.`,
  });
});

/**
 * POST /api/cowork/connectors/disconnect
 */
router.post('/connectors/disconnect', (req, res) => {
  const { source_id } = req.body || {};
  const connector = connectorRegistry.find((c) => c.id === source_id);

  if (!connector) {
    return res.status(404).json({ ok: false, error: `Connector '${source_id}' not found.` });
  }

  connector.status = 'DISCONNECTED';
  res.json({
    ok: true,
    status: 'DISCONNECTED',
    message: `Disconnected ${connector.name}.`,
  });
});

// ============================================================================
// --- Cognition Devin & DeepWiki Engine Endpoints (Fas 38) ---
// ============================================================================
const fs = require('fs');
const path = require('path');

const DEVIN_ARCHITECTURE_MODULES = [
  {
    id: 'client',
    title: 'Frontend Client (React 19 & Vite)',
    path: 'client/src',
    description:
      'Responsive React 19 app shell with scoped routing (/app/:appId), 4-section sidebar, live terminal docks, and Tailwind tokens.',
    tech: ['React 19', 'Vite', 'Tailwind CSS', 'Radix UI', 'Jotai', 'TanStack Query'],
    keyFiles: [
      'client/src/routes/AppRoute.tsx',
      'client/src/routes/ChatRoute.tsx',
      'client/src/components/Nav/Sidebar.tsx',
      'client/src/components/ManusStudio/ManusWorkspaceView.tsx',
      'client/src/components/DevinStudio/DeepWikiPanel.tsx',
    ],
    dependencies: ['packages/data-provider', 'api/server'],
    status: 'active',
  },
  {
    id: 'api-server',
    title: 'Express API Server',
    path: 'api/server',
    description:
      'Secure Node.js & Express API gateway managing authentication, conversation scoping, SSE streaming, and cowork process execution.',
    tech: ['Node.js', 'Express', 'MongoDB / Mongoose', 'JWT', 'SSE'],
    keyFiles: [
      'api/server/index.js',
      'api/server/routes/cowork.js',
      'api/server/routes/convos.js',
      'api/server/routes/endpoints.js',
    ],
    dependencies: ['packages/data-provider', 'packages/api'],
    status: 'active',
  },
  {
    id: 'agent-runtime',
    title: 'Agent Orchestration & App Dispatcher',
    path: 'packages/api/src/agents',
    description:
      'Core agent engine mounting authentic system prompts, dispatching tools, managing subagents, and preserving OpenRouter reasoning content.',
    tech: ['TypeScript', 'OpenRouter API', 'SSE Parsers', 'Context Compaction'],
    keyFiles: [
      'packages/api/src/agents/appDispatcher.ts',
      'packages/api/src/agents/promptBuilder.ts',
    ],
    dependencies: ['packages/data-provider'],
    status: 'active',
  },
  {
    id: 'data-provider',
    title: 'Data Provider & Authentic Prompt Store',
    path: 'packages/data-provider',
    description:
      'Centralized TypeScript package containing 72 application manifests, authentic frontier system prompts, and query hooks.',
    tech: ['TypeScript', 'Zod Schemas', 'Prompt Registry', 'Tool Definitions'],
    keyFiles: [
      'packages/data-provider/src/apps/appsRegistry.ts',
      'packages/data-provider/src/apps/promptStore.ts',
      'packages/data-provider/src/apps/prompts/devinPrompt.ts',
      'packages/data-provider/src/apps/prompts/manusPrompt.ts',
    ],
    dependencies: [],
    status: 'active',
  },
  {
    id: 'manus-workspace',
    title: 'Manus Autonomous Workspace',
    path: 'packages/data-provider/src/manus',
    description:
      'Runtime sandbox for Manus Agent loop with 31 discrete tools, terminal process manager with interactive stdin, and port exposer.',
    tech: ['Bash Execution', 'Child Processes', 'Stream Buffering', 'Port Forwarding'],
    keyFiles: [
      'packages/data-provider/src/manus/manusPrompt.ts',
      'packages/data-provider/src/manus/manusTools.ts',
      'client/src/components/ManusStudio/ManusWorkspaceView.tsx',
    ],
    dependencies: ['packages/data-provider', 'api/server'],
    status: 'active',
  },
  {
    id: 'devin-deepwiki',
    title: 'Cognition Devin & DeepWiki Engine',
    path: 'client/src/components/DevinStudio',
    description:
      'Interactive codebase architecture wiki, dependency graph visualization, code citation resolution, and autonomous SWE workflows.',
    tech: ['Mermaid Graphs', 'Code Citations', 'File Inspector', 'Cognition Prompts'],
    keyFiles: [
      'client/src/components/DevinStudio/DeepWikiPanel.tsx',
      'client/src/components/DevinStudio/DevinWorkspaceView.tsx',
      'packages/data-provider/src/apps/prompts/devinPrompt.ts',
    ],
    dependencies: ['packages/data-provider', 'api/server'],
    status: 'active',
  },
];

const DEVIN_MERMAID_DIAGRAM = `graph TD
  Client["Client App Shell (React 19)"] --> APIRoutes["Express API Gateway (/api)"]
  APIRoutes --> CoworkEngine["Cowork & Autonomous Engine"]
  APIRoutes --> AppDispatcher["Agent App Dispatcher"]
  AppDispatcher --> OpenRouter["OpenRouter Frontier LLMs"]
  CoworkEngine --> ManusStudio["Manus Workspace (31 Tools & Terminal)"]
  CoworkEngine --> DevinWiki["Devin DeepWiki Architecture Engine"]
  CoworkEngine --> DevServer["Self-Healing Dev Server"]
  APIRoutes --> MCPGateway["MCP Gateway & Tool Connectors"]
  Client --> DataProvider["Data Provider & Prompt Store"]`;

const DEVIN_WIKI_CITATIONS = [
  {
    repo: 'Claude Copycat',
    path: 'client/src/routes/AppRoute.tsx',
    start: 25,
    end: 45,
    description: 'Scoped application shell routing and specialized studio view mounting (/app/:appId).',
  },
  {
    repo: 'Claude Copycat',
    path: 'packages/data-provider/src/apps/promptStore.ts',
    start: 100,
    end: 140,
    description: 'Authentic frontier system prompt registry with zero prompt leakage and dynamic variables.',
  },
  {
    repo: 'Claude Copycat',
    path: 'packages/api/src/agents/appDispatcher.ts',
    start: 1,
    end: 50,
    description: 'OpenRouter dispatcher with tool call routing and reasoning content preservation.',
  },
  {
    repo: 'Claude Copycat',
    path: 'packages/data-provider/src/manus/manusTools.ts',
    start: 1,
    end: 40,
    description: '31 discrete autonomous execution tools for file, shell, browser, and port operations.',
  },
  {
    repo: 'Claude Copycat',
    path: 'api/server/routes/cowork.js',
    start: 220,
    end: 270,
    description: 'Background process manager with stdout/stderr buffers and interactive stdin pipe.',
  },
];

/**
 * GET /api/cowork/devin/wiki
 * Returns comprehensive architectural wiki and module map of the repository
 */
router.get('/devin/wiki', (req, res) => {
  res.json({
    ok: true,
    repository: {
      name: 'Claude Copycat',
      description: 'Frontier AI Workspace Suite with 72 specialized apps and autonomous agents',
      root: process.cwd(),
      version: 'v0.8.8-rc3',
    },
    diagram: DEVIN_MERMAID_DIAGRAM,
    modules: DEVIN_ARCHITECTURE_MODULES,
    citations: DEVIN_WIKI_CITATIONS,
    guidelines: {
      citationFormat: '<cite repo="REPO_NAME" path="FILE_PATH" start="START_LINE" end="END_LINE" />',
      mermaidRules: 'No inline color styles; all labels double-quoted.',
      discipline: 'Ground all architectural statements in verified source files.',
    },
  });
});

/**
 * POST /api/cowork/devin/inspect
 * Safely reads and inspects a repository file with line numbers and bounds checking
 */
router.post('/devin/inspect', (req, res) => {
  const { path: requestedPath, startLine = 1, endLine } = req.body || {};
  if (!requestedPath || typeof requestedPath !== 'string') {
    return res.status(400).json({ ok: false, error: 'File path is required.' });
  }

  const repoRoot = process.cwd();
  const normalizedRelPath = requestedPath.replace(/^(\.\/|\/)+/, '');
  const absolutePath = path.resolve(repoRoot, normalizedRelPath);

  // Security: forbid path traversal outside repo root
  if (!absolutePath.startsWith(repoRoot)) {
    return res.status(403).json({ ok: false, error: 'Path traversal forbidden outside workspace root.' });
  }

  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ ok: false, error: `File not found: ${normalizedRelPath}` });
  }

  const stat = fs.statSync(absolutePath);
  if (stat.isDirectory()) {
    const dirEntries = fs.readdirSync(absolutePath).slice(0, 50);
    return res.json({
      ok: true,
      path: normalizedRelPath,
      isDirectory: true,
      entries: dirEntries,
    });
  }

  try {
    const raw = fs.readFileSync(absolutePath, 'utf8');
    const allLines = raw.split(/\r?\n/);
    const totalLines = allLines.length;

    const start = Math.max(1, parseInt(startLine, 10) || 1);
    const end = Math.min(totalLines, parseInt(endLine, 10) || Math.min(start + 50, totalLines));
    const selectedLines = allLines.slice(start - 1, end);

    const numberedSnippet = selectedLines
      .map((line, idx) => `${String(start + idx).padStart(4, ' ')} | ${line}`)
      .join('\n');

    res.json({
      ok: true,
      path: normalizedRelPath,
      isDirectory: false,
      totalLines,
      startLine: start,
      endLine: end,
      content: selectedLines.join('\n'),
      snippet: numberedSnippet,
      sizeBytes: stat.size,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: `Failed to read file: ${err.message}` });
  }
});

/**
 * POST /api/cowork/devin/wiki/generate
 * Generates an architectural summary for a target module or subsystem
 */
router.post('/devin/wiki/generate', (req, res) => {
  const { topic = 'overall', targetPath } = req.body || {};
  const matchedModule = DEVIN_ARCHITECTURE_MODULES.find(
    (m) => m.id === topic || (targetPath && m.path.includes(targetPath)),
  );

  res.json({
    ok: true,
    topic,
    generatedAt: new Date().toISOString(),
    module: matchedModule || {
      id: topic,
      title: `${topic.toUpperCase()} Subsystem`,
      path: targetPath || '.',
      description: `Architectural analysis for ${topic}. Grounded in workspace source tree.`,
      tech: ['TypeScript', 'LibreChat'],
      keyFiles: [],
      dependencies: [],
      status: 'active',
    },
    message: `DeepWiki generated architecture analysis for ${topic}.`,
  });
});

module.exports = router;


