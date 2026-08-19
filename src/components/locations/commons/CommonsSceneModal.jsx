import FamilyContent from './FamilyContent';
import WalkContent from './WalkContent';
import RoomContent from './RoomContent';
import StaticPromptContent from './StaticPromptContent';
import { actionPrompts } from '../../../data/actionPrompts';
import './CommonsSceneModal.css';

const sceneComponents = {
  family: FamilyContent,
  walk: WalkContent,
  room: RoomContent,
  flower_painting: (props) => (
    <StaticPromptContent
      text={actionPrompts.commons_photo_prompt.text}
      promptId="commons_photo_prompt"
      {...props}
    />
  ),
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