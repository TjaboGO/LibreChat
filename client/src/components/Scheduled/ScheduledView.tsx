import { useMediaQuery } from '@librechat/client';
import { SchedulePanel } from '~/components/SidePanel/Schedules';
import OpenSidebar from '~/components/Chat/Menus/OpenSidebar';
import { useLocalize } from '~/hooks';

/**
 * Standalone "Scheduled" page (sidebar nav destination). Wraps the existing
 * SchedulePanel — built for the narrow side panel — in a full-page shell
 * rather than duplicating its schedule list, create dialog, and empty state.
 */
export default function ScheduledView() {
  const localize = useLocalize();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  return (
    <main className="flex h-full min-h-0 flex-col overflow-auto bg-presentation text-text-primary">
      <header className="sticky top-0 z-10 border-b border-border-light bg-presentation">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2.5 px-4 md:h-16 md:px-6">
          {isSmallScreen ? <OpenSidebar className="size-9 shrink-0" /> : null}
          <h1 className="truncate text-balance font-serif text-lg font-semibold tracking-tight text-text-primary md:text-xl">
            {localize('com_ui_scheduled')}
          </h1>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-10 pt-6 md:px-6 md:pt-8">
        <SchedulePanel />
      </div>
    </main>
  );
}
