import { useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  getAppDefinition,
  isValidAppId,
  type AppDefinition,
} from 'librechat-data-provider';
import { createStorageAtom } from './jotai-utils';

export const PINNED_APPS_STORAGE_KEY = 'side:pinned-apps';

/**
 * Curated set of default pinned apps offering immediate utility across all 4 sections:
 * - chat (Core: Claude Chat)
 * - cowork (Core: Claude Cowork)
 * - manus (Agents: Manus Autonomous Workspace)
 * - v0 (Builders: v0 Studio)
 * - perplexity (Research: Perplexity Research)
 */
export const DEFAULT_PINNED_APPS: string[] = [
  'chat',
  'cowork',
  'manus',
  'v0',
  'perplexity',
];

/**
 * Jotai atom with localStorage persistence for pinned app IDs.
 */
export const pinnedAppIdsAtom = createStorageAtom<string[]>(
  PINNED_APPS_STORAGE_KEY,
  DEFAULT_PINNED_APPS,
);

/**
 * Custom hook providing reactive pinned apps state and mutators.
 */
export function usePinnedApps() {
  const [pinnedIds, setPinnedIds] = useAtom(pinnedAppIdsAtom);

  const safeIds = useMemo(() => {
    return Array.isArray(pinnedIds) ? pinnedIds : DEFAULT_PINNED_APPS;
  }, [pinnedIds]);

  const pinnedApps = useMemo(() => {
    return safeIds
      .filter((id) => isValidAppId(id))
      .map((id) => getAppDefinition(id))
      .filter((app): app is AppDefinition => !!app);
  }, [safeIds]);

  const isPinned = useCallback(
    (appId: string): boolean => {
      return safeIds.includes(appId);
    },
    [safeIds],
  );

  const pinApp = useCallback(
    (appId: string) => {
      if (!isValidAppId(appId)) {
        return;
      }
      setPinnedIds((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        if (list.includes(appId)) {
          return list;
        }
        return [...list, appId];
      });
    },
    [setPinnedIds],
  );

  const unpinApp = useCallback(
    (appId: string) => {
      setPinnedIds((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.filter((id) => id !== appId);
      });
    },
    [setPinnedIds],
  );

  const togglePin = useCallback(
    (appId: string) => {
      if (!isValidAppId(appId)) {
        return;
      }
      setPinnedIds((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        if (list.includes(appId)) {
          return list.filter((id) => id !== appId);
        }
        return [...list, appId];
      });
    },
    [setPinnedIds],
  );

  const reorderPinnedApps = useCallback(
    (newOrder: string[]) => {
      const valid = newOrder.filter((id) => isValidAppId(id));
      setPinnedIds(valid);
    },
    [setPinnedIds],
  );

  const clearAllPinned = useCallback(() => {
    setPinnedIds([]);
  }, [setPinnedIds]);

  const resetToDefault = useCallback(() => {
    setPinnedIds(DEFAULT_PINNED_APPS);
  }, [setPinnedIds]);

  return {
    pinnedAppIds: safeIds,
    pinnedApps,
    isPinned,
    pinApp,
    unpinApp,
    togglePin,
    reorderPinnedApps,
    clearAllPinned,
    resetToDefault,
  };
}
