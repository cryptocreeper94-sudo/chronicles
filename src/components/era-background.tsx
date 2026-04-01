import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { solarEngine, SolarState } from "@/lib/world/solar-engine";

export function EraBackground({ era, children }: { era: string; children: React.ReactNode }) {
  const [solarState, setSolarState] = useState<SolarState>(() => solarEngine.getSolarState(new Date(), era));

  useEffect(() => {
    setSolarState(solarEngine.getSolarState(new Date(), era));
    const handleLocationUpdate = () => setSolarState(solarEngine.getSolarState(new Date(), era));
    window.addEventListener("chronicles_solar_update", handleLocationUpdate);
    
    const interval = setInterval(() => {
      setSolarState(solarEngine.getSolarState(new Date(), era));
    }, 60000);
    
    return () => {
      window.removeEventListener("chronicles_solar_update", handleLocationUpdate);
      clearInterval(interval);
    };
  }, [era]);

  // Determine the core sky gradient based on solar state
  const skyGradient = solarState.isDaytime
    ? solarState.isGoldenHour 
      ? "from-orange-900/40 via-[#2d1b10]/40 to-[#0a0f18]/90" // Golden hour
      : "from-blue-900/30 via-slate-900/50 to-slate-950/90" // Daytime
    : "from-[#0a0b10] via-[#050608] to-black"; // Deep night

  return (
    <div className={`relative min-h-screen w-full bg-gradient-to-b ${skyGradient} overflow-hidden transition-colors duration-1000`}>
      {/* Base Void Color (Ultra-Premium aesthetic) */}
      <div className="absolute inset-0 bg-slate-950/40 pointer-events-none z-0" />

      {/* Sun/Moon Glow based on solar elevation */}
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none blur-[120px] opacity-20 z-0"
        animate={{
          x: `${(solarState.azimuth / 360) * 100}vw`,
          y: `${100 - (solarState.elevation + 90) / 1.8}vh`,
          backgroundColor: solarState.isDaytime ? (solarState.isGoldenHour ? "#ff7b00" : "#cbd5e1") : "#3b82f6"
        }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* --- Era Specific Particle FX --- */}

      {/* MODERN ERA: Cybernetic Data Streams & Grid */}
      {era === "modern" && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `linear-gradient(to right, #0891b211 1px, transparent 1px), linear-gradient(to bottom, #0891b211 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          }} />
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`modern-${i}`}
              className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
              style={{ left: `${Math.random() * 100}%`, top: '-10%', height: `${Math.random() * 40 + 20}%` }}
              animate={{ y: ['-10%', '120%'], opacity: [0, Math.random() * 0.5 + 0.2, 0] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
            />
          ))}
        </div>
      )}

      {/* MEDIEVAL ERA: Forge Embers & Mist */}
      {era === "medieval" && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute inset-0 bg-blue-900/10 blur-3xl opacity-30"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={`medieval-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: '-5%',
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                backgroundColor: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
                boxShadow: '0 0 10px #f59e0b',
              }}
              animate={{
                y: [0, -window.innerHeight * 0.8],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [0, Math.random() * 0.8 + 0.2, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      )}

      {/* WILD WEST ERA: Rolling Dust & Heat Haze */}
      {era === "wildwest" && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-[#3d2b10]/20 to-transparent opacity-40 mix-blend-color-dodge" />
          {Array.from({ length: 40 }).map((_, i) => {
            const size = Math.random() * 8 + 4;
            return (
              <motion.div
                key={`wildwest-${i}`}
                className="absolute bg-[#d4a373] rounded-full blur-[2px] opacity-20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: '-5%',
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                animate={{
                  x: ['0vw', '105vw'],
                  y: [0, (Math.random() - 0.5) * 50],
                  opacity: [0, Math.random() * 0.3 + 0.1, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 10
                }}
              />
            );
          })}
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
