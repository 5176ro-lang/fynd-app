const PICKUP_SPOTS = [
  {
    name: 'Main Library (Columbus Metropolitan Library)',
    address: '96 S. Grant Ave, Columbus, OH 43215',
    note: 'Downtown — busy, well-lit, staffed during open hours.',
  },
  {
    name: 'Whetstone Branch Library',
    address: '3909 N. High St, Columbus, OH 43214',
    note: 'North Columbus / Clintonville area.',
  },
  {
    name: 'Bexley Public Library',
    address: '2411 E. Main St, Bexley, OH 43209',
    note: 'East side, near German Village / Bexley.',
  },
  {
    name: 'Hilliard Branch Library',
    address: '4500 Hickory Chase Way, Hilliard, OH 43026',
    note: 'West side / Hilliard area.',
  },
];

export default function Community() {
  return (
    <section>
      <div className="section-divider">
        <span className="loop-glyph" aria-hidden="true"></span>
        <h2>Free market & safe pickups</h2>
        <span className="rule"></span>
      </div>

     <div className="community-card">
        <h3>Columbus Free Market</h3>
        <p>
          Every 3rd Sunday of the month, Columbus hosts a Free Market in various locations
          around the city — bring what you don't need, take what you do, no money involved.
          Follow{' '}
          <a href="https://www.instagram.com/fyndcolumbus/" target="_blank" rel="noreferrer">
            @FYNDColumbus
          </a>{' '}
          on Instagram to find our next FREE Market. Come connect, swap, and shop for free!
        </p>
        <p className="form-hint">
          Schedules and locations can shift month to month — check @FYNDColumbus's Instagram for the current date and address before you go.
        </p>
      </div>

      <div className="section-divider" style={{ marginTop: 36 }}>
        <span className="loop-glyph" aria-hidden="true"></span>
        <h2>Suggested pickup spots</h2>
        <span className="rule"></span>
      </div>

      <p className="form-hint" style={{ marginBottom: 16 }}>
        Fynd doesn't verify individual traders, so we encourage meeting somewhere public. These Central Ohio public libraries are well-lit, staffed, and easy for both sides to reach.
      </p>

      <div className="pickup-grid">
        {PICKUP_SPOTS.map((spot) => (
          <div className="pickup-card" key={spot.name}>
            <h4>{spot.name}</h4>
            <p className="pickup-address">{spot.address}</p>
            <p className="pickup-note">{spot.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}