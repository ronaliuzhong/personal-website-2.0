// Data for the "Which Life" café book — a single pick-one-of-four
// hypothetical, finite (one question, one answer), with a percentage
// reveal afterward showing what other visitors chose.
//
// Kept separate from questions.js since this book, like UglyArtBook
// and EthicsGameBook, is a self-contained mini-experience that saves
// its own answer directly rather than flowing through the
// triggered/ambient question queue.

export const whichLifeQuestionId = 'cafe_which_life'

export const whichLifeOptions = [
  {
    id: 'loop',
    label: 'The Loop',
    text: "Pick your most nostalgic childhood year—you get to live this year on repeat for the rest of your life. You and your friends will never age, and you guys will make childhood memories for the rest of your life.",
  },
  {
    id: 'machine',
    label: 'The Machine',
    text: "You've been put in a space pod that is permanently attached to a virtual reality system where you can create anything you want except for truly sentient life. Other than that you can use your creativity to its fullest extent, build whatever you want without restraints, and live in comfortable abundance.",
  },
  {
    id: 'calm',
    label: 'The Calm After',
    text: "You live in a peaceful post-apocalyptic world and you're free to wander the remains of human cities and interact with the many other survivors. This world is peaceful and easy enough to survive, meaning food and water isn't hard to acquire.",
  },
  {
    id: 'hard_story',
    label: 'The Hard Story',
    text: "You live a harsh life in a fantasy world with magic and monsters, facing many hardships and pain. However, triumphing over these sufferings makes your life very interesting and fulfilling, as you will accomplish many great things.",
  },
]