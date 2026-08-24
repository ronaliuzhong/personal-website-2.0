import { useState, useRef, useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';
import CommonsSceneModal from './commons/CommonsSceneModal';
import { useSounds } from '../../hooks/useSounds';
import { useQuestions } from '../../hooks/useQuestions';
import { useAmbientQuestion } from '../../hooks/useAmbientQuestion';
import QuestionCard from '../QuestionCard';
import './CommonsScreen.css';

const SCENES = [
  {
    id: 'card',
    label: 'The Card Table',
    src: '/commons/card-scene.riv',
    stateMachines: 'State Machine 1',
    hotspots: [
      { id: 'family', top: '50%', left: '45%', width: '12%', height: '7%' },
      { id: 'flower_painting', top: '58%', left: '53%', width: '16%', height: '10%' },
    ],
    cursorRegions: [
      { top: '44%', left: '29%', width: '17%', height: '13%' }, // left girl
      { top: '44%', left: '53%', width: '16%', height: '12%' }, // right girl
      { top: '33%', left: '46%', width: '8%', height: '4%' },   // flower at top of house
      { top: '60%', left: '30%', width: '12%', height: '18%' }, // red block/art frame
      { top: '68%', left: '50%', width: '14%', height: '7%' },  // cat
      { top: '87%', left: '57%', width: '5%', height: '3%' },   // flower in lake
    ],
  },
  {
    id: 'walking',
    label: 'The Walk',
    src: '/commons/walking-scene.riv',
    stateMachines: 'State Machine 1',
    // Clouds still open the blurb — the question no longer lives here
    // though; it surfaces ambiently while this scene is being viewed
    // (see the ambient question effect below), unprompted and without
    // needing a click.
    hotspots: [{ id: 'walk', top: '33%', left: '20%', width: '55%', height: '11%' }],
    cursorRegions: [{ top: '37%', left: '39%', width: '22%', height: '27%' }],
  },
  {
    id: 'room',
    label: 'The Room',
    src: '/commons/room-scene.riv',
    stateMachines: 'State Machine 1',
    // Door opens the blurb only. Light/grapes/frames are separate,
    // dedicated question triggers — light can resurface multiple times
    // (continuous), grapes/frames are each a single one-and-done
    // question. Placeholder coordinates — tune these in dev tools
    // against your actual artwork, same as the other hotspots.
    hotspots: [
      { id: 'room', top: '63%', left: '59%', width: '27%', height: '32%' },
      { id: 'light', top: '15%', left: '40%', width: '12%', height: '7%', directQuestion: true, trigger: 'light_scene' },
      { id: 'grapes', top: '40%', left: '13%', width: '10%', height: '8%', directQuestion: true, trigger: 'grapes_scene' },
      { id: 'frames', top: '75%', left: '35%', width: '15%', height: '10%', directQuestion: true, trigger: 'frames_scene' },
    ],
    cursorRegions: [{ top: '8%', left: '60%', width: '20%', height: '13%' }],
  },
];

function CommonsScreen() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeModalId, setActiveModalId] = useState(null);
  const [triggeredQuestion, setTriggeredQuestion] = useState(null);
  const [showCredit, setShowCredit] = useState(false);
  const wrapRef = useRef(null);
  const { playTransition, playClick } = useSounds();
  const { getTriggeredQuestion, getSeenQuestions } = useQuestions();

  const scene = SCENES[sceneIndex];
  const isFirstRender = useRef(true);
  const { question: walkQuestion, close: closeWalkQuestion } = useAmbientQuestion('commons', {
    active: scene.id === 'walking',
    suppress: !!activeModalId || !!triggeredQuestion,
  });

  const { rive, RiveComponent } = useRive({
    src: SCENES[0].src,
    stateMachines: SCENES[0].stateMachines,
    autoplay: true,
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!rive) return;
    rive.load({
      src: scene.src,
      stateMachines: scene.stateMachines,
      autoplay: true,
    });
  }, [sceneIndex, rive]);

  const goPrev = () => {
    playTransition();
    setSceneIndex((i) => (i - 1 + SCENES.length) % SCENES.length);
  };

  const goNext = () => {
    playTransition();
    setSceneIndex((i) => (i + 1) % SCENES.length);
  };

  const openHotspot = (h) => {
    playClick();
    if (h.directQuestion) {
      const q = getTriggeredQuestion('commons', h.trigger);
      if (q) setTriggeredQuestion(q);
      // if nothing left, clicking just does nothing — no modal to show
    } else if (h.id === 'flower_painting') {
      // One-time prompt — only opens if not already done/declined via
      // an explicit choice inside the modal.
      if (!getSeenQuestions().includes('commons_photo_prompt')) {
        setActiveModalId('flower_painting');
      }
    } else {
      setActiveModalId(h.id);
    }
  };

  function handleRevealQuestion(question) {
    setActiveModalId(null);
    setTriggeredQuestion(question);
  }

  const isInRegion = (e, region) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const xFrac = (e.clientX - rect.left) / rect.width;
    const yFrac = (e.clientY - rect.top) / rect.height;
    const top = parseFloat(region.top) / 100;
    const left = parseFloat(region.left) / 100;
    const width = parseFloat(region.width) / 100;
    const height = parseFloat(region.height) / 100;
    return (
      xFrac >= left && xFrac <= left + width && yFrac >= top && yFrac <= top + height
    );
  };

  const handleCanvasMouseMove = (e) => {
    if (!scene.cursorRegions || !wrapRef.current) return;
    const overInteractive = scene.cursorRegions.some((region) => isInRegion(e, region));
    wrapRef.current.style.cursor = overInteractive ? 'pointer' : 'default';
  };

  return (
    <>
      <div className="commons-scene">
        <button className="commons-arrow left" onClick={goPrev} aria-label="Previous scene">
          ‹
        </button>

        <div ref={wrapRef} className="commons-canvas-wrap" onMouseMove={handleCanvasMouseMove}>
          <RiveComponent />

          {scene.hotspots.map((h) => (
            <button
              key={h.id}
              className="commons-hotspot"
              style={{
                top: h.top,
                left: h.left,
                width: h.width || '15%',
                height: h.height || '35%',
              }}
              onClick={() => openHotspot(h)}
              aria-label={`Open ${h.id}`}
            />
          ))}
        </div>

        <button className="commons-arrow right" onClick={goNext} aria-label="Next scene">
          ›
        </button>

        <p className="commons-scene-label">{scene.label}</p>
      </div>

      <button
        className="commons-credit-icon"
        onClick={() => setShowCredit(true)}
        aria-label="View animation credit"
      >
        i
      </button>

      {showCredit && (
        <div className="commons-credit-overlay" onClick={() => setShowCredit(false)}>
          <div className="commons-credit-card" onClick={(e) => e.stopPropagation()}>
            <button className="commons-credit-close" onClick={() => setShowCredit(false)}>×</button>
            <p className="commons-credit-text">
              "Hover House," "Cloudy Walk," and "Bored Room" by{' '}
              <a href="https://rive.app/@RyanRumbolt/" target="_blank" rel="noopener noreferrer">
                RyanRumbolt
              </a>
              , in collaboration with Justyna Stasik, licensed under{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
                CC BY 4.0
              </a>
              . Modified from the originals.
            </p>
          </div>
        </div>
      )}

      {activeModalId && (
        <CommonsSceneModal
          sceneId={activeModalId}
          onClose={() => setActiveModalId(null)}
          onRevealQuestion={handleRevealQuestion}
        />
      )}

      {triggeredQuestion && (
        <QuestionCard
          question={triggeredQuestion}
          location="commons"
          onClose={() => setTriggeredQuestion(null)}
        />
      )}

      {walkQuestion && (
        <QuestionCard
          question={walkQuestion}
          location="commons"
          onClose={closeWalkQuestion}
        />
      )}
    </>
  );
}

export default CommonsScreen;