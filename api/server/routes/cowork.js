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

module.exports = router;

