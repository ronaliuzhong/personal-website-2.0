export const questions = [
  // TRIGGERED — School
  {
    id: 'school_t1',
    text: 'Pick the emoji that best describes your work:',
    type: 'triggered',
    location: 'school',
    trigger: 'projects',
    inputType: 'choice',
    options: ['💻', '🔬', '📊', '🎨'],
    sequence: 1,
  },
  {
    id: 'school_t2',
    text: 'What job would be your worst nightmare?',
    type: 'triggered',
    location: 'school',
    trigger: 'projects',
    inputType: 'text',
    sequence: 2,
  },

  // TRIGGERED -- Qexe (question mark icon) in School
  {
  id: 'school_qexe_1',
  text: 'What would you do if money wasn\'t a question?',
  type: 'triggered',
  location: 'school',
  trigger: 'question_exe',
  inputType: 'text',
  sequence: 1,
},
{
  id: 'school_qexe_2',
  text: 'Should people work for money or for passion?',
  type: 'triggered',
  location: 'school',
  trigger: 'question_exe',
  inputType: 'text',
  sequence: 2,
},

  // TRIGGERED — Café
  {
    id: 'cafe_t1',
    text: 'Pick a flower:',
    type: 'triggered',
    location: 'cafe',
    trigger: 'bookshelf',
    inputType: 'choice',
    options: ['🌸', '🌻', '🌹', '🌿'],
    sequence: 1,
  },
  {
    id: 'cafe_t2',
    text: 'Who is most important in your life?',
    type: 'triggered',
    location: 'cafe',
    trigger: 'bookshelf',
    inputType: 'text',
    sequence: 2,
  },

  // AMBIENT — anywhere
  {
    id: 'ambient_1',
    text: 'Do you think suffering truly makes us stronger?',
    type: 'ambient',
    location: null,
    inputType: 'text',
  },
  {
    id: 'ambient_2',
    text: 'What is one thing you refuse to be frugal about?',
    type: 'ambient',
    location: null,
    inputType: 'text',
  },
  {
    id: 'ambient_3',
    text: 'Why do you think people search for a lifelong partner?',
    type: 'ambient',
    location: null,
    inputType: 'text',
  },
  {
    id: 'ambient_4',
    text: 'Rate your life out of 10.',
    type: 'ambient',
    location: null,
    inputType: 'choice',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  {
    id: 'ambient_5',
    text: 'What\'s your favorite icebreaker question?',
    type: 'ambient',
    location: null,
    inputType: 'text',
  },
]