import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import type { FormCardData } from 'librechat-data-provider';
import InteractiveFormCard from '../InteractiveFormCard';

describe('InteractiveFormCard (AskUserQuestions / Generative UI)', () => {
  const sampleFormData: FormCardData = {
    title: 'Database & Auth Setup',
    description: 'Select your preferred stack components.',
    questions: [
      {
        id: 'database',
        question: 'Which database do you want to use?',
        options: [
          { label: 'PostgreSQL', value: 'PostgreSQL', isRecommended: true },
          { label: 'MongoDB', value: 'MongoDB' },
          { label: 'SQLite', value: 'SQLite' },
        ],
        isMultiSelect: false,
        allowOther: true,
      },
      {
        id: 'features',
        question: 'Which features should we enable?',
        options: [
          { label: 'Analytics', value: 'analytics' },
          { label: 'OAuth Login', value: 'oauth', isRecommended: true },
        ],
        isMultiSelect: true,
        allowOther: true,
      },
    ],
  };

  it('renders form card with header, questions, and options', () => {
    render(<InteractiveFormCard data={sampleFormData} />);

    expect(screen.getByText('Database & Auth Setup')).toBeInTheDocument();
    expect(screen.getByText('Select your preferred stack components.')).toBeInTheDocument();
    expect(screen.getByText('Which database do you want to use?')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    expect(screen.getAllByText('✦ Recommended')).toHaveLength(2);
  });

  it('pre-selects recommended option for single select by default', () => {
    const mockSubmit = jest.fn();
    render(<InteractiveFormCard data={sampleFormData} onSubmit={mockSubmit} />);

    // Click submit directly
    const submitButton = screen.getByRole('button', { name: /submit answers/i });
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const submission = mockSubmit.mock.calls[0][0];
    expect(submission.answers.database).toBe('PostgreSQL');
  });

  it('allows changing option selection', () => {
    const mockSubmit = jest.fn();
    render(<InteractiveFormCard data={sampleFormData} onSubmit={mockSubmit} />);

    // Select MongoDB instead
    const mongoOption = screen.getByRole('button', { name: /mongodb/i });
    fireEvent.click(mongoOption);

    const submitButton = screen.getByRole('button', { name: /submit answers/i });
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const submission = mockSubmit.mock.calls[0][0];
    expect(submission.answers.database).toBe('MongoDB');
  });

  it('handles multi-select toggling correctly', () => {
    const mockSubmit = jest.fn();
    render(<InteractiveFormCard data={sampleFormData} onSubmit={mockSubmit} />);

    // Toggle both analytics and oauth
    const analyticsOpt = screen.getByRole('button', { name: /analytics/i });
    const oauthOpt = screen.getByRole('button', { name: /oauth login/i });

    fireEvent.click(analyticsOpt);
    fireEvent.click(oauthOpt);

    const submitButton = screen.getByRole('button', { name: /submit answers/i });
    fireEvent.click(submitButton);

    const submission = mockSubmit.mock.calls[0][0];
    expect(submission.answers.features).toContain('analytics');
    expect(submission.answers.features).toContain('oauth');
  });

  it('allows typing custom text via "Write custom answer"', () => {
    const mockSubmit = jest.fn();
    render(<InteractiveFormCard data={sampleFormData} onSubmit={mockSubmit} />);

    const customButtons = screen.getAllByRole('button', { name: /\+ write custom answer/i });
    fireEvent.click(customButtons[0]);

    const input = screen.getByPlaceholderText(/type custom answer or notes/i);
    fireEvent.change(input, { target: { value: 'CockroachDB Serverless' } });

    const submitButton = screen.getByRole('button', { name: /submit answers/i });
    fireEvent.click(submitButton);

    const submission = mockSubmit.mock.calls[0][0];
    expect(submission.answers.database).toBe('CockroachDB Serverless');
  });

  it('switches to submitted state and shows checkmark badge upon submit', () => {
    render(<InteractiveFormCard data={sampleFormData} />);

    const submitButton = screen.getByRole('button', { name: /submit answers/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Answers Submitted')).toBeInTheDocument();
    // Options buttons should be disabled
    const postgreButton = screen.getByRole('button', { name: /postgresql/i });
    expect(postgreButton).toBeDisabled();
  });

  it('handles skip action and marks answers as skipped', () => {
    const mockSkip = jest.fn();
    render(<InteractiveFormCard data={sampleFormData} onSkip={mockSkip} />);

    const skipButton = screen.getByRole('button', { name: /skip & use defaults/i });
    fireEvent.click(skipButton);

    expect(mockSkip).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Answers Submitted')).toBeInTheDocument();
  });
});
