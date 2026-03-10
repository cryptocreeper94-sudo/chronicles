/* ====== Chrono Eras ====== */
import { Link } from 'react-router-dom'

export default function ChronoEras() {
  return (
    <div className="chrono-layout">
      <nav className="chrono-nav">
        <Link to="/chrono" className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>← Chrono</Link>
        <div className="chrono-nav-brand">⚡ <span>Eras</span></div>
        <div />
      </nav>
      <main className="chrono-main">
        <h2 className="section-title">Eras</h2>
        <p className="section-sub">Explore every historical era available in Chronicles.</p>
        <div className="glass-card glow" style={{ textAlign: 'center' }}>
          <div className="card-image" style={{ borderRadius: '12px 12px 0 0' }}>
            <img src="/images/ancient_egyptian_kingdom_sunset.png" alt="Eras" />
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
