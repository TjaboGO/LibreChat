import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, fireEvent } from '@testing-library/react';
import AttachPlusMenu from '../AttachPlusMenu';
import store from '~/store';

jest.mock('~/hooks', () => ({
  useFileHandlingNoChatContext: jest.fn(() => ({
    handleFileChange: jest.fn(),
  })),
  useLocalize: jest.fn(() => (key: string) => {
    const map: Record<string, string> = {
      com_ui_attach_content_and_tools: 'Add content and tools',
      com_ui_add_files_or_photos: 'Add files or photos',
      com_ui_take_screenshot: 'Take a screenshot',
      com_ui_add_to_project: 'Add to project',
      com_ui_skills: 'Skills',
      com_ui_connectors: 'Connectors',
      com_ui_design_system: 'Design system',
      com_ui_add_plugins: 'Add plugins',
      com_ui_research: 'Research',
      com_ui_web_search: 'Web search',
      com_ui_memory: 'Memory',
      com_ui_devices: 'Devices',
      com_ui_run_tasks_on: 'Run tasks on',
    };
    return map[key] || key;
  }),
}));

const mockWebSearchToggle = jest.fn();
const mockMemoryToggle = jest.fn();
let mockBadgeContext: Record<string, any> = {
  webSearch: { toggleState: false, debouncedChange: mockWebSearchToggle },
  memory: { toggleState: false, debouncedChange: mockMemoryToggle },
};

jest.mock('~/Providers/BadgeRowContext', () => ({
  useBadgeRowContext: () => mockBadgeContext,
}));

function renderAttachPlusMenu(mode: 'chat' | 'cowork' = 'chat') {
  return render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(store.composerModeFamily(0), mode);
      }}
    >
      <AttachPlusMenu
        index={0}
        conversation={null}
        files={new Map()}
        setFiles={() => {}}
        setFilesLoading={() => {}}
      />
    </RecoilRoot>,
  );
}

describe('AttachPlusMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBadgeContext = {
      webSearch: { toggleState: false, debouncedChange: mockWebSearchToggle },
      memory: { toggleState: false, debouncedChange: mockMemoryToggle },
    };
  });

  it('renders the circular "+" button with accessible label', () => {
    renderAttachPlusMenu('chat');
    const button = screen.getByRole('button', { name: /add content and tools/i });
    expect(button).toBeInTheDocument();
  });

  it('opens unified menu showing all expected items', () => {
    renderAttachPlusMenu('chat');
    const button = screen.getByRole('button', { name: /add content and tools/i });
    fireEvent.click(button);

    expect(screen.getAllByText('Add files or photos')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Take a screenshot')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Add to project')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Record a skill')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Skills')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Connectors')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Design system')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Add plugins')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Research')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Web search')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Memory')[0]).toBeInTheDocument();
  });

  it('clicking Record a skill opens the record skill modal', () => {
    renderAttachPlusMenu();
    const button = screen.getByRole('button', { name: /add content and tools/i });
    fireEvent.click(button);

    const recordItem = screen.getByText('Record a skill');
    fireEvent.click(recordItem);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText(/Your screen, clicks, typing, and voice are recorded/i),
    ).toBeInTheDocument();
  });

  it('clicking Web search triggers webSearch toggle callback', () => {
    renderAttachPlusMenu('chat');
    const button = screen.getByRole('button', { name: /add content and tools/i });
    fireEvent.click(button);

    const webSearchItem = screen.getByText('Web search');
    fireEvent.click(webSearchItem);
    expect(mockWebSearchToggle).toHaveBeenCalledTimes(1);
  });

  it('clicking Memory triggers memory toggle callback', () => {
    renderAttachPlusMenu('chat');
    const button = screen.getByRole('button', { name: /add content and tools/i });
    fireEvent.click(button);

    const memoryItem = screen.getByText('Memory');
    fireEvent.click(memoryItem);
    expect(mockMemoryToggle).toHaveBeenCalledTimes(1);
  });

  it('triggers file picker click on ⌘U / Ctrl+U', () => {
    renderAttachPlusMenu('chat');
    const clickSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
    fireEvent.keyDown(window, { key: 'u', metaKey: true });
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
