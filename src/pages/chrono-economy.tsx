/* ====== Chrono Economy ====== */
import { Link } from 'react-router-dom'

export default function ChronoEconomy() {
  return (
    <div className="chrono-layout">
      <nav className="chrono-nav">
        <Link to="/chrono" className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>← Chrono</Link>
        <div className="chrono-nav-brand">⚡ <span>Economy</span></div>
        <div />
      </nav>
      <main className="chrono-main">
        <h2 className="section-title">Economy</h2>
        <p className="section-sub">Shell tokens, marketplace dynamics, and the in-game economic model.</p>
        <div className="glass-card glow" style={{ textAlign: 'center' }}>
          <div className="card-image" style={{ borderRadius: '12px 12px 0 0' }}>
            <img src="/images/victorian_london_street_scene.png" alt="Economy" />
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
