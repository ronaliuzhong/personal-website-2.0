import './BookModal.css'
import UglyArtBook from './UglyArtBook'
import ReadingListBook from './ReadingListBook'
import WitnessBook from './WitnessBook'

const bookComponents = {
  book_ugly_art: UglyArtBook,
  book_reading_list: ReadingListBook,
  book_witness: WitnessBook,
}

function BookModal({ book, onClose }) {
  const BookContent = bookComponents[book.id]

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-modal" onClick={e => e.stopPropagation()}>
        <div className="book-modal__titlebar" style={{ borderColor: book.color }}>
          <span className="book-modal__title" style={{ color: book.color }}>{book.title}</span>
          <button className="book-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="book-modal__body">
          {BookContent && <BookContent />}
        </div>
      </div>
    </div>
  )
}

export default BookModal