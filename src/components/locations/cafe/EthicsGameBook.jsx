import { useState, useEffect, useRef } from 'react';
import { useQuestions } from '../../../hooks/useQuestions';
import { getAnswerAggregate } from '../../../utils/api';
import { ethicsDilemmas, ethicsClosingBlurb } from '../../../data/ethicsDilemmas';
import './EthicsGameBook.css';

const CIRCUMFERENCE = 264; // matches r=42 circle, 2*pi*42 ≈ 264

function CountdownRing({ seconds, shakeThreshold, onTimeout }) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);
  const onTimeoutRef = useRef(onTimeout);
  const firedRef = useRef(false);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    firedRef.current = false;
    setRemaining(seconds);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          if (!firedRef.current) {
            firedRef.current = true;
            onTimeoutRef.current();
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const frac = remaining / seconds;
  const isWarn = frac <= 0.5 && frac > shakeThreshold;
  const isDanger = frac <= shakeThreshold;

  return (
    <div className={`ethics-ring-wrap ${isDanger ? 'ethics-shake' : ''}`}>
      <svg width="100" height="100">
        <circle className="ethics-ring-bg" cx="50" cy="50" r="42" />
        <circle
          className={`ethics-ring-fg ${isWarn ? 'ethics-ring-fg--warn' : ''} ${isDanger ? 'ethics-ring-fg--danger' : ''}`}
          cx="50"
          cy="50"
          r="42"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - frac)}
        />
      </svg>
      <div className="ethics-ring-number">{remaining}</div>
    </div>
  );
}

function EthicsGameBook() {
  const { saveAnswer, markSeen, getSeenQuestions } = useQuestions();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('checking'); // 'checking' | 'dilemma' | 'transition' | 'results'
  const [aggregates, setAggregates] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [frozen, setFrozen] = useState(false);

  // On mount, check if this visitor already played through all six —
  // if so, skip straight to results instead of letting them replay
  // and overwrite their previous answers.
  useEffect(() => {
    const seen = getSeenQuestions();
    const alreadyPlayed = ethicsDilemmas.every((d) => seen.includes(d.id));
    if (alreadyPlayed) {
      loadResults();
    } else {
      setPhase('dilemma');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dilemma = ethicsDilemmas[index];
  const isLast = index === ethicsDilemmas.length - 1;

  // Defensive guard: if index somehow ever goes out of range, don't
  // crash the whole app rendering undefined.dilemma — just treat it
  // as done.
  useEffect(() => {
    if (!dilemma && phase === 'dilemma') {
      setPhase('transition');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dilemma, phase]);

  function recordAnswer(answer) {
    if (!dilemma) return;
    saveAnswer(dilemma.id, answer);
    markSeen(dilemma.id);

    if (isLast) {
      setPhase('transition');
    } else {
      setIndex((i) => i + 1);
    }
  }

  function handleTimeout() {
    setFrozen(true);
    setTimeout(() => {
      setFrozen(false);
      recordAnswer('(froze)');
    }, 1500);
  }

  useEffect(() => {
    if (phase !== 'transition') return;
    const timer = setTimeout(() => {
      loadResults();
    }, 2200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  async function loadResults() {
    setLoadingResults(true);
    const entries = await Promise.all(
      ethicsDilemmas.map(async (d) => {
        try {
          const agg = await getAnswerAggregate(d.id);
          return [d.id, agg];
        } catch (err) {
          console.error('Failed to load aggregate for', d.id, err);
          return [d.id, null];
        }
      })
    );
    setAggregates(Object.fromEntries(entries));
    setLoadingResults(false);
    setPhase('results');
  }

  if (phase === 'checking' || loadingResults) {
    return (
      <div className="ethics-content">
        <p className="ethics-loading-text">tallying everyone's answers...</p>
      </div>
    );
  }

  if (phase === 'dilemma' && dilemma) {
    return (
      <div className="ethics-content">
        <p className="ethics-progress">
          {index + 1} / {ethicsDilemmas.length}
        </p>
        <p className="ethics-dilemma-text">{dilemma.text}</p>

        <CountdownRing
          key={dilemma.id}
          seconds={dilemma.timerSeconds}
          shakeThreshold={dilemma.shakeThreshold}
          onTimeout={handleTimeout}
        />

        {frozen ? (
          <p className="ethics-frozen-message">you didn't decide in time.</p>
        ) : (
          <div className="ethics-choices">
            {dilemma.choices.map((choice) => (
              <button
                key={choice}
                className="ethics-choice-btn"
                onClick={() => recordAnswer(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (phase === 'transition') {
    return (
      <div className="ethics-content ethics-transition">
        <p className="ethics-transition-text">that's all six.</p>
      </div>
    );
  }

  // phase === 'results'
  return (
    <div className="ethics-content">
      <p className="ethics-results-heading">what everyone else chose</p>

      {ethicsDilemmas.map((d) => {
        const agg = aggregates?.[d.id];
        return (
          <div key={d.id} className="ethics-result-row">
            <p className="ethics-result-label">{d.text.split('?')[0]}?</p>
            {agg && agg.total > 0 ? (
              <div className="ethics-result-bars">
                {agg.breakdown.map((b) => (
                  <div key={b.answer} className="ethics-result-bar-line">
                    <span className="ethics-result-bar-answer">{b.answer}</span>
                    <span className="ethics-result-bar-percent">{b.percentage}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="ethics-result-empty">no data yet</p>
            )}
          </div>
        );
      })}

      <p className="ethics-blurb">{ethicsClosingBlurb}</p>
    </div>
  );
}

export default EthicsGameBook;