import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuestions } from '../../../hooks/useQuestions'
import './cafe-books.css'

const pieces = [
  { id: 'dali', src: '/art/dali.jpg' },
  { id: 'hirst', src: '/art/hirst.jpg' },
  { id: 'koons', src: '/art/koons.png' },
  { id: 'millet', src: '/art/millet.jpg' },
]

const titles = {
  dali: 'Birth of Liquid Desires — Salvador Dalí',
  hirst: 'The Physical Impossibility of Death in the Mind of Someone Living — Damien Hirst',
  koons: 'Balloon Dog — Jeff Koons',
  millet: 'The Gleaners — Jean-François Millet',
}



function SortableItem({ id, src }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="ugly-art__item">
      <img src={src} alt="" className="ugly-art__img"/>
    </div>
  )
}

function UglyArtBook() {
  const { saveAnswer, markSeen, getSeenQuestions } = useQuestions()
  const seen = getSeenQuestions()
  const [submitted, setSubmitted] = useState(seen.includes('ugly_art_ranking'))
  const [items, setItems] = useState(() => {
    const visitor = JSON.parse(localStorage.getItem('visitor')) || {}
    const saved = visitor.answers?.ugly_art_ranking
    if (saved) return saved.split(',')
    return pieces.map(p => p.id)
  })
  
  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event) {
    const { active, over } = event
    if (active.id !== over?.id) {
      setItems(prev => {
        const oldIndex = prev.indexOf(active.id)
        const newIndex = prev.indexOf(over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  function handleSubmit() {
    const ranking = items.join(',')
    saveAnswer('ugly_art_ranking', ranking)
    markSeen('ugly_art_ranking')
    setSubmitted(true)
  }

  return (
    <div className="ugly-art-book">
      <p className="ugly-art-book__intro">
        One of my favorite high school teachers taught a segment on art. Two questions came up:
        what qualifies as art? And what qualifies as <em>good</em> art?
      </p>
      <p className="ugly-art-book__intro">
        The first is nearly impossible to answer with exclusion. The second is far more interesting.
        Drag these four pieces to rank them from most to least good—in your opinion.
      </p>

      {!submitted ? (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={horizontalListSortingStrategy}>
              <div className="ugly-art__grid">
                {items.map(id => {
                  const piece = pieces.find(p => p.id === id)
                  return <SortableItem key={id} id={id} src={piece.src}/>
                })}
              </div>
            </SortableContext>
          </DndContext>
          <p className="ugly-art-book__hint">drag to reorder · best on the left</p>
          <button className="witness-book__submit" onClick={handleSubmit}>
            submit my ranking
          </button>
        </>
      ) : (
        <div className="ugly-art__reveal">
          <p className="witness-book__thanks">here's what you ranked ✦</p>
          <div className="ugly-art__grid">
            {items.map((id, index) => {
              const piece = pieces.find(p => p.id === id)
              return (
                <div key={id} className="ugly-art__item">
                  <img src={piece.src} alt="" className="ugly-art__img"/>
                  <p className="ugly-art__rank">#{index + 1}</p>
                  <p className="ugly-art__title">{titles[id]}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default UglyArtBook