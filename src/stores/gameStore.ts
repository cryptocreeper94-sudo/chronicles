/* ====== Chronicles — Game Store ====== */
import { create } from 'zustand'
import { api } from '../services/api'
import type { Era, GameState, Character, Scenario, Achievement, NpcRelationship } from '../types/game'

interface GameStoreState {
    // State
    gameState: GameState | null
    character: Character | null
    currentEra: Era
    currentScenario: Scenario | null
    achievements: Achievement[]
    npcRelationships: NpcRelationship[]
    loading: boolean

    // Actions
    loadGameState: () => Promise<void>
    generateScenario: () => Promise<void>
    makeDecision: (choiceId: string) => Promise<any>
    switchEra: (era: Era) => void
    loadAchievements: () => Promise<void>
    talkToNpc: (npcId: string, message: string) => Promise<string>
}

export const useGameStore = create<GameStoreState>((set, get) => ({
    gameState: null,
    character: null,
    currentEra: 'modern',
    currentScenario: null,
    achievements: [],
    npcRelationships: [],
    loading: false,

    loadGameState: async () => {
        set({ loading: true })
        try {
            const state = await api.get<any>('/api/chronicles/play/state')
            set({
                gameState: state,
                character: state.character,
                currentEra: state.currentEra || 'modern',
                loading: false,
            })
        } catch {
            // Dev mode fallback — rich mock data so the game is playable without backend
            const devCharacter: Character = {
                id: 'dev-char-001',
                userId: 'dev-user-001',
                name: 'Chronicler',
                title: 'Time Walker',
                era: 'modern',
                faction: null,
                level: 5,
                experience: 2400,
                wisdom: 42,
                courage: 38,
                compassion: 55,
                cunning: 31,
                influence: 18,
                shellsEarned: '500',
                questsCompleted: 12,
                decisionsRecorded: 47,
                energy: 78,
                mood: 85,
                health: 92,
                social: 60,
                hunger: 35,
                lastCheckIn: new Date().toISOString(),
                currentLocation: 'City Center',
                currentActivity: null,
                avatarUrl: null,
                isActive: true,
            }
            set({
                gameState: { phase: 'playing', currentEra: 'modern', dayNumber: 7 } as any,
                character: devCharacter,
                currentEra: 'modern',
                loading: false,
            })
        }
    },

    generateScenario: async () => {
        set({ loading: true })
        try {
            const scenario = await api.post<Scenario>('/api/chronicles/play/scenario', {
                era: get().currentEra,
            })
            set({ currentScenario: scenario, loading: false })
        } catch {
            set({ loading: false })
        }
    },

    makeDecision: async (choiceId: string) => {
        try {
            const result = await api.post('/api/chronicles/play/decide', {
                choiceId,
                scenarioId: get().currentScenario?.id,
            })
            // Refresh game state after decision
            get().loadGameState()
            return result
        } catch (err: any) {
            throw err
        }
    },

    switchEra: (era) => set({ currentEra: era }),

    loadAchievements: async () => {
        try {
            const achievements = await api.get<Achievement[]>('/api/chronicles/play/achievements')
            set({ achievements })
        } catch { }
    },

    talkToNpc: async (npcId, message) => {
        try {
            const res = await api.post<{ response: string }>('/api/chronicles/play/npc-chat', {
                npcId,
                message,
                era: get().currentEra,
            })
            return res.response
        } catch {
            return 'The NPC seems lost in thought...'
        }
    },
}))
