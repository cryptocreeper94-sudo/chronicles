/* ====== Chronicles 3D Engine — Main Canvas ====== */
import { Canvas } from '@react-three/fiber'
import { Sky, Stars, OrbitControls, Text } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { getSceneForEra } from './scenes'
import { ModelLoader } from './ModelLoader'
import type { SceneConfig, BuildingConfig, PropConfig, AssetRef } from './types'
import type { Era, LocationType } from '../../types/game'

interface ChroniclesEngineProps {
    era: Era
    location?: LocationType
    level?: number
    xp?: number
    shells?: number
    className?: string
    height?: string
    showStats?: boolean
    children?: React.ReactNode
}

export function ChroniclesEngine({
    era, location, level = 1, xp = 0, shells = 0,
    className = '', height = '100%', showStats = true, children,
}: ChroniclesEngineProps) {
    const scene = useMemo(() => getSceneForEra(era, location), [era, location])

    return (
        <div className={`chronicles-engine ${className}`} style={{ position: 'relative', height, width: '100%' }}>
            <Canvas
                shadows
                camera={{ position: [15, 12, 15], fov: 50 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                style={{ background: scene.sky.color }}
            >
                <Suspense fallback={null}>
                    <SceneRenderer config={scene} />
                    <OrbitControls
                        enableDamping
                        dampingFactor={0.08}
                        minDistance={5}
                        maxDistance={60}
                        maxPolarAngle={Math.PI / 2.2}
                    />
                </Suspense>
            </Canvas>

            {showStats && (
                <div className="chronicles-3d-hud">
                    <div className="hud-stat"><span className="hud-label">LVL</span><span className="hud-value">{level}</span></div>
                    <div className="hud-stat"><span className="hud-label">XP</span><span className="hud-value">{xp}</span></div>
                    <div className="hud-stat"><span className="hud-label">🐚</span><span className="hud-value">{shells}</span></div>
                    <div className="hud-location">{scene.name}</div>
                </div>
            )}

            {children}
        </div>
    )
}

// ── Scene Renderer ──
function SceneRenderer({ config }: { config: SceneConfig }) {
    // Map era name to model path folder
    const eraFolder = config.era === 'wildwest' ? 'wild-west' : config.era

    return (
        <>
            {/* Lighting */}
            <ambientLight color={config.ambient.color} intensity={config.ambient.intensity} />
            <directionalLight
                color={config.directional.color}
                intensity={config.directional.intensity}
                position={config.directional.position}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <fog attach="fog" args={[config.fog.color, config.fog.near, config.fog.far]} />

            {/* Sky */}
            {config.era === 'modern' ? (
                <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
            ) : config.era === 'medieval' ? (
                <Sky sunPosition={[0, -1, 0]} turbidity={10} rayleigh={0.5} />
            ) : (
                <Sky sunPosition={[5, 2, 0]} turbidity={20} rayleigh={3} />
            )}

            {/* Ground */}
            <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={0}>
                <planeGeometry args={config.ground.size} />
                <meshStandardMaterial color={config.ground.color} />
            </mesh>

            {/* Buildings (primitive fallbacks) */}
            {config.buildings.map((b, i) => (
                <Building key={i} config={b} />
            ))}

            {/* Props (primitive fallbacks) */}
            {config.props.map((p, i) => (
                <Prop key={i} config={p} />
            ))}

            {/* TrustGen GLB Assets — loads generated models, falls back to wireframe */}
            {config.assets?.map((asset, i) => (
                <ModelLoader
                    key={`asset-${i}`}
                    assetId={asset.assetId}
                    era={eraFolder}
                    position={asset.position}
                    scale={asset.scale}
                />
            ))}
        </>
    )
}

// ── Building Component ──
function Building({ config }: { config: BuildingConfig }) {
    const geom = useMemo(() => {
        switch (config.type) {
            case 'cylinder': return <cylinderGeometry args={config.args as any} />
            case 'cone': return <coneGeometry args={config.args as any} />
            default: return <boxGeometry args={config.args as any} />
        }
    }, [config.type, config.args])

    return (
        <group position={config.position}>
            <mesh castShadow receiveShadow>
                {geom}
                <meshStandardMaterial color={config.color} roughness={0.8} />
            </mesh>
            {config.label && (
                <Text
                    position={[0, (config.args[1] || 2) / 2 + 1.5, 0]}
                    fontSize={0.5}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="bottom"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    {config.label}
                </Text>
            )}
        </group>
    )
}

// ── Prop Component ──
function Prop({ config }: { config: PropConfig }) {
    const [x, y, z] = config.position

    switch (config.type) {
        case 'tree':
            return (
                <group position={[x, y, z]}>
                    <mesh position={[0, 1.5, 0]} castShadow>
                        <cylinderGeometry args={[0.15, 0.2, 3, 6]} />
                        <meshStandardMaterial color="#5B3A1A" />
                    </mesh>
                    <mesh position={[0, 3.5, 0]} castShadow>
                        <coneGeometry args={[1.5, 3, 6]} />
                        <meshStandardMaterial color="#1a5c2a" />
                    </mesh>
                </group>
            )
        case 'cactus':
            return (
                <group position={[x, y, z]}>
                    <mesh position={[0, 1.2, 0]} castShadow>
                        <cylinderGeometry args={[0.2, 0.25, 2.4, 6]} />
                        <meshStandardMaterial color="#2d5a27" />
                    </mesh>
                    <mesh position={[0.4, 1.5, 0]} castShadow rotation-z={Math.PI / 4}>
                        <cylinderGeometry args={[0.12, 0.12, 0.8, 5]} />
                        <meshStandardMaterial color="#2d5a27" />
                    </mesh>
                </group>
            )
        case 'rock':
            return (
                <mesh position={[x, y + 0.3, z]} castShadow>
                    <dodecahedronGeometry args={[0.6, 0]} />
                    <meshStandardMaterial color="#6b7280" roughness={1} />
                </mesh>
            )
        case 'lamp':
            return (
                <group position={[x, y, z]}>
                    <mesh position={[0, 1.5, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
                        <meshStandardMaterial color="#374151" />
                    </mesh>
                    <pointLight position={[0, 3.2, 0]} color="#ffcc88" intensity={0.5} distance={8} />
                </group>
            )
        case 'barrel':
            return (
                <mesh position={[x, y + 0.4, z]} castShadow>
                    <cylinderGeometry args={[0.35, 0.35, 0.8, 8]} />
                    <meshStandardMaterial color="#6B4226" roughness={0.9} />
                </mesh>
            )
        case 'torch':
            return (
                <group position={[x, y, z]}>
                    <mesh position={[0, 0.8, 0]}>
                        <cylinderGeometry args={[0.04, 0.06, 1.6, 5]} />
                        <meshStandardMaterial color="#4a3a2a" />
                    </mesh>
                    <pointLight position={[0, 1.8, 0]} color="#ff6622" intensity={0.8} distance={6} />
                </group>
            )
        default:
            return null
    }
}

export default ChroniclesEngine
