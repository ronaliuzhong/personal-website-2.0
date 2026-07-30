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
  text: 'What is one de-stress method you use?',
  type: 'triggered',
  location: 'overlook',
  trigger: 'moon',
  inputType: 'text',
  sequence: 3,
},

// triggered -- commons
{ id: 'commons_family', 
  text: "What is your family's go-to activity?", 
  type: 'triggered', 
  location: 'commons', 
  trigger: 'family_scene', 
  inputType: 'text', 
  sequence: 1 
},

{
  id: 'commons_room_frame1',
  text: 'What\'s a memory you\'re afraid you\'ll forget one day?',
  type: 'triggered',
  location: 'commons',
  trigger: 'frames_scene',
  inputType: 'text',
  sequence: 1,
},

{ id: 'commons_room_grapes1', 
  text: 'Favorite movie snack: ', 
  type: 'triggered', 
  location: 'commons', 
  trigger: 'grapes_scene', 
  inputType: 'text', 
  sequence: 1 },

{ id: 'commons_room_light1', 
  text: 'Your house is burning, what do you grab?', 
  type: 'triggered', 
  location: 'commons', 
  trigger: 'light_scene', 
  inputType: 'text', 
  sequence: 1 },

{
  id: 'commons_light_kmk',
  text: 'Kiss, Marry, Kill:',
  type: 'triggered',
  location: 'commons',
  trigger: 'light_scene',
  inputType: 'kmk',
  options: ['Pineapple on pizza', 'Ketchup on eggs', 'Mayo on fries'],
  sequence: 2,
},
{
  id: 'commons_light_2truths',
  text: 'Two Truths and a Lie: Select the Lie',
  type: 'triggered',
  location: 'commons',
  trigger: 'light_scene',
  inputType: 'twoTruths',
  options: ['I average a banana a day', 'I like my drinking water hot', 'I hate milk'],
  correctAnswer: 'I average a banana a day', // whichever one is actually the lie
  sequence: 3,
},

{
  id: 'commons_room_light4',
  text: 'Would you rather:',
  type: 'triggered',
  location: 'commons',
  trigger: 'light_scene',
  inputType: 'choice',
  options: ['never wear socks', 'always wear shoes'],
  sequence: 4,
},

// ambient -- commons (walk)
{ id: 'commons_walk_ambient', 
  text: 'What is one thing you refuse to be frugal about?', 
  type: 'ambient', 
  location: 'commons', 
  inputType: 'text' },

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
    text: 'What\'s your favorite icebreaker question?',
    type: 'ambient',
    location: null,
    inputType: 'text',
  },
]