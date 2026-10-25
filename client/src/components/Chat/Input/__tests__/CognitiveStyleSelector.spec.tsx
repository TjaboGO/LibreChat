import React from 'react';
import '@testing-library/jest-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import CognitiveStyleSelector from '../CognitiveStyleSelector';
import { cognitiveStyleFamily } from '~/store/families';

describe('CognitiveStyleSelector', () => {
  const StateObserver = ({ index = 0 }: { index?: number }) => {
    const style = useRecoilValue(cognitiveStyleFamily(index));
    return <div data-testid="current-style-state">{style}</div>;
  };

  const setup = (index = 0) => {
    return render(
      <RecoilRoot>
        <CognitiveStyleSelector index={index} />
        <StateObserver index={index} />
      </RecoilRoot>,
    );
  };

  it('renders trigger button with initial default style', () => {
    setup();
    const trigger = screen.getByTestId('cognitive-style-selector-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Style: Default');
    expect(screen.getByTestId('current-style-state')).toHaveTextContent('default');
  });

  it('opens dropdown and displays all 5 cognitive styles with slash commands', async () => {
    setup();
    const trigger = screen.getByTestId('cognitive-style-selector-trigger');
    await userEvent.click(trigger);

    expect(screen.getByText('Cognitive Persona Style')).toBeInTheDocument();
    expect(screen.getByText('/concise')).toBeInTheDocument();
    expect(screen.getByText('/learning')).toBeInTheDocument();
    expect(screen.getByText('/explanatory')).toBeInTheDocument();
    expect(screen.getByText('/proactive')).toBeInTheDocument();
    expect(screen.getByText('/default')).toBeInTheDocument();
  });

  it('selects concise style and updates recoil state', async () => {
    setup();
    const trigger = screen.getByTestId('cognitive-style-selector-trigger');
    await userEvent.click(trigger);

    const conciseOption = screen.getByText('/concise');
    await userEvent.click(conciseOption);

    expect(screen.getByTestId('current-style-state')).toHaveTextContent('concise');
  });

  it('selects learning style and updates trigger label', async () => {
    setup();
    const trigger = screen.getByTestId('cognitive-style-selector-trigger');
    await userEvent.click(trigger);

    const learningOption = screen.getByText('/learning');
    await userEvent.click(learningOption);

    expect(screen.getByTestId('current-style-state')).toHaveTextContent('learning');
    expect(trigger).toHaveTextContent('Style: Learning');
  });
});
