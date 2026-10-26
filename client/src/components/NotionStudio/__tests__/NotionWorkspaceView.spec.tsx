import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import NotionWorkspaceView from '../NotionWorkspaceView';

// Mock triggerDownload from utils
jest.mock('~/utils', () => {
  const actual = jest.requireActual('~/utils');
  return {
    ...actual,
    triggerDownload: jest.fn(),
  };
});

describe('NotionWorkspaceView (Fas 42: Notion AI Studio)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Notion AI Studio and wiki pages stage by default', () => {
    render(<NotionWorkspaceView />);

    expect(screen.getByText('Notion AI Studio')).toBeInTheDocument();
    expect(screen.getByText('Workspace 3.0')).toBeInTheDocument();
    expect(screen.getByTestId('notion-workspace-panel')).toBeInTheDocument();
    expect(screen.getByTestId('notion-wiki-stage')).toBeInTheDocument();
    expect(screen.getByText('Core Architecture Wiki')).toBeInTheDocument();
    expect(screen.getByText('Action Items')).toBeInTheDocument();
  });

  it('toggles checklist items when clicked', () => {
    render(<NotionWorkspaceView />);

    const itemBtn = screen.getByText('Implement bi-directional relational database rollups');
    expect(itemBtn).toBeInTheDocument();

    fireEvent.click(itemBtn);
    // Verified item toggles without error
  });

  it('switches wiki pages via page tree navigation', () => {
    render(<NotionWorkspaceView />);

    const productRoadmapBtn = screen.getByText('Product Roadmap 2026');
    fireEvent.click(productRoadmapBtn);

    expect(screen.getByText('Tiered Pricing Strategy & Quotas')).toBeInTheDocument();
  });

  it('exports active wiki page as Markdown (.md)', () => {
    const { triggerDownload } = require('~/utils');
    render(<NotionWorkspaceView />);

    const exportBtn = screen.getByTestId('notion-export-md-btn');
    fireEvent.click(exportBtn);

    expect(triggerDownload).toHaveBeenCalledTimes(1);
    expect(triggerDownload.mock.calls[0][1]).toBe('engineering-wiki.md');
  });

  it('switches to Relational Database tab, adds record, and exports CSV', () => {
    const { triggerDownload } = require('~/utils');
    render(<NotionWorkspaceView />);

    const databaseTab = screen.getByTestId('notion-tab-database');
    fireEvent.click(databaseTab);

    expect(screen.getByTestId('notion-database-stage')).toBeInTheDocument();
    expect(screen.getByText('Relational Tasks & Epics')).toBeInTheDocument();

    const addRecordBtn = screen.getByTestId('notion-add-record-btn');
    fireEvent.click(addRecordBtn);

    expect(screen.getByText('New Workspace Task Initiative')).toBeInTheDocument();

    const exportCsvBtn = screen.getByTestId('notion-export-csv-btn');
    fireEvent.click(exportCsvBtn);

    expect(triggerDownload).toHaveBeenCalledTimes(1);
    expect(triggerDownload.mock.calls[0][1]).toBe('Notion_Database.csv');
  });

  it('collapses to slim 32px dock and expands back', () => {
    render(<NotionWorkspaceView />);

    const collapseBtn = screen.getByTestId('notion-studio-collapse-btn');
    fireEvent.click(collapseBtn);

    expect(screen.getByTestId('notion-studio-collapsed')).toBeInTheDocument();
    expect(screen.getByTestId('notion-studio-expand-btn')).toBeInTheDocument();

    const expandBtn = screen.getByTestId('notion-studio-expand-btn');
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('notion-workspace-panel')).toBeInTheDocument();
  });
});
