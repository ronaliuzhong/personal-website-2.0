import FamilyContent from './FamilyContent';
import WalkContent from './WalkContent';
import RoomContent from './RoomContent';
import './CommonsSceneModal.css';

const sceneComponents = {
  family: FamilyContent,
  walk: WalkContent,
  room: RoomContent,
};

function CommonsSceneModal({ sceneId, onClose, onRevealQuestion }) {
  const Content = sceneComponents[sceneId];

  if (!Content) return null;

  return (
    <div className="commons-modal-backdrop" onClick={onClose}>
      <div className="commons-modal" onClick={(e) => e.stopPropagation()}>
        <Content onClose={onClose} onRevealQuestion={onRevealQuestion} />
      </div>
    </div>
  );
}

export default CommonsSceneModal;