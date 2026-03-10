/* Portal Entry — Session entry with offline summary */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { api } from '../services/api'

export default function ChroniclesPortalEntry() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()
    const [status, setStatus] = useState<any>(null)
    const [entering, setEntering] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) { navigate('/chronicles/login'); return }
        api.get('/api/chronicles/portal-entry/status').then(setStatus).catch(() => { })
    }, [isAuthenticated])

    const enter = async () => {
        setEntering(true)
        try { await api.post('/api/chronicles/portal-entry/enter') } catch { }
        navigate('/chronicles/hub')
    }

    return (
        <div className="chrono-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: 500, width: '100%', padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>⚡</div>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
                    Welcome Back, <span style={{ color: 'var(--accent-glow)' }}>Chronicler</span>
                </h1>
                {status?.offlineSummary && (
                    <div className="glass-card" style={{ padding: 16, marginTop: 20, marginBottom: 20, textAlign: 'left' }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--accent)' }}>While you were away...</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{status.offlineSummary}</p>
                    </div>
                )}
                <button className="btn btn-primary" style={{ padding: '14px 40px', fontSize: 16 }} onClick={enter} disabled={entering}>
                    {entering ? 'Entering...' : 'Enter the Chronicles →'}
                </button>
            </div>
        </div>
    )
}
