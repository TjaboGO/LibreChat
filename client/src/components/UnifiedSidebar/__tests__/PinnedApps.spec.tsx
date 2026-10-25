import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { getAppDefinition, listAppsBySection } from 'librechat-data-provider';
import { DEFAULT_PINNED_APPS } from '~/store/pinnedApps';
import AppSectionGroup from '../AppSectionGroup';
import PinnedAppsRow from '../PinnedAppsRow';

// Mock state and hooks
let mockPinnedIds = [...DEFAULT_PINNED_APPS];

const mockTogglePin = jest.fn((id: string) => {
  if (mockPinnedIds.includes(id)) {
    mockPinnedIds = mockPinnedIds.filter((p) => p !== id);
  } else {
    mockPinnedIds = [...mockPinnedIds, id];
  }
});

const mockUnpinApp = jest.fn((id: string) => {
  mockPinnedIds = mockPinnedIds.filter((p) => p !== id);
});

const mockPinApp = jest.fn((id: string) => {
  if (!mockPinnedIds.includes(id)) {
    mockPinnedIds = [...mockPinnedIds, id];
  }
});

jest.mock('~/store/pinnedApps', () => ({
  DEFAULT_PINNED_APPS: ['chat', 'cowork', 'manus', 'v0', 'perplexity'],
  pinnedAppIdsAtom: {},
  usePinnedApps: () => ({
    pinnedAppIds: mockPinnedIds,
    pinnedApps: mockPinnedIds
      .map((id) => getAppDefinition(id))
      .filter(Boolean),
    isPinned: (id: string) => mockPinnedIds.includes(id),
    pinApp: mockPinApp,
    unpinApp: mockUnpinApp,
    togglePin: mockTogglePin,
  }),
}));

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) => key,
  useLocalStorage: <T,>(_key: string, defaultVal: T) => {
    const [val, setVal] = React.useState<T>(defaultVal);
    return [val, setVal] as [T, (v: T) => void];
  },
}));

describe('Favoriter & Pinning System (Fas 31)', () => {
  beforeEach(() => {
    mockPinnedIds = [...DEFAULT_PINNED_APPS];
    jest.clearAllMocks();
  });

  describe('Default Pinned Apps & Registry', () => {
    it('has 5 curated default pinned apps from frontier sections', () => {
      expect(DEFAULT_PINNED_APPS).toEqual(['chat', 'cowork', 'manus', 'v0', 'perplexity']);
      for (const id of DEFAULT_PINNED_APPS) {
        const app = getAppDefinition(id);
        expect(app).toBeDefined();
        expect(app?.id).toBe(id);
      }
    });
  });

  describe('PinnedAppsRow (Quick Dock)', () => {
    it('renders Quick Dock with count badge and pinned apps', () => {
      render(
        <MemoryRouter>
          <PinnedAppsRow />
        </MemoryRouter>,
      );

      expect(screen.getByText('Quick Dock')).toBeInTheDocument();
      expect(screen.getByText('5 Pinned')).toBeInTheDocument();

      // Check rendered pinned apps (using compact names)
      expect(screen.getByTestId('pinned-app-dock-chat')).toBeInTheDocument();
      expect(screen.getByTestId('pinned-app-dock-cowork')).toBeInTheDocument();
      expect(screen.getByTestId('pinned-app-dock-manus')).toBeInTheDocument();
      expect(screen.getByTestId('pinned-app-dock-v0')).toBeInTheDocument();
      expect(screen.getByTestId('pinned-app-dock-perplexity')).toBeInTheDocument();
    });

    it('unpins an app when unpin button is clicked', () => {
      render(
        <MemoryRouter>
          <PinnedAppsRow />
        </MemoryRouter>,
      );

      const unpinManusBtn = screen.getByTestId('unpin-btn-manus');
      expect(unpinManusBtn).toBeInTheDocument();

      fireEvent.click(unpinManusBtn);
      expect(mockUnpinApp).toHaveBeenCalledWith('manus');
    });

    it('renders empty prompt when no apps are pinned', () => {
      mockPinnedIds = [];

      render(
        <MemoryRouter>
          <PinnedAppsRow />
        </MemoryRouter>,
      );

      expect(screen.getByText('0 Pinned')).toBeInTheDocument();
      expect(
        screen.getByText('Hover over any app and click the pin icon to add it here.'),
      ).toBeInTheDocument();
    });

    it('toggles expansion of the quick dock header', () => {
      render(
        <MemoryRouter>
          <PinnedAppsRow />
        </MemoryRouter>,
      );

      const header = screen.getByTestId('pinned-apps-header');
      expect(header).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('AppSectionGroup Pin Button Integration', () => {
    it('shows pinned status and allows toggling pins on app rows', () => {
      const coreApps = listAppsBySection('core');
      const coreSection = {
        id: 'core',
        title: 'Core Apps',
        badge: '4 Apps',
        icon: 'Sparkles',
        order: 1,
      };

      render(
        <MemoryRouter>
          <AppSectionGroup section={coreSection} apps={coreApps} defaultExpanded={true} />
        </MemoryRouter>,
      );

      // 'chat' is in mockPinnedIds (default)
      const chatPinBtn = screen.getByTestId('pin-toggle-chat');
      expect(chatPinBtn).toBeInTheDocument();
      expect(chatPinBtn).toHaveAttribute('title', 'Unpin from Quick Dock');

      // 'design' is not in mockPinnedIds
      const designPinBtn = screen.getByTestId('pin-toggle-design');
      expect(designPinBtn).toBeInTheDocument();
      expect(designPinBtn).toHaveAttribute('title', 'Pin to Quick Dock');

      // Click pin toggle for design
      fireEvent.click(designPinBtn);
      expect(mockTogglePin).toHaveBeenCalledWith('design');
    });
  });
});
