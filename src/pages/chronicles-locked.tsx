/* ====== Locked Content ====== */
import { Link } from 'react-router-dom'

export default function ChroniclesLocked() {
  return (
    <div className="chrono-layout">
      <nav className="chrono-nav">
        <Link to="/chronicles" className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>← Home</Link>
        <div className="chrono-nav-brand">⚡ <span>Locked</span></div>
        <div />
      </nav>
      <main className="chrono-main">
        <h2 className="section-title">Content Locked</h2>
        <p className="section-sub">This area requires authentication or higher progression to access.</p>
        <div className="glass-card glow" style={{ textAlign: 'center' }}>
          <div className="card-image" style={{ borderRadius: '12px 12px 0 0' }}>
            <img src="/images/medieval_castle_vertical_portrait.png" alt="Locked" />
            <div className="card-image-overlay" />
          </div>
          <div style={{ padding: 32 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Login or progress further to unlock this content.</p>
          </div>
        </div>
      </main>
      <footer className="chrono-footer">DarkWave Chronicles — A Trust Layer Ecosystem App</footer>
    </div>
  )
}
