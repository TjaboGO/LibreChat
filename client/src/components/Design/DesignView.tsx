import React, { useState } from 'react';
import DesignLandingPage from './DesignLandingPage';
import DesignCanvasView from './DesignCanvasView';

export default function DesignView() {
  const [activeProject, setActiveProject] = useState<{
    title: string;
    designSystem: string;
  } | null>(null);

  if (activeProject) {
    return (
      <DesignCanvasView
        projectTitle={activeProject.title}
        designSystemName={activeProject.designSystem}
        onBack={() => setActiveProject(null)}
      />
    );
  }

  return (
    <DesignLandingPage
      onOpenProject={(title, designSystem) => setActiveProject({ title, designSystem })}
    />
  );
}
