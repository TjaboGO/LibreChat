import type { SettingsTab } from './Settings/types';
import type { TDialogProps } from '~/common';
import { SettingsDialog } from './Settings/index';

export default function Settings(props: TDialogProps & { initialTab?: SettingsTab }) {
  return <SettingsDialog {...props} />;
}
