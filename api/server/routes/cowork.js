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
        title: 'Background subagent task',
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
  const { title, type = 'task' } = req.body || {};
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

module.exports = router;
