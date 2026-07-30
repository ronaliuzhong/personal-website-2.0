// Blurb only — the walking scene's question now appears ambiently,
// unprompted, while viewing the scene itself (see CommonsScreen.jsx),
// rather than being tied to clicking the clouds.

function WalkContent({ onClose }) {
  return (
    <div className="commons-content">
      <button className="commons-modal-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2 className="commons-modal-title">The Chores I Don't Mind</h2>
      <p className="commons-modal-intro">
        Although the "slow living" trend tried to convince me to enjoy
        chores, they failed. Anything that required I take my focus away
        from the task that brought me closer to my goals was an
        unwelcome inconvenience.
      </p>
      <p className="commons-modal-intro">
        But as my girlfriend and I started spending prolonged periods of
        time together, we started doing our everyday mundane tasks
        together, and you know what? I didn't mind doing these chores at
        all. I hate the time transportation takes but driving for her or
        walking with her? Doesn't feel like any time was lost at all.
        Cooking is a date night activity, grocery shopping is a fun
        sidequest, and laundry is time to watch a show together.
      </p>
      <p className="commons-modal-intro">
        I guess some people just make life a bit more vibrant, so it's
        easier to slow down and enjoy the colors.
      </p>
    </div>
  );
}

export default WalkContent;