/* ====== Chronicles 3D Engine — 19 Location Scene Configs ====== */
import type { SceneConfig, AssetRef } from './types'

// ── MODERN ERA (8 locations) ──
const modernHome: SceneConfig = {
    id: 'home', name: 'Apartment', era: 'modern',
    ground: { color: '#1a1a2e', size: [40, 40] },
    sky: { color: '#0a0a1a' },
    fog: { color: '#0a0a1a', near: 15, far: 60 },
    ambient: { color: '#4488cc', intensity: 0.4 },
    directional: { color: '#ffffff', intensity: 0.8, position: [5, 10, 5] },
    buildings: [
        { type: 'box', position: [0, 3, 0], args: [6, 6, 6], color: '#1e293b', label: 'Your Apartment' },
        { type: 'box', position: [12, 5, -5], args: [4, 10, 4], color: '#334155' },
        { type: 'box', position: [-10, 4, 5], args: [5, 8, 5], color: '#2d3748' },
    ],
    props: [
        { type: 'lamp', position: [4, 0, 4] },
        { type: 'lamp', position: [-4, 0, -4] },
        { type: 'tree', position: [8, 0, 8] },
    ],
    assets: [
        { assetId: 'env-mod-apartment', position: [0, 0, 0] },
        { assetId: 'env-mod-streetlight', position: [4, 0, 4] },
        { assetId: 'env-mod-streetlight', position: [-4, 0, -4] },
        { assetId: 'env-mod-oak', position: [8, 0, 8] },
        { assetId: 'env-mod-sedan', position: [-6, 0, 3] },
        { assetId: 'env-mod-mailbox', position: [3, 0, 5] },
    ],
}

const modernOffice: SceneConfig = {
    id: 'office', name: 'Office Tower', era: 'modern',
    ground: { color: '#1a1a2e', size: [50, 50] },
    sky: { color: '#0d1117' },
    fog: { color: '#0d1117', near: 20, far: 80 },
    ambient: { color: '#66aaff', intensity: 0.5 },
    directional: { color: '#ffffff', intensity: 1, position: [8, 15, 5] },
    buildings: [
        { type: 'box', position: [0, 8, 0], args: [8, 16, 8], color: '#0ea5e9', label: 'Tech Corp' },
        { type: 'box', position: [15, 6, 10], args: [6, 12, 6], color: '#1e40af' },
        { type: 'box', position: [-12, 5, -8], args: [5, 10, 5], color: '#334155' },
        { type: 'box', position: [10, 4, -12], args: [7, 8, 4], color: '#475569' },
    ],
    props: [
        { type: 'lamp', position: [6, 0, 6] },
        { type: 'tree', position: [-6, 0, 6] },
    ],
    assets: [
        { assetId: 'env-mod-office-tower', position: [0, 0, 0] },
        { assetId: 'env-mod-streetlight', position: [6, 0, 6] },
        { assetId: 'env-mod-oak', position: [-6, 0, 6] },
        { assetId: 'env-mod-bench', position: [5, 0, 3] },
        { assetId: 'env-mod-busstop', position: [-8, 0, 0] },
    ],
}

const modernGym: SceneConfig = {
    id: 'gym', name: 'Fitness Center', era: 'modern',
    ground: { color: '#1a1a2e', size: [30, 30] },
    sky: { color: '#0a0a1a' },
    fog: { color: '#0a0a1a', near: 10, far: 40 },
    ambient: { color: '#ff6644', intensity: 0.3 },
    directional: { color: '#ffaa88', intensity: 0.7, position: [3, 8, 3] },
    buildings: [
        { type: 'box', position: [0, 2.5, 0], args: [12, 5, 8], color: '#374151', label: 'Gym' },
    ],
    props: [{ type: 'lamp', position: [8, 0, 0] }],
    assets: [
        { assetId: 'env-mod-gym', position: [0, 0, 0] },
        { assetId: 'env-mod-gymequip', position: [0, 0, 5] },
        { assetId: 'env-mod-streetlight', position: [8, 0, 0] },
        { assetId: 'env-mod-bench', position: [-5, 0, 3] },
    ],
}

const modernCafe: SceneConfig = {
    id: 'cafe', name: 'Coffee Shop', era: 'modern',
    ground: { color: '#1a1a2e', size: [25, 25] },
    sky: { color: '#1a1025' },
    fog: { color: '#1a1025', near: 8, far: 35 },
    ambient: { color: '#ffcc88', intensity: 0.5 },
    directional: { color: '#ffddaa', intensity: 0.6, position: [4, 6, 4] },
    buildings: [
        { type: 'box', position: [0, 1.5, 0], args: [8, 3, 6], color: '#78350f', label: 'Café' },
    ],
    props: [
        { type: 'tree', position: [6, 0, 3] },
        { type: 'lamp', position: [-5, 0, 3] },
    ],
    assets: [
        { assetId: 'env-mod-cafe', position: [0, 0, 0] },
        { assetId: 'env-mod-cafetable', position: [4, 0, 3] },
        { assetId: 'env-mod-cafetable', position: [4, 0, -3] },
        { assetId: 'env-mod-cherry', position: [6, 0, 3] },
        { assetId: 'env-mod-streetlight', position: [-5, 0, 3] },
    ],
}

const modernPark: SceneConfig = {
    id: 'park', name: 'City Park', era: 'modern',
    ground: { color: '#065f46', size: [60, 60] },
    sky: { color: '#0f172a' },
    fog: { color: '#0f172a', near: 20, far: 80 },
    ambient: { color: '#88cc88', intensity: 0.6 },
    directional: { color: '#ffffff', intensity: 0.9, position: [5, 12, 5] },
    buildings: [],
    props: [
        { type: 'tree', position: [5, 0, 5] }, { type: 'tree', position: [-8, 0, 3] },
        { type: 'tree', position: [3, 0, -7] }, { type: 'tree', position: [-5, 0, -5] },
        { type: 'tree', position: [10, 0, -3] }, { type: 'tree', position: [-3, 0, 10] },
        { type: 'lamp', position: [0, 0, 0] }, { type: 'rock', position: [7, 0, -5] },
    ],
    assets: [
        { assetId: 'env-mod-gazebo', position: [0, 0, 0] },
        { assetId: 'env-mod-oak', position: [5, 0, 5] },
        { assetId: 'env-mod-oak', position: [-8, 0, 3] },
        { assetId: 'env-mod-cherry', position: [3, 0, -7] },
        { assetId: 'env-mod-cherry', position: [-5, 0, -5] },
        { assetId: 'env-mod-bench', position: [2, 0, 3] },
        { assetId: 'env-mod-bench', position: [-3, 0, -2] },
        { assetId: 'env-mod-planter', position: [7, 0, 0] },
        { assetId: 'env-mod-streetlight', position: [0, 0, 8] },
    ],
}

const modernLibrary: SceneConfig = {
    id: 'library', name: 'Public Library', era: 'modern',
    ground: { color: '#1a1a2e', size: [30, 30] },
    sky: { color: '#0d1117' },
    fog: { color: '#0d1117', near: 12, far: 45 },
    ambient: { color: '#aabbdd', intensity: 0.4 },
    directional: { color: '#ffffff', intensity: 0.7, position: [5, 10, 3] },
    buildings: [
        { type: 'box', position: [0, 3, 0], args: [10, 6, 8], color: '#1e293b', label: 'Library' },
        { type: 'box', position: [0, 6.5, 0], args: [6, 1, 5], color: '#334155' },
    ],
    props: [{ type: 'lamp', position: [7, 0, 5] }, { type: 'tree', position: [-7, 0, 5] }],
    assets: [
        { assetId: 'env-mod-library', position: [0, 0, 0] },
        { assetId: 'env-mod-bookshelf', position: [0, 0, 4] },
        { assetId: 'env-mod-bench', position: [5, 0, 5] },
        { assetId: 'env-mod-streetlight', position: [7, 0, 5] },
        { assetId: 'env-mod-oak', position: [-7, 0, 5] },
    ],
}

const modernMall: SceneConfig = {
    id: 'mall', name: 'Shopping Mall', era: 'modern',
    ground: { color: '#1a1a2e', size: [50, 50] },
    sky: { color: '#0a0a1a' },
    fog: { color: '#0a0a1a', near: 15, far: 60 },
    ambient: { color: '#cc88ff', intensity: 0.4 },
    directional: { color: '#ffffff', intensity: 0.8, position: [8, 12, 5] },
    buildings: [
        { type: 'box', position: [0, 4, 0], args: [16, 8, 12], color: '#6366f1', label: 'Mall' },
        { type: 'box', position: [12, 2, 8], args: [4, 4, 4], color: '#475569' },
    ],
    props: [{ type: 'lamp', position: [10, 0, 0] }],
    assets: [
        { assetId: 'env-mod-mall', position: [0, 0, 0] },
        { assetId: 'env-mod-streetlight', position: [10, 0, 0] },
        { assetId: 'env-mod-sedan', position: [8, 0, 8] },
        { assetId: 'env-mod-bus', position: [-10, 0, 5] },
        { assetId: 'env-mod-trashcan', position: [6, 0, 6] },
        { assetId: 'env-mod-hydrant', position: [-6, 0, 6] },
    ],
}

const modernRestaurant: SceneConfig = {
    id: 'restaurant', name: 'Fine Dining', era: 'modern',
    ground: { color: '#1a1a2e', size: [25, 25] },
    sky: { color: '#1a0a1a' },
    fog: { color: '#1a0a1a', near: 8, far: 30 },
    ambient: { color: '#ff8866', intensity: 0.4 },
    directional: { color: '#ffccaa', intensity: 0.5, position: [3, 6, 3] },
    buildings: [
        { type: 'box', position: [0, 2, 0], args: [10, 4, 7], color: '#7f1d1d', label: 'Restaurant' },
    ],
    props: [{ type: 'lamp', position: [6, 0, 4] }, { type: 'lamp', position: [-6, 0, 4] }],
    assets: [
        { assetId: 'env-mod-restaurant', position: [0, 0, 0] },
        { assetId: 'env-mod-cafetable', position: [5, 0, 3] },
        { assetId: 'env-mod-streetlight', position: [6, 0, 4] },
        { assetId: 'env-mod-streetlight', position: [-6, 0, 4] },
        { assetId: 'env-mod-planter', position: [3, 0, 4] },
    ],
}

// ── MEDIEVAL ERA (6 locations) ──
const medievalTownSquare: SceneConfig = {
    id: 'town_square', name: 'Town Square', era: 'medieval',
    ground: { color: '#5c4a32', size: [50, 50] },
    sky: { color: '#1a1510' },
    fog: { color: '#1a1510', near: 15, far: 60 },
    ambient: { color: '#aa8855', intensity: 0.3 },
    directional: { color: '#ffcc88', intensity: 0.7, position: [5, 10, 5] },
    buildings: [
        { type: 'box', position: [8, 3, 8], args: [5, 6, 5], color: '#8B7355', label: 'Tavern' },
        { type: 'box', position: [-8, 2.5, 6], args: [6, 5, 4], color: '#6B5B3E' },
        { type: 'box', position: [0, 1, 0], args: [3, 2, 3], color: '#9CA3AF', label: 'Well' },
        { type: 'box', position: [-6, 3, -8], args: [5, 6, 5], color: '#7B6B4E' },
    ],
    props: [
        { type: 'torch', position: [4, 0, 4] }, { type: 'torch', position: [-4, 0, 4] },
        { type: 'barrel', position: [6, 0, -3] },
    ],
    assets: [
        { assetId: 'env-med-well', position: [0, 0, 0] },
        { assetId: 'env-med-tavern', position: [8, 0, 8], scale: [0.8, 0.8, 0.8] },
        { assetId: 'env-med-barrel', position: [6, 0, -3] },
        { assetId: 'env-med-torch', position: [4, 0, 4] },
        { assetId: 'env-med-torch', position: [-4, 0, 4] },
        { assetId: 'env-med-oak', position: [-12, 0, -10] },
        { assetId: 'env-med-haycart', position: [5, 0, -8] },
    ],
}

const medievalCastle: SceneConfig = {
    id: 'castle', name: 'Castle Keep', era: 'medieval',
    ground: { color: '#4a3f30', size: [60, 60] },
    sky: { color: '#101020' },
    fog: { color: '#101020', near: 20, far: 80 },
    ambient: { color: '#8888aa', intensity: 0.25 },
    directional: { color: '#ccccff', intensity: 0.6, position: [10, 15, 5] },
    buildings: [
        { type: 'box', position: [0, 6, 0], args: [12, 12, 12], color: '#4a4a5a', label: 'Keep' },
        { type: 'cylinder', position: [8, 5, 8], args: [2, 2, 10, 8], color: '#5a5a6a' },
        { type: 'cylinder', position: [-8, 5, 8], args: [2, 2, 10, 8], color: '#5a5a6a' },
        { type: 'cylinder', position: [8, 5, -8], args: [2, 2, 10, 8], color: '#5a5a6a' },
        { type: 'cylinder', position: [-8, 5, -8], args: [2, 2, 10, 8], color: '#5a5a6a' },
        { type: 'box', position: [0, 2, 12], args: [6, 4, 1], color: '#3a3a4a', label: 'Gate' },
    ],
    props: [
        { type: 'torch', position: [3, 0, 12] }, { type: 'torch', position: [-3, 0, 12] },
    ],
    assets: [
        { assetId: 'env-med-keep', position: [0, 0, 0] },
        { assetId: 'env-med-guardtower', position: [8, 0, 8] },
        { assetId: 'env-med-guardtower', position: [-8, 0, 8] },
        { assetId: 'env-med-guardtower', position: [8, 0, -8] },
        { assetId: 'env-med-guardtower', position: [-8, 0, -8] },
        { assetId: 'env-med-wall', position: [0, 0, 12] },
        { assetId: 'env-med-banner', position: [3, 3, 12] },
        { assetId: 'env-med-banner', position: [-3, 3, 12] },
    ],
}

const medievalTavern: SceneConfig = {
    id: 'tavern', name: 'The Golden Flagon', era: 'medieval',
    ground: { color: '#5c4a32', size: [30, 30] },
    sky: { color: '#1a1510' },
    fog: { color: '#1a1510', near: 8, far: 35 },
    ambient: { color: '#cc8844', intensity: 0.4 },
    directional: { color: '#ffaa66', intensity: 0.5, position: [3, 6, 3] },
    buildings: [
        { type: 'box', position: [0, 2, 0], args: [8, 4, 6], color: '#6B4226', label: 'Tavern' },
        { type: 'cone', position: [0, 5, 0], args: [5, 3, 4], color: '#4a3520' },
    ],
    props: [
        { type: 'torch', position: [5, 0, 0] }, { type: 'barrel', position: [-5, 0, 2] },
        { type: 'barrel', position: [-5, 0, -1] },
    ],
    assets: [
        { assetId: 'env-med-tavern', position: [0, 0, 0] },
        { assetId: 'env-med-taverntable', position: [0, 0, 5] },
        { assetId: 'env-med-barrel', position: [-5, 0, 2] },
        { assetId: 'env-med-barrel', position: [-5, 0, -1] },
        { assetId: 'env-med-torch', position: [5, 0, 0] },
    ],
}

const medievalMarket: SceneConfig = {
    id: 'market_square', name: 'Market Square', era: 'medieval',
    ground: { color: '#5c4a32', size: [40, 40] },
    sky: { color: '#1a1510' },
    fog: { color: '#1a1510', near: 12, far: 50 },
    ambient: { color: '#bb9955', intensity: 0.35 },
    directional: { color: '#ffcc88', intensity: 0.7, position: [5, 8, 5] },
    buildings: [
        { type: 'box', position: [5, 1.5, 5], args: [4, 3, 3], color: '#8B7355', label: 'Stall' },
        { type: 'box', position: [-5, 1.5, 5], args: [4, 3, 3], color: '#7B6B4E', label: 'Butcher' },
        { type: 'box', position: [5, 1.5, -5], args: [4, 3, 3], color: '#6B5B3E', label: 'Baker' },
        { type: 'box', position: [-5, 1.5, -5], args: [4, 3, 3], color: '#8B7F6E', label: 'Herbs' },
    ],
    props: [{ type: 'barrel', position: [0, 0, 0] }, { type: 'torch', position: [8, 0, 0] }],
    assets: [
        { assetId: 'env-med-market', position: [5, 0, 5] },
        { assetId: 'env-med-market', position: [-5, 0, 5] },
        { assetId: 'env-med-market', position: [5, 0, -5] },
        { assetId: 'env-med-market', position: [-5, 0, -5] },
        { assetId: 'env-med-barrel', position: [0, 0, 0] },
        { assetId: 'env-med-crate', position: [3, 0, 0] },
        { assetId: 'env-med-wagon', position: [-8, 0, 0] },
    ],
}

const medievalChapel: SceneConfig = {
    id: 'chapel', name: 'Chapel of the Light', era: 'medieval',
    ground: { color: '#4a4a3a', size: [30, 30] },
    sky: { color: '#101020' },
    fog: { color: '#101020', near: 10, far: 40 },
    ambient: { color: '#ccccdd', intensity: 0.35 },
    directional: { color: '#ffffee', intensity: 0.8, position: [3, 12, 3] },
    buildings: [
        { type: 'box', position: [0, 3, 0], args: [6, 6, 10], color: '#d4c5a0', label: 'Chapel' },
        { type: 'cone', position: [0, 8, -3], args: [2, 5, 4], color: '#9CA3AF' },
    ],
    props: [{ type: 'torch', position: [4, 0, 5] }, { type: 'torch', position: [-4, 0, 5] }],
    assets: [
        { assetId: 'env-med-chapel', position: [0, 0, 0] },
        { assetId: 'env-med-stones', position: [-8, 0, -6] },
        { assetId: 'env-med-torch', position: [4, 0, 5] },
        { assetId: 'env-med-torch', position: [-4, 0, 5] },
        { assetId: 'env-med-pine', position: [8, 0, 5] },
    ],
}

const medievalBlacksmith: SceneConfig = {
    id: 'blacksmith', name: 'The Forge', era: 'medieval',
    ground: { color: '#3a3a2a', size: [25, 25] },
    sky: { color: '#1a1510' },
    fog: { color: '#1a1510', near: 8, far: 30 },
    ambient: { color: '#ff6622', intensity: 0.4 },
    directional: { color: '#ff8844', intensity: 0.6, position: [3, 6, 3] },
    buildings: [
        { type: 'box', position: [0, 2, 0], args: [7, 4, 5], color: '#4a3a2a', label: 'Forge' },
    ],
    props: [
        { type: 'barrel', position: [5, 0, 2] },
        { type: 'rock', position: [-4, 0, 3] },
    ],
    assets: [
        { assetId: 'env-med-forge', position: [0, 0, 0] },
        { assetId: 'env-med-anvil', position: [3, 0, 0] },
        { assetId: 'env-med-barrel', position: [5, 0, 2] },
        { assetId: 'env-med-weaponrack', position: [-3, 0, -2] },
        { assetId: 'env-med-crate', position: [4, 0, -2] },
    ],
}

// ── WILD WEST ERA (5 locations) ──
const wildwestSaloon: SceneConfig = {
    id: 'saloon', name: 'Dusty Trail Saloon', era: 'wildwest',
    ground: { color: '#C4A574', size: [40, 40] },
    sky: { color: '#2a1a0a' },
    fog: { color: '#2a1a0a', near: 12, far: 50 },
    ambient: { color: '#ddaa66', intensity: 0.4 },
    directional: { color: '#ffcc88', intensity: 0.8, position: [8, 10, 5] },
    buildings: [
        { type: 'box', position: [0, 2.5, 0], args: [10, 5, 7], color: '#8B6914', label: 'Saloon' },
        { type: 'box', position: [0, 5.5, -2], args: [8, 1, 3], color: '#6B4914' },
    ],
    props: [
        { type: 'cactus', position: [8, 0, 8] }, { type: 'barrel', position: [-6, 0, 0] },
        { type: 'cactus', position: [-10, 0, -5] },
    ],
    assets: [
        { assetId: 'env-ww-saloon', position: [0, 0, 0] },
        { assetId: 'env-ww-pokertable', position: [0, 0, 6] },
        { assetId: 'env-ww-whiskey', position: [-6, 0, 0] },
        { assetId: 'env-ww-hitchpost', position: [6, 0, 5] },
        { assetId: 'env-ww-saguaro', position: [8, 0, 8] },
        { assetId: 'env-ww-saguaro', position: [-10, 0, -5] },
        { assetId: 'env-ww-wanted', position: [-4, 0, 3.5] },
    ],
}

const wildwestSheriff: SceneConfig = {
    id: 'sheriff', name: 'Sheriff\'s Office', era: 'wildwest',
    ground: { color: '#C4A574', size: [35, 35] },
    sky: { color: '#2a1a0a' },
    fog: { color: '#2a1a0a', near: 10, far: 45 },
    ambient: { color: '#cc9955', intensity: 0.35 },
    directional: { color: '#ffbb77', intensity: 0.7, position: [5, 8, 5] },
    buildings: [
        { type: 'box', position: [0, 2, 0], args: [8, 4, 6], color: '#7B5B2E', label: 'Sheriff' },
        { type: 'box', position: [0, 4.5, 0], args: [6, 1, 4], color: '#5B4B1E' },
    ],
    props: [{ type: 'cactus', position: [6, 0, 5] }, { type: 'barrel', position: [-5, 0, 3] }],
    assets: [
        { assetId: 'env-ww-sheriff', position: [0, 0, 0] },
        { assetId: 'env-ww-hitchpost', position: [5, 0, 4] },
        { assetId: 'env-ww-wanted', position: [-5, 0, 0] },
        { assetId: 'env-ww-saguaro', position: [6, 0, 5] },
        { assetId: 'env-ww-barrel-cactus', position: [-8, 0, -3] },
    ],
}

const wildwestGeneralStore: SceneConfig = {
    id: 'general_store', name: 'General Store', era: 'wildwest',
    ground: { color: '#C4A574', size: [30, 30] },
    sky: { color: '#2a1a0a' },
    fog: { color: '#2a1a0a', near: 8, far: 35 },
    ambient: { color: '#bb9944', intensity: 0.4 },
    directional: { color: '#ffcc88', intensity: 0.6, position: [4, 7, 4] },
    buildings: [
        { type: 'box', position: [0, 2, 0], args: [9, 4, 6], color: '#8B7355', label: 'General Store' },
    ],
    props: [
        { type: 'barrel', position: [6, 0, 0] }, { type: 'barrel', position: [6, 0, -2] },
        { type: 'cactus', position: [-7, 0, 5] },
    ],
    assets: [
        { assetId: 'env-ww-generalstore', position: [0, 0, 0] },
        { assetId: 'env-ww-whiskey', position: [6, 0, 0] },
        { assetId: 'env-ww-whiskey', position: [6, 0, -2] },
        { assetId: 'env-ww-saguaro', position: [-7, 0, 5] },
        { assetId: 'env-ww-wagon', position: [-5, 0, -5] },
    ],
}

const wildwestRanch: SceneConfig = {
    id: 'ranch', name: 'Cattle Ranch', era: 'wildwest',
    ground: { color: '#8B7355', size: [60, 60] },
    sky: { color: '#2a1a0a' },
    fog: { color: '#2a1a0a', near: 20, far: 80 },
    ambient: { color: '#ddbb77', intensity: 0.5 },
    directional: { color: '#ffffff', intensity: 0.9, position: [10, 12, 5] },
    buildings: [
        { type: 'box', position: [0, 2, 0], args: [12, 4, 8], color: '#6B4226', label: 'Barn' },
        { type: 'box', position: [10, 1.5, 8], args: [5, 3, 5], color: '#7B5B2E', label: 'Bunkhouse' },
    ],
    props: [
        { type: 'cactus', position: [-12, 0, 10] }, { type: 'rock', position: [15, 0, -8] },
    ],
    assets: [
        { assetId: 'env-ww-barn', position: [0, 0, 0] },
        { assetId: 'env-ww-cabin', position: [10, 0, 8] },
        { assetId: 'env-ww-fence', position: [5, 0, 12] },
        { assetId: 'env-ww-fence', position: [-5, 0, 12] },
        { assetId: 'env-ww-trough', position: [6, 0, 3] },
        { assetId: 'env-ww-windmill', position: [-10, 0, -8] },
        { assetId: 'env-ww-horse', position: [8, 0, 5] },
        { assetId: 'env-ww-saguaro', position: [-12, 0, 10] },
        { assetId: 'env-ww-rocks', position: [15, 0, -8] },
    ],
}

const wildwestGoldMine: SceneConfig = {
    id: 'gold_mine', name: 'Gold Mine', era: 'wildwest',
    ground: { color: '#6B5B3E', size: [40, 40] },
    sky: { color: '#1a1510' },
    fog: { color: '#1a1510', near: 8, far: 35 },
    ambient: { color: '#aa8822', intensity: 0.3 },
    directional: { color: '#ffaa44', intensity: 0.5, position: [5, 8, 3] },
    buildings: [
        { type: 'box', position: [0, 1.5, 0], args: [6, 3, 5], color: '#4a3a2a', label: 'Mine Entrance' },
        { type: 'box', position: [8, 1, 5], args: [4, 2, 3], color: '#5B4B2E', label: 'Assay Office' },
    ],
    props: [
        { type: 'rock', position: [-5, 0, 3] }, { type: 'rock', position: [-3, 0, -5] },
        { type: 'barrel', position: [5, 0, -3] },
    ],
    assets: [
        { assetId: 'env-ww-mining', position: [0, 0, 0] },
        { assetId: 'env-ww-minecart', position: [4, 0, 0] },
        { assetId: 'env-ww-dynamite', position: [5, 0, -3] },
        { assetId: 'env-ww-campfire', position: [-6, 0, 5] },
        { assetId: 'env-ww-rocks', position: [-5, 0, 3] },
        { assetId: 'env-ww-rocks', position: [-3, 0, -5] },
    ],
}

// ── Master index ──
export const SCENE_CONFIGS: Record<string, SceneConfig> = {
    home: modernHome, office: modernOffice, gym: modernGym, cafe: modernCafe,
    park: modernPark, library: modernLibrary, mall: modernMall, restaurant: modernRestaurant,
    town_square: medievalTownSquare, castle: medievalCastle, tavern: medievalTavern,
    market_square: medievalMarket, chapel: medievalChapel, blacksmith: medievalBlacksmith,
    saloon: wildwestSaloon, sheriff: wildwestSheriff, general_store: wildwestGeneralStore,
    ranch: wildwestRanch, gold_mine: wildwestGoldMine,
}

export function getSceneForEra(era: string, location?: string): SceneConfig {
    if (location && SCENE_CONFIGS[location]) return SCENE_CONFIGS[location]
    const defaults: Record<string, string> = { modern: 'home', medieval: 'town_square', wildwest: 'saloon' }
    return SCENE_CONFIGS[defaults[era] || 'home']
}
