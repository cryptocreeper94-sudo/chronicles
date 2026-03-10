/* ====== Chronicles — GLB Model Loader ====== */
/* Loads generated 3D props from TrustGen's pipeline with primitive fallback */
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

interface ModelLoaderProps {
    /** TrustGen asset ID (e.g. 'env-med-tavern') */
    assetId: string
    /** Era for path resolution */
    era: string
    /** Fallback position */
    position?: [number, number, number]
    /** Fallback scale */
    scale?: [number, number, number]
    /** Fallback color for primitive placeholder */
    fallbackColor?: string
    /** Fallback primitive args [width, height, depth] */
    fallbackArgs?: [number, number, number]
}

/** Resolve asset ID to model URL */
function resolveModelUrl(assetId: string, era: string): string {
    return `/models/${era}/${assetId}.glb`
}

/** Inner component that loads the GLB */
function GLBModel({ url }: { url: string }) {
    const { scene } = useGLTF(url)
    const cloned = useMemo(() => scene.clone(true), [scene])
    return <primitive object={cloned} />
}

/** Primitive fallback box */
function FallbackPrimitive({
    color = '#888888',
    args = [1, 1, 1] as [number, number, number],
}: {
    color?: string
    args?: [number, number, number]
}) {
    return (
        <mesh castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial color={color} wireframe opacity={0.4} transparent />
        </mesh>
    )
}

/** Error boundary wrapper - falls back to primitive on GLB load failure */
function ModelWithFallback({
    url,
    fallbackColor,
    fallbackArgs,
}: {
    url: string
    fallbackColor?: string
    fallbackArgs?: [number, number, number]
}) {
    try {
        // Preload check — if the GLB doesn't exist, drei will throw
        useGLTF.preload(url)
    } catch {
        return <FallbackPrimitive color={fallbackColor} args={fallbackArgs} />
    }

    return (
        <Suspense fallback={<FallbackPrimitive color={fallbackColor} args={fallbackArgs} />}>
            <GLBModel url={url} />
        </Suspense>
    )
}

/**
 * ModelLoader — Drop-in component for Chronicles 3D scenes.
 * Attempts to load a generated GLB from TrustGen's pipeline.
 * Falls back to a wireframe box if the model isn't available.
 */
export function ModelLoader({
    assetId,
    era,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    fallbackColor,
    fallbackArgs,
}: ModelLoaderProps) {
    const url = resolveModelUrl(assetId, era)

    return (
        <group position={position} scale={scale}>
            <ModelWithFallback
                url={url}
                fallbackColor={fallbackColor}
                fallbackArgs={fallbackArgs}
            />
        </group>
    )
}
