/* eslint-disable i18next/no-literal-string */
import React, { useMemo, useState, useCallback, useContext } from 'react';
import copy from 'copy-to-clipboard';
import { useRecoilValue } from 'recoil';
import { DiffEditor } from '@monaco-editor/react';
import { Button, ThemeContext } from '@librechat/client';
import {
  Check,
  RotateCcw,
  Columns,
  AlignJustify,
  Copy,
  GitCompare,
  CheckCheck,
} from 'lucide-react';
import type { Artifact } from '~/common';
import { useCodeState, useMutationState } from '~/Providers/EditorContext';
import { getMonacoLanguage } from './ArtifactCodeEditor';
import { useEditArtifact } from '~/data-provider';
import { cn } from '~/utils';
import store from '~/store';

interface ArtifactDiffEditorProps {
  artifact: Artifact;
  readOnly?: boolean;
}

export default function ArtifactDiffEditor({
  artifact,
  readOnly = false,
}: ArtifactDiffEditorProps) {
  const artifacts = useRecoilValue(store.artifactsState);
  const { currentCode, setCurrentCode } = useCodeState();
  const { isMutating, setIsMutating } = useMutationState();
  const [isSideBySide, setIsSideBySide] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const themeContext = useContext(ThemeContext);
  const isDark =
    themeContext?.theme === 'dark' ||
    (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  const monacoTheme = isDark ? 'vs-dark' : 'vs';

  const { originalContent, modifiedContent, hasChanges } = useMemo(() => {
    const allArtifactList = Object.values(artifacts ?? {})
      .filter((a): a is Artifact => a != null)
      .sort((a, b) => (a.lastUpdateTime ?? 0) - (b.lastUpdateTime ?? 0));

    const matchingArtifacts = allArtifactList.filter(
      (a) =>
        (artifact.identifier && a.identifier === artifact.identifier) ||
        (a.title && a.title === artifact.title),
    );

    const currIdx = matchingArtifacts.findIndex((a) => a.id === artifact.id);
    let original = '';
    if (currIdx > 0) {
      original = matchingArtifacts[currIdx - 1]?.content ?? '';
    } else if (currentCode != null && currentCode !== artifact.content) {
      original = artifact.content ?? '';
    } else {
      original = artifact.content ?? '';
    }

    const modified = currentCode ?? artifact.content ?? '';
    return {
      originalContent: original,
      modifiedContent: modified,
      hasChanges: original.trim() !== modified.trim(),
    };
  }, [artifact, artifacts, currentCode]);

  const stats = useMemo(() => {
    if (!originalContent && !modifiedContent) {
      return { added: 0, removed: 0 };
    }
    const origLines = originalContent.split('\n');
    const modLines = modifiedContent.split('\n');
    const origSet = new Set(origLines);
    const modSet = new Set(modLines);

    let added = 0;
    let removed = 0;
    for (const line of modLines) {
      if (!origSet.has(line)) {
        added++;
      }
    }
    for (const line of origLines) {
      if (!modSet.has(line)) {
        removed++;
      }
    }
    return { added, removed };
  }, [originalContent, modifiedContent]);

  const editArtifact = useEditArtifact({
    onSuccess: () => {
      setIsMutating(false);
      setIsAccepted(true);
      setTimeout(() => setIsAccepted(false), 2500);
    },
    onError: () => {
      setIsMutating(false);
    },
  });

  const handleAcceptDiff = useCallback(() => {
    if (readOnly || artifact.index == null || !artifact.messageId) {
      return;
    }
    setIsMutating(true);
    editArtifact.mutate({
      messageId: artifact.messageId,
      index: artifact.index,
      original: originalContent,
      updated: modifiedContent,
    });
  }, [
    artifact.index,
    artifact.messageId,
    editArtifact,
    modifiedContent,
    originalContent,
    readOnly,
    setIsMutating,
  ]);

  const handleRevert = useCallback(() => {
    setCurrentCode(originalContent);
  }, [originalContent, setCurrentCode]);

  const handleCopyDiff = useCallback(() => {
    const filename = artifact.title || 'artifact';
    const patchHeader = `--- a/${filename}\n+++ b/${filename}\n`;
    copy(`${patchHeader}${modifiedContent}`, { format: 'text/plain' });
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [artifact.title, modifiedContent]);

  const language = getMonacoLanguage(artifact.type, artifact.language);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-surface-primary">
      {/* Cursor-style Toolbar */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border-light bg-surface-primary-alt px-3 py-1.5 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-text-tertiary" />
          <span className="font-mono text-text-primary">{artifact.title || 'Diff View'}</span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
              +{stats.added}
            </span>
            <span className="rounded bg-rose-500/10 px-1.5 py-0.5 font-semibold text-rose-600 dark:text-rose-400">
              -{stats.removed}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Side by Side vs Inline toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsSideBySide((prev) => !prev)}
            className="h-7 gap-1 px-2 text-xs font-normal text-text-secondary hover:text-text-primary"
            title={isSideBySide ? 'Switch to inline diff' : 'Switch to side-by-side diff'}
          >
            {isSideBySide ? (
              <>
                <Columns className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Split</span>
              </>
            ) : (
              <>
                <AlignJustify className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Unified</span>
              </>
            )}
          </Button>

          {/* Copy diff patch */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyDiff}
            className="h-7 gap-1 px-2 text-xs font-normal text-text-secondary hover:text-text-primary"
            title="Copy patch to clipboard"
          >
            {isCopied ? (
              <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
          </Button>

          {/* Revert Changes button */}
          {hasChanges && !readOnly && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRevert}
              className="h-7 gap-1 px-2 text-xs font-normal text-text-secondary hover:text-rose-500"
              title="Revert modifications back to original"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Revert</span>
            </Button>
          )}

          {/* Accept & Save button */}
          {!readOnly && (
            <Button
              size="sm"
              variant="default"
              onClick={handleAcceptDiff}
              disabled={isMutating || !hasChanges}
              className={cn(
                'h-7 gap-1 px-2.5 text-xs font-medium transition-all duration-150',
                isAccepted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-surface-submit text-white hover:bg-surface-submit-hover',
              )}
              title="Accept and persist code changes"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{isAccepted ? 'Accepted!' : 'Accept Diff'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Monaco Diff Editor Canvas */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <DiffEditor
          original={originalContent}
          modified={modifiedContent}
          language={language}
          theme={monacoTheme}
          options={{
            readOnly: true,
            renderSideBySide: isSideBySide,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 13,
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 8 },
            scrollbar: {
              vertical: 'visible',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              useShadows: false,
            },
            overviewRulerLanes: 0,
            overviewRulerBorder: false,
          }}
        />
      </div>
    </div>
  );
}
