import { useState, useEffect } from 'react';
import { useQuestions } from '../../../hooks/useQuestions';
import { textPuzzles } from '../../../data/laytonPuzzles';
import TextRiddle from './TextRiddle';
import RiverCrossingPuzzle from './RiverCrossingPuzzle';
import './LaytonWindow.css';

const RIVER_PUZZLE_ID = 'layton_river';
const ALL_PUZZLE_IDS = [...textPuzzles.map((p) => p.id), RIVER_PUZZLE_ID];

function LaytonWindow({ onClose }) {
  const { saveAnswer, markSeen, getSeenQuestions } = useQuestions();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('checking'); // 'checking' | 'playing' | 'done'
  const [levelIntroVisible, setLevelIntroVisible] = useState(false);

  // Answers already save as each puzzle is solved (via saveAnswer +
  // markSeen below), so progress persists across closing/reopening —
  // this figures out where to resume, rather than always restarting
  // from puzzle 1.
  useEffect(() => {
    const seen = getSeenQuestions();

    const allDone = ALL_PUZZLE_IDS.every((id) => seen.includes(id));
    if (allDone) {
      setPhase('done');
      return;
    }

    const firstUnsolvedTextIndex = textPuzzles.findIndex((p) => !seen.includes(p.id));
    if (firstUnsolvedTextIndex === -1) {
      // all text puzzles solved, only the river crossing remains
      setIndex(textPuzzles.length);
    } else {
      setIndex(firstUnsolvedTextIndex);
    }
    setPhase('playing');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Brief "Level 1" title card, shown once when entering this level —
  // not on every individual puzzle within it.
  useEffect(() => {
    if (phase !== 'playing') return;
    setLevelIntroVisible(true);
    const timer = setTimeout(() => setLevelIntroVisible(false), 1300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const isRiverStage = index === textPuzzles.length;
  const currentPuzzle = isRiverStage ? null : textPuzzles[index];

  function handleTextSolved() {
    saveAnswer(currentPuzzle.id, 'solved');
    markSeen(currentPuzzle.id);

    const nextIndex = index + 1;
    const nextIsRiverStage = nextIndex === textPuzzles.length;

    if (nextIsRiverStage && getSeenQuestions().includes(RIVER_PUZZLE_ID)) {
      // River was already completed in a previous session — don't
      // force a redo just because a new text puzzle was added.
      setPhase('done');
    } else {
      setIndex(nextIndex);
    }
  }

  function handleRiverSolved() {
    saveAnswer(RIVER_PUZZLE_ID, 'solved');
    markSeen(RIVER_PUZZLE_ID);
    setPhase('done');
  }

  return (
    <div className="layton-window">
      <div className="layton-window__titlebar">
        <span className="layton-window__title">layton/</span>
        <button className="layton-window__close" onClick={onClose}>×</button>
      </div>

      <div className="layton-window__body layton-window__body--puzzle">
        {phase === 'checking' && null}

        {phase === 'done' && (
          <p className="layton-done-message">
            RonalzOS—layton/—Level 1 complete. 
          </p>
        )}

        {phase === 'playing' && (
          <div className="layton-puzzle-area">
            {levelIntroVisible ? (
              <p className="layton-level-intro">Level 1</p>
            ) : (
              <>
                <p className="layton-progress">
                  puzzle {index + 1} / {ALL_PUZZLE_IDS.length}
                </p>

                {isRiverStage ? (
                  <RiverCrossingPuzzle key="river" onSolved={handleRiverSolved} />
                ) : (
                  <TextRiddle
                    key={currentPuzzle.id}
                    puzzle={currentPuzzle}
                    onSolved={handleTextSolved}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LaytonWindow;