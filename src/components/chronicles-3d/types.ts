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
