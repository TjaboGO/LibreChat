import {
  MessageSquare,
  Users,
  Palette,
  Terminal,
  Cpu,
  Bot,
  Code,
  Waves,
  Sliders,
  Layers,
  Zap,
  ShieldCheck,
  Sparkles,
  Heart,
  FileSpreadsheet,
  FileText,
  Globe,
  Search,
  Compass,
  Plug,
  Boxes,
} from 'lucide-react';
import type { ComponentType } from 'react';

export type IconComponent = ComponentType<{
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

export const APP_ICON_MAP: Record<string, IconComponent> = {
  MessageSquare,
  Users,
  Palette,
  Terminal,
  Cpu,
  Bot,
  Code,
  Waves,
  Sliders,
  Layers,
  Zap,
  ShieldCheck,
  Sparkles,
  Heart,
  FileSpreadsheet,
  FileText,
  Globe,
  Search,
  Compass,
  Plug,
  Boxes,
};

/**
 * Resolves a Lucide icon component by its registered string identifier.
 * Gracefully falls back to Sparkles if the icon is undefined or not found.
 */
export function getAppIcon(iconName?: string): IconComponent {
  if (!iconName) {
    return Sparkles;
  }
  return APP_ICON_MAP[iconName] || Sparkles;
}
