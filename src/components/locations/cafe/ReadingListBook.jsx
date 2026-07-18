import './cafe-books.css'

function ReadingListBook() {
  const books = [
    { title: 'Tuesdays with Morrie', author: 'Mitch Albom', status: 'in progress' },
    { title: 'Eleanor Oliphant is Completely Fine', author: 'Gail Honeyman' },
    { title: 'Freakonomics', author: 'Steven Levitt & Stephen J. Dubner' },
    { title: 'Funny Story', author: 'Emily Henry' },
    { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin' },
  ]

  return (
    <div className="reading-list">
      <p className="reading-list__intro">books i've read recently, in no particular order.</p>
      <div className="reading-list__items">
        {books.map((book, i) => (
          <div key={i} className="reading-list__item">
            <span className="reading-list__title">{book.title}</span>
            <span className="reading-list__author">{book.author}</span>
            {book.status && <span className="reading-list__status">{book.status}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReadingListBook