/* ====== Chrono Home ====== */
import { Link } from 'react-router-dom'

export default function ChronoHome() {
  return (
    <div className="chrono-layout">
      <nav className="chrono-nav">
        <Link to="/chronicles" className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>← Chronicles</Link>
        <div className="chrono-nav-brand">⚡ <span>Chrono</span></div>
        <div />
      </nav>
      <main className="chrono-main">
        <h2 className="section-title">Chrono</h2>
        <p className="section-sub">The marketing hub for DarkWave Chronicles.</p>
        <div className="glass-card glow" style={{ textAlign: 'center' }}>
          <div className="card-image" style={{ borderRadius: '12px 12px 0 0' }}>
            <img src="/images/medieval_fantasy_kingdom.png" alt="Chrono" />
            <div className="card-image-overlay" />
          </div>
          <div style={{ padding: 32 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>This module is wired and ready. Connect to the backend to see live data.</p>
          </div>
        </div>
      </main>
      <footer className="chrono-footer">DarkWave Chronicles — A Trust Layer Ecosystem App</footer>
    </div>
  )
}
