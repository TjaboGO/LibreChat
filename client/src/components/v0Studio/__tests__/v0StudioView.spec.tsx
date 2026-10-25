import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import v0StudioView from '../v0StudioView';

describe('v0StudioView (Fas 40)', () => {
  it('renders v0 Studio header and runner stage by default', () => {
    render(<v0StudioView />);

    expect(screen.getByText('v0 Studio')).toBeInTheDocument();
    expect(screen.getByText('shadcn/ui & React 19')).toBeInTheDocument();
    expect(screen.getByTestId('v0-runner-stage')).toBeInTheDocument();
  });

  it('switches multi-viewport modes (Desktop, Tablet, Mobile)', () => {
    render(<v0StudioView />);

    const tabletBtn = screen.getByTestId('v0-viewport-tablet');
    fireEvent.click(tabletBtn);

    const stage = screen.getByTestId('v0-runner-stage');
    expect(stage).toHaveStyle('width: 768px');

    const mobileBtn = screen.getByTestId('v0-viewport-mobile');
    fireEvent.click(mobileBtn);
    expect(stage).toHaveStyle('width: 375px');
  });

  it('switches to AskUserQuestions tab and submits clarification answers', () => {
    const mockSelectPrompt = jest.fn();
    render(<v0StudioView onSelectPrompt={mockSelectPrompt} />);

    const questionsTab = screen.getByTestId('v0-tab-questions');
    fireEvent.click(questionsTab);

    expect(screen.getByTestId('v0-questions-stage')).toBeInTheDocument();
    expect(screen.getByText('Interactive Clarification Card')).toBeInTheDocument();

    const submitBtn = screen.getByTestId('v0-submit-answers-btn');
    fireEvent.click(submitBtn);

    expect(screen.getByText('✓ Answers submitted to v0')).toBeInTheDocument();
    expect(mockSelectPrompt).toHaveBeenCalledTimes(1);
  });

  it('switches to TSX Code tab and displays code snippet', () => {
    render(<v0StudioView />);

    const codeTab = screen.getByTestId('v0-tab-code');
    fireEvent.click(codeTab);

    expect(screen.getByTestId('v0-code-stage')).toBeInTheDocument();
    expect(screen.getByText(/export default function AnalyticsDashboard/)).toBeInTheDocument();
  });

  it('collapses to slim vertical dock and expands back', () => {
    render(<v0StudioView />);

    const collapseBtn = screen.getByTestId('v0-studio-collapse-btn');
    fireEvent.click(collapseBtn);

    expect(screen.getByTestId('v0-studio-collapsed')).toBeInTheDocument();
    expect(screen.getByTestId('v0-studio-expand-btn')).toBeInTheDocument();

    const expandBtn = screen.getByTestId('v0-studio-expand-btn');
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('v0-studio-expanded')).toBeInTheDocument();
  });
});
