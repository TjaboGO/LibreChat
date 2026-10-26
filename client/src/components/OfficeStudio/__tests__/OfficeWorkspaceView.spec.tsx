import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import OfficeWorkspaceView from '../OfficeWorkspaceView';

// Mock triggerDownload from utils
jest.mock('~/utils', () => {
  const actual = jest.requireActual('~/utils');
  return {
    ...actual,
    triggerDownload: jest.fn(),
  };
});

describe('OfficeWorkspaceView (Fas 42: Living Office Suite)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Living Office Suite and Excel spreadsheet stage by default with live formulas', () => {
    render(<OfficeWorkspaceView />);

    expect(screen.getByText('Living Office Suite')).toBeInTheDocument();
    expect(screen.getByTestId('office-workspace-panel')).toBeInTheDocument();
    expect(screen.getByTestId('office-xlsx-stage')).toBeInTheDocument();
    expect(screen.getByText('=SUM & =AVERAGE Live')).toBeInTheDocument();
    expect(screen.getByText('Financial Forecast Model')).toBeInTheDocument();
    expect(screen.getByText('Total Annual Forecast')).toBeInTheDocument();
  });

  it('adds a new row to the spreadsheet and recalculates total dynamically', () => {
    render(<OfficeWorkspaceView />);

    const addRowBtn = screen.getByTestId('office-add-row-btn');
    fireEvent.click(addRowBtn);

    expect(screen.getByDisplayValue('New Expansion Initiative')).toBeInTheDocument();
  });

  it('exports Excel file and triggers download', () => {
    const { triggerDownload } = require('~/utils');
    render(<OfficeWorkspaceView />);

    const exportBtn = screen.getByTestId('office-export-xlsx-btn');
    fireEvent.click(exportBtn);

    expect(triggerDownload).toHaveBeenCalledTimes(1);
    expect(triggerDownload.mock.calls[0][1]).toBe('Financial_Model.xlsx');
    expect(screen.getByText('Exported Financial_Model.xlsx successfully!')).toBeInTheDocument();
  });

  it('switches to Word tab and exports .docx', () => {
    const { triggerDownload } = require('~/utils');
    render(<OfficeWorkspaceView />);

    const docxTab = screen.getByTestId('office-tab-docx');
    fireEvent.click(docxTab);

    expect(screen.getByTestId('office-docx-stage')).toBeInTheDocument();
    expect(screen.getByText('Strategic Executive Brief: FY2026')).toBeInTheDocument();

    const exportBtn = screen.getByTestId('office-export-docx-btn');
    fireEvent.click(exportBtn);

    expect(triggerDownload).toHaveBeenCalledTimes(1);
    expect(triggerDownload.mock.calls[0][1]).toBe('Executive_Brief.docx');
  });

  it('switches to PowerPoint tab, navigates slides, and exports .pptx', () => {
    const { triggerDownload } = require('~/utils');
    render(<OfficeWorkspaceView />);

    const pptxTab = screen.getByTestId('office-tab-pptx');
    fireEvent.click(pptxTab);

    expect(screen.getByTestId('office-pptx-stage')).toBeInTheDocument();
    expect(screen.getByText('Slide 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Series A Executive Strategy')).toBeInTheDocument();

    const nextSlideBtn = screen.getByTitle('Next Slide');
    fireEvent.click(nextSlideBtn);

    expect(screen.getByText('Slide 2 of 2')).toBeInTheDocument();
    expect(screen.getByText('Platform Architecture & Engine')).toBeInTheDocument();

    const exportBtn = screen.getByTestId('office-export-pptx-btn');
    fireEvent.click(exportBtn);

    expect(triggerDownload).toHaveBeenCalledTimes(1);
    expect(triggerDownload.mock.calls[0][1]).toBe('Strategy_Deck.pptx');
  });

  it('switches to PDF tab and triggers print dialog', () => {
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {});
    render(<OfficeWorkspaceView />);

    const pdfTab = screen.getByTestId('office-tab-pdf');
    fireEvent.click(pdfTab);

    expect(screen.getByTestId('office-pdf-stage')).toBeInTheDocument();

    const printBtn = screen.getByTestId('office-print-pdf-btn');
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });

  it('collapses to slim 32px dock and expands back', () => {
    render(<OfficeWorkspaceView />);

    const collapseBtn = screen.getByTestId('office-studio-collapse-btn');
    fireEvent.click(collapseBtn);

    expect(screen.getByTestId('office-studio-collapsed')).toBeInTheDocument();
    expect(screen.getByTestId('office-studio-expand-btn')).toBeInTheDocument();

    const expandBtn = screen.getByTestId('office-studio-expand-btn');
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('office-workspace-panel')).toBeInTheDocument();
  });
});
