/* ====== Chronicles 3D Engine — Types ====== */
import type { Era, LocationType } from '../../types/game'

export interface SceneConfig {
    id: LocationType
    name: string
    era: Era
    ground: { color: string; size: [number, number] }
    sky: { color: string; turbidity?: number; rayleigh?: number }
    fog: { color: string; near: number; far: number }
    ambient: { color: string; intensity: number }
    directional: { color: string; intensity: number; position: [number, number, number] }
    buildings: BuildingConfig[]
    props: PropConfig[]
    /** TrustGen-generated GLB assets to load in this scene */
    assets?: AssetRef[]
}

export interface BuildingConfig {
    type: 'box' | 'cylinder' | 'cone'
    position: [number, number, number]
    args: number[]
    color: string
    label?: string
}

export interface PropConfig {
    type: 'tree' | 'cactus' | 'rock' | 'lamp' | 'barrel' | 'torch'
    position: [number, number, number]
}

/** Reference to a TrustGen-generated GLB asset */
export interface AssetRef {
    /** TrustGen asset ID (e.g. 'env-med-tavern') */
    assetId: string
    /** World position [x, y, z] */
    position: [number, number, number]
    /** Scale [x, y, z], defaults to [1, 1, 1] */
    scale?: [number, number, number]
    /** Rotation in radians [x, y, z] */
    rotation?: [number, number, number]
}
