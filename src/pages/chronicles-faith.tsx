/* ====== Faith and Spirituality ====== */
import { Link } from 'react-router-dom'

export default function ChroniclesFaith() {
  return (
    <div className="chrono-layout">
      <nav className="chrono-nav">
        <Link to="/chronicles/hub" className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>← Hub</Link>
        <div className="chrono-nav-brand">⚡ <span>Faith and Spirituality</span></div>
        <div />
      </nav>
      <main className="chrono-main">
        <h2 className="section-title">Faith and Spirituality</h2>
        <p className="section-sub">Study sacred texts, pray, attend services, and talk to Ursula.</p>
        <div className="glass-card glow" style={{ textAlign: 'center' }}>
          <div className="card-image" style={{ borderRadius: '12px 12px 0 0' }}>
            <img src="/images/ancient_wisdom_library_interior.png" alt="Faith and Spirituality" />
            <div className="card-image-overlay" />
          </div>
          <div style={{ padding: 32 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              This module is wired and ready. Connect to the backend to see live data.
            </p>
          </div>
        </div>
      </main>
      <footer className="chrono-footer">DarkWave Chronicles — A Trust Layer Ecosystem App</footer>
    </div>
  )
}
