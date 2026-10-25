import React from 'react';
import CognitiveStyleSelector from './CognitiveStyleSelector';
import ProjectPickerDropdown from './ProjectPickerDropdown';
import AutoApprovalDropdown from './AutoApprovalDropdown';
import OutputFormatDropdown from './OutputFormatDropdown';

interface ComposerQuickTogglesProps {
  index?: number;
}

export default function ComposerQuickToggles({ index = 0 }: ComposerQuickTogglesProps) {
  return (
    <div className="mt-2 flex items-center gap-2 px-1 text-xs">
      <ProjectPickerDropdown />
      <span className="text-text-tertiary/40">·</span>
      <AutoApprovalDropdown index={index} />
      <span className="text-text-tertiary/40">·</span>
      <OutputFormatDropdown index={index} />
      <span className="text-text-tertiary/40">·</span>
      <CognitiveStyleSelector index={index} />
    </div>
  );
}
