/* ====== Chronicles — Type Definitions ====== */

// ── Core Types ──
export type Era = 'modern' | 'medieval' | 'wildwest'

export interface GameState {
    character: Character
    currentEra: Era
    level: number
    experience: number
    wisdom: number
    courage: number
    compassion: number
    cunning: number
    influence: number
    completedSituations: string[]
    inventory: InventoryItem[]
    faithLevel: number
    spiritualPath: string | null
    sacredTextsRead: Record<string, boolean>
    prayerStreak: number
    servicesAttended: number
    currentZone: string | null
}

export interface Character {
    id: string
    userId: string
    name: string
    title: string | null
    era: Era
    faction: string | null
    level: number
    experience: number
    wisdom: number
    courage: number
    compassion: number
    cunning: number
    influence: number
    shellsEarned: string
    questsCompleted: number
    decisionsRecorded: number
    energy: number
    mood: number
    health: number
    social: number
    hunger: number
    lastCheckIn: string | null
    currentLocation: string | null
    currentActivity: string | null
    avatarUrl: string | null
    isActive: boolean
}

// ── Scenarios & Quests ──
export interface Scenario {
    id: string
    type: 'arrival' | 'moral_dilemma' | 'crisis' | 'relationship' | 'power' | 'survival' | 'faith' | 'legacy'
    title: string
    description: string
    era: Era | 'any'
    difficulty: number
    choices: Choice[]
    rewards: { xp: number; shells: number; items?: string[] }
}

export interface Choice {
    id: string
    text: string
    consequences: Record<string, number>
}

export interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    earned: boolean
    earnedAt?: string
}

// ── NPCs ──
export interface Npc {
    id: string
    name: string
    title: string | null
    era: Era
    factionId: string | null
    personality: Record<string, any>
    backstory: string
    currentMood: string
    disposition: number
    location: string | null
    isAlive: boolean
}

export interface NpcRelationship {
    id: string
    npcId: string
    npcName: string
    era: Era
    relationshipType: string
    affinity: number
    trust: number
    fear: number
    romance: number
    rivalry: number
}

// ── Economy ──
export interface InventoryItem {
    id: string
    itemCode: string
    name: string
    era: Era
    quantity: number
    equippedSlot: string | null
    rarity: string
    description: string
    statBonus?: Record<string, number>
}

export interface MarketplaceItem {
    id: string
    code: string
    name: string
    era: Era
    category: string
    shellCost: string
    unlockLevel: number
    description: string
    rarity: string
    stockQuantity: number
    statBonus?: Record<string, number>
}

// ── Estate & City ──
export interface Estate {
    id: string
    era: Era
    gridData: (string | null)[][]
    totalBuildings: number
    shellsSpent: string
}

export interface LandPlot {
    id: string
    era: Era
    plotX: number
    plotY: number
    ownerId: string | null
    plotSize: string
    buildingType: string | null
    buildingLevel: number
}

export interface CityZone {
    id: string
    era: Era
    zoneType: string
    name: string
    architectureStyle: string
    population: number
    prosperity: number
}

// ── Travel ──
export interface City {
    id: string
    name: string
    medievalName: string
    wildwestName: string
    modernName: string
    latitude: string
    longitude: string
    isCapital: boolean
}

export interface TravelSession {
    id: string
    routeId: string
    travelType: 'realtime' | 'compressed' | 'fast'
    speedMph: string
    progressPercent: number
    startedAt: string
    estimatedArrival: string
    status: 'active' | 'completed' | 'abandoned'
}

export interface TravelEncounter {
    id: string
    encounterType: string
    title: string
    description: string
    choices: Choice[]
    outcome: string | null
    xpReward: number
    echoReward: number
    isResolved: boolean
}

// ── Pets ──
export interface Pet {
    id: string
    species: string
    breed: string
    name: string
    era: Era
    rarity: string
    bondLevel: number
    happiness: number
    health: number
    ageMonths: number
    primaryAbility: string
    isCompanion: boolean
}

// ── Legacy ──
export interface Legacy {
    id: string
    characterName: string
    era: Era
    generation: number
    parentLegacyId: string | null
    birthYear: number
    deathYear: number | null
    profession: string
    inheritanceTraits: Record<string, any>
    legacyScore: number
    epitaph: string | null
}

// ── Seasons ──
export interface Season {
    id: string
    seasonNumber: number
    startDate: string
    endDate: string
    isActive: boolean
}

export interface SeasonProgress {
    id: string
    seasonId: string
    erasExplored: string[]
    medievalProgress: number
    wildwestProgress: number
    modernProgress: number
    finaleUnlocked: boolean
}

// ── Decision Trail ──
export interface ChronicleProof {
    id: string
    era: Era
    decisionType: string
    situationTitle: string
    choiceMade: string
    consequences: string
    blockNumber: number
    blockHash: string
    previousHash: string
    guardianSignature: string
    verified: boolean
    createdAt: string
}

// ── 3D Engine ──
export type LocationType =
    // Modern
    | 'home' | 'office' | 'gym' | 'cafe' | 'park' | 'library' | 'mall' | 'restaurant'
    // Medieval
    | 'town_square' | 'castle' | 'tavern' | 'market_square' | 'chapel' | 'blacksmith'
    // Wild West
    | 'saloon' | 'sheriff' | 'general_store' | 'ranch' | 'gold_mine'

export interface LocationConfig {
    id: LocationType
    name: string
    era: Era
    ambientColor: string
    skyColor: string
    fogColor: string
    fogNear: number
    fogFar: number
}

// ── Emotional State (AI) ──
export interface EmotionalState {
    arousal: number
    valence: number
    socialCohesion: number
    fear: number
    ambition: number
}
