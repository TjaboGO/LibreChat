import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import CodingStudioWorkspaceView from '../CodingStudioWorkspaceView';

jest.mock('../CursorDiffStudio', () => {
  return function MockCursorDiffStudio() {
    return <div data-testid="cursor-diff-studio-mock">Cursor Diff Studio Mock</div>;
  };
});

jest.mock('../WindsurfDevServerStudio', () => {
  return function MockWindsurfDevServerStudio() {
    return <div data-testid="windsurf-studio-mock">Windsurf Studio Mock</div>;
  };
});

jest.mock('../KiroDualModeStudio', () => {
  return function MockKiroDualModeStudio() {
    return <div data-testid="kiro-studio-mock">Kiro Studio Mock</div>;
  };
});

describe('CodingStudioWorkspaceView (Fas 39)', () => {
  it('mounts CursorDiffStudio when appId is cursor', () => {
    render(<CodingStudioWorkspaceView appId="cursor" />);

    expect(screen.getByTestId('coding-studio-expanded')).toBeInTheDocument();
    expect(screen.getByTestId('cursor-diff-studio-mock')).toBeInTheDocument();
  });

  it('mounts WindsurfDevServerStudio when appId is windsurf', () => {
    render(<CodingStudioWorkspaceView appId="windsurf" />);

    expect(screen.getByTestId('coding-studio-expanded')).toBeInTheDocument();
    expect(screen.getByTestId('windsurf-studio-mock')).toBeInTheDocument();
  });

  it('mounts KiroDualModeStudio when appId is kiro', () => {
    render(<CodingStudioWorkspaceView appId="kiro" />);

    expect(screen.getByTestId('coding-studio-expanded')).toBeInTheDocument();
    expect(screen.getByTestId('kiro-studio-mock')).toBeInTheDocument();
  });

  it('collapses into slim vertical dock and re-expands', () => {
    render(<CodingStudioWorkspaceView appId="cursor" />);

    const collapseBtn = screen.getByTestId('cursor-studio-collapse-btn');
    fireEvent.click(collapseBtn);

    expect(screen.getByTestId('coding-studio-collapsed')).toBeInTheDocument();
    expect(screen.getByTestId('cursor-studio-expand-btn')).toBeInTheDocument();

    const expandBtn = screen.getByTestId('cursor-studio-expand-btn');
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('coding-studio-expanded')).toBeInTheDocument();
  });
});
