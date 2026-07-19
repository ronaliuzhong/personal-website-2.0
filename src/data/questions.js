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
    type: 'ambient',
    location: 'cafe',
    trigger: null,
    inputType: 'choice',
    options: ['🌸', '🌹', '🌿', '🌷', '💐', '🌼'],
  },
  {
    id: 'cafe_t2',
    text: 'Who is most important in your life?',
    type: 'triggered',
    location: 'cafe',
    trigger: 'bookshelf',
    inputType: 'text',
    sequence: 1,
  },

  // TRIGGERED--overlook
  {
    id: 'overlook_flower',
    text: 'What flower would your favorite person pick?',
    type: 'triggered',
    location: 'overlook',
    trigger: 'bouquet',
    inputType: 'choice',
    options: ['🌸', '🌹', '🌿', '🌷', '💐', '🌼'],
    sequence: 1,
  },


// TRIGGERED — Moon
{
  id: 'moon_q1',
  text: 'Rate your life out of 10.',
  type: 'triggered',
  location: 'overlook',
  trigger: 'moon',
  inputType: 'choice',
  options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  sequence: 1,
},
{
  id: 'moon_q2',
  text: 'What made you smile recently?',
  type: 'triggered',
  location: 'overlook',
  trigger: 'moon',
  inputType: 'text',
  sequence: 2,
},
{
  id: 'moon_q3',
  text: 'What does a perfect day look like to you?',
  type: 'triggered',
  location: 'overlook',
  trigger: 'moon',
  inputType: 'text',
  sequence: 3,
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
    id: 'ambient_4',
    text: 'What\'s your favorite icebreaker question?',
    type: 'ambient',
    location: null,
    inputType: 'text',
  },
]