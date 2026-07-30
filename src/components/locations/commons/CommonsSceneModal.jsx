import FamilyContent from './FamilyContent';
import WalkContent from './WalkContent';
import RoomContent from './RoomContent';
import './CommonsSceneModal.css';
import QuestionOnlyContent from './QuestionOnlyContent';

// Mirrors the bookComponents pattern in BookModal.jsx —
// add a new scene/character by adding one entry here plus a component file.
const sceneComponents = {
  family: FamilyContent,
  walk: WalkContent,
  room: RoomContent,
};

function CommonsSceneModal({ sceneId, onClose }) {
  const Content = sceneComponents[sceneId];

  if (!Content) return null;

  return (
    <div className="commons-modal-backdrop" onClick={onClose}>
      <div className="commons-modal" onClick={(e) => e.stopPropagation()}>
        <button className="commons-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <Content />
      </div>
    </div>
  );
}

export default CommonsSceneModal;