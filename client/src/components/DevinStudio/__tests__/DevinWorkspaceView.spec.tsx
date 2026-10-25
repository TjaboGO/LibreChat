import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import DevinWorkspaceView from '../DevinWorkspaceView';

jest.mock('../DeepWikiPanel', () => {
  return function MockDeepWikiPanel() {
    return <div data-testid="deepwiki-panel-mock">DeepWiki Panel Mock</div>;
  };
});

describe('DevinWorkspaceView (Fas 38)', () => {
  it('renders expanded workspace view by default', () => {
    render(<DevinWorkspaceView />);

    expect(screen.getByTestId('devin-workspace-expanded')).toBeInTheDocument();
    expect(screen.getByTestId('deepwiki-panel-mock')).toBeInTheDocument();
  });

  it('collapses to slim vertical dock when collapse button is clicked', () => {
    render(<DevinWorkspaceView />);

    const collapseBtn = screen.getByTestId('devin-workspace-collapse-btn');
    fireEvent.click(collapseBtn);

    expect(screen.getByTestId('devin-workspace-collapsed')).toBeInTheDocument();
    expect(screen.getByTestId('devin-workspace-expand-btn')).toBeInTheDocument();
  });

  it('expands back when expand button is clicked', () => {
    render(<DevinWorkspaceView defaultCollapsed={true} />);

    expect(screen.getByTestId('devin-workspace-collapsed')).toBeInTheDocument();

    const expandBtn = screen.getByTestId('devin-workspace-expand-btn');
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('devin-workspace-expanded')).toBeInTheDocument();
    expect(screen.getByTestId('deepwiki-panel-mock')).toBeInTheDocument();
  });
});
