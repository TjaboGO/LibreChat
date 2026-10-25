import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { createStorageAtom } from '~/store/jotai-utils';
import useCurrentApp from './useCurrentApp';

export type AppHistoryFilterScope = 'app' | 'all';

/**
 * Storage atom for user's preference on conversation scoping in the sidebar.
 * Default is 'app' so each specialized app has an isolated thread list.
 */
export const conversationFilterScopeAtom = createStorageAtom<AppHistoryFilterScope>(
  'side:conversation-filter-scope',
  'app',
);

export default function useConversationFilters() {
  const [filterScope, setFilterScope] = useAtom(conversationFilterScopeAtom);
  const { app, isSpecializedApp, appId } = useCurrentApp();

  const toggleFilterScope = useCallback(() => {
    setFilterScope((prev) => (prev === 'app' ? 'all' : 'app'));
  }, [setFilterScope]);

  // When inside a specialized app (manus, devin, v0, etc.) and filterScope is 'app',
  // we filter query results to that specific appId.
  const isScoped = isSpecializedApp && filterScope === 'app';
  const effectiveAppId = isScoped ? appId : undefined;

  return {
    filterScope,
    setFilterScope,
    toggleFilterScope,
    isScoped,
    effectiveAppId,
    currentApp: app,
    isSpecializedApp,
    appId,
  };
}
