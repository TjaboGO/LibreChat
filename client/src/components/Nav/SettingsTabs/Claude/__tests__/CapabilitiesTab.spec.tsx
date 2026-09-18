import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CapabilitiesTab from '../CapabilitiesTab';

describe('CapabilitiesTab', () => {
  it('renders general, visuals, and code execution sections', () => {
    render(<CapabilitiesTab />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Tool access mode')).toBeInTheDocument();
    expect(screen.getByText('Connector search')).toBeInTheDocument();
    expect(screen.getByText('Switch models when a message is flagged')).toBeInTheDocument();

    expect(screen.getByText('Visuals')).toBeInTheDocument();
    expect(screen.getByText('Artifacts')).toBeInTheDocument();
    expect(screen.getByText('AI-powered artifacts')).toBeInTheDocument();
    expect(screen.getByText('Inline visualizations')).toBeInTheDocument();

    expect(screen.getByText('Code execution and file creation')).toBeInTheDocument();
    expect(screen.getByText('Cloud code execution and file creation')).toBeInTheDocument();
    expect(screen.getByText('Allow network egress')).toBeInTheDocument();
    expect(screen.getByText('Domain allowlist')).toBeInTheDocument();
  });

  it('allows changing tool access mode dropdown', async () => {
    const user = userEvent.setup();
    render(<CapabilitiesTab />);

    const select = screen.getByLabelText('Tool access mode');
    expect(select).toHaveValue('loaded');

    await user.selectOptions(select, 'ondemand');
    expect(select).toHaveValue('ondemand');
  });

  it('triggers onNavigateTab when clicking Customize link in Skills section', async () => {
    const user = userEvent.setup();
    const onNavigateTab = jest.fn();
    render(<CapabilitiesTab onNavigateTab={onNavigateTab} />);

    const customizeLink = screen.getByText('Customize');
    await user.click(customizeLink);
    expect(onNavigateTab).toHaveBeenCalledWith('skills');
  });
});
