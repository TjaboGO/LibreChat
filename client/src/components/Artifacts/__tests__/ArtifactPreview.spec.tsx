import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { ArtifactPreview } from '../ArtifactPreview';

jest.mock('@codesandbox/sandpack-react/unstyled', () => ({
  SandpackProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sandpack-provider">{children}</div>
  ),
  SandpackPreview: React.forwardRef((_props, _ref) => (
    <div data-testid="sandpack-preview">Sandpack Preview Content</div>
  )),
}));

describe('ArtifactPreview', () => {
  const mockFiles = {
    '/App.tsx': { code: 'export default function App() { return <div>Hello</div>; }' },
  };
  const mockRef = { current: {} as any };

  it('renders viewport control bar with Desktop, Tablet, and Mobile buttons', () => {
    render(
      <ArtifactPreview
        files={mockFiles}
        fileKey="/App.tsx"
        template="react-ts"
        sharedProps={{}}
        previewRef={mockRef}
      />,
    );

    expect(screen.getByText('Viewport:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /desktop/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tablet/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mobile/i })).toBeInTheDocument();
    expect(screen.getByText('100% Fluid')).toBeInTheDocument();
    expect(screen.getByTestId('sandpack-preview')).toBeInTheDocument();
  });

  it('switches viewports to Tablet and Mobile on click', async () => {
    const user = userEvent.setup();
    render(
      <ArtifactPreview
        files={mockFiles}
        fileKey="/App.tsx"
        template="react-ts"
        sharedProps={{}}
        previewRef={mockRef}
      />,
    );

    const tabletBtn = screen.getByRole('button', { name: /tablet/i });
    await user.click(tabletBtn);
    expect(screen.getByText('768 × 1024')).toBeInTheDocument();

    const mobileBtn = screen.getByRole('button', { name: /mobile/i });
    await user.click(mobileBtn);
    expect(screen.getByText('375 × 667')).toBeInTheDocument();

    const desktopBtn = screen.getByRole('button', { name: /desktop/i });
    await user.click(desktopBtn);
    expect(screen.getByText('100% Fluid')).toBeInTheDocument();
  });
});
