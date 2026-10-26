import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import AtlasWorkspaceView from '../AtlasWorkspaceView';

describe('AtlasWorkspaceView (Fas 44: ChatGPT Atlas Browser Companion)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders ChatGPT Atlas header and browser stage by default', () => {
    render(<AtlasWorkspaceView />);

    expect(screen.getByText('ChatGPT Atlas')).toBeInTheDocument();
    expect(screen.getByText('Live Web Companion')).toBeInTheDocument();
    expect(screen.getByTestId('atlas-studio-panel')).toBeInTheDocument();
    expect(screen.getByTestId('atlas-browser-stage')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/introducing-chatgpt-atlas/)).toBeInTheDocument();
  });

  it('triggers page reload animation', () => {
    render(<AtlasWorkspaceView />);

    const reloadBtn = screen.getByTestId('atlas-reload-btn');
    fireEvent.click(reloadBtn);

    jest.advanceTimersByTime(700);
    // Reload completes cleanly
  });

  it('sends live DOM context into chat prompt callback', () => {
    const mockSelectPrompt = jest.fn();
    render(<AtlasWorkspaceView onSelectPrompt={mockSelectPrompt} />);

    const sendContextBtn = screen.getByTestId('atlas-send-context-btn');
    fireEvent.click(sendContextBtn);

    expect(mockSelectPrompt).toHaveBeenCalledTimes(1);
    expect(mockSelectPrompt.mock.calls[0][0]).toContain('I am browsing https://openai.com');
    expect(screen.getByText('Injected in Chat')).toBeInTheDocument();
  });

  it('switches to DOM Outline tab', () => {
    render(<AtlasWorkspaceView />);

    const domTab = screen.getByTestId('atlas-tab-dom');
    fireEvent.click(domTab);

    expect(screen.getByTestId('atlas-dom-stage')).toBeInTheDocument();
    expect(screen.getByText('Page Hierarchy & Extracted Headings')).toBeInTheDocument();
    expect(screen.getByText('1. Live Tab Context & Side-Chat Companion')).toBeInTheDocument();
  });

  it('captures Playwright MCP screenshot and displays viewport buffer', () => {
    render(<AtlasWorkspaceView />);

    const snapBtn = screen.getByTestId('atlas-screenshot-btn');
    fireEvent.click(snapBtn);

    expect(screen.getByTestId('atlas-screenshot-stage')).toBeInTheDocument();
    expect(screen.getByText('Playwright MCP Screen Buffer')).toBeInTheDocument();
    expect(screen.getByText('1920x1080 Viewport')).toBeInTheDocument();
  });

  it('collapses to slim 32px dock and expands back', () => {
    render(<AtlasWorkspaceView />);

    const collapseBtn = screen.getByTestId('atlas-studio-collapse-btn');
    fireEvent.click(collapseBtn);

    expect(screen.getByTestId('atlas-studio-collapsed')).toBeInTheDocument();
    expect(screen.getByTestId('atlas-studio-expand-btn')).toBeInTheDocument();

    const expandBtn = screen.getByTestId('atlas-studio-expand-btn');
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('atlas-studio-panel')).toBeInTheDocument();
  });
});
