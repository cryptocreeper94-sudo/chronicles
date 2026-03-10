/* ====== Chronicles — Shells Economy Store ====== */
import { create } from 'zustand'
import { api } from '../services/api'

interface Transaction {
    id: number
    type: 'earn' | 'spend' | 'tip' | 'purchase' | 'refund'
    amount: string
    balance: string
    description: string
    createdAt: string
}

interface ShellStoreState {
    balance: string
    totalEarned: string
    totalSpent: string
    transactions: Transaction[]
    loading: boolean

    loadBalance: () => Promise<void>
    loadTransactions: () => Promise<void>
    spendShells: (amount: number, reason: string) => Promise<boolean>
    tipUser: (toUserId: string, amount: number) => Promise<boolean>
    claimDailyReward: () => Promise<{ shells: number; streak: number } | null>
}

export const useShellStore = create<ShellStoreState>((set) => ({
    balance: '0',
    totalEarned: '0',
    totalSpent: '0',
    transactions: [],
    loading: false,

    loadBalance: async () => {
        try {
            const res = await api.get<any>('/api/shells/balance')
            set({ balance: res.balance, totalEarned: res.totalEarned, totalSpent: res.totalSpent })
        } catch {
            // Dev mode fallback
            set({ balance: '500', totalEarned: '1250', totalSpent: '750' })
        }
    },

    loadTransactions: async () => {
        try {
            const res = await api.get<Transaction[]>('/api/shells/transactions')
            set({ transactions: res })
        } catch { }
    },

    spendShells: async (amount, reason) => {
        try {
            await api.post('/api/chronicles/economy/spend', { amount, reason })
            // Refresh balance
            const res = await api.get<any>('/api/shells/balance')
            set({ balance: res.balance })
            return true
        } catch {
            return false
        }
    },

    tipUser: async (toUserId, amount) => {
        try {
            await api.post('/api/shells/tip', { toUserId, amount })
            const res = await api.get<any>('/api/shells/balance')
            set({ balance: res.balance })
            return true
        } catch {
            return false
        }
    },

    claimDailyReward: async () => {
        try {
            const res = await api.post<any>('/api/chronicles/daily-reward')
            const bal = await api.get<any>('/api/shells/balance')
            set({ balance: bal.balance })
            return { shells: res.shellsAwarded, streak: res.currentStreak }
        } catch {
            return null
        }
    },
}))
