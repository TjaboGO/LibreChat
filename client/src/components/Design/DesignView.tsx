import React, { useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import DesignLandingPage from './DesignLandingPage';
import DesignCanvasView from './DesignCanvasView';
import store from '~/store';

export default function DesignView() {
  const currentArtifactId = useRecoilValue(store.currentArtifactId);
  const artifactsRecord = useRecoilValue(store.artifactsState);
  const resetCurrentArtifactId = useResetRecoilState(store.currentArtifactId);

  const [activeProject, setActiveProject] = useState<{
    title: string;
    designSystem: string;
  } | null>(null);

  const [dismissedArtifactId, setDismissedArtifactId] = useState<string | null>(null);

  // If there's an active artifact from chat / artifacts pipeline and it hasn't been dismissed
  const activeArtifact =
    currentArtifactId && currentArtifactId !== dismissedArtifactId
      ? artifactsRecord?.[currentArtifactId]
      : null;

  const handleBack = () => {
    setActiveProject(null);
    if (currentArtifactId) {
      setDismissedArtifactId(currentArtifactId);
      resetCurrentArtifactId();
    }
  };

  if (activeProject) {
    return (
      <DesignCanvasView
        projectTitle={activeProject.title}
        designSystemName={activeProject.designSystem}
        onBack={handleBack}
      />
    );
  }

  if (activeArtifact) {
    return (
      <DesignCanvasView
        projectTitle={activeArtifact.title || 'Design Project'}
        designSystemName="Modernist"
        onBack={handleBack}
      />
    );
  }

  return (
    <DesignLandingPage
      onOpenProject={(title, designSystem) => {
        setDismissedArtifactId(null);
        setActiveProject({ title, designSystem });
      }}
    />
  );
}
