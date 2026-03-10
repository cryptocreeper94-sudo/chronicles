/* ====== Chronicles Marketing Entry — Hero Video Carousel ====== */
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { VolumeX, Volume2 } from 'lucide-react'

/* ── Video inventory (public/videos/) ── */
const HERO_VIDEOS = [
    { src: '/videos/medieval_castle_twilight_scene.mp4', label: 'Medieval Era' },
    { src: '/videos/wild_west_frontier_town_flyover.mp4', label: 'Wild West' },
    { src: '/videos/ancient_rome_colosseum_glory.mp4', label: 'Ancient Rome' },
    { src: '/videos/victorian_london_foggy_streets.mp4', label: 'Victorian London' },
    { src: '/videos/ancient_egypt_pyramids_sunset.mp4', label: 'Ancient Egypt' },
    { src: '/videos/biblical_jerusalem_temple_scene.mp4', label: 'Biblical Era' },
    { src: '/videos/medieval_kingdom_establishing_shot.mp4', label: 'Medieval Kingdom' },
]

/* ── Era cards with real images ── */
const ERAS = [
    {
        id: 'medieval',
        name: 'Medieval Era',
        desc: 'Forge alliances, defend kingdoms, and master ancient crafts',
        img: '/images/medieval_fantasy_kingdom.png',
    },
    {
        id: 'wildwest',
        name: 'Wild West',
        desc: 'Stake your claim, tame the frontier, and build your legacy',
        img: '/images/wild_west_frontier_town.png',
    },
    {
        id: 'roman',
        name: 'Roman Empire',
        desc: 'Command legions, shape politics, and claim glory in the arena',
        img: '/images/roman_empire_colosseum_gladiators.png',
    },
    {
        id: 'egypt',
        name: 'Ancient Egypt',
        desc: 'Build monuments, decipher mysteries, and rule as pharaoh',
        img: '/images/ancient_egyptian_kingdom_sunset.png',
    },
    {
        id: 'victorian',
        name: 'Victorian London',
        desc: 'Navigate gaslit streets, unravel conspiracies, and climb society',
        img: '/images/victorian_london_street_scene.png',
    },
    {
        id: 'japan',
        name: 'Feudal Japan',
        desc: 'Walk the bushido path, master the blade, and protect your honour',
        img: '/images/feudal_japan_samurai_castle.png',
    },
]

/* ── Audio fade helper ── */
function fadeAudio(video: HTMLVideoElement, fadeIn: boolean, duration = 500) {
    const steps = 20
    const stepTime = duration / steps
    const startVol = fadeIn ? 0 : 1
    const endVol = fadeIn ? 1 : 0
    const volStep = (endVol - startVol) / steps
    video.volume = startVol
    let step = 0
    const interval = setInterval(() => {
        step++
        video.volume = Math.max(0, Math.min(1, startVol + volStep * step))
        if (step >= steps) {
            clearInterval(interval)
            video.volume = endVol
        }
    }, stepTime)
}

export default function Chronicles() {
    /* ── Video state ── */
    const [videoMuted, setVideoMuted] = useState(true)
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
    const [nextVideoIndex, setNextVideoIndex] = useState(1)
    const [isVideoTransitioning, setIsVideoTransitioning] = useState(false)
    const currentVideoRef = useRef<HTMLVideoElement>(null)
    const nextVideoRef = useRef<HTMLVideoElement>(null)

    /* ── Video end → crossfade ── */
    useEffect(() => {
        const handleVideoEnd = () => {
            const currentVideo = currentVideoRef.current
            if (currentVideo && !videoMuted) fadeAudio(currentVideo, false, 500)
            setIsVideoTransitioning(true)
            setTimeout(() => {
                setCurrentVideoIndex(nextVideoIndex)
                setNextVideoIndex((nextVideoIndex + 1) % HERO_VIDEOS.length)
                setIsVideoTransitioning(false)
            }, 400)
        }
        const video = currentVideoRef.current
        if (video) {
            video.addEventListener('ended', handleVideoEnd)
            return () => video.removeEventListener('ended', handleVideoEnd)
        }
    }, [nextVideoIndex, videoMuted])

    /* ── Preload next video ── */
    useEffect(() => {
        if (nextVideoRef.current) nextVideoRef.current.load()
    }, [nextVideoIndex])

    /* ── Play current video ── */
    useEffect(() => {
        if (currentVideoRef.current && !isVideoTransitioning) {
            const video = currentVideoRef.current
            video.volume = 0
            video.play().catch(() => { })
            if (!videoMuted) fadeAudio(video, true, 500)
        }
    }, [currentVideoIndex, isVideoTransitioning, videoMuted])

    /* ── Jump to specific video ── */
    const jumpToVideo = (idx: number) => {
        if (idx === currentVideoIndex) return
        setNextVideoIndex(idx)
        setIsVideoTransitioning(true)
        setTimeout(() => {
            setCurrentVideoIndex(idx)
            setNextVideoIndex((idx + 1) % HERO_VIDEOS.length)
            setIsVideoTransitioning(false)
        }, 700)
    }

    return (
        <div className="chrono-layout">
            {/* ── Nav ── */}
            <nav className="chrono-nav">
                <div className="chrono-nav-brand">⚡ <span>Chronicles</span> <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>by <a href="https://darkwavestudios.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-glow)', textDecoration: 'none' }}>DarkWave Studios</a></span></div>
                <ul className="chrono-nav-links">
                    <li><Link to="/chrono/eras">Eras</Link></li>
                    <li><Link to="/chrono/gameplay">Gameplay</Link></li>
                    <li><Link to="/chrono/economy">Economy</Link></li>
                    <li><Link to="/chrono/community">Community</Link></li>
                    <li><Link to="/chronicles/login">Play Now</Link></li>
                </ul>
            </nav>

            {/* ══════ HERO VIDEO CAROUSEL ══════ */}
            <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 56, overflow: 'hidden' }}>
                {/* Black base */}
                <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
                    {/* Current video */}
                    <video
                        ref={currentVideoRef}
                        key={`current-${currentVideoIndex}`}
                        autoPlay
                        muted={videoMuted}
                        playsInline
                        className="hero-video"
                        style={{ opacity: isVideoTransitioning ? 0 : 1 }}
                    >
                        <source src={HERO_VIDEOS[currentVideoIndex].src} type="video/mp4" />
                    </video>

                    {/* Next video (preloaded, shows during transition) */}
                    <video
                        ref={nextVideoRef}
                        key={`next-${nextVideoIndex}`}
                        muted={videoMuted}
                        playsInline
                        preload="auto"
                        className="hero-video"
                        style={{ opacity: isVideoTransitioning ? 1 : 0 }}
                    >
                        <source src={HERO_VIDEOS[nextVideoIndex].src} type="video/mp4" />
                    </video>

                    {/* Gradient overlays for text readability */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4) 50%, #06060a)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent 30%, transparent 70%, rgba(0,0,0,0.7))' }} />
                </div>

                {/* Atmospheric cyan/purple glow */}
                <div className="hero-glow" />

                {/* Video indicator dots */}
                <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
                    <div className="hero-dots">
                        {HERO_VIDEOS.map((video, idx) => (
                            <button
                                key={idx}
                                onClick={() => jumpToVideo(idx)}
                                className={`hero-dot ${currentVideoIndex === idx ? 'active' : 'inactive'}`}
                                title={video.label}
                                data-testid={`button-video-${idx}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Mute / unmute toggle */}
                <button
                    onClick={() => setVideoMuted(!videoMuted)}
                    className="hero-mute-btn"
                    data-testid="button-toggle-sound"
                >
                    {videoMuted
                        ? <VolumeX style={{ width: 20, height: 20 }} />
                        : <Volume2 style={{ width: 20, height: 20 }} />}
                </button>

                {/* Hero text content */}
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 720, padding: '0 24px' }}>
                    <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                        by <a href="https://darkwavestudios.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-glow)', textDecoration: 'none' }}>DarkWave Studios</a>
                    </p>
                    <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 8, color: '#fff' }}>
                        Chronicles
                    </h1>
                    <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 300, color: 'rgba(255,255,255,0.5)', marginBottom: 16, letterSpacing: 1 }}>
                        Your Choices. Your <span style={{ color: 'var(--accent-glow)' }}>Legacy</span>.
                    </p>
                    <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: 'rgba(255,255,255,0.6)', marginBottom: 24, lineHeight: 1.6 }}>
                        Live parallel lives across history's greatest eras. Every decision shapes who you become.
                        AI-driven narratives. Blockchain-verified choices. No morality meters — just consequences.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/chronicles/login" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
                            Begin Your Journey →
                        </Link>
                        <Link to="/chronicles/demo" className="btn btn-ghost" style={{ padding: '14px 32px', fontSize: 15 }}>
                            Try the Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════ MAIN CONTENT ══════ */}
            <main className="chrono-main">
                {/* Social proof ticker */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div className="social-ticker">
                        <div className="social-ticker-item"><div className="social-ticker-value">1,247</div><div className="social-ticker-label">Players</div></div>
                        <div className="social-ticker-item"><div className="social-ticker-value">47,832</div><div className="social-ticker-label">Decisions Made</div></div>
                        <div className="social-ticker-item"><div className="social-ticker-value">73</div><div className="social-ticker-label">Historical Eras</div></div>
                        <div className="social-ticker-item"><div className="social-ticker-value">3</div><div className="social-ticker-label">Eras Live</div></div>
                    </div>
                </div>

                {/* ── Era Cards ── */}
                <h2 className="section-title" style={{ textAlign: 'center' }}>Travel Through Time</h2>
                <p className="section-sub" style={{ textAlign: 'center' }}>Each era offers unique challenges, characters, and paths to power.</p>

                <div className="grid-3">
                    {ERAS.map(era => (
                        <div key={era.id} className="holo-card">
                            <div className="card-image">
                                <img src={era.img} alt={era.name} />
                                <div className="card-image-overlay" />
                            </div>
                            <div className="holo-card-inner" style={{ textAlign: 'center' }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{era.name}</h3>
                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{era.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── The Parallel Self ── */}
                <div style={{ textAlign: 'center', marginTop: 48 }}>
                    <h2 className="section-title">The Parallel Self</h2>
                    <p className="section-sub" style={{ maxWidth: 600, margin: '0 auto 32px' }}>
                        No morality meters. No karma bars. Your choices reveal character, not enforce it.
                        AI observes your patterns and reflects them back — showing you who you truly are.
                    </p>
                </div>
            </main>

            <footer className="chrono-footer">
                © 2026 DarkWave Studios. All rights reserved. A Trust Layer Ecosystem App.
            </footer>
        </div>
    )
}
