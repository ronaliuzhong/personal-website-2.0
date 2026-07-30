import { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

const ZONES = [
  { id: 'kiss', label: 'Kiss' },
  { id: 'marry', label: 'Marry' },
  { id: 'kill', label: 'Kill' },
];

function DraggableChip({ id, label }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 10 : 1,
      }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="kmk-chip"
      type="button"
    >
      {label}
    </button>
  );
}

function DroppableZone({ id, label, assigned }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`kmk-zone ${isOver ? 'kmk-zone--over' : ''}`}>
      <span className="kmk-zone-label">{label}</span>
      {assigned && <div className="kmk-chip kmk-chip--placed">{assigned}</div>}
    </div>
  );
}

// options: array of exactly 3 strings (names/things to sort).
// onComplete: called once all 3 zones are filled, with a formatted
// answer string like "Kiss: A, Marry: B, Kill: C".
function KissMarryKill({ options, onComplete }) {
  const [assignments, setAssignments] = useState({ kiss: null, marry: null, kill: null });

  const placed = new Set(Object.values(assignments).filter(Boolean));
  const pool = options.filter((name) => !placed.has(name));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const zoneId = over.id;
    if (!ZONES.some((z) => z.id === zoneId)) return;

    const name = active.id;
    const next = { ...assignments };

    // Clear this name from any zone it might already occupy.
    for (const key of Object.keys(next)) {
      if (next[key] === name) next[key] = null;
    }
    next[zoneId] = name;
    setAssignments(next);

    const allFilled = ZONES.every((z) => next[z.id]);
    if (allFilled) {
      const answer = ZONES.map((z) => `${z.label}: ${next[z.id]}`).join(', ');
      onComplete(answer);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="kmk-pool">
        {pool.map((name) => (
          <DraggableChip key={name} id={name} label={name} />
        ))}
      </div>
      <div className="kmk-zones">
        {ZONES.map((z) => (
          <DroppableZone key={z.id} id={z.id} label={z.label} assigned={assignments[z.id]} />
        ))}
      </div>
    </DndContext>
  );
}

export default KissMarryKill;