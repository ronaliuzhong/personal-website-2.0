import { useQuestions } from '../../../hooks/useQuestions';

// Closing the blurb doesn't just close the modal — it hands the
// question off to CommonsScreen via onRevealQuestion, which closes
// this modal and shows QuestionCard as its own separate overlay
// (QuestionCard already provides a full-screen overlay itself, so it
// must never be nested inside another modal's box — that's what
// caused the earlier blank-box bug).

function FamilyContent({ onClose, onRevealQuestion }) {
  const { getTriggeredQuestion } = useQuestions();

  function handleBlurbClose() {
    const q = getTriggeredQuestion('commons', 'family_scene');
    if (q) {
      onRevealQuestion(q);
    } else {
      onClose();
    }
  }

  return (
    <div className="commons-content">
      <button className="commons-modal-close" onClick={handleBlurbClose} aria-label="Close">
        ×
      </button>
      <h2 className="commons-modal-title">Sheng Ji</h2>
      <p className="commons-modal-intro">
        When other Chinese families came over, the schedule was almost
        always a joint dinner followed by a split of the kids and adults,
        where the adults would eat sunflower seeds and play card games
        and the kids would go do whatever it was we used to do.
        Eventually my sister and I got older, and we were taught to play
        the grown-up card game (Sheng Ji, also known as Level Up or
        Tractor) as well. Now, we always bring two decks of cards with
        us on family outings, in case the perfect scene for a good game
        of Sheng Ji appears.
      </p>
    </div>
  );
}

export default FamilyContent;