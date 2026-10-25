import React, { memo, useMemo, ReactElement } from 'react';
import { useRecoilValue } from 'recoil';
import { normalizeFormCardQuestions } from 'librechat-data-provider';
import InteractiveFormCard from '~/components/Chat/Messages/Content/FormCard/InteractiveFormCard';
import MarkdownLite from '~/components/Chat/Messages/Content/MarkdownLite';
import useSmoothStreaming from '~/hooks/Messages/useSmoothStreaming';
import Markdown from '~/components/Chat/Messages/Content/Markdown';
import CollapsibleText from './CollapsibleText';
import { useMessageContext } from '~/Providers';
import { cn } from '~/utils';
import store from '~/store';

type TextPartProps = {
  text: string;
  showCursor: boolean;
  isCreatedByUser: boolean;
};

const FORM_CONTAINER_REGEX = /:::(?:form-card|question)(?:\{[^}]*\})?\s*\n([\s\S]*?)\n:::/g;

function renderTextWithFormCards(text: string, isLatestMessage?: boolean) {
  if (!text.includes(':::form-card') && !text.includes(':::question')) {
    return <Markdown content={text} isLatestMessage={isLatestMessage} />;
  }

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  FORM_CONTAINER_REGEX.lastIndex = 0;

  while ((match = FORM_CONTAINER_REGEX.exec(text)) !== null) {
    const preText = text.slice(lastIndex, match.index);
    if (preText.trim()) {
      elements.push(
        <Markdown key={`pre-${match.index}`} content={preText} isLatestMessage={false} />,
      );
    }

    const formContent = match[1];
    const normalizedData = normalizeFormCardQuestions(formContent);
    if (normalizedData) {
      elements.push(
        <InteractiveFormCard key={`form-${match.index}`} data={normalizedData} />,
      );
    } else {
      elements.push(
        <Markdown key={`raw-${match.index}`} content={match[0]} isLatestMessage={false} />,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  const remainingText = text.slice(lastIndex);
  if (remainingText.trim()) {
    elements.push(
      <Markdown key={`post-${lastIndex}`} content={remainingText} isLatestMessage={isLatestMessage} />,
    );
  }

  return <>{elements}</>;
}

const TextPart = memo(function TextPart({ text, isCreatedByUser, showCursor }: TextPartProps) {
  const { isSubmitting = false, isLatestMessage = false } = useMessageContext();
  const enableUserMsgMarkdown = useRecoilValue(store.enableUserMsgMarkdown);
  const collapseLongUserMessages = useRecoilValue(store.collapseLongUserMessages);
  const smoothStreaming = useSmoothStreaming();
  // The word fade itself indicates streaming, so the trailing block cursor
  // only shows when the fade is unavailable (setting off or reduced motion).
  const showCursorState = useMemo(
    () => showCursor && isSubmitting && !(smoothStreaming && !isCreatedByUser),
    [showCursor, isSubmitting, smoothStreaming, isCreatedByUser],
  );

  const content = useMemo(() => {
    if (!isCreatedByUser) {
      return renderTextWithFormCards(text, isLatestMessage);
    } else if (enableUserMsgMarkdown) {
      return <MarkdownLite content={text} />;
    } else {
      return <>{text}</>;
    }
  }, [isCreatedByUser, enableUserMsgMarkdown, text, isLatestMessage]);

  return (
    <CollapsibleText enabled={isCreatedByUser && collapseLongUserMessages}>
      <div
        className={cn(
          isSubmitting ? 'submitting' : '',
          showCursorState && !!text.length ? 'result-streaming' : '',
          'markdown prose message-content dark:prose-invert light w-full break-words',
          isCreatedByUser && !enableUserMsgMarkdown && 'whitespace-pre-wrap',
          'text-text-primary',
        )}
      >
        {content}
      </div>
    </CollapsibleText>
  );
});
TextPart.displayName = 'TextPart';

export default TextPart;
