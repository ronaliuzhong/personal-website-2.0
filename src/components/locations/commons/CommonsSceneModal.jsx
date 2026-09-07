import FamilyContent from './FamilyContent';
import WalkContent from './WalkContent';
import RoomContent from './RoomContent';
import StaticPromptContent from './StaticPromptContent';
import { actionPrompts, getNextActionPrompt } from '../../../data/actionPrompts';
import { useQuestions } from '../../../hooks/useQuestions';
import './CommonsSceneModal.css';

const sceneComponents = {
  family: FamilyContent,
  walk: WalkContent,
  room: RoomContent,
  flower_painting: (props) => {
    const { getSeenQuestions } = useQuestions();
    const promptId = getNextActionPrompt(getSeenQuestions());
    if (!promptId) return null;
    return (
      <StaticPromptContent
        text={actionPrompts[promptId].text}
        promptId={promptId}
        {...props}
      />
    );
  },
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