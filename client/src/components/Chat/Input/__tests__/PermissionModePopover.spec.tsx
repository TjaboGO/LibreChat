import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, fireEvent } from '@testing-library/react';
import PermissionModePopover from '../PermissionModePopover';

describe('PermissionModePopover', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders with default Auto mode', () => {
    render(
      <RecoilRoot>
        <PermissionModePopover index={0} />
      </RecoilRoot>,
    );

    const button = screen.getByRole('button', { name: /permission mode: auto/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Auto')).toBeInTheDocument();
  });

  it('opens popover showing Manual and Auto choices', () => {
    render(
      <RecoilRoot>
        <PermissionModePopover index={0} />
      </RecoilRoot>,
    );

    const button = screen.getByRole('button', { name: /permission mode: auto/i });
    fireEvent.click(button);

    expect(screen.getByText('Permission mode')).toBeInTheDocument();
    expect(
      screen.getByText('Claude asks before using new tools or opening new sites.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Claude runs on its own and pauses to ask if anything looks unsafe.'),
    ).toBeInTheDocument();
  });

  it('selects Manual mode and sets codeApprovalMode to ask', () => {
    const mockSetConversation = jest.fn();
    render(
      <RecoilRoot>
        <PermissionModePopover
          index={0}
          conversation={{ conversationId: 'c1' } as any}
          setConversation={mockSetConversation}
        />
      </RecoilRoot>,
    );

    const button = screen.getByRole('button', { name: /permission mode: auto/i });
    fireEvent.click(button);

    const manualOption = screen.getByText(
      'Claude asks before using new tools or opening new sites.',
    );
    fireEvent.click(manualOption);

    expect(localStorage.getItem('claude_permission_mode')).toBe('manual');
    expect(mockSetConversation).toHaveBeenCalled();
  });
});
