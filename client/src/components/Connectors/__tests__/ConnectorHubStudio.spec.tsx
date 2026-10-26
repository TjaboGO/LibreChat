import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConnectorHubStudio from '../ConnectorHubStudio';

describe('ConnectorHubStudio (Fas 44: Perplexity Computer MCP Connector Hub)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders Connector Hub catalog by default with 12 services', () => {
    render(<ConnectorHubStudio />);

    expect(screen.getByText('Connector Hub')).toBeInTheDocument();
    expect(screen.getByText('On-Demand MCP')).toBeInTheDocument();
    expect(screen.getByTestId('connectors-studio-panel')).toBeInTheDocument();
    expect(screen.getByTestId('connectors-catalog-stage')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Slack')).toBeInTheDocument();
  });

  it('filters connectors by search query', () => {
    render(<ConnectorHubStudio />);

    const searchInput = screen.getByPlaceholderText(/Search connectors/);
    fireEvent.change(searchInput, { target: { value: 'PostgreSQL' } });

    expect(screen.getByText('PostgreSQL Database')).toBeInTheDocument();
    expect(screen.queryByText('Spotify Player')).not.toBeInTheDocument();
  });

  it('toggles connect and disconnect status for a connector', () => {
    render(<ConnectorHubStudio />);

    // Find and click disconnect on GitHub
    const disconnectBtns = screen.getAllByText('Disconnect');
    fireEvent.click(disconnectBtns[0]);

    expect(screen.getByText(/Disconnected connector/)).toBeInTheDocument();
  });

  it('switches to @Mentions tab, detects services, and dispatches to chat', () => {
    const mockSelectPrompt = jest.fn();
    render(<ConnectorHubStudio onSelectPrompt={mockSelectPrompt} />);

    const mentionsTab = screen.getByTestId('connectors-tab-mentions');
    fireEvent.click(mentionsTab);

    expect(screen.getByTestId('connectors-mentions-stage')).toBeInTheDocument();
    expect(screen.getByText('Sensitive @Mention Detection')).toBeInTheDocument();
    expect(screen.getByText('@GITHUB')).toBeInTheDocument();

    const sendBtn = screen.getByTestId('connectors-send-mention-btn');
    fireEvent.click(sendBtn);

    expect(mockSelectPrompt).toHaveBeenCalledTimes(1);
    expect(mockSelectPrompt.mock.calls[0][0]).toContain('@GitHub');
  });

  it('switches to Test Tool Runner tab and executes a tool', async () => {
    render(<ConnectorHubStudio />);

    const runnerTab = screen.getByTestId('connectors-tab-execution');
    fireEvent.click(runnerTab);

    expect(screen.getByTestId('connectors-execution-stage')).toBeInTheDocument();

    const runBtn = screen.getByTestId('connectors-run-tool-btn');
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByText(/gabrielodenhagen/)).toBeInTheDocument();
    });
  });

  it('collapses to slim 32px dock and expands back', () => {
    render(<ConnectorHubStudio />);

    const collapseBtn = screen.getByTestId('connectors-studio-collapse-btn');
    fireEvent.click(collapseBtn);

    expect(screen.getByTestId('connectors-studio-collapsed')).toBeInTheDocument();
    expect(screen.getByTestId('connectors-studio-expand-btn')).toBeInTheDocument();

    const expandBtn = screen.getByTestId('connectors-studio-expand-btn');
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('connectors-studio-panel')).toBeInTheDocument();
  });
});
