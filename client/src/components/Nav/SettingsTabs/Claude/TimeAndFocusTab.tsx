/* eslint-disable i18next/no-literal-string */
import React, { useState, useEffect } from 'react';
import { Clock, Moon } from 'lucide-react';
import { cn } from '~/utils';

const STORAGE_KEY = 'claude_time_and_focus_prefs';

export interface TimeAndFocusPrefs {
  breakInterval: string;
  breakDuration: string;
  quietDays: number[];
  quietStart: string;
  quietEnd: string;
}

const DEFAULT_PREFS: TimeAndFocusPrefs = {
  breakInterval: '-',
  breakDuration: '-',
  quietDays: [],
  quietStart: '22:00',
  quietEnd: '07:00',
};

const DAY_LABELS = [
  { day: 0, label: 'S', title: 'Sunday' },
  { day: 1, label: 'M', title: 'Monday' },
  { day: 2, label: 'T', title: 'Tuesday' },
  { day: 3, label: 'W', title: 'Wednesday' },
  { day: 4, label: 'T', title: 'Thursday' },
  { day: 5, label: 'F', title: 'Friday' },
  { day: 6, label: 'S', title: 'Saturday' },
];

export default function TimeAndFocusTab() {
  const [prefs, setPrefs] = useState<TimeAndFocusPrefs>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PREFS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      window.dispatchEvent(new CustomEvent('claude_time_focus_updated', { detail: prefs }));
    } catch {
      // ignore
    }
  }, [prefs]);

  const updateField = <K extends keyof TimeAndFocusPrefs>(key: K, value: TimeAndFocusPrefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDay = (day: number) => {
    setPrefs((prev) => {
      const exists = prev.quietDays.includes(day);
      const newDays = exists ? prev.quietDays.filter((d) => d !== day) : [...prev.quietDays, day];
      return { ...prev, quietDays: newDays.sort() };
    });
  };

  return (
    <div className="flex flex-col space-y-8 text-text-primary" data-testid="time-and-focus-tab">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary">Time and focus</h3>
      </div>

      {/* SECTION 1: BREAK REMINDERS */}
      <div className="flex flex-col justify-between gap-4 border-b border-border-light pb-6 sm:flex-row sm:items-start">
        <div className="max-w-md">
          <h4 className="text-sm font-medium text-text-primary">Break reminders</h4>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            Get a nudge to take a break from Claude. You can snooze or adjust anytime.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Interval dropdown */}
          <select
            value={prefs.breakInterval}
            onChange={(e) => updateField('breakInterval', e.target.value)}
            aria-label="Break interval"
            data-testid="break-interval-select"
            className="rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:border-text-primary focus:outline-none"
          >
            <option value="-">-</option>
            <option value="30m">Every 30m</option>
            <option value="50m">Every 50m</option>
            <option value="1h">Every 1 hour</option>
            <option value="2h">Every 2 hours</option>
          </select>

          {/* Duration dropdown */}
          <select
            value={prefs.breakDuration}
            onChange={(e) => updateField('breakDuration', e.target.value)}
            aria-label="Break duration"
            data-testid="break-duration-select"
            className="rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 text-xs text-text-primary focus:border-text-primary focus:outline-none"
          >
            <option value="-">-</option>
            <option value="5m">5 min break</option>
            <option value="10m">10 min break</option>
            <option value="15m">15 min break</option>
            <option value="30m">30 min break</option>
          </select>
        </div>
      </div>

      {/* SECTION 2: QUIET HOURS */}
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-medium text-text-primary">Quiet hours</h4>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            Set time limits for Claude. You can dismiss or adjust anytime.
          </p>
        </div>

        {/* Day Pills matching screenshot 17.00.40 */}
        <div className="flex items-center gap-2 pt-1" data-testid="quiet-days-group">
          {DAY_LABELS.map(({ day, label, title }) => {
            const isSelected = prefs.quietDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                title={title}
                aria-pressed={isSelected}
                data-testid={`quiet-day-${day}`}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isSelected
                    ? 'bg-text-primary text-surface-primary shadow-sm'
                    : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary hover:text-text-primary',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Optional Time Range Selectors when days are active */}
        {prefs.quietDays.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-3 rounded-lg border border-border-light bg-surface-secondary/40 p-3 text-xs">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Moon className="h-3.5 w-3.5 text-text-primary" />
              <span>Quiet period:</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-text-secondary">
                <span>From:</span>
                <input
                  type="time"
                  value={prefs.quietStart}
                  onChange={(e) => updateField('quietStart', e.target.value)}
                  data-testid="quiet-start-input"
                  className="rounded border border-border-light bg-surface-secondary px-2 py-1 text-xs text-text-primary focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-1 text-text-secondary">
                <span>To:</span>
                <input
                  type="time"
                  value={prefs.quietEnd}
                  onChange={(e) => updateField('quietEnd', e.target.value)}
                  data-testid="quiet-end-input"
                  className="rounded border border-border-light bg-surface-secondary px-2 py-1 text-xs text-text-primary focus:outline-none"
                />
              </label>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
              <Clock className="h-3 w-3" />
              <span>Claude will mute proactive notifications during these hours.</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
