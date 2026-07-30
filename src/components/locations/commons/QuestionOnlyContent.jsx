import { useState } from 'react';
import { useQuestions } from '../../../hooks/useQuestions';

// Same fix as FamilyContent — hand off to onRevealQuestion rather than
// rendering QuestionCard nested inside this modal's box.

function QuestionOnlyContent({ trigger, onClose, onRevealQuestion }) {
  const { getTriggeredQuestion } = useQuestions();
  const [nothingLeft, setNothingLeft] = useState(false);

  function handleReveal() {
    const q = getTriggeredQuestion('commons', trigger);
    if (q) {
      onRevealQuestion(q);
    } else {
      setNothingLeft(true);
    }
  }

  return (
    <div className="commons-content">
      <button className="commons-modal-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      {!nothingLeft ? (
        <button className="commons-reveal-question" onClick={handleReveal}>
          uncover a question →
        </button>
      ) : (
        <p className="commons-modal-intro">nothing more to uncover here yet.</p>
      )}
    </div>
  );
}

export default QuestionOnlyContent;