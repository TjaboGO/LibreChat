import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import InteractiveResearchCard from '../InteractiveResearchCard';

describe('InteractiveResearchCard', () => {
  it('renders research card with topic and default queries and sources', () => {
    render(
      <RecoilRoot>
        <InteractiveResearchCard
          args={{ topic: 'Quantum Machine Learning' }}
          output={JSON.stringify({
            status: 'completed',
            progress: 100,
            summary: 'Comprehensive multi-hop deep research completed.',
          })}
        />
      </RecoilRoot>,
    );

    expect(screen.getByTestId('interactive-research-card')).toBeInTheDocument();
    expect(screen.getByText(/Deep Research: Quantum Machine Learning/i)).toBeInTheDocument();
    expect(screen.getByText('Multi-Hop Query Tree (4)')).toBeInTheDocument();
    expect(screen.getByText('Authoritative Citations Grounded (2)')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('allows toggling query tree and sources accordion', () => {
    render(
      <RecoilRoot>
        <InteractiveResearchCard
          args={{
            topic: 'Autonomous Driving',
            queries: [{ id: 'q1', query: 'LiDAR vs Vision models', depth: 0, resultsCount: 10 }],
            sources: [{ id: 1, url: 'https://arxiv.org/abs/123', title: 'Vision Paper', reliability: 'academic' }],
          }}
        />
      </RecoilRoot>,
    );

    expect(screen.getByText(/LiDAR vs Vision models/i)).toBeInTheDocument();

    const toggleTreeBtn = screen.getByText(/Multi-Hop Query Tree/i);
    fireEvent.click(toggleTreeBtn);

    // After collapse, query item should not be visible
    expect(screen.queryByText(/LiDAR vs Vision models/i)).not.toBeInTheDocument();
  });
});
