import { useState } from 'react';

function TextRiddle({ puzzle, onSolved }) {
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);

  function normalize(str) {
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function handleSubmit() {
    const isCorrect = puzzle.answers.some((a) => normalize(a) === normalize(answer));

    if (isCorrect) {
      setWrong(false);
      setSolved(true);
      setTimeout(() => onSolved(), 1200);
    } else {
      setWrong(true);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  function showNextHint() {
    setHintsShown((h) => Math.min(h + 1, puzzle.hints.length));
  }

  if (solved) {
    return (
      <div className="layton-riddle">
        <p className="layton-prompt">{puzzle.prompt}</p>
        <p className="layton-correct-message">correct!</p>
      </div>
    );
  }

  return (
    <div className="layton-riddle">
      <p className="layton-prompt">{puzzle.prompt}</p>

      <div className="layton-input-wrap">
        <input
          className="layton-input"
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setWrong(false);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button className="layton-submit-btn" onClick={handleSubmit}>
          submit
        </button>
      </div>

      {wrong && <p className="layton-wrong-message">not quite—try again.</p>}

      <div className="layton-hints">
        {puzzle.hints.slice(0, hintsShown).map((hint, i) => (
          <p key={i} className="layton-hint-text">
            hint {i + 1}: {hint}
          </p>
        ))}

        {hintsShown < puzzle.hints.length && (
          <button className="layton-hint-btn" onClick={showNextHint}>
            {hintsShown === 0 ? 'show a hint' : 'show another hint'}
          </button>
        )}
      </div>
    </div>
  );
}

export default TextRiddle;