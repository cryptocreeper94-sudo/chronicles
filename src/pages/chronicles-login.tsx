/* ====== Chronicles Login ====== */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function ChroniclesLogin() {
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const { login, signup, devLogin, loading, error } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (mode === 'login') {
            await login(email, password)
        } else {
            await signup(email, password, username)
        }
        if (useAuthStore.getState().isAuthenticated) {
            navigate('/chronicles/portal')
        }
    }

    const handleDevLogin = () => {
        devLogin()
        navigate('/chronicles/portal')
    }

    return (
        <div className="chrono-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-card glow" style={{ maxWidth: 420, width: '100%', padding: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
                    <span style={{ color: 'var(--accent-glow)' }}>DarkWave</span> Chronicles
                </h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: 13, marginBottom: 24 }}>
                    {mode === 'login' ? 'Continue your journey' : 'Begin your parallel life'}
                </p>

                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    <button
                        className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ flex: 1 }}
                        onClick={() => setMode('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`btn ${mode === 'signup' ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ flex: 1 }}
                        onClick={() => setMode('signup')}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {mode === 'signup' && (
                        <input
                            className="input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            data-testid="username-input"
                        />
                    )}
                    <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        data-testid="email-input"
                    />
                    <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        data-testid="password-input"
                    />

                    {error && <p style={{ color: '#06b6d4', fontSize: 12 }}>{error}</p>}

                    <button className="btn btn-primary" type="submit" disabled={loading} data-testid="submit-btn"
                        style={{ width: '100%', marginTop: 8 }}>
                        {loading ? 'Loading...' : mode === 'login' ? 'Enter the Chronicles' : 'Create Account'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>or</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
                </div>

                <button
                    className="btn"
                    onClick={handleDevLogin}
                    style={{
                        width: '100%',
                        padding: '14px 20px',
                        fontSize: 15,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        cursor: 'pointer',
                        letterSpacing: 0.5,
                    }}
                    data-testid="dev-login-btn"
                >
                    ⚡ Play Now — Dev Mode
                </button>

                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    A Trust Layer Ecosystem App
                </p>
            </div>
        </div>
    )
}
