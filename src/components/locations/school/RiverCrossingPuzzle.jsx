import { useState, useEffect } from 'react';

const ITEMS = {
  wolf: { emoji: '🐺', label: 'Wolf' },
  chicken: { emoji: '🐔', label: 'Chicken' },
  grain: { emoji: '🌾', label: 'Grain' },
};

const UNSAFE_PAIRS = [
  ['wolf', 'chicken'],
  ['chicken', 'grain'],
];

function isUnsafe(bank) {
  return UNSAFE_PAIRS.some(([a, b]) => bank.includes(a) && bank.includes(b));
}

function RiverCrossingPuzzle({ onSolved }) {
  const [leftBank, setLeftBank] = useState(['wolf', 'chicken', 'grain']);
  const [rightBank, setRightBank] = useState([]);
  const [farmerSide, setFarmerSide] = useState('left');
  const [boarded, setBoarded] = useState(null);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'

  const currentBank = farmerSide === 'left' ? leftBank : rightBank;

  useEffect(() => {
    if (status !== 'won') return;
    const timer = setTimeout(() => onSolved(), 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function toggleBoard(item) {
    if (status !== 'playing') return;
    if (boarded === item) {
      setBoarded(null);
    } else if (currentBank.includes(item)) {
      setBoarded(item);
    }
  }

  function rowAcross() {
    if (status !== 'playing') return;

    const fromLeft = farmerSide === 'left';
    const departingBank = fromLeft ? leftBank : rightBank;
    const arrivingBank = fromLeft ? rightBank : leftBank;

    const remainingOnDeparture = boarded
      ? departingBank.filter((i) => i !== boarded)
      : departingBank;
    const newArrivingBank = boarded ? [...arrivingBank, boarded] : arrivingBank;

    if (fromLeft) {
      setLeftBank(remainingOnDeparture);
      setRightBank(newArrivingBank);
    } else {
      setRightBank(remainingOnDeparture);
      setLeftBank(newArrivingBank);
    }

    const newFarmerSide = fromLeft ? 'right' : 'left';
    setFarmerSide(newFarmerSide);
    setBoarded(null);
    setMoves((m) => m + 1);

    if (isUnsafe(remainingOnDeparture)) {
      setStatus('lost');
      return;
    }

    if (newArrivingBank.length === 3 && newFarmerSide === 'right') {
      setStatus('won');
    }
  }

  function reset() {
    setLeftBank(['wolf', 'chicken', 'grain']);
    setRightBank([]);
    setFarmerSide('left');
    setBoarded(null);
    setMoves(0);
    setStatus('playing');
  }

  function renderBank(items, side) {
    return (
      <div className={`layton-river-bank ${farmerSide === side ? 'layton-river-bank--farmer' : ''}`}>
        {farmerSide === side && <span className="layton-river-farmer">🧑‍🌾</span>}
        {items.map((item) => (
          <button
            key={item}
            className={`layton-river-item ${boarded === item ? 'layton-river-item--boarded' : ''}`}
            onClick={() => toggleBoard(item)}
            disabled={farmerSide !== side}
            title={ITEMS[item].label}
          >
            {ITEMS[item].emoji}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="layton-river">
      <p className="layton-prompt">
        Get the wolf, chicken, and grain across the river. Your boat only
        fits one item at a time—and you must always be with the boat.
        Left alone, the wolf will eat the chicken, and the chicken will
        eat the grain.
      </p>

      <div className="layton-river-scene">
        {renderBank(leftBank, 'left')}
        <div className="layton-river-water">🌊</div>
        {renderBank(rightBank, 'right')}
      </div>

      {status === 'playing' && (
        <>
          <p className="layton-river-hint-text">
            Tap an item on your side to board it (or tap again to leave it), then row across.
          </p>
          <div className="layton-river-controls">
            <button className="layton-submit-btn" onClick={rowAcross}>
              Row across →
            </button>
            <button className="layton-restart-btn" onClick={reset}>
              start over
            </button>
          </div>
          <p className="layton-river-moves">moves: {moves}</p>
        </>
      )}

      {status === 'lost' && (
        <>
          <p className="layton-wrong-message">Something got eaten. Try again.</p>
          <button className="layton-submit-btn" onClick={reset}>
            restart
          </button>
        </>
      )}

      {status === 'won' && (
        <p className="layton-river-won">Everyone made it across safely! ({moves} moves)</p>
      )}
    </div>
  );
}

export default RiverCrossingPuzzle;