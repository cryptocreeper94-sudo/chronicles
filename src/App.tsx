/* ====== DarkWave Chronicles — App Router ====== */
/* 43+ routes across core gameplay, world, life sim, social, progression, and marketing */
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { DWSCFooterBadge } from './components/DWSCFooterBadge'

// ── Loading fallback ──
function PageLoader() {
    return (
        <div className="page-loader">
            <div className="loader-orb" />
            <span>Loading...</span>
        </div>
    )
}

// ── Lazy-loaded pages ──
// Core Gameplay
const ChroniclesPage = lazy(() => import('./pages/chronicles'))
const LoginPage = lazy(() => import('./pages/chronicles-login'))
const OnboardingPage = lazy(() => import('./pages/chronicles-onboarding'))
const HubPage = lazy(() => import('./pages/chronicles-hub'))
const PlayPage = lazy(() => import('./pages/chronicles-play'))
const PortalEntryPage = lazy(() => import('./pages/chronicles-portal-entry'))
const DashboardPage = lazy(() => import('./pages/chronicles-dashboard'))

// World & Exploration
const WorldPage = lazy(() => import('./pages/chronicles-world'))
const CityPage = lazy(() => import('./pages/chronicles-city'))
const TravelPage = lazy(() => import('./pages/chronicles-travel'))
const TimePortalPage = lazy(() => import('./pages/chronicles-time-portal'))
const EstatePage = lazy(() => import('./pages/chronicles-estate'))
const InteriorPage = lazy(() => import('./pages/chronicles-interior'))

// Life Simulation
const DailyLifePage = lazy(() => import('./pages/chronicles-daily-life'))
const LifePage = lazy(() => import('./pages/chronicles-life'))
const FaithPage = lazy(() => import('./pages/chronicles-faith'))
const PetsPage = lazy(() => import('./pages/chronicles-pets'))
const MarketplacePage = lazy(() => import('./pages/chronicles-marketplace'))

// Social & AI
const NpcChatPage = lazy(() => import('./pages/chronicles-npc-chat'))
const AiDemoPage = lazy(() => import('./pages/chronicles-ai-demo'))
const VoicePage = lazy(() => import('./pages/chronicles-voice'))

// Progression & Meta
const SeasonHubPage = lazy(() => import('./pages/chronicles-season-hub'))
const BuilderPage = lazy(() => import('./pages/chronicles-builder'))
const ScenarioGenPage = lazy(() => import('./pages/scenario-generator'))
const EraCodexPage = lazy(() => import('./pages/era-codex'))
const LegacyPage = lazy(() => import('./pages/build-your-legacy'))

// Info & Admin
const DemoPage = lazy(() => import('./pages/chronicles-demo'))
const TutorialPage = lazy(() => import('./pages/chronicles-tutorial'))
const AdminPage = lazy(() => import('./pages/chronicles-admin'))
const ExecSummaryPage = lazy(() => import('./pages/chronicles-executive-summary'))
const LockedPage = lazy(() => import('./pages/chronicles-locked'))
const RoadmapPage = lazy(() => import('./pages/roadmap-chronicles'))

// Chrono Marketing
const ChronoHomePage = lazy(() => import('./pages/chrono-home'))
const ChronoCreatorsPage = lazy(() => import('./pages/chrono-creators'))
const ChronoTeamPage = lazy(() => import('./pages/chrono-team'))
const ChronoErasPage = lazy(() => import('./pages/chrono-eras'))
const ChronoCommunityPage = lazy(() => import('./pages/chrono-community'))
const ChronoRoadmapPage = lazy(() => import('./pages/chrono-roadmap'))
const ChronoDashboardPage = lazy(() => import('./pages/chrono-dashboard'))
const ChronoGameplayPage = lazy(() => import('./pages/chrono-gameplay'))
const ChronoEconomyPage = lazy(() => import('./pages/chrono-economy'))
const ChronoChatPage = lazy(() => import('./pages/chronochat'))
const ChronoChatInvitePage = lazy(() => import('./pages/chronochat-invite'))
import { PresaleBanner } from './components/PresaleBanner'
import { EcosystemAccountHub } from './components/EcosystemAccountHub'

export function App() {
    return (
        <>
        <PresaleBanner />
        <EcosystemAccountHub />
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Core Gameplay */}
                <Route path="/chronicles" element={<ChroniclesPage />} />
                <Route path="/chronicles/login" element={<LoginPage />} />
                <Route path="/chronicles/onboarding" element={<OnboardingPage />} />
                <Route path="/chronicles/hub" element={<HubPage />} />
                <Route path="/chronicles/play" element={<PlayPage />} />
                <Route path="/chronicles/portal" element={<PortalEntryPage />} />
                <Route path="/chronicles/dashboard" element={<DashboardPage />} />

                {/* World & Exploration */}
                <Route path="/chronicles/world" element={<WorldPage />} />
                <Route path="/chronicles/city" element={<CityPage />} />
                <Route path="/chronicles/travel" element={<TravelPage />} />
                <Route path="/chronicles/time-portal" element={<TimePortalPage />} />
                <Route path="/chronicles/estate" element={<EstatePage />} />
                <Route path="/chronicles/interior" element={<InteriorPage />} />

                {/* Life Simulation */}
                <Route path="/chronicles/daily-life" element={<DailyLifePage />} />
                <Route path="/chronicles/life" element={<LifePage />} />
                <Route path="/chronicles/faith" element={<FaithPage />} />
                <Route path="/chronicles/pets" element={<PetsPage />} />
                <Route path="/chronicles/marketplace" element={<MarketplacePage />} />

                {/* Social & AI */}
                <Route path="/chronicles/npc-chat" element={<NpcChatPage />} />
                <Route path="/chronicles/ai-demo" element={<AiDemoPage />} />
                <Route path="/chronicles/voice" element={<VoicePage />} />

                {/* Progression & Meta */}
                <Route path="/chronicles/seasons" element={<SeasonHubPage />} />
                <Route path="/chronicles/builder" element={<BuilderPage />} />
                <Route path="/scenario-generator" element={<ScenarioGenPage />} />
                <Route path="/era-codex" element={<EraCodexPage />} />
                <Route path="/build-your-legacy" element={<LegacyPage />} />

                {/* Info & Admin */}
                <Route path="/chronicles/demo" element={<DemoPage />} />
                <Route path="/chronicles/tutorial" element={<TutorialPage />} />
                <Route path="/chronicles/admin" element={<AdminPage />} />
                <Route path="/chronicles/executive-summary" element={<ExecSummaryPage />} />
                <Route path="/chronicles/locked" element={<LockedPage />} />
                <Route path="/roadmap-chronicles" element={<RoadmapPage />} />

                {/* Chrono Marketing */}
                <Route path="/chrono" element={<ChronoHomePage />} />
                <Route path="/chrono/creators" element={<ChronoCreatorsPage />} />
                <Route path="/chrono/team" element={<ChronoTeamPage />} />
                <Route path="/chrono/eras" element={<ChronoErasPage />} />
                <Route path="/chrono/community" element={<ChronoCommunityPage />} />
                <Route path="/chrono/roadmap" element={<ChronoRoadmapPage />} />
                <Route path="/chrono/dashboard" element={<ChronoDashboardPage />} />
                <Route path="/chrono/gameplay" element={<ChronoGameplayPage />} />
                <Route path="/chrono/economy" element={<ChronoEconomyPage />} />
                <Route path="/chronochat" element={<ChronoChatPage />} />
                <Route path="/chronochat/invite" element={<ChronoChatInvitePage />} />

                {/* Catch-all → Chronicles landing */}
                <Route path="/" element={<ChroniclesPage />} />
                <Route path="*" element={<LockedPage />} />
            </Routes>
            <DWSCFooterBadge />
        </Suspense>
        </>
    )
}
