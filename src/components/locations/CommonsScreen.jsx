import { useState, useRef, useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';
import CommonsSceneModal from './commons/CommonsSceneModal';
import { useSounds } from '../../hooks/useSounds';
import './CommonsScreen.css';


const SCENES = [
  {
    id: 'card',
    label: 'The Card Table',
    src: '/commons/card-scene.riv',
    stateMachines: 'State Machine 1',
    // Single hotspot over the table itself — opens the family blurb.
    // Kept away from the individual characters so it doesn't block
    // Rive's own hover/click reactions on mom/dad/sister.
    // top/left/width/height are % of the canvas wrapper's box — tune
    // these to sit over the table in your actual artwork.
    hotspots: [{ id: 'family', top: '50%', left: '45%', width: '12%', height: '7%' }],
    cursorRegions: [
      { top: '44%', left: '29%', width: '17%', height: '13%' }, // left girl
      { top: '44%', left: '53%', width: '16%', height: '12%' }, // right girl
      { top: '33%', left: '46%', width: '8%', height: '4%' },   // flower at top of house
      { top: '60%', left: '30%', width: '12%', height: '18%' },  // red block/art frame
      { top: '68%', left: '50%', width: '14%', height: '7%' },  // cat
      { top: '87%', left: '57%', width: '5%', height: '3%' },   // flower in lake
    ],
  },
  {
    id: 'walking',
    label: 'The Walk',
    src: '/commons/walking-scene.riv',
    stateMachines: 'State Machine 1',
    // Hotspot on the clouds rather than the girl, since she's the
    // element Rive is animating continuously.
    hotspots: [{ id: 'walk', top: '33%', left: '20%', width: '55%', height: '11%' }],
    cursorRegions: [{ top: '37%', left: '39%', width: '22%', height: '27%' }],
  },
  {
    id: 'room',
    label: 'The Room',
    src: '/commons/room-scene.riv',
    stateMachines: 'State Machine 1',
    // Hotspot on the door rather than the clock/girl — she's always
    // moving, and the clock has its own built-in Rive reaction we
    // don't want to intercept. The door is a static, clickable target.
    hotspots: [{ id: 'room', top: '63%', left: '59%', width: '27%', height: '32%' }],
    cursorRegions: [{ top: '8%', left: '60%', width: '20%', height: '13%' }],
  },
];

function CommonsScreen() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeModalId, setActiveModalId] = useState(null);
  const wrapRef = useRef(null);
  const { playTransition, playClick } = useSounds();

  const scene = SCENES[sceneIndex];
  const isFirstRender = useRef(true);

  const { rive, RiveComponent } = useRive({
    src: SCENES[0].src,
    stateMachines: SCENES[0].stateMachines,
    autoplay: true,
  });

  // useRive only loads its initial src once — swapping scenes after
  // that requires explicitly telling the existing rive instance to load
  // the new file.
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

  const openHotspot = (hotspotId) => {
    playClick();
    setActiveModalId(hotspotId);
  };

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
              onClick={() => openHotspot(h.id)}
              aria-label={`Open ${h.id}`}
            />
          ))}
        </div>

        <button className="commons-arrow right" onClick={goNext} aria-label="Next scene">
          ›
        </button>

        <p className="commons-scene-label">{scene.label}</p>
      </div>

      {activeModalId && (
        <CommonsSceneModal sceneId={activeModalId} onClose={() => setActiveModalId(null)} />
      )}
    </>
  );
}

export default CommonsScreen;