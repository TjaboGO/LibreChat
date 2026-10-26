import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import FullStackStudio from '../FullStackStudio';

describe('FullStackStudio (Fas 41: Lovable & Bolt.new)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Lovable Studio Rendering', () => {
    it('renders Lovable Studio header, tabs, and live preview stage by default', () => {
      render(<FullStackStudio appId="lovable" />);

      expect(screen.getByText('Lovable Studio')).toBeInTheDocument();
      expect(screen.getByText('Full-Stack')).toBeInTheDocument();
      expect(screen.getByTestId('fullstack-studio-panel')).toBeInTheDocument();
      expect(screen.getByTestId('fullstack-preview-stage')).toBeInTheDocument();
      expect(screen.getByText('http://')).toBeInTheDocument();
      expect(screen.getByText('localhost:5173/')).toBeInTheDocument();
    });

    it('collapses to slim vertical dock and expands back for Lovable', () => {
      render(<FullStackStudio appId="lovable" />);

      const collapseBtn = screen.getByTestId('lovable-studio-collapse-btn');
      fireEvent.click(collapseBtn);

      expect(screen.getByTestId('lovable-studio-collapsed')).toBeInTheDocument();
      expect(screen.getByTestId('lovable-studio-expand-btn')).toBeInTheDocument();

      const expandBtn = screen.getByTestId('lovable-studio-expand-btn');
      fireEvent.click(expandBtn);

      expect(screen.getByTestId('fullstack-studio-panel')).toBeInTheDocument();
    });
  });

  describe('Bolt.new Rendering', () => {
    it('renders Bolt.new header and WebContainers badge', () => {
      render(<FullStackStudio appId="bolt" />);

      expect(screen.getByText('Bolt.new')).toBeInTheDocument();
      expect(screen.getByText('WebContainers')).toBeInTheDocument();
      expect(screen.getByTestId('fullstack-studio-panel')).toBeInTheDocument();
    });

    it('collapses to slim vertical dock and expands back for Bolt', () => {
      render(<FullStackStudio appId="bolt" />);

      const collapseBtn = screen.getByTestId('bolt-studio-collapse-btn');
      fireEvent.click(collapseBtn);

      expect(screen.getByTestId('bolt-studio-collapsed')).toBeInTheDocument();
      expect(screen.getByTestId('bolt-studio-expand-btn')).toBeInTheDocument();

      const expandBtn = screen.getByTestId('bolt-studio-expand-btn');
      fireEvent.click(expandBtn);

      expect(screen.getByTestId('fullstack-studio-panel')).toBeInTheDocument();
    });
  });

  describe('Supabase SQL Schema Studio', () => {
    it('switches to Supabase SQL tab, changes table, and displays schema & RLS policies', () => {
      render(<FullStackStudio appId="lovable" />);

      const supabaseTab = screen.getByTestId('fullstack-tab-supabase');
      fireEvent.click(supabaseTab);

      expect(screen.getByTestId('fullstack-supabase-stage')).toBeInTheDocument();
      expect(screen.getByText('Row-Level Security (RLS) Policies')).toBeInTheDocument();
      expect(screen.getByText('RLS ENABLED')).toBeInTheDocument();

      // Change table to products
      const tableSelect = screen.getByTestId('fullstack-table-select');
      fireEvent.change(tableSelect, { target: { value: 'products' } });

      expect(screen.getByText('price_cents')).toBeInTheDocument();
      expect(screen.getByText('products_select_public')).toBeInTheDocument();
      expect(screen.getByText('products_admin_modify')).toBeInTheDocument();
    });

    it('simulates running SQL migration with success notification', () => {
      render(<FullStackStudio appId="lovable" />);

      const supabaseTab = screen.getByTestId('fullstack-tab-supabase');
      fireEvent.click(supabaseTab);

      const runBtn = screen.getByTestId('fullstack-sql-runner-btn');
      fireEvent.click(runBtn);

      expect(screen.getByText('Applying migration to Supabase PostgreSQL...')).toBeInTheDocument();

      jest.advanceTimersByTime(700);

      expect(screen.getByText('Migration applied successfully! RLS policies active.')).toBeInTheDocument();
    });

    it('copies SQL migration to clipboard', () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockImplementation(() => Promise.resolve()),
        },
      });

      render(<FullStackStudio appId="bolt" />);

      const supabaseTab = screen.getByTestId('fullstack-tab-supabase');
      fireEvent.click(supabaseTab);

      const copyBtn = screen.getByTestId('fullstack-export-sql-btn');
      fireEvent.click(copyBtn);

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  describe('Starter Templates & Console', () => {
    it('switches to templates tab and triggers onSelectPrompt when clicking Use Starter', () => {
      const mockSelectPrompt = jest.fn();
      render(<FullStackStudio appId="lovable" onSelectPrompt={mockSelectPrompt} />);

      const templatesTab = screen.getByTestId('fullstack-tab-templates');
      fireEvent.click(templatesTab);

      expect(screen.getByTestId('fullstack-templates-stage')).toBeInTheDocument();
      expect(screen.getByText('SaaS Supabase Starter')).toBeInTheDocument();
      expect(screen.getByText('Real-Time Chat & Collab')).toBeInTheDocument();
      expect(screen.getByText('Modern E-Commerce Store')).toBeInTheDocument();

      const useStarterButtons = screen.getAllByText('Use Starter');
      fireEvent.click(useStarterButtons[0]);

      expect(mockSelectPrompt).toHaveBeenCalledTimes(1);
      expect(mockSelectPrompt.mock.calls[0][0]).toContain('Build a full-stack SaaS dashboard');
    });

    it('clears console logs when clicking Clear Logs', () => {
      render(<FullStackStudio appId="lovable" />);

      expect(screen.getByText(/DevServer Console/)).toBeInTheDocument();
      const clearBtn = screen.getByTestId('fullstack-console-clear-btn');
      fireEvent.click(clearBtn);

      expect(screen.getByText('No console output')).toBeInTheDocument();
    });
  });
});
