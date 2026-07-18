import './cafe-books.css'

import { useState } from 'react'
import { useQuestions } from '../../../hooks/useQuestions'

function WitnessBook() {
  const { saveAnswer, markSeen, getSeenQuestions } = useQuestions()
  const seen = getSeenQuestions()
  const [submitted, setSubmitted] = useState(seen.includes('cafe_witness_question'))
  const [answer, setAnswer] = useState(() => {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    return visitor.answers?.cafe_witness_question || ''
  })

  function handleSubmit() {
    if (answer.trim() === '') return
    saveAnswer('cafe_witness_question', answer)
    markSeen('cafe_witness_question')
    setSubmitted(true)
  }

  return (
    <div className="witness-book">
      <p className="witness-book__subtitle">Why do you think people look for a lifelong partner?</p>
      <div className="witness-book__body">
        <p>When I was 14, I didn't believe in long-term relationships (not that I had ever even been in one). I thought the desperate need and search for true love was created by media and pushed by corporate. After all, happiness is constantly fluctuating and difficult to define—how can one person guarantee a fleeting feeling that centuries of research and exploration has not yielded a clear answer to?</p>
        <p>14-year-old me had some valid points (although ironically she was the biggest consumer of the rom-com entertainment), but some questions can only be answered through experience. At 16, I met the person who shattered my original belief. I still have no answers to the happiness question, but a new belief emerged. For human beings, connection is a need. Moreso, a full and deep connection brings unquantifiable value that is rare and treasured. There is a certain happiness that can only be obtained through the knowledge that we are loved, known, and supported and only understood when experienced.</p>
        <p>Now you may ask (as I have asked), "What about other non-romantic connections?". I believe these are vital as well, but they are different as they have a many-to-many relationship while a lifelong partner is a one-to-one relationship. The promise of priority, patience and effort for a lifetime. And one day, an eloquent Instagram Reel gifted me a resonating answer:</p>
        <blockquote className="witness-book__quote">
          "We need a witness to our lives. There's a billion people on the planet... I mean, what does any one life really mean? But in a marriage, you're promising to care about everything. The good things, the bad things, the terrible things, the mundane things... all of it, all of the time, every day. You're saying 'Your life will not go unnoticed because I will notice it. Your life will not go un-witnessed because I will be your witness.'" <br/>
          — from the movie "Shall We Dance?"
        </blockquote>
        <p className="witness-book__question">Now let me ask you—why do you think people look for a lifelong partner?</p>

        {!submitted ? (
          <div className="witness-book__input-wrap">
            <textarea
              className="witness-book__input"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="your thoughts..."
              rows={3}
            />
            <button className="witness-book__submit" onClick={handleSubmit}>
              share your thoughts
            </button>
          </div>
        ) : (
          <p className="witness-book__thanks">thank you for sharing. ✦</p>
        )}
      </div>
    </div>
  )
}

export default WitnessBook