import { useState, useEffect, useRef } from 'react';
import './WorkoutPlayer.css';

function RestTimer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  return (
    <div className="workout-rest">
      <p className="workout-rest-label">rest</p>
      <p className="workout-rest-number">{remaining}</p>
    </div>
  );
}

function ExerciseTimer({ seconds, onDone }) {
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!started) return;
    if (remaining <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, started]);

  if (!started) {
    return (
      <div className="workout-timer-prestart">
        <p className="workout-timer-number">{seconds}s</p>
        <button className="workout-action-btn" onClick={() => setStarted(true)}>
          start
        </button>
      </div>
    );
  }

  return <p className="workout-timer-number">{remaining}</p>;
}

function WorkoutPlayer({ workout, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState(workout.hasBuddyToggle ? null : 'solo'); // null | 'solo' | 'buddy'
  const [setNumber, setSetNumber] = useState(1);
  const [resting, setResting] = useState(false);
  const [finished, setFinished] = useState(false);

  const step = workout.steps[stepIndex];
  const isLastStep = stepIndex === workout.steps.length - 1;

  function goToNextStep() {
    if (isLastStep) {
      setFinished(true);
    } else {
      setStepIndex((i) => i + 1);
      setSetNumber(1);
      setResting(false);
    }
  }

  function handleFreeformDone() {
    goToNextStep();
  }

  function handleTimeDone() {
    goToNextStep();
  }

  function handleSetComplete() {
    if (setNumber < step.sets) {
      setResting(true);
    } else {
      goToNextStep();
    }
  }

  function handleRestDone() {
    setResting(false);
    setSetNumber((n) => n + 1);
  }

  function handleReadyManual() {
    setResting(false);
    setSetNumber((n) => n + 1);
  }

  // Buddy/solo selection screen, shown once before the workout starts.
  if (workout.hasBuddyToggle && mode === null) {
    return (
      <div className="workout-player">
        <button className="workout-close" onClick={onClose}>×</button>
        <div className="workout-card">
          <h2 className="workout-title">{workout.title}</h2>
          <p className="workout-mode-prompt">Working out with a buddy, or solo today?</p>
          <div className="workout-mode-choices">
            <button className="workout-mode-btn" onClick={() => setMode('solo')}>
              Solo (timed rest)
            </button>
            <button className="workout-mode-btn" onClick={() => setMode('buddy')}>
              With a buddy
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="workout-player">
        <button className="workout-close" onClick={onClose}>×</button>
        <div className="workout-card">
          <h2 className="workout-title">{workout.title}</h2>
          <p className="workout-done-message">Nice work—workout complete!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-player">
      <button className="workout-close" onClick={onClose}>×</button>
      <div className="workout-card">
        <h2 className="workout-title">{workout.title}</h2>
        <p className="workout-progress">
          step {stepIndex + 1} / {workout.steps.length}
        </p>

        {step.groupLabel && <p className="workout-group-label">{step.groupLabel}</p>}
        <h3 className="workout-exercise-name">
          {step.name}
          {step.eachSide ? ' (each side)' : ''}
        </h3>
        <p className="workout-instructions">{step.instructions}</p>

        {step.type === 'freeform' && (
          <button className="workout-action-btn" onClick={handleFreeformDone}>
            done—next
          </button>
        )}

        {step.type === 'time' && !resting && (
          <div className="workout-timer-wrap">
            <ExerciseTimer key={stepIndex} seconds={step.durationSeconds} onDone={handleTimeDone} />
          </div>
        )}

        {step.type === 'reps' && !resting && (
          <>
            <p className="workout-set-label">
              set {setNumber} / {step.sets}—{step.reps} reps
            </p>
            <button className="workout-action-btn" onClick={handleSetComplete}>
              done with this set
            </button>
          </>
        )}

        {resting && mode === 'solo' && (
          <RestTimer key={`${stepIndex}-${setNumber}`} seconds={workout.restSeconds} onDone={handleRestDone} />
        )}

        {resting && mode === 'buddy' && (
          <div className="workout-rest">
            <p className="workout-rest-label">resting while they go</p>
            <button className="workout-action-btn" onClick={handleReadyManual}>
              I'm ready
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutPlayer;