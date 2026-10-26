import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import ResearchStudioView from '../ResearchStudioView';

// Mock triggerDownload from utils
jest.mock('~/utils', () => {
  const actual = jest.requireActual('~/utils');
  return {
    ...actual,
    triggerDownload: jest.fn(),
  };
});

describe('ResearchStudioView (Fas 43: Perplexity Deep Research Studio)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Deep Research Studio and report stage by default with citation badges', () => {
    render(<ResearchStudioView />);

    expect(screen.getByText('Perplexity Deep Research')).toBeInTheDocument();
    expect(screen.getByText('Recursive 3-Hop')).toBeInTheDocument();
    expect(screen.getByTestId('research-studio-panel')).toBeInTheDocument();
    expect(screen.getByTestId('research-report-stage')).toBeInTheDocument();
    expect(screen.getByText('Frontier Inference-Time Reasoning & Compute Scaling')).toBeInTheDocument();
    expect(screen.getByTestId('research-citation-badge-1')).toBeInTheDocument();
  });

  it('clicks on citation badge [1] to open the citation inspection card', () => {
    render(<ResearchStudioView />);

    const badge1 = screen.getByTestId('research-citation-badge-1');
    fireEvent.click(badge1);

    expect(screen.getByTestId('research-citation-card')).toBeInTheDocument();
    expect(screen.getByText('arxiv.org')).toBeInTheDocument();
    expect(screen.getByText(/Scaling Inference-Time Compute/)).toBeInTheDocument();
    expect(screen.getByText(/99% Confidence/)).toBeInTheDocument();
    expect(screen.getByText('Visit Source URL')).toBeInTheDocument();
  });

  it('exports research report with markdown and references', () => {
    const { triggerDownload } = require('~/utils');
    render(<ResearchStudioView />);

    const exportBtn = screen.getByTestId('research-export-report-btn');
    fireEvent.click(exportBtn);

    expect(triggerDownload).toHaveBeenCalledTimes(1);
    expect(triggerDownload.mock.calls[0][1]).toBe('Deep_Research_Report.md');
  });

  it('switches to Query Graph tab and adds a sub-query', () => {
    render(<ResearchStudioView />);

    const plannerTab = screen.getByTestId('research-tab-planner');
    fireEvent.click(plannerTab);

    expect(screen.getByTestId('research-planner-stage')).toBeInTheDocument();
    expect(screen.getByText('Hop 0: Broad Landscape Discovery')).toBeInTheDocument();
    expect(screen.getByText('Hop 1: Domain-Specific Deep Dives')).toBeInTheDocument();
    expect(screen.getByText('Hop 2: Cross-Source Synthesis & Reconciliation')).toBeInTheDocument();

    const addQueryBtn = screen.getByTestId('research-add-subquery-btn');
    fireEvent.click(addQueryBtn);

    expect(screen.getByText('Emergent self-correction patterns in multi-turn test-time compute')).toBeInTheDocument();
  });

  it('switches to Sources tab and filters by search term', () => {
    render(<ResearchStudioView />);

    const sourcesTab = screen.getByTestId('research-tab-sources');
    fireEvent.click(sourcesTab);

    expect(screen.getByTestId('research-sources-stage')).toBeInTheDocument();
    expect(screen.getByText('github.com')).toBeInTheDocument();
    expect(screen.getByText('nature.com')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Filter sources by title, author, or domain...');
    fireEvent.change(searchInput, { target: { value: 'DeepSeek' } });

    expect(screen.getByText(/DeepSeek-R1: Incentivizing Reasoning/)).toBeInTheDocument();
    expect(screen.queryByText(/Recursive Multi-Hop Grounding/)).not.toBeInTheDocument();
  });

  it('collapses to slim 32px dock and expands back', () => {
    render(<ResearchStudioView />);

    const collapseBtn = screen.getByTestId('research-studio-collapse-btn');
    fireEvent.click(collapseBtn);

    expect(screen.getByTestId('research-studio-collapsed')).toBeInTheDocument();
    expect(screen.getByTestId('research-studio-expand-btn')).toBeInTheDocument();

    const expandBtn = screen.getByTestId('research-studio-expand-btn');
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('research-studio-panel')).toBeInTheDocument();
  });
});
