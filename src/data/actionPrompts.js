// ACTION PROMPTS — one-time instructions/dares, not questions.
// No inputType, no answer to save — just text shown once (gated via
// getSeenQuestions/markSeen the same way questions are, so each only
// ever appears the first time it's triggered).

export const actionPrompts = {
  commons_photo_prompt: {
    text: 'I like to send random photo updates to stay in contact with far away loved ones. My prompt for you today: Text a random recently taken photo to your family (or friends) groupchat.',
    sequence: 1,
  },
  commons_snack_prompt: {
    text: 'Surprise a friend with their favorite snack.',
    sequence: 2,
  },
}

// Given a list of already-seen question/prompt ids, returns the id of
// the next not-yet-seen action prompt (sorted by sequence), or null if
// every prompt has already been seen. Lets a single hotspot cycle
// through multiple one-time prompts in order, the same way sequenced
// questions (like Light's 4 in a row) already do.
export function getNextActionPrompt(seenIds) {
  const remaining = Object.entries(actionPrompts)
    .filter(([id]) => !seenIds.includes(id))
    .sort((a, b) => a[1].sequence - b[1].sequence)
  return remaining.length > 0 ? remaining[0][0] : null
}