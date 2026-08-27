import './cafe-books.css'

const mapping = [
  { name: 'Café', category: 'Thoughts & Reflections', color: '#FAC775' },
  { name: 'School', category: 'Career & Contributions', color: '#B5D4F4' },
  { name: 'Commons', category: 'Community & Relationships', color: '#ED93B1' },
  { name: 'Field', category: 'Health & Athletics', color: '#C0DD97' },
  { name: 'Overlook', category: 'Joy & Simple Things', color: '#27500A' },
]

function WelcomeBook() {
  return (
    <div className="welcome-book">
      <p className="welcome-book__greeting">Hello!</p>
      <p className="welcome-book__text">
        I'm Rona—this is my corner of the internet. Remember how I said
        I'd get to know you? Here's my half of the deal:{' '}
        <span className="welcome-book__highlight">5 locations</span>, each one
        holding a different piece of my life. Wander around, click on things,
        answer what feels true.
      </p>
      <p className="welcome-book__mapping-intro">Here's a quick mapping:</p>
      <div className="welcome-book__mapping">
        {mapping.map((row) => (
          <div key={row.name} className="welcome-book__mapping-row">
            <span className="welcome-book__mapping-name" style={{ color: row.color }}>
              {row.name}
            </span>
            <span className="welcome-book__mapping-arrow" style={{ color: row.color }}>
              →
            </span>
            <span className="welcome-book__mapping-category">{row.category}</span>
          </div>
        ))}
      </div>
      <p className="welcome-book__text">
        I'm curious what you'll find, and what I'll learn about{' '}
        <em>you</em> along the way.
      </p>
      <p className="welcome-book__signature">— Rona</p>
    </div>
  )
}

export default WelcomeBook