import QuestionCard from '../../QuestionCard';

// Generic "question only" modal content — no intro blurb, just the
// QuestionCard itself. Use this for hotspots that don't need their own
// written content (e.g. background characters), by passing the right
// trigger name in via CommonsSceneModal.
//
// To use: register a wrapper in CommonsSceneModal.jsx like:
//   left_girl: () => <QuestionOnlyContent trigger="left_girl_scene" />,

function QuestionOnlyContent({ trigger }) {
  return (
    <div className="commons-content">
      <QuestionCard trigger={trigger} theme="commons" />
    </div>
  );
}

export default QuestionOnlyContent;