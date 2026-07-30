// Blurb only — the room's questions now live in the separate
// light/grapes/frames hotspots (see CommonsScreen.jsx + CommonsSceneModal.jsx),
// not attached to the door/blurb itself anymore.

function RoomContent({ onClose }) {
  return (
    <div className="commons-content">
      <button className="commons-modal-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2 className="commons-modal-title">Whatever, Together</h2>
      <p className="commons-modal-intro">
        While I love a good shared activity to pass quality time with
        loved ones, I've also discovered the art of the "super casual
        hang". Having friends over to "study" in the living room,
        stretch on my yoga mat, sit on the couch and contemplate
        life—it's nice to just be in the company of others. My roommate
        is the master of the "super casual hang", and every second we
        lived together, I discovered new joys to this art, as well as
        just how important it was to me to have friends I could just
        exist with.
      </p>
    </div>
  );
}

export default RoomContent;