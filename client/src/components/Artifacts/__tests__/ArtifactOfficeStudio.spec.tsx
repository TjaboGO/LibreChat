import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Artifact } from '~/common/artifacts';
import ArtifactOfficeStudio from '../ArtifactOfficeStudio';

const mockTriggerDownload = jest.fn();
jest.mock('~/utils', () => ({
  ...jest.requireActual('~/utils'),
  triggerDownload: (...args: any[]) => mockTriggerDownload(...args),
}));

describe('ArtifactOfficeStudio (Living Office Artifacts)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wordArtifact: Artifact = {
    id: 'art-word-1',
    title: 'Strategic Brief.docx',
    type: 'docx',
    content: `# Strategic Brief
*Author: Gabriel Odenhagen*
*Date: 2026-02-15*

> [!NOTE] Executive Summary
> Strong double-digit revenue growth.

## 1. Roadmap Overview
Content paragraph for testing.

| Deliverable | Status |
| --- | --- |
| Office Suite | Ready |`,
    lastSaved: new Date().toISOString(),
  };

  it('renders Word document viewer with title, metadata, and sections', () => {
    render(<ArtifactOfficeStudio artifact={wordArtifact} />);

    expect(screen.getByTestId('word-document-viewer')).toBeInTheDocument();
    expect(screen.getByText('Strategic Brief')).toBeInTheDocument();
    expect(screen.getByText(/Gabriel Odenhagen/)).toBeInTheDocument();
    expect(screen.getByText(/Strong double-digit revenue growth/)).toBeInTheDocument();
    expect(screen.getByText('Roadmap Overview')).toBeInTheDocument();
    expect(screen.getByText('Office Suite')).toBeInTheDocument();
  });

  it('allows switching to Excel (.xlsx) spreadsheet viewer', () => {
    render(<ArtifactOfficeStudio artifact={wordArtifact} />);

    const excelBtn = screen.getByRole('button', { name: /Excel \(\.xlsx\)/i });
    fireEvent.click(excelBtn);

    expect(screen.getByTestId('excel-spreadsheet-viewer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter value or formula/i)).toBeInTheDocument();
  });

  it('allows switching to PowerPoint (.pptx) presentation viewer and navigating slides', () => {
    const pptxArtifact: Artifact = {
      id: 'art-pptx-1',
      title: 'Deck.pptx',
      type: 'pptx',
      content: `# Pitch Deck
## Subtitle text
---
# Slide 2 Key Traction
ARR: $15M (+100%)
---
# Slide 3 Roadmap
- Feature A
- Feature B`,
      lastSaved: new Date().toISOString(),
    };

    render(<ArtifactOfficeStudio artifact={pptxArtifact} />);

    expect(screen.getByTestId('presentation-viewer')).toBeInTheDocument();
    expect(screen.getByText('Pitch Deck')).toBeInTheDocument();
    expect(screen.getByText(/1 of 3/i)).toBeInTheDocument();

    // Next slide
    const nextButtons = screen.getAllByRole('button');
    const nextBtn = nextButtons.find((btn) => btn.querySelector('svg.lucide-chevron-right'));
    if (nextBtn) {
      fireEvent.click(nextBtn);
      expect(screen.getByText(/2 of 3/i)).toBeInTheDocument();
      expect(screen.getByText('Slide 2 Key Traction')).toBeInTheDocument();
    }
  });

  it('triggers file download on export click', () => {
    render(<ArtifactOfficeStudio artifact={wordArtifact} />);

    const exportBtn = screen.getByRole('button', { name: /Export \.docx/i });
    fireEvent.click(exportBtn);

    expect(mockTriggerDownload).toHaveBeenCalledTimes(1);
  });
});
