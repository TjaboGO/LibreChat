import React from 'react';
import '@testing-library/jest-dom';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import ComposerQuickToggles from '../ComposerQuickToggles';

describe('ComposerQuickToggles', () => {
  const setup = () => {
    render(
      <RecoilRoot>
        <ComposerQuickToggles index={0} />
      </RecoilRoot>,
    );
  };

  it('renders Project, Auto, and Output quicktoggles', () => {
    setup();
    expect(screen.getByText(/project or folder/i)).toBeInTheDocument();
    expect(screen.getByText(/auto/i)).toBeInTheDocument();
    expect(screen.getByText(/output/i)).toBeInTheDocument();
  });

  it('opens Output format dropdown and lists all formats', async () => {
    setup();
    const outputBtn = screen.getByRole('button', { name: /output/i });
    await userEvent.click(outputBtn);

    expect(screen.getByText(/docs/i)).toBeInTheDocument();
    expect(screen.getByText(/slides/i)).toBeInTheDocument();
    expect(screen.getByText(/design/i)).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /artifact/i })).toBeInTheDocument();
  });

  it('opens Auto approval mode dropdown and lists approval options', async () => {
    setup();
    const autoBtn = screen.getByRole('button', { name: /auto/i });
    await userEvent.click(autoBtn);

    expect(screen.getByText(/manually approve/i)).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /automatically approve/i })).toBeInTheDocument();
    expect(screen.getByText(/skip all approvals/i)).toBeInTheDocument();
  });

  it('opens Project picker dropdown and shows Pinned projects and actions', async () => {
    setup();
    const projectBtn = screen.getByRole('button', { name: /project or folder/i });
    await userEvent.click(projectBtn);

    expect(screen.getByPlaceholderText(/search projects/i)).toBeInTheDocument();
    expect(screen.getByText(/pinned/i)).toBeInTheDocument();
    expect(screen.getByText(/new project/i)).toBeInTheDocument();
    expect(screen.getByText(/add folder/i)).toBeInTheDocument();
  });
});
