import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeAndFocusTab from '../TimeAndFocusTab';

describe('TimeAndFocusTab', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders break reminders and quiet hours matching screenshot 17.00.40', () => {
    render(<TimeAndFocusTab />);

    expect(screen.getByText('Time and focus')).toBeInTheDocument();
    expect(screen.getByText('Break reminders')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Get a nudge to take a break from Claude. You can snooze or adjust anytime.',
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Quiet hours')).toBeInTheDocument();
    expect(
      screen.getByText('Set time limits for Claude. You can dismiss or adjust anytime.'),
    ).toBeInTheDocument();

    // Verify 7 day buttons (S, M, T, W, T, F, S)
    expect(screen.getByTestId('quiet-day-0')).toHaveTextContent('S');
    expect(screen.getByTestId('quiet-day-1')).toHaveTextContent('M');
    expect(screen.getByTestId('quiet-day-2')).toHaveTextContent('T');
    expect(screen.getByTestId('quiet-day-3')).toHaveTextContent('W');
    expect(screen.getByTestId('quiet-day-4')).toHaveTextContent('T');
    expect(screen.getByTestId('quiet-day-5')).toHaveTextContent('F');
    expect(screen.getByTestId('quiet-day-6')).toHaveTextContent('S');
  });

  it('updates break reminder interval and duration and saves to localStorage', () => {
    render(<TimeAndFocusTab />);

    const intervalSelect = screen.getByTestId('break-interval-select');
    const durationSelect = screen.getByTestId('break-duration-select');

    fireEvent.change(intervalSelect, { target: { value: '50m' } });
    fireEvent.change(durationSelect, { target: { value: '10m' } });

    expect(intervalSelect).toHaveValue('50m');
    expect(durationSelect).toHaveValue('10m');

    const stored = JSON.parse(localStorage.getItem('claude_time_and_focus_prefs') || '{}');
    expect(stored.breakInterval).toBe('50m');
    expect(stored.breakDuration).toBe('10m');
  });

  it('toggles quiet days and displays time range inputs when active', () => {
    render(<TimeAndFocusTab />);

    // Initially no days selected, time range inputs not present
    expect(screen.queryByTestId('quiet-start-input')).not.toBeInTheDocument();

    // Toggle Monday (day 1) and Friday (day 5)
    const monBtn = screen.getByTestId('quiet-day-1');
    const friBtn = screen.getByTestId('quiet-day-5');

    fireEvent.click(monBtn);
    fireEvent.click(friBtn);

    // Inputs now visible
    const startInput = screen.getByTestId('quiet-start-input');
    const endInput = screen.getByTestId('quiet-end-input');

    expect(startInput).toBeInTheDocument();
    expect(endInput).toBeInTheDocument();

    // Change start and end times
    fireEvent.change(startInput, { target: { value: '23:00' } });
    fireEvent.change(endInput, { target: { value: '08:00' } });

    expect(startInput).toHaveValue('23:00');
    expect(endInput).toHaveValue('08:00');

    const stored = JSON.parse(localStorage.getItem('claude_time_and_focus_prefs') || '{}');
    expect(stored.quietDays).toEqual([1, 5]);
    expect(stored.quietStart).toBe('23:00');
    expect(stored.quietEnd).toBe('08:00');
  });
});
