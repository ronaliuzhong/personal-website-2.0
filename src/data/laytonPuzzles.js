// LAYTON PUZZLES — text riddle data
// Each puzzle: id (used for saving/tracking progress), prompt, answers
// (array of all acceptable normalized strings), and hints (revealed
// one at a time via a "show a hint" button — no cost, just free
// tiered hints).

export const textPuzzles = [
  {
    id: 'layton_keyboard',
    prompt: 'What has keys but no locks, space but no room, and you can enter but not go in?',
    answers: ['keyboard'],
    hints: [
      "You might be using one of these to type this very answer.",
      "It's not something with an actual lock—think computer peripheral.",
    ],
  },
  {
    id: 'layton_photo',
    prompt: 'A man looks at a photo and says: "Brothers and sisters I have none, but this man\'s father is my father\'s son." Who is in the photo?',
    answers: ['his son', 'son', 'the son'],
    hints: [
      "The speaker says he has no brothers or sisters—hold onto that fact.",
      "If \"my father's son\" isn't a brother, who else could that phrase describe?",
    ],
  },
  {
    id: 'layton_balls',
    prompt: 'You have 8 identical-looking balls. One is heavier than the rest. Using a balance scale, what is the minimum number of weighings needed to guarantee finding the heavier ball?',
    answers: ['2', 'two'],
    hints: [
      'Try dividing the balls into three groups instead of two.',
      'Weighing two equal groups against each other narrows things down fast, in very few tries.',
    ],
  },
  {
    id: 'layton_word',
    prompt: 'What five-letter word, typed in all capital letters, reads the same upside down (a 180 degree rotation)?',
    answers: ['swims'],
    hints: [
      'Think of a common five-letter verb related to being in water.',
      'A few capital letters are symmetrical enough to look unchanged (or like another valid letter) upside down.',
    ],
  },
]