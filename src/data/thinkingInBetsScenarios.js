// Data for "Thinking in Bets" — a café book inspired by Annie Duke's
// book of the same name, illustrating "resulting": the idea that an
// outcome does not determine the quality of a decision.
//
// Each scenario gives the visitor two options. Each option has a
// private probabilityGood (never shown to the visitor — they have to
// reason it out from the scenario's own qualitative information,
// the same way a real decision-maker would). At runtime, a genuine
// weighted random draw decides whether that pick's outcome is "good"
// or "bad" — nothing is scripted or rigged toward a lesson.
//
// Each scenario also supports one "try the other choice" replay,
// which re-draws using the *other* option's probability so the
// visitor can compare both paths for the same scenario.

export const thinkingInBetsQuestionId = 'cafe_thinking_in_bets_reflection'

export const thinkingInBetsScenarios = [
  {
    id: 'kidney_stone',
    promptLines: [
      '"So," says Doctor, pulling up your scan. "You\'ve got a 6-millimeter stone. It\'s right on the edge—this size could go either way."',
      '"If your pain\'s manageable and your kidney\'s not blocked up, I can give you some medication to help it slide out easier on its own. If it hasn\'t moved in a few weeks, the pain will probably get worse and potentially significantly so, and we\'ll have to schedule a procedure."',
      '"Or we can do the procedure now, which uses sound waves to break the stone apart from outside your body. It\'s a bit more invasive than just waiting on the medication and has negative side effects, but it gives you a better shot at actually clearing the stone without needing to come back for another round."',
      '"Up to you—want to try the medication and see if it passes on its own, or go ahead and schedule the procedure now?"',
    ],
    optionA: {
      id: 'medication',
      label: 'Try the medication',
      probabilityGood: 0.5,
      textGood: "A few days later, sharp pain hits—but this time, it's the stone finally passing! Rough couple of hours, but it's over, and you never needed the procedure at all.",
      textBad: "Weeks pass and nothing happens. Eventually the pain gets bad enough that you're back at the doctor's office anyway, scheduling the procedure you tried to avoid…",
    },
    optionB: {
      id: 'procedure',
      label: 'Schedule the procedure',
      probabilityGood: 0.7,
      textGood: "The procedure does its job—the stone breaks up and passes within the week! No second round needed.",
      textBad: "The first round doesn't fully break up the stone, and on top of that, you're stuck with blood in your urine for a few uncomfortable days. You're back in a few weeks for a second treatment…",
    },
  },
  {
    id: 'investing',
    promptLines: [
      '"You just got a bonus and want to invest it. Your advisor lays it out: \'Markets tend to drift upward over time, so the sooner your money\'s in, the more time it has to grow. But if you put it all in today and the market dips right after, you\'ll wish you\'d eased in gradually instead.\'"',
      '"\'Some people invest it all right away. Others spread it out over several months, buying a little at a time so no single bad day hurts as much.\'"',
      '"\'What do you want to do—go all in now, or ease into it over time?\'"',
    ],
    optionA: {
      id: 'lump_sum',
      label: 'Invest it all now',
      probabilityGood: 0.66,
      textGood: "The market climbs steadily in the months after. Your full investment rides the whole way up—turns out today was a great day to buy!",
      textBad: "Right after you invest, the market dips hard. You watch your windfall shrink before it has any chance to recover…",
    },
    optionB: {
      id: 'ease_in',
      label: 'Ease into it over time',
      probabilityGood: 0.34,
      textGood: "A few weeks in, the market drops sharply. Because most of your money was still sitting safely on the sidelines, you dodge the worst of it!",
      textBad: "The market just keeps climbing while you're still easing your money in. By the time you're fully invested, you've missed a big chunk of the gains…",
    },
  },
  {
    id: 'roommate',
    promptLines: [
      '"You\'re about to start your first year at college, and you\'ve been chatting with a few incoming students online. One of them, Sam, seems like a great fit—easygoing, into the same music as you—though Sam also mentions loving to have friends over most nights and not being much of an early riser, so mornings might be an adjustment."',
      '"You could lock Sam in as your roommate now, or leave it up to random assignment—your school\'s housing office says most students end up satisfied with their assigned roommate, even without choosing."',
      '"Do you choose Sam, or leave it up to random assignment?"',
    ],
    optionA: {
      id: 'choose_sam',
      label: 'Choose Sam',
      probabilityGood: 0.65,
      textGood: "You and Sam click immediately. Same sleep schedule, same sense of humor—it feels like you picked right.",
      textBad: "Sam ends up staying up all night and refuses to let you sleep. Needless to say, you aren't the closest of roommates.",
    },
    optionB: {
      id: 'random',
      label: 'Leave it up to random assignment',
      probabilityGood: 0.65,
      textGood: "Your randomly assigned roommate turns out to be great—easy to live with, and you actually become close friends.",
      textBad: "Your randomly assigned roommate is a rough fit—messy, mismatched schedules, hard to talk to.",
    },
  },
]