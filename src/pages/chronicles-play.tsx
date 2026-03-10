/* ====== Chronicles Play — Core Gameplay Loop ====== */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { useAuthStore } from '../stores/authStore'
import { ChroniclesEngine } from '../components/chronicles-3d'
import type { Choice } from '../types/game'

export default function ChroniclesPlay() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()
    const { currentScenario, currentEra, character, loading, generateScenario, makeDecision, loadGameState } = useGameStore()
    const [result, setResult] = useState<any>(null)
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null)

    useEffect(() => {
        if (!isAuthenticated) { navigate('/chronicles/login'); return }
        loadGameState()
    }, [isAuthenticated])

    const handleGenerate = async () => {
        setResult(null)
        setSelectedChoice(null)
        await generateScenario()
    }

    const handleDecision = async (choice: Choice) => {
        setSelectedChoice(choice.id)
        const r = await makeDecision(choice.id)
        setResult(r)
    }

    return (
        <div className="chrono-layout">
            <nav className="chrono-nav">
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => navigate('/chronicles/hub')}>
                    ← Hub
                </button>
                <div className="chrono-nav-brand">⚡ <span>Play</span></div>
                <span className="stat-badge">LVL {character?.level || 1}</span>
            </nav>

            {/* 3D Scene */}
            <div style={{ height: '35vh', borderBottom: '1px solid var(--border)' }}>
                <ChroniclesEngine
                    era={currentEra}
                    level={character?.level}
                    xp={character?.experience}
                    shells={parseInt(character?.shellsEarned || '0')}
                />
            </div>

            <main className="chrono-main" style={{ maxWidth: 700 }}>
                {/* Generate Scenario */}
                {!currentScenario && !result && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <h2 className="section-title" style={{ fontSize: 22 }}>Ready for a new challenge?</h2>
                        <p className="section-sub">AI will generate a unique scenario based on your era and personality.</p>
                        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} data-testid="generate-btn">
                            {loading ? 'Generating...' : 'Generate Scenario →'}
                        </button>
                    </div>
                )}

                {/* Scenario Display */}
                {currentScenario && !result && (
                    <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                        <div className="glass-card glow" style={{ padding: 24, marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <span className={`era-badge era-${currentEra}`}>{currentEra}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 4 }}>
                                    Difficulty: {Array.from({ length: currentScenario.difficulty }, (_, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />)}
                                </span>
                            </div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{currentScenario.title}</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>
                                {currentScenario.description}
                            </p>
                        </div>

                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                            What do you do?
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {currentScenario.choices.map((choice: Choice) => (
                                <button
                                    key={choice.id}
                                    className="holo-card"
                                    style={{
                                        textAlign: 'left', cursor: 'pointer', border: selectedChoice === choice.id ? '1px solid var(--accent)' : undefined,
                                        opacity: selectedChoice && selectedChoice !== choice.id ? 0.5 : 1,
                                    }}
                                    onClick={() => handleDecision(choice)}
                                    disabled={!!selectedChoice}
                                    data-testid={`choice-${choice.id}`}
                                >
                                    <p style={{ fontSize: 14, color: 'var(--text-primary)' }}>{choice.text}</p>
                                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                                        {Object.entries(choice.consequences).map(([stat, delta]) => (
                                            <span key={stat} className="stat-badge" style={{
                                                color: Number(delta) > 0 ? '#06b6d4' : '#a855f7',
                                                background: Number(delta) > 0 ? 'rgba(6,182,212,0.08)' : 'rgba(168,85,247,0.08)',
                                                borderColor: Number(delta) > 0 ? 'rgba(6,182,212,0.15)' : 'rgba(168,85,247,0.15)',
                                            }}>
                                                {stat} {Number(delta) > 0 ? '+' : ''}{delta}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div style={{ animation: 'fadeInUp 0.4s ease-out', textAlign: 'center', padding: '24px 0' }}>
                        <div className="glass-card glow" style={{ padding: 24, marginBottom: 20 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--accent-glow)' }}>Decision Recorded</h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>
                                {result.narrative || 'Your choice has been etched into the Chronicles forever.'}
                            </p>
                            {result.xpGained && <p style={{ color: 'var(--accent)', marginTop: 8 }}>+{result.xpGained} XP earned</p>}
                            {result.shellsEarned && <p style={{ color: 'var(--purple-glow)' }}>+{result.shellsEarned} Shells</p>}
                        </div>
                        <button className="btn btn-primary" onClick={handleGenerate} data-testid="next-scenario-btn">
                            ⚡ Next Scenario
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
