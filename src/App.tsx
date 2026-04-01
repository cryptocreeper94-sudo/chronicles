import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Entering Chronicles...</p>
      </div>
    </div>
  );
}

// Chronicles Pages
const ChronoHome = lazy(() => import("@/pages/chrono-home"));
const ChroniclesPlay = lazy(() => import("@/pages/chronicles-play"));
const ChroniclesCity = lazy(() => import("@/pages/chronicles-city"));
const ChroniclesInterior = lazy(() => import("@/pages/chronicles-interior"));
const ChroniclesNpcChat = lazy(() => import("@/pages/chronicles-npc-chat"));
const ChroniclesFaith = lazy(() => import("@/pages/chronicles-faith"));
const ChroniclesEstate = lazy(() => import("@/pages/chronicles-estate"));
const ChroniclesAdmin = lazy(() => import("@/pages/chronicles-admin"));
const ChroniclesDemo = lazy(() => import("@/pages/chronicles-demo"));
const EraCodex = lazy(() => import("@/pages/era-codex"));
const BuildYourLegacy = lazy(() => import("@/pages/build-your-legacy"));
const ScenarioGenerator = lazy(() => import("@/pages/scenario-generator"));
const ChronoEras = lazy(() => import("@/pages/chrono-eras"));
const ChronoEconomy = lazy(() => import("@/pages/chrono-economy"));
const ChronoDashboard = lazy(() => import("@/pages/chrono-dashboard"));
const RoadmapChronicles = lazy(() => import("@/pages/roadmap-chronicles"));
const ChroniclesBuilder = lazy(() => import("@/pages/chronicles-builder"));
const ChroniclesLumeStudio = lazy(() => import("@/pages/chronicles-lume-studio"));

const NotFound = () => (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400">
        <h1 className="text-4xl font-bold mb-4">404 - Era Not Found</h1>
        <p>The timeline you are seeking does not exist or has been fractured.</p>
    </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={ChronoHome} />
        <Route path="/play" component={ChroniclesPlay} />
        <Route path="/city" component={ChroniclesCity} />
        <Route path="/interior" component={ChroniclesInterior} />
        <Route path="/npc-chat" component={ChroniclesNpcChat} />
        <Route path="/faith" component={ChroniclesFaith} />
        <Route path="/estate" component={ChroniclesEstate} />
        <Route path="/admin" component={ChroniclesAdmin} />
        <Route path="/demo" component={ChroniclesDemo} />
        <Route path="/era-codex" component={EraCodex} />
        <Route path="/legacy" component={BuildYourLegacy} />
        <Route path="/scenario-generator" component={ScenarioGenerator} />
        <Route path="/eras" component={ChronoEras} />
        <Route path="/economy" component={ChronoEconomy} />
        <Route path="/dashboard" component={ChronoDashboard} />
        <Route path="/roadmap-chronicles" component={RoadmapChronicles} />
        <Route path="/builder" component={ChroniclesBuilder} />
        <Route path="/studio" component={ChroniclesLumeStudio} />
        
        {/* Support the old paths for compatibility during transition if needed */}
        <Route path="/chronicles-play" component={ChroniclesPlay} />
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
