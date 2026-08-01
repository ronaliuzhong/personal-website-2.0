// ETHICS GAME — dilemma content
// Each dilemma: id (used as question_id for saving + aggregating answers),
// text, choices, and timerSeconds + shakeThreshold (fraction of time
// remaining at which point the card starts shaking — lower number =
// shakes earlier/longer, for more pressure).

export const ethicsDilemmas = [
  {
    id: 'ethics_trolley',
    text: "A runaway trolley is speeding toward five people tied to the track. You're standing next to a lever—pull it, and the trolley diverts onto a side track, where it will kill one person instead. Do you pull the lever?",
    choices: ['Pull the lever', "Don't pull it"],
    timerSeconds: 12,
    shakeThreshold: 0.2,
  },
  {
    id: 'ethics_fatman',
    text: "Same trolley, same five people—but this time there's no lever. You're on a footbridge next to a large stranger. Pushing him onto the track below would stop the trolley with his body, killing him but saving the five. Do you push him?",
    choices: ['Push him', "Don't push him"],
    timerSeconds: 12,
    shakeThreshold: 0.2,
  },
  {
    id: 'ethics_transplant',
    text: "You're a surgeon. Five patients will die today without organ transplants they can't get in time—unless you harvest the organs of one healthy patient in your waiting room, who came in for a routine checkup. Do you do it?",
    choices: ['Harvest the organs', "Don't"],
    timerSeconds: 12,
    shakeThreshold: 0.2,
  },
  {
    id: 'ethics_babyhitler',
    text: "You have a time machine. Baby Hitler is asleep in a crib in front of you, having done nothing wrong yet. You know what he'll grow up to do. Do you kill him now?",
    choices: ['Kill him', "Don't"],
    timerSeconds: 10,
    shakeThreshold: 0.25,
  },
  {
    id: 'ethics_bomb',
    text: "A captured terrorist knows the location of a bomb set to kill thousands within the hour. He won't talk. Torturing him could get the location in time. Do you torture him?",
    choices: ['Torture him', "Don't"],
    timerSeconds: 10,
    shakeThreshold: 0.25,
  },
  {
    id: 'ethics_car',
    text: "Your self-driving car's brakes just failed. Ahead: pedestrians crossing. The only way to avoid them is to swerve into a concrete barrier—killing you. Decide now.",
    choices: ['Swerve into the barrier', 'Stay the course'],
    timerSeconds: 8,
    shakeThreshold: 0.4,
  },
]

// Closing reflection blurb — shown after all six + percentages.
// Written to prompt reflection on WHAT changed between dilemmas
// (mechanism, distance, timing, numbers) rather than telling the
// visitor what to think.
export const ethicsClosingBlurb = `
Every version of this had the same basic shape: fewer people harmed
instead of more. But the details you were actually reacting to weren't
really about the numbers.

The trolley and the fat man are mathematically identical—one dies,
five live—but pulling a lever feels different from pushing someone
with your own hands. The transplant swaps a stranger's death for a
premeditated, institutional one. Baby Hitler is the only one where the
math genuinely changes—he'd cause far more than five deaths—but he
hasn't done anything yet, so is preemptive action acceptable? The bomb asks you to trade certainty of death for the
possibility of pain, which might be why it feels a little less
impossible than the others. And the car is the only one where the cost
lands on you.

If your answers didn't stay consistent across all six—if pulling a
lever felt fine but pushing someone didn't, even though the outcome was
identical—that's not a contradiction to feel bad about. It's worth
asking, though: what were you actually responding to? The number of
people saved, or something else? And should that something else matter
as much as it clearly does?
`