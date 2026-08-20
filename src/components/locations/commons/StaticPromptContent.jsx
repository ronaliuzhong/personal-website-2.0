import { useState } from 'react';
import { useQuestions } from '../../../hooks/useQuestions';

// Generic "just show a message" content — no question, no answer,
// just a one-time-ish instruction or prompt. Reusable for any future
// hotspot like this (pass a different `text`/`promptId` rather than
// creating a new file), same pattern as QuestionOnlyContent's `trigger`
// prop.
//
// Usage in CommonsSceneModal.jsx:
//   cat: (props) => <StaticPromptContent text="..." promptId="..." {...props} />,

function StaticPromptContent({ text, promptId, onClose }) {
  const { markSeen } = useQuestions();
  const [completed, setCompleted] = useState(false);

  function handleDone() {
    markSeen(promptId);
    setCompleted(true);
    setTimeout(onClose, 2000);
  }

  function handleDecline() {
    markSeen(promptId);
    onClose();
  }

  if (completed) {
    return (
      <div className="commons-content commons-confetti-wrap">
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <div className="commons-confetti-piece" />
        <p className="commons-action-prompt-complete">
          Good work!
        </p>
      </div>
    );
  }

  return (
    <div className="commons-content">
      <button className="commons-modal-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2 className="commons-action-prompt-title">Action Prompt...</h2>
      <p className="commons-modal-intro">{text}</p>

      <div className="commons-action-prompt-buttons">
        <button className="commons-action-prompt-btn commons-action-prompt-btn--done" onClick={handleDone}>
          done
        </button>
        <button className="commons-action-prompt-btn commons-action-prompt-btn--later" onClick={handleDecline}>
          not for me
        </button>
      </div>
    </div>
  );
}

export default StaticPromptContent;