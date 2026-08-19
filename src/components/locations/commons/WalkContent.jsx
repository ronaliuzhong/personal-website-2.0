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
        Although the "slow living" trend tried to convince me to enjoy chores, they failed. I've never been good at slowing down for something that didn't feel like it had a goal--if a task had no clear purpose, it just felt like something standing between me and whatever came next. 
      </p>
      <p className="commons-modal-intro">
        But as my girlfriend and I started spending prolonged periods of time together, we started doing our everyday mundane tasks together, and you know what? I didn't mind doing these chores. I hate the time transportation takes but I like walking with her. Cooking is a date night activity, grocery shopping is a fun sidequest, and laundry is time to watch a show together.
      </p>
      <p className="commons-modal-intro">
        Granted, we don't get much time together so of course any time together will feel like a novelty. But it's had me thinking: maybe slow living was onto something after all. Either way, big steps for me. 
      </p>
    </div>
  );
}

export default WalkContent;