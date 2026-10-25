import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { getAppSections, listAppsBySection } from 'librechat-data-provider';
import AppSectionGroup from '../AppSectionGroup';

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) => key,
  useLocalStorage: <T,>(_key: string, defaultVal: T) => {
    const [val, setVal] = React.useState<T>(defaultVal);
    return [val, setVal] as [T, (v: T) => void];
  },
}));

describe('AppSectionGroup (Fas 30)', () => {
  const sections = getAppSections();

  it('renders all 4 registered sections in order', () => {
    expect(sections.length).toBe(4);
    expect(sections[0].id).toBe('core');
    expect(sections[0].title).toBe('Core Apps');
    expect(sections[0].badge).toBe('4 Apps');

    expect(sections[1].id).toBe('agents');
    expect(sections[1].title).toBe('Autonomous Agents');
    expect(sections[1].badge).toBe('8 Agents');

    expect(sections[2].id).toBe('builders');
    expect(sections[2].title).toBe('Builders & Productivity');
    expect(sections[2].badge).toBe('6 Studios');

    expect(sections[3].id).toBe('research');
    expect(sections[3].title).toBe('Research & Browsing');
    expect(sections[3].badge).toBe('4 Hubs');
  });

  it('renders Core Apps with all 4 frontier apps and badges', () => {
    const coreSection = sections[0];
    const coreApps = listAppsBySection('core');

    render(
      <MemoryRouter>
        <AppSectionGroup section={coreSection} apps={coreApps} defaultExpanded={true} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Core Apps')).toBeInTheDocument();
    expect(screen.getByText('4 Apps')).toBeInTheDocument();

    expect(screen.getByText('Claude Chat')).toBeInTheDocument();
    expect(screen.getByText('Claude Cowork')).toBeInTheDocument();
    expect(screen.getByText('Claude Design')).toBeInTheDocument();
    expect(screen.getByText('Claude Code')).toBeInTheDocument();

    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('Pair Coding')).toBeInTheDocument();
    expect(screen.getByText('Design System')).toBeInTheDocument();
    expect(screen.getByText('CLI Agent')).toBeInTheDocument();
  });

  it('renders Autonomous Agents with specialized agent tools and badges', () => {
    const agentsSection = sections[1];
    const agentApps = listAppsBySection('agents');

    render(
      <MemoryRouter>
        <AppSectionGroup section={agentsSection} apps={agentApps} defaultExpanded={true} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Autonomous Agents')).toBeInTheDocument();
    expect(screen.getByText('8 Agents')).toBeInTheDocument();

    expect(screen.getByText('Manus Workspace')).toBeInTheDocument();
    expect(screen.getByText('30+ Tools')).toBeInTheDocument();

    expect(screen.getByText('Cognition Devin')).toBeInTheDocument();
    expect(screen.getByText('Autonomous SWE')).toBeInTheDocument();

    expect(screen.getByText('Cursor Studio')).toBeInTheDocument();
    expect(screen.getByText('Inline Diffs')).toBeInTheDocument();

    expect(screen.getByText('Windsurf Wave')).toBeInTheDocument();
    expect(screen.getByText('Self-Healing')).toBeInTheDocument();
  });

  it('renders Builders & Productivity and collapses when header is clicked', () => {
    const buildersSection = sections[2];
    const builderApps = listAppsBySection('builders');

    render(
      <MemoryRouter>
        <AppSectionGroup section={buildersSection} apps={builderApps} defaultExpanded={true} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Builders & Productivity')).toBeInTheDocument();
    expect(screen.getByText('6 Studios')).toBeInTheDocument();
    expect(screen.getByText('v0 Studio')).toBeInTheDocument();
    expect(screen.getByText('Living Office Suite')).toBeInTheDocument();

    const headerButton = screen.getByTestId('app-section-header-builders');
    expect(headerButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(headerButton);
    expect(headerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders Research & Browsing hubs with badges', () => {
    const researchSection = sections[3];
    const researchApps = listAppsBySection('research');

    render(
      <MemoryRouter>
        <AppSectionGroup section={researchSection} apps={researchApps} defaultExpanded={true} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Research & Browsing')).toBeInTheDocument();
    expect(screen.getByText('4 Hubs')).toBeInTheDocument();

    expect(screen.getByText('Perplexity Research')).toBeInTheDocument();
    expect(screen.getByText('Multi-Hop')).toBeInTheDocument();

    expect(screen.getByText('Connector Hub')).toBeInTheDocument();
    expect(screen.getByText('On-Demand')).toBeInTheDocument();

    expect(screen.getByText('ChatGPT Atlas')).toBeInTheDocument();
    expect(screen.getByText('Web Atlas')).toBeInTheDocument();
  });
});
