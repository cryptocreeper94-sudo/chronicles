/* ====== Chronicles Hub — Central Dashboard ====== */
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { useShellStore } from '../stores/shellStore'
import { useAuthStore } from '../stores/authStore'
import {
    Gamepad2, Globe, Home, Sun, Heart, PawPrint,
    MessageCircle, Map, ShoppingBag, Trophy, Building2, Clock,
    Swords, Shield, Compass
} from 'lucide-react'
import type { Era } from '../types/game'

const ERA_COLORS: Record<Era, string> = { modern: '#06b6d4', medieval: '#a855f7', wildwest: '#22d3ee' }

const NAV_ITEMS = [
    { label: 'Play', path: '/chronicles/play', Icon: Gamepad2 },
    { label: 'World', path: '/chronicles/world', Icon: Globe },
    { label: 'Estate', path: '/chronicles/estate', Icon: Home },
    { label: 'Daily Life', path: '/chronicles/daily-life', Icon: Sun },
    { label: 'Faith', path: '/chronicles/faith', Icon: Heart },
    { label: 'Pets', path: '/chronicles/pets', Icon: PawPrint },
    { label: 'NPC Chat', path: '/chronicles/npc-chat', Icon: MessageCircle },
    { label: 'Travel', path: '/chronicles/travel', Icon: Map },
    { label: 'Marketplace', path: '/chronicles/marketplace', Icon: ShoppingBag },
    { label: 'Seasons', path: '/chronicles/seasons', Icon: Trophy },
    { label: 'City', path: '/chronicles/city', Icon: Building2 },
    { label: 'Time Portal', path: '/chronicles/time-portal', Icon: Clock },
]

const ERA_ICONS: Record<Era, React.FC<{ style?: React.CSSProperties }>> = {
    modern: Compass,
    medieval: Shield,
    wildwest: Swords,
}

export default function ChroniclesHub() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()
    const { gameState, character, currentEra, loadGameState, switchEra } = useGameStore()
    const { balance, loadBalance, claimDailyReward } = useShellStore()
    const [rewardMsg, setRewardMsg] = useState('')

    useEffect(() => {
        if (!isAuthenticated) { navigate('/chronicles/login'); return }
        loadGameState()
        loadBalance()
    }, [isAuthenticated])

    const handleClaimReward = async () => {
        const r = await claimDailyReward()
        if (r) setRewardMsg(`+${r.shells} Shells (${r.streak} day streak!)`)
        else setRewardMsg('Already claimed today!')
        setTimeout(() => setRewardMsg(''), 3000)
    }

    return (
        <div className="chrono-layout">
            {/* Nav */}
            <nav className="chrono-nav">
                <div className="chrono-nav-brand">⚡ <span>Chronicles</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="stat-badge">{balance} Shells</span>
                    <span className="stat-badge purple">LVL {character?.level || 1}</span>
                    <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => navigate('/chronicles/login')}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className="chrono-main">
                {/* Era Switcher */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    {(['modern', 'medieval', 'wildwest'] as Era[]).map(era => {
                        const EraIcon = ERA_ICONS[era]
                        return (
                            <button
                                key={era}
                                className={`btn ${currentEra === era ? '' : 'btn-ghost'}`}
                                style={{
                                    flex: 1,
                                    background: currentEra === era ? `linear-gradient(135deg, ${ERA_COLORS[era]}22, ${ERA_COLORS[era]}08)` : undefined,
                                    borderColor: currentEra === era ? ERA_COLORS[era] : undefined,
                                    color: currentEra === era ? ERA_COLORS[era] : undefined,
                                }}
                                onClick={() => switchEra(era)}
                                data-testid={`era-${era}`}
                            >
                                <EraIcon style={{ width: 16, height: 16 }} /> {era.charAt(0).toUpperCase() + era.slice(1)}
                            </button>
                        )
                    })}
                </div>

                {/* Daily Reward */}
                <div className="glass-card glow" style={{ padding: 16, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: 14, fontWeight: 600 }}>Daily Reward</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Login every day for bonus shells</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {rewardMsg && <span style={{ fontSize: 12, color: 'var(--accent-glow)' }}>{rewardMsg}</span>}
                        <button className="btn btn-primary" style={{ fontSize: 12, padding: '8px 16px' }} onClick={handleClaimReward}>
                            Claim
                        </button>
                    </div>
                </div>

                {/* Character Stats */}
                {character && (
                    <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{character.name}</h3>
                        <div className="grid-4" style={{ gap: 8 }}>
                            {[
                                { label: 'Wisdom', value: character.wisdom, color: '#a855f7' },
                                { label: 'Courage', value: character.courage, color: '#c084fc' },
                                { label: 'Compassion', value: character.compassion, color: '#06b6d4' },
                                { label: 'Cunning', value: character.cunning, color: '#22d3ee' },
                                { label: 'Energy', value: character.energy, color: '#06b6d4' },
                                { label: 'Mood', value: character.mood, color: '#a855f7' },
                                { label: 'Health', value: character.health, color: '#22d3ee' },
                                { label: 'Hunger', value: character.hunger, color: '#c084fc' },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: s.color }}>{s.value}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation Grid */}
                <h2 className="section-title" style={{ fontSize: 20, marginBottom: 16 }}>What will you do?</h2>
                <div className="grid-3">
                    {NAV_ITEMS.map(item => (
                        <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                            <div className="holo-card" style={{ textAlign: 'center' }}>
                                <div className="holo-card-inner">
                                    <item.Icon style={{ width: 28, height: 28, marginBottom: 8, color: 'var(--accent)' }} />
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer className="chrono-footer">
                DarkWave Chronicles — A Trust Layer Ecosystem App
            </footer>
        </div>
    )
}
