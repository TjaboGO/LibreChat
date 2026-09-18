import { Boxes } from 'lucide-react';
import { useMediaQuery } from '@librechat/client';
import OpenSidebar from '~/components/Chat/Menus/OpenSidebar';
import { useLocalize } from '~/hooks';

/**
 * Standalone "Artifacts" page (sidebar nav destination), distinct from the
 * in-chat split-view renderer under this same directory. Ships as an empty
 * state for now — the full list (type filters, "Make something new" cards,
 * date-grouped history) is planned for Fas 7, see docs/ui-reference/PLAN.md.
 */
export default function ArtifactsListPage() {
  const localize = useLocalize();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  return (
    <main className="flex h-full min-h-0 flex-col overflow-auto bg-presentation text-text-primary">
      <header className="sticky top-0 z-10 border-b border-border-light bg-presentation">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2.5 px-4 md:h-16 md:px-6">
          {isSmallScreen ? <OpenSidebar className="size-9 shrink-0" /> : null}
          <h1 className="truncate text-balance font-serif text-lg font-semibold tracking-tight text-text-primary md:text-xl">
            {localize('com_ui_artifacts')}
          </h1>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-6 md:px-6 md:pt-8">
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-surface-secondary px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-tertiary text-text-secondary">
            <Boxes className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-balance text-base font-semibold text-text-primary">
            {localize('com_ui_no_artifacts')}
          </h2>
          <p className="mt-1 max-w-sm text-pretty text-sm text-text-secondary">
            {localize('com_ui_no_artifacts_body')}
          </p>
        </div>
      </div>
    </main>
  );
}
